export const ROUTES = {
  // general navigation
  HOME: "/",
  FEATURES: "/#features",
  DEMO: "/demo",
  DASHBOARD: "/dashboard",

  // external resources
  EXTENSION: "https://google.com",
  GITHUB: "https://github.com/alejo742/screwit"
} as const;

export const defaultProfilePicture = "/default/profile-picture.jpg" as const;

// Prompt validation constants (characters)
export const PROMPT_LIMITS = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 1000
} as const;

// AI Capabilities detailed information
export const AI_CAPABILITY_DETAILS = {
  amazon: {
    title: "Amazon Product Search",
    description: "Searches Amazon's vast marketplace for event supplies, decorations, and equipment",
    features: [
      "Real-time product availability",
      "Price comparison across sellers", 
      "Prime delivery options",
      "Customer reviews integration"
    ],
    useCase: "Perfect for finding unique decorations, party supplies, tech equipment, and bulk items for your event."
  },
  instacart: {
    title: "Instacart Grocery Delivery",
    description: "Sources fresh groceries, snacks, and beverages from local stores near Dartmouth",
    features: [
      "Same-day delivery available",
      "Fresh produce and ingredients",
      "Multiple store options",
      "Dietary restriction filters"
    ],
    useCase: "Ideal for sourcing fresh ingredients, snacks, beverages, and last-minute food items for your event."
  },
  restaurants: {
    title: "Local Restaurant Scanning",
    description: "Analyzes menus from restaurants and catering services in the Dartmouth area",
    features: [
      "Real-time menu updates",
      "Catering package options",
      "Dietary accommodations",
      "Delivery radius checking"
    ],
    useCase: "Great for discovering catering options, food trucks, and restaurant partnerships for your event."
  },
  events: {
    title: "Dartmouth Event Inspiration",
    description: "Draws insights from successful past events and traditions at Dartmouth College",
    features: [
      "Historical event database",
      "Success metrics analysis",
      "Seasonal event trends",
      "Campus venue insights"
    ],
    useCase: "Helps you build on proven event formats and avoid common pitfalls based on campus history."
  }
} as const;