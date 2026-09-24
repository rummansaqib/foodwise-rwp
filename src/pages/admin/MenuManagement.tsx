import { useState, ReactNode } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';
import { DietaryPreference, DietaryRestriction, FoodCategory, FoodItem, MealType, SpiceLevel } from '../../types';

const CATEGORIES: FoodCategory[] = ['Biryani', 'Karahi', 'BBQ', 'Burger', 'Pizza', 'Fried Chicken', 'Chinese', 'Sandwich', 'Wrap', 'Salad', 'Rice', 'Curry', 'Roti/Naan', 'Dessert', 'Beverage', 'Breakfast'];
const MEAL_TYPES: MealType[] = ['Traditional', 'Chinese', 'Healthy', 'Fast Food', 'BBQ', 'Continental', 'Bakery'];
const SPICE: SpiceLevel[] = ['Mild', 'Medium', 'Spicy'];
const TAGS: DietaryPreference[] = ['Vegetarian', 'Vegan', 'High Protein', 'Low Sugar', 'Lower Fat', 'Balanced'];
const ALLERGENS: DietaryRestriction[] = ['Lactose intolerance', 'Gluten avoidance', 'Nut allergy', 'Egg allergy', 'Seafood allergy'];

const BLANK = (restaurantId: string): FoodItem => ({
  id: '', restaurantId, name: '', description: '', category: 'Curry', mealType: 'Traditional', price: 300,
  ingredients: [], calories: 300, protein: 10, fat: 10, carbs: 30, sugar: 2, sodium: 400, spiceLevel: 'Mild',
  vegetarian: false, vegan: false, dietaryTags: [], allergens: [], servingSize: '1 serving', servesPersons: 1,
  image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600', popular: false,
});

export default function MenuManagement() {
  const { restaurants, menuItems, saveMenuItem, deleteMenuItemById } = useApp();
  const [restaurantId, setRestaurantId] = useState(restaurants[0]?.id || '');
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const menu = menuItems.filter((m) => m.restaurantId === restaurantId);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-20 md:pb-8">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-6">Menu Management</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)} className="border border-charcoal/15 rounded-lg px-3 py-2 text-sm">
          {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <button
          onClick={() => setEditing({ ...BLANK(restaurantId), id: `${restaurantId}-f${Date.now()}` })}
          className="flex items-center gap-1.5 text-sm font-medium bg-emerald-700 text-white rounded-lg px-4 py-2 hover:bg-emerald-800 w-fit"
        >
          <Plus className="w-4 h-4" /> Add Food Item
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {menu.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-3 flex gap-3">
            <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt={item.name} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-charcoal text-sm truncate">{item.name}</p>
              <p className="text-xs text-charcoal/50">Rs. {item.price} · {item.category} · {item.mealType}</p>
              <div className="flex gap-2 mt-1.5">
                <button onClick={() => setEditing(item)} className="text-emerald-700"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteMenuItemById(item.id)} className="text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Menu Item">
        {editing && <FoodForm initial={editing} onCancel={() => setEditing(null)} onSave={(f) => { saveMenuItem(f); setEditing(null); }} />}
      </Modal>
    </div>
  );
}

function FoodForm({ initial, onSave, onCancel }: { initial: FoodItem; onSave: (f: FoodItem) => void; onCancel: () => void }) {
  const [form, setForm] = useState<FoodItem>(initial);
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
      <F label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></F>
      <F label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={2} /></F>
      <div className="grid grid-cols-2 gap-3">
        <F label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as FoodCategory })} className="input">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </F>
        <F label="Meal Type">
          <select value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value as MealType })} className="input">
            {MEAL_TYPES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </F>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <F label="Price (Rs.)"><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input" /></F>
        <F label="Serves (persons/unit)"><input type="number" min={1} value={form.servesPersons} onChange={(e) => setForm({ ...form, servesPersons: Number(e.target.value) })} className="input" /></F>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <F label="Calories"><input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })} className="input" /></F>
        <F label="Protein (g)"><input type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: Number(e.target.value) })} className="input" /></F>
        <F label="Spice">
          <select value={form.spiceLevel} onChange={(e) => setForm({ ...form, spiceLevel: e.target.value as SpiceLevel })} className="input">
            {SPICE.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </F>
      </div>
      <F label="Dietary Tags">
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((t) => (
            <button key={t} onClick={() => setForm({ ...form, dietaryTags: toggle(form.dietaryTags, t) })} className={`text-xs px-2.5 py-1 rounded-full border ${form.dietaryTags.includes(t) ? 'bg-emerald-700 text-white border-emerald-700' : 'border-charcoal/15'}`}>{t}</button>
          ))}
        </div>
      </F>
      <F label="Allergens">
        <div className="flex flex-wrap gap-1.5">
          {ALLERGENS.map((a) => (
            <button key={a} onClick={() => setForm({ ...form, allergens: toggle(form.allergens, a) })} className={`text-xs px-2.5 py-1 rounded-full border ${form.allergens.includes(a) ? 'bg-red-500 text-white border-red-500' : 'border-charcoal/15'}`}>{a}</button>
          ))}
        </div>
      </F>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.vegetarian} onChange={(e) => setForm({ ...form, vegetarian: e.target.checked })} /> Vegetarian</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.vegan} onChange={(e) => setForm({ ...form, vegan: e.target.checked })} /> Vegan</label>
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={onCancel} className="flex-1 text-sm font-medium border border-charcoal/15 rounded-lg py-2">Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.name} className="flex-1 text-sm font-medium bg-emerald-700 disabled:opacity-40 text-white rounded-lg py-2 hover:bg-emerald-800">Save</button>
      </div>
      <style>{`.input { width: 100%; border: 1px solid rgba(31,36,33,0.15); border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; }`}</style>
    </div>
  );
}

function F({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className="text-xs font-medium text-charcoal/60 block mb-1">{label}</label>{children}</div>;
}
