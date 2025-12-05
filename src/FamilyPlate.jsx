import React, { useState, useEffect } from 'react';
import { Camera, Book, Home, Plus, X, FileImage, Trash2, ShoppingCart, Menu } from 'lucide-react';

const HamburgerMenu = ({ isOpen, onClose, activeScreen, onNavigate }) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed top-0 left-0 h-full w-64 sm:w-72 md:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">Menu</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-600" />
            </button>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => { onNavigate('home'); onClose(); }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeScreen === 'home' 
                  ? 'bg-gradient-to-r from-orange-100 to-rose-100 text-orange-600 font-semibold' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Home size={24} />
              <span>Home</span>
            </button>
            <button
              onClick={() => { onNavigate('upload'); onClose(); }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeScreen === 'upload' 
                  ? 'bg-gradient-to-r from-orange-100 to-rose-100 text-orange-600 font-semibold' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Plus size={24} />
              <span>Add Recipe</span>
            </button>
            <button
              onClick={() => { onNavigate('library'); onClose(); }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeScreen === 'library' 
                  ? 'bg-gradient-to-r from-orange-100 to-rose-100 text-orange-600 font-semibold' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Book size={24} />
              <span>My Recipes</span>
            </button>
            <button
              onClick={() => { onNavigate('shopping'); onClose(); }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeScreen === 'shopping' 
                  ? 'bg-gradient-to-r from-orange-100 to-rose-100 text-orange-600 font-semibold' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <ShoppingCart size={24} />
              <span>Shopping List</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

const TopBar = ({ onMenuClick }) => (
  <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-30 px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <button 
        onClick={onMenuClick}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Menu size={20} className="text-gray-700 sm:w-6 sm:h-6" />
      </button>
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
        FamilyPlate
      </h1>
      <div className="w-8 sm:w-10"></div>
    </div>
  </div>
);

export default function FamilyPlate() {
  const [screen, setScreen] = useState('home');
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} activeScreen={screen} onNavigate={setScreen} />
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-16 sm:pt-20 pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full mb-4 sm:mb-6 shadow-xl">
              <Book size={48} className="text-white sm:w-16 sm:h-16" strokeWidth={2} />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">Your family recipes deserve forever</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 italic mb-2 px-4">Digitize and preserve your treasured family recipes</p>
            <p className="text-sm sm:text-base md:text-lg text-gray-500">{recipes.length} recipes saved</p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-orange-100 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Get Started</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Use the menu button in the top left to navigate</p>
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <Menu size={20} className="sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base font-semibold">Click the menu to begin</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (screen === 'upload') return (
    <>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} activeScreen={screen} onNavigate={setScreen} />
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-16 sm:pt-20 pb-6 sm:pb-8">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 border border-orange-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Upload Recipe Photo</h2>
            <div className="border-4 border-dashed border-orange-200 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center hover:border-orange-300 transition-colors group">
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="fileInput" />
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className="inline-block p-3 sm:p-4 bg-orange-100 rounded-full mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <FileImage className="mx-auto text-orange-600 w-10 h-10 sm:w-12 sm:h-12" strokeWidth={2} />
                </div>
                <p className="text-lg sm:text-xl font-semibold">Click to upload</p>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (screen === 'preview' && previewImage) return (
    <>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} activeScreen={screen} onNavigate={setScreen} />
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-16 sm:pt-20 px-3 sm:px-4 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 border border-orange-100">
            <img src={previewImage} alt="Preview" className="w-full max-h-64 sm:max-h-80 md:max-h-96 object-contain rounded-xl sm:rounded-2xl mb-4 sm:mb-6" />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={() => { setPreviewImage(null); setScreen('upload'); }} className="flex-1 bg-white border-2 border-gray-300 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-md text-sm sm:text-base">
                Retake
              </button>
              <button onClick={() => extractRecipe(previewImage)} className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow shadow-md text-sm sm:text-base">
                Extract Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
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
    <>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} activeScreen={screen} onNavigate={setScreen} />
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6 pb-6 sm:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">My Recipe Library</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{recipes.length} recipes</p>
          
          {recipes.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl sm:rounded-3xl shadow-lg p-8 sm:p-12 text-center border border-orange-100">
              <div className="inline-block p-3 sm:p-4 bg-orange-100 rounded-full mb-3 sm:mb-4">
                <Book className="mx-auto text-orange-600 w-10 h-10 sm:w-12 sm:h-12" strokeWidth={2} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">No recipes yet</h3>
              <button onClick={() => setScreen('upload')} className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow shadow-md text-sm sm:text-base">
                Add Your First Recipe
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recipes.map(r => (
                <button key={r.id} onClick={() => { setCurrentRecipe(r); setScreen('view'); }} className="bg-gradient-to-br from-white to-orange-50 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden text-left border border-orange-100 transform hover:-translate-y-1">
                  {r.image && <img src={r.image} alt={r.title} className="w-full h-40 sm:h-48 object-cover" />}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-2">{r.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Added {r.dateAdded}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (screen === 'view' && currentRecipe) return (
    <>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} activeScreen={screen} onNavigate={setScreen} />
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-16 sm:pt-20 px-3 sm:px-4 pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-3 sm:mb-4 flex justify-between items-center">
            <button onClick={() => { setCurrentRecipe(null); setScreen('library'); }} className="text-gray-600 flex items-center gap-1 sm:gap-2 hover:text-gray-800 transition-colors text-sm sm:text-base">
              <X size={18} className="sm:w-5 sm:h-5" /> Back
            </button>
            <button onClick={() => deleteRecipe(currentRecipe.id)} className="bg-white border-2 border-red-400 text-red-600 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-red-50 transition-colors shadow-md">
              Delete
            </button>
          </div>
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-orange-100">
            {currentRecipe.image && <img src={currentRecipe.image} alt={currentRecipe.title} className="w-full max-h-64 sm:max-h-80 md:max-h-96 object-contain bg-gray-100" />}
            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{currentRecipe.title}</h1>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8 text-gray-600 text-sm sm:text-base">
                {currentRecipe.servings && <div><span className="block text-xs sm:text-sm text-gray-500">Servings</span>{currentRecipe.servings}</div>}
                {currentRecipe.prepTime && <div><span className="block text-xs sm:text-sm text-gray-500">Prep</span>{currentRecipe.prepTime}</div>}
                {currentRecipe.cookTime && <div><span className="block text-xs sm:text-sm text-gray-500">Cook</span>{currentRecipe.cookTime}</div>}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ingredients</h2>
              {currentRecipe.ingredientSections.map((s, i) => (
                <div key={i} className="mb-3 sm:mb-4">
                  {s.title && <h3 className="font-semibold text-orange-600 mb-2 text-sm sm:text-base">{s.title}</h3>}
                  <ul className="space-y-1.5 sm:space-y-2">
                    {s.items.map((item, j) => (
                      <li key={j} className="flex gap-2 text-sm sm:text-base">
                        <span className="text-orange-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 mt-6 sm:mt-8">Instructions</h2>
              <ol className="space-y-3 sm:space-y-4">
                {currentRecipe.instructions.map((inst, i) => (
                  <li key={i} className="flex gap-2 sm:gap-4">
                    <span className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm sm:text-base">{i + 1}</span>
                    <p className="text-sm sm:text-base">{inst}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (screen === 'shopping') return (
    <>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} activeScreen={screen} onNavigate={setScreen} />
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-16 sm:pt-20 px-3 sm:px-4 pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping List</h2>
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl sm:rounded-3xl shadow-lg p-8 sm:p-12 text-center border border-orange-100">
            <div className="inline-block p-3 sm:p-4 bg-orange-100 rounded-full mb-3 sm:mb-4">
              <ShoppingCart className="mx-auto text-orange-600 w-10 h-10 sm:w-12 sm:h-12" strokeWidth={2} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Shopping list coming soon!</h3>
            <p className="text-sm sm:text-base text-gray-600">This feature will let you add ingredients from recipes to a shopping list.</p>
          </div>
        </div>
      </div>
    </>
  );

  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>;
}