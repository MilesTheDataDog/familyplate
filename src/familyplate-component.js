import React, { useState, useEffect } from 'react';
import { Camera, Book, Home, Plus, Save, X, FileImage, Trash2, PlusCircle, ShoppingCart } from 'lucide-react';

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
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showTimeEstimate, setShowTimeEstimate] = useState(false);
  const [estimatingTimes, setEstimatingTimes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [showShoppingPreview, setShowShoppingPreview] = useState(false);
  const [previewItems, setPreviewItems] = useState([]);
  const [expandedShoppingItem, setExpandedShoppingItem] = useState(null);
  const [showStorySection, setShowStorySection] = useState(false);
  const [editingStory, setEditingStory] = useState(false);
  const [isPremium, setIsPremium] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableCategories] = useState(['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Appetizers', 'Sides', 'Drinks', 'Holiday', 'Quick Meals']);

  useEffect(() => { loadRecipes(); loadShoppingList(); }, []);

  const loadRecipes = async () => {
    try {
      const result = await window.storage.list('recipe:');
      if (result && result.keys) {
        const loaded = [];
        for (const key of result.keys) {
          const data = await window.storage.get(key);
          if (data && data.value) {
            const recipe = JSON.parse(data.value);
            if (!recipe.story) {
              recipe.story = { text: '', creator: '', origin: '', occasions: '' };
            }
            if (!recipe.category) recipe.category = '';
            if (!recipe.tags) recipe.tags = [];
            loaded.push(recipe);
          }
        }
        loaded.sort((a, b) => b.id - a.id);
        setRecipes(loaded);
      }
    } catch (e) { console.log('No recipes'); }
    finally { setLoading(false); }
  };

  const loadShoppingList = async () => {
    try {
      const result = await window.storage.get('shopping-list');
      if (result && result.value) setShoppingList(JSON.parse(result.value));
    } catch (e) { console.log('No list'); }
  };

  const saveShoppingList = async (list) => {
    try { await window.storage.set('shopping-list', JSON.stringify(list)); setShoppingList(list); }
    catch (e) { console.error(e); }
  };

  const saveRecipeToStorage = async (recipe) => {
    try { await window.storage.set('recipe:' + recipe.id, JSON.stringify(recipe)); return true; }
    catch (e) { return false; }
  };

  const parseIngredientName = (ing) => {
    let p = ing;
    p = p.replace(/^[\d\s\/\.\-]+/, '');
    p = p.replace(/^\/\s*\d+\s*/, '');
    p = p.replace(/\b(cup|cups|tablespoon|tablespoons|tbsp|tbs|teaspoon|teaspoons|tsp|ounce|ounces|oz|pound|pounds|lb|lbs|can|cans|package|packages|pkg|pkgs|pint|pints|pt|quart|quarts|qt|gallon|gallons|gal|ml|milliliter|milliliters|l|liter|liters|g|gram|grams|kg|kilogram|kilograms|stick|sticks|clove|cloves|head|heads|bunch|bunches|slice|slices|piece|pieces|pinch|pinches|dash|dashes|sprig|sprigs|large|medium|small|halves|halved|half|and)\b/gi, '');
    p = p.replace(/\([^)]*\)/g, '');
    p = p.replace(/\b(dried|chopped|minced|diced|sliced|grated|shredded|melted|softened|room temperature|cold|warm|hot|thawed|cooked|raw|whole|quartered|firmly packed|loosely packed|packed|sifted|unsifted|beaten|lightly beaten|well beaten|divided|separated|optional|to taste|as needed|for garnish|for serving|peeled|cored|seeded|deveined|trimmed|rinsed|drained|crushed|ground|cubed|julienned|thinly sliced|finely chopped|finely minced|roughly chopped|coarsely chopped|at room temperature|chilled|warmed|toasted|untoasted|blanched|unblanched|pitted)\b/gi, '');
    p = p.replace(/^[\.\s]+/, '').replace(/[\.\s]+$/, '');
    p = p.replace(/,/g, '').replace(/\s+/g, ' ').trim();
    p = p.replace(/^of\s+/i, '');
    p = p.replace(/\s+of$/i, '');
    return p ? p.charAt(0).toUpperCase() + p.slice(1) : '';
  };

  const addToShoppingList = () => {
    if (!currentRecipe) return;
    const all = currentRecipe.ingredientSections.flatMap(s => s.items);
    const parsed = [];
    for (let i = 0; i < all.length; i++) {
      const original = all[i];
      const cleaned = parseIngredientName(original);
      if (cleaned.length > 0) {
        parsed.push({ 
          name: cleaned, 
          selected: true,
          originalText: original,
          recipeName: currentRecipe.title
        });
      }
    }
    setPreviewItems(parsed);
    setShowShoppingPreview(true);
  };

  const togglePreviewItem = (index) => {
    setPreviewItems(prev => prev.map((item, i) => i === index ? { ...item, selected: !item.selected } : item));
  };

  const selectAllPreviewItems = () => {
    setPreviewItems(prev => prev.map(item => ({ ...item, selected: true })));
  };

  const deselectAllPreviewItems = () => {
    setPreviewItems(prev => prev.map(item => ({ ...item, selected: false })));
  };

  const confirmAddToShopping = () => {
    const selectedItems = previewItems.filter(item => item.selected);
    const updatedList = [...shoppingList];
    
    for (const item of selectedItems) {
      const existingIndex = updatedList.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase());
      
      if (existingIndex >= 0) {
        const existing = updatedList[existingIndex];
        const alreadyHasRecipe = existing.sources?.some(s => s.recipeName === item.recipeName && s.originalText === item.originalText);
        if (!alreadyHasRecipe) {
          existing.sources = existing.sources || [];
          existing.sources.push({ recipeName: item.recipeName, originalText: item.originalText });
        }
      } else {
        updatedList.push({
          id: Date.now() + Math.random(),
          name: item.name,
          checked: false,
          sources: [{ recipeName: item.recipeName, originalText: item.originalText }]
        });
      }
    }
    
    saveShoppingList(updatedList);
    setShowShoppingPreview(false);
    setPreviewItems([]);
    setScreen('shopping');
  };

  const toggleShoppingItem = (id) => saveShoppingList(shoppingList.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const deleteShoppingItem = (id) => saveShoppingList(shoppingList.filter(i => i.id !== id));
  const clearShoppingList = () => saveShoppingList([]);

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

  const postProcessIngredients = (sections) => sections.map(s => {
    const items = s.items.map(item => {
      let p = item, mod = false;
      if (/\boleo\b/gi.test(p)) { p = p.replace(/\boleo\b/gi, 'margarine'); mod = true; }
      if (/\bcrisco\b/gi.test(p)) { p = p.replace(/\bcrisco\b/gi, 'shortening'); mod = true; }
      return { text: p, mod };
    });
    return { title: s.title, items: items.map(i => i.text), uncertain: items.map(i => i.mod) };
  });

  const extractRecipe = async (imageData) => {
    setScreen('processing');
    try {
      const compressed = await compressImage(imageData);
      const base64 = compressed.split(',')[1];
      const type = compressed.split(';')[0].split(':')[1];
      
      const prompt = `Extract this recipe as JSON with these fields: title, servings, prepTime, cookTime, ingredientSections, instructions.

CRITICAL for ingredientSections:
- Look carefully for ANY section headers/labels in the ingredients area (e.g., "Ingredients", "Dressing", "Sauce", "Filling", "Crust", "Topping", "For the...", "Marinade", etc.)
- If you see multiple labeled groups (like "INGREDIENTS" followed by "DRESSING"), create separate sections for each with appropriate titles
- If the recipe has headers like "INGREDIENTS" and "DRESSING" as two separate labeled lists, that means TWO sections
- Only combine into a single section (with empty title) if there are truly NO section labels at all
- Preserve the exact section names from the recipe

Format:
{
  "title": "Recipe Name",
  "servings": "4",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes", 
  "ingredientSections": [
    {"title": "Ingredients", "items": ["item 1", "item 2"]},
    {"title": "Dressing", "items": ["item 1", "item 2"]}
  ],
  "instructions": ["step 1", "step 2"]
}

Return only valid JSON, no markdown or explanation.`;
      
      const res = await fetch('/api/extract-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: base64, 
          type: type,
          prompt: prompt
        })
      });
      
      const data = await res.json();
      
      if (data.error) {
        alert('Failed: ' + data.error);
        setScreen('preview');
        return;
      }
      
      const text = data.content.find(i => i.type === 'text').text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      const ext = JSON.parse(text);
      let sections = ext.ingredientSections || [{ title: '', items: ext.ingredients || [] }];
      sections = sections.map(s => ({ title: s.title || '', items: s.items || [], uncertain: (s.items || []).map(() => false) }));
      sections = postProcessIngredients(sections);
      setCurrentRecipe({ 
        id: Date.now(), 
        title: ext.title || 'Untitled', 
        image: compressed, 
        ingredientSections: sections, 
        instructions: ext.instructions || [], 
        servings: ext.servings || '', 
        prepTime: ext.prepTime || '', 
        cookTime: ext.cookTime || '', 
        dateAdded: new Date().toLocaleDateString(),
        category: '',
        tags: [],
        story: {
          text: '',
          creator: '',
          origin: '',
          occasions: ''
        }
      });
      setShowTimeEstimate(!ext.prepTime || !ext.cookTime);
      setScreen('edit');
    } catch (e) { alert('Failed: ' + e.message); setScreen('preview'); }
  };

  const estimateTimes = async () => {
    setEstimatingTimes(true);
    try {
      const ings = currentRecipe.ingredientSections.flatMap(s => s.items).join(', ');
      const instrs = currentRecipe.instructions.join(' ');
      
      const res = await fetch('/api/estimate-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: currentRecipe.title,
          ingredients: ings,
          instructions: instrs
        })
      });
      
      const data = await res.json();
      console.log('Time estimate response:', data);
      
      if (data.error) {
        alert('API Error: ' + data.error);
        return;
      }
      
      const text = data.content?.find(i => i.type === 'text')?.text || '{}';
      const cleanText = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      console.log('Parsing:', cleanText);
      const times = JSON.parse(cleanText);
      
      setCurrentRecipe(prev => ({ 
        ...prev, 
        prepTime: prev.prepTime || '~' + (times.prepTime || '15 minutes'), 
        cookTime: prev.cookTime || '~' + (times.cookTime || '30 minutes') 
      }));
      setShowTimeEstimate(false);
    } catch (e) { 
      console.error('Time estimate error:', e);
      alert('Failed to estimate times: ' + e.message); 
    }
    finally { setEstimatingTimes(false); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => { setPreviewImage(await compressImage(reader.result)); setScreen('preview'); };
      reader.readAsDataURL(file);
    }
  };

  const saveRecipe = async () => {
    if (!isPremium && recipes.length >= 10 && !recipes.find(r => r.id === currentRecipe.id)) {
      setUpgradeReason('recipe-limit');
      setShowUpgradeModal(true);
      return;
    }
    
    if (await saveRecipeToStorage(currentRecipe)) {
      setRecipes(recipes.find(r => r.id === currentRecipe.id) ? recipes.map(r => r.id === currentRecipe.id ? currentRecipe : r) : [currentRecipe, ...recipes]);
      setCurrentRecipe(null); setUploadedImage(null); setShowTimeEstimate(false); setScreen('library');
    }
  };

  const deleteRecipe = (id) => { setRecipeToDelete(id); setShowDeleteConfirm(true); };
  const confirmDelete = async () => {
    await window.storage.delete('recipe:' + recipeToDelete);
    setRecipes(recipes.filter(r => r.id !== recipeToDelete));
    setCurrentRecipe(null); setShowDeleteConfirm(false); setRecipeToDelete(null); setScreen('library');
  };
  const cancelDelete = () => { setShowDeleteConfirm(false); setRecipeToDelete(null); };
  const cancelEdit = () => { setCurrentRecipe(null); setUploadedImage(null); setPreviewImage(null); setShowTimeEstimate(false); setScreen('upload'); };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center"><Book className="text-orange-600 animate-pulse" size={48} /></div>;

  const UpgradeModal = () => {
    const messages = {
      'recipe-limit': {
        title: 'Recipe Limit Reached',
        message: 'You have reached the 10 recipe limit on the free plan. Upgrade to Premium to save unlimited family recipes!',
        features: ['Unlimited recipes', 'Ad-free experience', 'Advanced shopping lists', 'Search and organize']
      },
      'search': {
        title: 'Search is a Premium Feature',
        message: 'Quickly find any recipe in your collection with instant search.',
        features: ['Instant search', 'Filter by category', 'Sort by date', 'Find recipes faster']
      },
      'categories': {
        title: 'Categories and Tags are Premium Features',
        message: 'Organize your recipes with categories and custom tags for easy browsing.',
        features: ['Organize by meal type', 'Add custom tags', 'Filter by category', 'Keep your collection organized']
      }
    };
    
    const content = messages[upgradeReason] || messages['recipe-limit'];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold mb-2">{content.title}</h3>
          <p className="text-gray-600 mb-6">{content.message}</p>
          <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-4 mb-6">
            <p className="font-semibold mb-2">Premium includes:</p>
            <ul className="space-y-1">
              {content.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-orange-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-orange-600 mb-1">$4.99/month</p>
            <p className="text-sm text-gray-500">or $39.99/year (save 33%)</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowUpgradeModal(false)} className="flex-1 bg-white border-2 border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">Maybe Later</button>
            <button onClick={() => alert('Upgrade feature coming soon!')} className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow shadow-md">Upgrade Now</button>
          </div>
        </div>
      </div>
    );
  };

  if (screen === 'home') return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setIsPremium(!isPremium)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${isPremium ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md' : 'bg-white border-2 border-gray-300 text-gray-700'}`}
          >
            {isPremium ? '💎 Premium' : 'Free Mode'}
          </button>
        </div>
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
      {showUpgradeModal && <UpgradeModal />}
    </div>
  );

  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>;
}