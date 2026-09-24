export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-10 pb-16 prose-sm">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-4">About FoodWise RWP</h1>
      <p className="text-charcoal/70 text-sm leading-relaxed">
        FoodWise RWP is a Final Year Project prototype demonstrating an AI-powered personalized food discovery
        and recommendation platform for Rawalpindi. Rather than just listing restaurants, it combines budget,
        group size, preferences, dietary goals, eating history, restaurant quality, and context into a single,
        explainable recommendation.
      </p>
      <h2 className="font-display text-lg font-semibold text-charcoal mt-6 mb-2">Data Disclaimer</h2>
      <p className="text-charcoal/70 text-sm leading-relaxed">
        This prototype uses demonstration restaurant and menu data. It does not represent every restaurant in
        Rawalpindi. A production version would populate the platform through permitted data sources, restaurant
        submissions, licensed APIs/datasets, and administrator verification.
      </p>
      <h2 className="font-display text-lg font-semibold text-charcoal mt-6 mb-2">Health Disclaimer</h2>
      <p className="text-charcoal/70 text-sm leading-relaxed">
        FoodWise is a food discovery and decision-support prototype, not a medical diagnostic or treatment system.
        Nutrition information shown may be demonstration data. Users with allergies, medical conditions, or specific
        dietary requirements should verify ingredients and nutritional information with the restaurant or a
        qualified professional.
      </p>
    </div>
  );
}
