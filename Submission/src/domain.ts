// Pantry Chef domain logic: pantry, recipes, hands-free cooking sessions, timers.
// In-memory state keyed by household so the demo stays dependency-free.

export interface PantryItem { name: string; quantity: number; unit: string; expires?: string }
export interface Step { text: string; timerMinutes?: number }
export interface Recipe { id: string; title: string; minutes: number; serves: number; ingredients: string[]; steps: Step[] }
export interface Timer { id: number; label: string; endsAt: number }
export interface Session { recipeId: string; stepIndex: number; startedAt: number }
interface Household { pantry: Map<string, PantryItem>; session?: Session; timers: Timer[]; nextTimer: number }

export const RECIPES: Recipe[] = [
  { id: "spinach-frittata", title: "Spinach & Feta Frittata", minutes: 25, serves: 2,
    ingredients: ["eggs", "spinach", "feta", "onion", "olive oil"],
    steps: [
      { text: "Heat the oven to 200°C / 400°F. Whisk 6 eggs with a pinch of salt." },
      { text: "Warm a tablespoon of olive oil in an oven-safe pan and soften a diced onion.", timerMinutes: 4 },
      { text: "Add two big handfuls of spinach and stir until wilted, about a minute." },
      { text: "Pour in the eggs, crumble the feta on top, and cook untouched until the edges set.", timerMinutes: 3 },
      { text: "Move the pan to the oven and bake until the center is just firm.", timerMinutes: 10 },
      { text: "Rest for two minutes, slice, and serve." },
    ] },
  { id: "banana-pancakes", title: "Ripe Banana Pancakes", minutes: 20, serves: 2,
    ingredients: ["bananas", "eggs", "flour", "milk", "butter"],
    steps: [
      { text: "Mash 2 ripe bananas in a bowl until mostly smooth." },
      { text: "Whisk in 2 eggs and 120 ml of milk, then fold in 100 g of flour." },
      { text: "Melt a little butter in a pan over medium heat." },
      { text: "Pour small rounds of batter and cook until bubbles form, then flip.", timerMinutes: 2 },
      { text: "Cook the second side until golden and serve warm." },
    ] },
  { id: "tomato-pasta", title: "Quick Cherry Tomato Pasta", minutes: 20, serves: 2,
    ingredients: ["pasta", "cherry tomatoes", "garlic", "olive oil", "basil"],
    steps: [
      { text: "Bring a large pot of salted water to a boil and add 200 g of pasta.", timerMinutes: 10 },
      { text: "Meanwhile, sizzle 3 sliced garlic cloves in olive oil for a minute." },
      { text: "Add the cherry tomatoes and cook until they burst.", timerMinutes: 5 },
      { text: "Drain the pasta, saving a splash of water, and toss everything together." },
      { text: "Tear in fresh basil and serve." },
    ] },
  { id: "chicken-stir-fry", title: "Chicken & Veg Stir-Fry", minutes: 25, serves: 3,
    ingredients: ["chicken breast", "bell pepper", "broccoli", "soy sauce", "garlic", "rice"],
    steps: [
      { text: "Start the rice according to the package.", timerMinutes: 15 },
      { text: "Slice the chicken into strips and the vegetables into bite-size pieces." },
      { text: "Stir-fry the chicken in a hot pan until cooked through.", timerMinutes: 6 },
      { text: "Add the garlic, pepper and broccoli and stir-fry until crisp-tender.", timerMinutes: 3 },
      { text: "Splash in soy sauce, toss, and serve over the rice." },
    ] },
  { id: "yogurt-parfait", title: "Berry Yogurt Parfait", minutes: 5, serves: 1,
    ingredients: ["yogurt", "berries", "granola", "honey"],
    steps: [
      { text: "Spoon yogurt into a glass." },
      { text: "Layer berries and granola on top, then repeat." },
      { text: "Drizzle with honey and enjoy." },
    ] },
];

const households = new Map<string, Household>();
const DAY = 86_400_000;
const isoIn = (days: number) => new Date(Date.now() + days * DAY).toISOString().slice(0, 10);
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

function seed(h: Household) {
  const items: PantryItem[] = [
    { name: "eggs", quantity: 8, unit: "count", expires: isoIn(4) },
    { name: "spinach", quantity: 1, unit: "bag", expires: isoIn(1) },
    { name: "feta", quantity: 150, unit: "g", expires: isoIn(2) },
    { name: "onion", quantity: 3, unit: "count" },
    { name: "olive oil", quantity: 1, unit: "bottle" },
    { name: "bananas", quantity: 3, unit: "count", expires: isoIn(1) },
    { name: "flour", quantity: 1, unit: "kg" },
    { name: "milk", quantity: 1, unit: "l", expires: isoIn(3) },
    { name: "pasta", quantity: 500, unit: "g" },
    { name: "garlic", quantity: 1, unit: "bulb" },
  ];
  for (const i of items) h.pantry.set(i.name, i);
}

