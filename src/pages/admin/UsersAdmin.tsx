import { adminUsers } from '../../data/users';

export default function UsersAdmin() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-20 md:pb-8">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-1">Users</h1>
      <p className="text-charcoal/50 text-sm mb-6">Demo users for the prototype — no live authentication backend is required for this view.</p>
      <div className="bg-white rounded-xl border border-charcoal/5 shadow-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
              <th className="p-3">User ID</th><th className="p-3">Name</th><th className="p-3">Goal</th><th className="p-3">Favorite Cuisine</th><th className="p-3">Meals This Week</th><th className="p-3">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((u) => (
              <tr key={u.id} className="border-b border-charcoal/5">
                <td className="p-3 text-charcoal/50">{u.id}</td>
                <td className="p-3 font-medium text-charcoal">{u.name}</td>
                <td className="p-3 text-charcoal/60">{u.goal}</td>
                <td className="p-3 text-charcoal/60">{u.favoriteCuisine}</td>
                <td className="p-3 text-charcoal/60">{u.mealsThisWeek}</td>
                <td className="p-3 text-charcoal/60">{u.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
