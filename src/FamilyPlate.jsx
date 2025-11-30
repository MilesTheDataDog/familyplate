import React, { useState, useEffect } from 'react';
import { Camera, Book, Home, Plus, X, FileImage, Trash2, ShoppingCart } from 'lucide-react';

const BottomNav = ({ activeScreen, onNavigate }) => (
  <div className="fixed bottom-0 left-0 right-0 pb-6 flex justify-center pointer-events-none">
    <div className="bg-white rounded-full shadow-2xl border border-gray-200 px-6 py-3 flex gap-8 pointer-events-auto backdrop-blur-lg bg-opacity-95">
      <button onClick={() => onNavigate('home')} className={`flex flex-col items-center transition-colors ${activeScreen === 'home' ? 'text-orange-600' : 'text-gray-400 hover:text-orange-400'}`}>
        <div className={`p-2 rounded-full transition-colors ${activeScreen === 'home' ? 'bg-orange-100' : ''}`}>
          <Home size={24} strokeWidth={activeScreen === 'home' ? 2.5 : 2} />
        </div>
        <span className="text-xs mt-1 font-medium">Home</span>
      </button>
      <button onClick={() => onNavigate('upload')} className={`flex flex-col items-center transition-colors ${activeScreen === 'upload' ? 'text-orange-600' : 'text-gray-400 hover:text-orange-400'}`}>
        <div className={`p-2 rounded-full transition-colors ${activeScreen === 'upload' ? 'bg-orange-100' : ''}`}>
          <Plus size={24} strokeWidth={activeScreen === 'upload' ? 2.5 : 2} />
        </div>
        <span className="text-xs mt-1 font-medium">Add</span>
      </button>
      <button onClick={() => onNavigate('library')} className={`flex flex-col items-center transition-colors ${activeScreen === 'library' ? 'text-orange-600' : 'text-gray-400 hover:text-orange-400'}`}>
        <div className={`p-2 rounded-full transition-colors ${activeScreen === 'library' ? 'bg-orange-100' : ''}`}>
          <Book size={24} strokeWidth={activeScreen === 'library' ? 2.5 : 2} />
        </div>
        <span className="text-xs mt-1 font-medium">Library</span>
      </button>
      <button onClick={() => onNavigate('shopping')} className={`flex flex-col items-center transition-colors ${activeScreen === 'shopping' ? 'text-orange-600' : 'text-gray-400 hover:text-orange-400'}`}>
        <div className={`p-2 rounded-full transition-colors ${activeScreen === 'shopping' ? 'bg-orange-100' : ''}`}>
          <ShoppingCart size={24} strokeWidth={activeScreen === 'shopping' ? 2.5 : 2} />
        </div>
        <span className="text-xs mt-1 font-medium">Shop</span>
      </button>
    </div>
  </div>
);