export function household(id = "demo"): Household {
  let h = households.get(id);
  if (!h) { h = { pantry: new Map(), timers: [], nextTimer: 1 }; seed(h); households.set(id, h); }
  return h;
}

export function resetHousehold(id = "demo") { households.delete(id); return household(id); }

export function daysLeft(item: PantryItem): number | undefined {
  if (!item.expires) return undefined;
  return Math.round((Date.parse(item.expires) - Date.parse(isoIn(0))) / DAY);
}

export function addItem(h: Household, name: string, quantity = 1, unit = "count", expiresInDays?: number) {
  const key = norm(name);
  const existing = h.pantry.get(key);
  const expires = expiresInDays !== undefined ? isoIn(expiresInDays) : existing?.expires;
  const item = { name: key, quantity: (existing?.unit === unit ? existing.quantity : 0) + quantity, unit, expires };
  h.pantry.set(key, item);
  return item;
}

export function removeItem(h: Household, name: string) {
  const key = norm(name);
  return h.pantry.delete(key) ? key : undefined;
}

export function listPantry(h: Household) {
  return [...h.pantry.values()]
    .map(i => ({ ...i, daysLeft: daysLeft(i) }))
    .sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999));
}

export function expiringSoon(h: Household, withinDays = 3) {
  return listPantry(h).filter(i => i.daysLeft !== undefined && i.daysLeft <= withinDays);
}

const has = (h: Household, ing: string) => [...h.pantry.keys()].some(k => k === ing || k.includes(ing) || ing.includes(k));

export function suggestRecipes(h: Household, limit = 3) {
  const expiring = new Set(expiringSoon(h).map(i => i.name));
  return RECIPES.map(r => {
    const haveList = r.ingredients.filter(i => has(h, i));
    const missing = r.ingredients.filter(i => !has(h, i));
    const usesExpiring = haveList.filter(i => [...expiring].some(e => e === i || e.includes(i) || i.includes(e)));
    const score = haveList.length / r.ingredients.length + usesExpiring.length * 0.5;
    return { id: r.id, title: r.title, minutes: r.minutes, usesExpiring, missing, score: Math.round(score * 100) / 100 };
  }).sort((a, b) => b.score - a.score).slice(0, limit);
}

export function findRecipe(q: string) {
  const s = norm(q);
  return RECIPES.find(r => r.id === s || norm(r.title) === s)
    ?? RECIPES.find(r => norm(r.title).includes(s) || s.includes(r.id.split("-")[0]) || r.id.includes(s.replace(/ /g, "-")));
}

function describeStep(h: Household) {
  const s = h.session!; const r = RECIPES.find(x => x.id === s.recipeId)!;
  const step = r.steps[s.stepIndex];
  return { recipe: r.title, step: s.stepIndex + 1, of: r.steps.length, text: step.text,
    suggestedTimerMinutes: step.timerMinutes, isLast: s.stepIndex === r.steps.length - 1 };
}

export function startCooking(h: Household, recipeQuery: string) {
  const r = findRecipe(recipeQuery);
  if (!r) return undefined;
  h.session = { recipeId: r.id, stepIndex: 0, startedAt: Date.now() };
  return { ingredients: r.ingredients, ...describeStep(h) };
}

export function moveStep(h: Household, delta: number) {
  if (!h.session) return undefined;
  const r = RECIPES.find(x => x.id === h.session!.recipeId)!;
  const next = h.session.stepIndex + delta;
  if (next >= r.steps.length) {
    const title = r.title; h.session = undefined;
    // Finishing a recipe uses up its soon-to-expire ingredients from the pantry.
    const used = r.ingredients.filter(i => { const d = daysLeft(h.pantry.get(i) ?? { name: "", quantity: 0, unit: "" }); return d !== undefined && d <= 3 && h.pantry.delete(i); });
    return { done: true, recipe: title, usedUp: used };
  }
  h.session.stepIndex = Math.max(0, next);
  return describeStep(h);
}

export const currentStep = (h: Household) => (h.session ? describeStep(h) : undefined);

export function setTimer(h: Household, minutes: number, label?: string) {
  const t = { id: h.nextTimer++, label: label ?? `${minutes} minute timer`, endsAt: Date.now() + minutes * 60_000 };
  h.timers.push(t);
  return { id: t.id, label: t.label, endsAt: new Date(t.endsAt).toISOString(), minutes };
}

export function listTimers(h: Household) {
  const now = Date.now();
  h.timers = h.timers.filter(t => t.endsAt > now - 60_000);
  return h.timers.map(t => ({ id: t.id, label: t.label, secondsLeft: Math.max(0, Math.round((t.endsAt - now) / 1000)), done: t.endsAt <= now }));
}

export function cancelTimer(h: Household, id?: number) {
  const before = h.timers.length;
  h.timers = id === undefined ? [] : h.timers.filter(t => t.id !== id);
  return before - h.timers.length;
}
