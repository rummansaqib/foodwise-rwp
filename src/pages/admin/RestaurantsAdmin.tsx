import { useState, ReactNode } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import RatingStars from '../../components/RatingStars';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { CuisineType, MealType, Restaurant, RwpArea } from '../../types';

const AREAS: RwpArea[] = ['Saddar', 'Commercial Market', 'Bahria Town', 'PWD', 'Chaklala', 'Satellite Town', 'Raja Bazaar', 'Murree Road', 'Scheme 3', 'Bahria Phase 4', '6th Road'];
const CUISINES: CuisineType[] = ['Pakistani', 'Chinese', 'Fast Food', 'BBQ', 'Burgers', 'Pizza', 'Desi', 'Biryani', 'Turkish', 'Continental', 'Cafe', 'Bakery', 'Seafood', 'Vegetarian'];
const MEAL_TYPES: MealType[] = ['Traditional', 'Chinese', 'Healthy', 'Fast Food', 'BBQ', 'Continental', 'Bakery'];

const BLANK: Restaurant = {
  id: '', name: '', description: '', address: '', area: 'Saddar', latitude: 33.6, longitude: 73.05,
  rating: 4.0, reviewCount: 0, priceLevel: 2, cuisines: [], mealTypes: [], distance: 1.0,
  openingDate: new Date().toISOString().slice(0, 10), isOpen: true,
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
};

export default function RestaurantsAdmin() {
  const { restaurants, saveRestaurant, deleteRestaurantById } = useApp();
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Restaurant | null>(null);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-charcoal">Restaurants</h1>
        <button onClick={() => setEditing({ ...BLANK, id: `r${Date.now()}` })} className="flex items-center gap-1.5 text-sm font-medium bg-emerald-700 text-white rounded-lg px-4 py-2 hover:bg-emerald-800">
          <Plus className="w-4 h-4" /> Add Restaurant
        </button>
      </div>

      <div className="bg-white rounded-xl border border-charcoal/5 shadow-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
              <th className="p-3">Restaurant</th><th className="p-3">Area</th><th className="p-3">Cuisine</th><th className="p-3">Rating</th><th className="p-3">Status</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r.id} className="border-b border-charcoal/5">
                <td className="p-3 font-medium text-charcoal">{r.name}</td>
                <td className="p-3 text-charcoal/60">{r.area}</td>
                <td className="p-3 text-charcoal/60">{r.cuisines.join(', ')}</td>
                <td className="p-3"><RatingStars value={r.rating} /></td>
                <td className="p-3"><Badge tone={r.isOpen ? 'emerald' : 'red'}>{r.isOpen ? 'Open' : 'Closed'}</Badge></td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => setEditing(r)} aria-label={`Edit ${r.name}`} className="text-emerald-700 hover:text-emerald-900"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setConfirmDelete(r)} aria-label={`Delete ${r.name}`} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing && restaurants.some((r) => r.id === editing.id) ? 'Edit Restaurant' : 'Add Restaurant'}>
        {editing && (
          <RestaurantForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={(r) => { saveRestaurant(r); setEditing(null); }}
          />
        )}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete restaurant?" subtitle={confirmDelete?.name}>
        <p className="text-sm text-charcoal/60 mb-4">This will remove the restaurant and its menu from the demo dataset. This cannot be undone.</p>
        <div className="flex gap-2">
          <button onClick={() => setConfirmDelete(null)} className="flex-1 text-sm font-medium border border-charcoal/15 rounded-lg py-2">Cancel</button>
          <button
            onClick={() => { if (confirmDelete) deleteRestaurantById(confirmDelete.id); setConfirmDelete(null); }}
            className="flex-1 text-sm font-medium bg-red-500 text-white rounded-lg py-2 hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

function RestaurantForm({
  initial, onSave, onCancel,
}: { initial: Restaurant; onSave: (r: Restaurant) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Restaurant>(initial);

  const toggleArr = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="space-y-3">
      <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></Field>
      <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={2} /></Field>
      <Field label="Address"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Area">
          <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value as RwpArea })} className="input">
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Field>
        <Field label="Rating">
          <input type="number" min={1} max={5} step={0.1} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="input" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Distance (km)">
          <input type="number" min={0} step={0.1} value={form.distance} onChange={(e) => setForm({ ...form, distance: Number(e.target.value) })} className="input" />
        </Field>
        <Field label="Opening Date">
          <input type="date" value={form.openingDate} onChange={(e) => setForm({ ...form, openingDate: e.target.value })} className="input" />
        </Field>
      </div>
      <Field label="Cuisines">
        <div className="flex flex-wrap gap-1.5">
          {CUISINES.map((c) => (
            <button key={c} onClick={() => setForm({ ...form, cuisines: toggleArr(form.cuisines, c) })} className={`text-xs px-2.5 py-1 rounded-full border ${form.cuisines.includes(c) ? 'bg-emerald-700 text-white border-emerald-700' : 'border-charcoal/15'}`}>{c}</button>
          ))}
        </div>
      </Field>
      <Field label="Meal Types">
        <div className="flex flex-wrap gap-1.5">
          {MEAL_TYPES.map((mt) => (
            <button key={mt} onClick={() => setForm({ ...form, mealTypes: toggleArr(form.mealTypes, mt) })} className={`text-xs px-2.5 py-1 rounded-full border ${form.mealTypes.includes(mt) ? 'bg-emerald-700 text-white border-emerald-700' : 'border-charcoal/15'}`}>{mt}</button>
          ))}
        </div>
      </Field>
      <Field label="Image URL"><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input" /></Field>
      <label className="flex items-center gap-2 text-sm text-charcoal/70">
        <input type="checkbox" checked={form.isOpen} onChange={(e) => setForm({ ...form, isOpen: e.target.checked })} /> Currently open
      </label>
      <div className="flex gap-2 pt-2">
        <button onClick={onCancel} className="flex-1 text-sm font-medium border border-charcoal/15 rounded-lg py-2">Cancel</button>
        <button
          onClick={() => onSave({ ...form, reviewCount: form.reviewCount || 0 })}
          disabled={!form.name || !form.cuisines.length}
          className="flex-1 text-sm font-medium bg-emerald-700 disabled:opacity-40 text-white rounded-lg py-2 hover:bg-emerald-800"
        >
          Save
        </button>
      </div>
      <style>{`.input { width: 100%; border: 1px solid rgba(31,36,33,0.15); border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-charcoal/60 block mb-1">{label}</label>
      {children}
    </div>
  );
}