export default function FamilyPlate() {
  const [screen, setScreen] = useState('home');
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRecipes(); }, []);

  const loadRecipes = async () => {
    try {
      const result = await window.storage.list('recipe:');
      if (result && result.keys) {
        const loaded = [];
        for (const key of result.keys) {
          const data = await window.storage.get(key);
          if (data && data.value) {
            loaded.push(JSON.parse(data.value));
          }
        }
        loaded.sort((a, b) => b.id - a.id);
        setRecipes(loaded);
      }
    } catch (e) { console.log('No recipes'); }
    finally { setLoading(false); }
  };

  const saveRecipeToStorage = async (recipe) => {
    try { 
      await window.storage.set('recipe:' + recipe.id, JSON.stringify(recipe)); 
      return true; 
    } catch (e) { 
      return false; 
    }
  };

  const compressImage = (dataUrl) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > 1200) { h = (h * 1200) / w; w = 1200; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
  });

  const extractRecipe = async (imageData) => {
    setScreen('processing');
    try {
      const compressed = await compressImage(imageData);
      const base64 = compressed.split(',')[1];
      const type = compressed.split(';')[0].split(':')[1];
      
      const prompt = `Extract this recipe as JSON with these fields: title, servings, prepTime, cookTime, ingredientSections, instructions.

Format:
{
  "title": "Recipe Name",
  "servings": "4",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes", 
  "ingredientSections": [
    {"title": "Ingredients", "items": ["item 1", "item 2"]}
  ],
  "instructions": ["step 1", "step 2"]
}

Return only valid JSON, no markdown.`;
      
      const res = await fetch('/api/extract-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, type: type, prompt: prompt })
      });
      
      const data = await res.json();
      
      if (data.error) {
        alert('Failed: ' + data.error);
        setScreen('preview');
        return;
      }
      
      const text = data.content.find(i => i.type === 'text').text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      const ext = JSON.parse(text);
      
      const recipe = { 
        id: Date.now(), 
        title: ext.title || 'Untitled', 
        image: compressed, 
        ingredientSections: ext.ingredientSections || [{ title: '', items: [] }], 
        instructions: ext.instructions || [], 
        servings: ext.servings || '', 
        prepTime: ext.prepTime || '', 
        cookTime: ext.cookTime || '', 
        dateAdded: new Date().toLocaleDateString()
      };
      
      if (await saveRecipeToStorage(recipe)) {
        setRecipes([recipe, ...recipes]);
        setScreen('library');
      }
    } catch (e) { 
      alert('Failed: ' + e.message); 
      setScreen('preview'); 
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => { 
        setPreviewImage(await compressImage(reader.result)); 
        setScreen('preview'); 
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteRecipe = async (id) => {
    if (window.confirm('Delete this recipe?')) {
      await window.storage.delete('recipe:' + id);
      setRecipes(recipes.filter(r => r.id !== id));
      setCurrentRecipe(null);
      setScreen('library');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <Book className="text-orange-600 animate-pulse" size={48} />
    </div>
  );

  if (screen === 'home') return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">FamilyPlate</h1>
          <p className="text-xl text-gray-600 italic">Where every dish has a story</p>
        </div>
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full mb-6 shadow-xl">
            <Book size={48} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="text-4xl font-bold mb-4">Your family recipes deserve forever</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <button onClick={() => setScreen('upload')} className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-left border border-orange-100 group">
            <div className="inline-block p-3 bg-orange-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Camera className="text-orange-600" size={32} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold">Add Recipe</h3>
          </button>
          <button onClick={() => setScreen('library')} className="bg-gradient-to-br from-white to-rose-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-left border border-rose-100 group">
            <div className="inline-block p-3 bg-rose-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Book className="text-rose-600" size={32} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold">My Recipes</h3>
            <p className="text-gray-600">{recipes.length} saved</p>
          </button>
        </div>
      </div>
      <BottomNav activeScreen="home" onNavigate={setScreen} />
    </div>
  );

  if (screen === 'upload') return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-24">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setScreen('home')} className="text-gray-600 flex items-center gap-2 hover:text-gray-800 transition-colors">
            <X size={20} /> Cancel
          </button>
        </div>
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-xl p-8 border border-orange-100">
          <h2 className="text-3xl font-bold text-center mb-6">Upload Recipe Photo</h2>
          <div className="border-4 border-dashed border-orange-200 rounded-2xl p-12 text-center hover:border-orange-300 transition-colors group">
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="fileInput" />
            <label htmlFor="fileInput" className="cursor-pointer">
              <div className="inline-block p-4 bg-orange-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <FileImage className="mx-auto text-orange-600" size={48} strokeWidth={2} />
              </div>
              <p className="text-xl font-semibold">Click to upload</p>
            </label>
          </div>
        </div>
      </div>
      <BottomNav activeScreen="upload" onNavigate={setScreen} />
    </div>
  );

  if (screen === 'preview' && previewImage) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => { setPreviewImage(null); setScreen('upload'); }} className="mb-4 text-gray-600 flex items-center gap-2 hover:text-gray-800 transition-colors">
          <X size={20} /> Back
        </button>
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-xl p-8 border border-orange-100">
          <img src={previewImage} alt="Preview" className="w-full max-h-96 object-contain rounded-2xl mb-6" />
          <div className="flex gap-4">
            <button onClick={() => { setPreviewImage(null); setScreen('upload'); }} className="flex-1 bg-white border-2 border-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-md">
              Retake
            </button>
            <button onClick={() => extractRecipe(previewImage)} className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow shadow-md">
              Extract Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (screen === 'processing') return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block p-4 bg-orange-100 rounded-full mb-6 animate-pulse">
          <Book className="mx-auto text-orange-600" size={64} strokeWidth={2} />
        </div>
        <h2 className="text-3xl font-bold">Reading your recipe...</h2>
      </div>
    </div>
  );

  if (screen === 'library') return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">My Recipe Library</h2>
        </div>
        <p className="text-gray-600 mb-6">{recipes.length} recipes</p>
        
        {recipes.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-lg p-12 text-center border border-orange-100">
            <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
              <Book className="mx-auto text-orange-600" size={48} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold mb-4">No recipes yet</h3>
            <button onClick={() => setScreen('upload')} className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow shadow-md">
              Add Your First Recipe
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {recipes.map(r => (
              <button key={r.id} onClick={() => { setCurrentRecipe(r); setScreen('view'); }} className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden text-left border border-orange-100 transform hover:-translate-y-1">
                {r.image && <img src={r.image} alt={r.title} className="w-full h-48 object-cover" />}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{r.title}</h3>
                  <p className="text-gray-400 text-sm">Added {r.dateAdded}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <BottomNav activeScreen="library" onNavigate={setScreen} />
    </div>
  );

  if (screen === 'view' && currentRecipe) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <button onClick={() => { setCurrentRecipe(null); setScreen('library'); }} className="text-gray-600 flex items-center gap-2 hover:text-gray-800 transition-colors">
            <X size={20} /> Back
          </button>
          <button onClick={() => deleteRecipe(currentRecipe.id)} className="bg-white border-2 border-red-400 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-md">
            Delete
          </button>
        </div>
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-xl overflow-hidden border border-orange-100">
          {currentRecipe.image && <img src={currentRecipe.image} alt={currentRecipe.title} className="w-full max-h-96 object-contain bg-gray-100" />}
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-2">{currentRecipe.title}</h1>
            <div className="grid grid-cols-3 gap-4 mb-8 text-gray-600">
              {currentRecipe.servings && <div><span className="block text-sm text-gray-500">Servings</span>{currentRecipe.servings}</div>}
              {currentRecipe.prepTime && <div><span className="block text-sm text-gray-500">Prep</span>{currentRecipe.prepTime}</div>}
              {currentRecipe.cookTime && <div><span className="block text-sm text-gray-500">Cook</span>{currentRecipe.cookTime}</div>}
            </div>
            <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
            {currentRecipe.ingredientSections.map((s, i) => (
              <div key={i} className="mb-4">
                {s.title && <h3 className="font-semibold text-orange-600 mb-2">{s.title}</h3>}
                <ul className="space-y-2">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-orange-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <h2 className="text-2xl font-bold mb-4 mt-8">Instructions</h2>
            <ol className="space-y-4">
              {currentRecipe.instructions.map((inst, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                  <p>{inst}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <BottomNav activeScreen="library" onNavigate={setScreen} />
    </div>
  );

  if (screen === 'shopping') return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Shopping List</h2>
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-lg p-12 text-center border border-orange-100">
          <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
            <ShoppingCart className="mx-auto text-orange-600" size={48} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold mb-4">Shopping list coming soon!</h3>
          <p className="text-gray-600">This feature will let you add ingredients from recipes to a shopping list.</p>
        </div>
      </div>
      <BottomNav activeScreen="shopping" onNavigate={setScreen} />
    </div>
  );

  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>;
}