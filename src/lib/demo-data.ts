import type { ThemeProps } from "@/components/menu/themes/types";
import type { Tenant, Menu, Category, Item } from "@/types";

const ACCENT_COLORS: Record<string, string> = {
  classic: "#8B4513",
  modern: "#111827",
  dark: "#C8A064",
  bistro: "#B8860B",
};

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", // bruschetta
  "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&q=80", // soup
  "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&q=80", // salad
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", // salmon
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", // pizza
  "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80", // pasta
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80", // creme brulee
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80", // tiramisu
  "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80", // chocolate cake
];

const menuId = "demo-menu-1";
const tenantId = "demo-tenant";

const demoCategories: Category[] = [
  {
    id: "demo-cat-starters",
    menuId,
    tenantId,
    name: "Starters",
    description: "Begin your journey with our chef's favorites",
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-cat-mains",
    menuId,
    tenantId,
    name: "Main Courses",
    description: "Hearty dishes crafted with seasonal ingredients",
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-cat-desserts",
    menuId,
    tenantId,
    name: "Desserts",
    description: "Sweet finales to complete your meal",
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const demoItems: Item[] = [
  // Starters
  {
    id: "demo-item-1",
    categoryId: "demo-cat-starters",
    tenantId,
    name: "Bruschetta al Pomodoro",
    description: "Toasted sourdough topped with vine-ripened tomatoes, fresh basil, and extra virgin olive oil",
    price: "12.00",
    currency: "USD",
    imageUrl: DEMO_IMAGES[0],
    isAvailable: true,
    prices: {},
    badges: ["vegetarian", "popular"],
    allergens: ["gluten"],
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-item-2",
    categoryId: "demo-cat-starters",
    tenantId,
    name: "Wild Mushroom Soup",
    description: "Velvety blend of porcini and chanterelle mushrooms with a hint of truffle oil",
    price: "14.00",
    currency: "USD",
    imageUrl: DEMO_IMAGES[1],
    isAvailable: true,
    prices: {},
    badges: ["vegan", "gluten_free"],
    allergens: [],
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-item-3",
    categoryId: "demo-cat-starters",
    tenantId,
    name: "Garden Salad",
    description: "Mixed greens with cherry tomatoes, cucumber, and lemon vinaigrette",
    price: "10.00",
    currency: "USD",
    imageUrl: DEMO_IMAGES[2],
    isAvailable: true,
    prices: {},
    badges: ["vegan"],
    allergens: [],
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Main Courses
  {
    id: "demo-item-4",
    categoryId: "demo-cat-mains",
    tenantId,
    name: "Pan-Seared Salmon",
    description: "Atlantic salmon with roasted asparagus, lemon butter sauce, and herbed quinoa",
    price: "28.00",
    currency: "USD",
    imageUrl: DEMO_IMAGES[3],
    isAvailable: true,
    prices: {},
    badges: ["chef_pick", "gluten_free"],
    allergens: ["fish"],
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-item-5",
    categoryId: "demo-cat-mains",
    tenantId,
    name: "Wood-Fired Margherita",
    description: "San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil on hand-stretched dough",
    price: "22.00",
    currency: "USD",
    imageUrl: DEMO_IMAGES[4],
    isAvailable: true,
    prices: {},
    badges: ["vegetarian", "popular"],
    allergens: ["gluten", "dairy"],
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-item-6",
    categoryId: "demo-cat-mains",
    tenantId,
    name: "Truffle Pappardelle",
    description: "House-made pappardelle pasta with black truffle cream sauce and parmesan shavings",
    price: "26.00",
    currency: "USD",
    imageUrl: DEMO_IMAGES[5],
    isAvailable: true,
    prices: {},
    badges: ["vegetarian", "new"],
    allergens: ["gluten", "dairy", "eggs"],
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Desserts
  {
    id: "demo-item-7",
    categoryId: "demo-cat-desserts",
    tenantId,
    name: "Crème Brûlée",
    description: "Classic vanilla custard with a caramelized sugar crust",
    price: "14.00",
    currency: "USD",
    imageUrl: DEMO_IMAGES[6],
    isAvailable: true,
    prices: {},
    badges: ["popular"],
    allergens: ["dairy", "eggs"],
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-item-8",
    categoryId: "demo-cat-desserts",
    tenantId,
    name: "Tiramisu",
    description: "Espresso-soaked ladyfingers layered with mascarpone cream and cocoa",
    price: "15.00",
    currency: "USD",
    imageUrl: DEMO_IMAGES[7],
    isAvailable: true,
    prices: {},
    badges: ["chef_pick"],
    allergens: ["dairy", "eggs", "gluten"],
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-item-9",
    categoryId: "demo-cat-desserts",
    tenantId,
    name: "Chocolate Fondant",
    description: "Warm dark chocolate cake with a molten center, served with vanilla ice cream",
    price: "16.00",
    currency: "USD",
    imageUrl: DEMO_IMAGES[8],
    isAvailable: true,
    prices: {},
    badges: ["new"],
    allergens: ["dairy", "eggs", "gluten"],
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function getDemoData(themeId: string): ThemeProps {
  const accentColor = ACCENT_COLORS[themeId] || ACCENT_COLORS.modern;

  const tenant = {
    id: tenantId,
    ownerId: "demo-owner",
    name: "La Maison",
    slug: "demo",
    description: "A cozy neighborhood bistro serving seasonal French-inspired cuisine with locally sourced ingredients.",
    logoUrl: null,
    coverImageUrl: null,
    address: "42 Rue de la Paix, Paris",
    phone: "+33 1 23 45 67 89",
    website: null,
    openingHours: null,
    themeId,
    accentColor,
    defaultLanguage: "en",
    enabledLanguages: ["en"],
    defaultCurrency: "USD",
    enabledCurrencies: ["USD"],
    customDomain: null,
    domainVerified: false,
    plan: "pro",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    trialEndsAt: null,
    aiUploadsUsed: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Tenant;

  const demoMenu: Menu = {
    id: menuId,
    tenantId,
    name: "Main Menu",
    isActive: true,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    tenant,
    menus: [demoMenu],
    categories: demoCategories,
    items: demoItems,
    translations: [],
    currentLanguage: "en",
    currentMenuId: menuId,
  };
}

export const VALID_THEMES = ["classic", "modern", "dark", "bistro"] as const;
