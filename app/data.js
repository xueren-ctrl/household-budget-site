// Hearth & Ledger — the household's money, November 2026.
//
// Every figure on the site comes from this file. The Alvarez household's
// November transactions are listed one by one, and the category totals,
// the month totals and the six-month trend are all computed from them, so
// no view can disagree with another. Amounts are US dollars.

export const HOUSEHOLD = {
  name: 'The Alvarez Household',
  tagline: 'Maya & Tom Alvarez, with Leo (9) and Sofia (6) — one shared pot, every dollar given a job.',
  month: 'November 2026',
  monthShort: 'Nov 2026',
  members: [
    { name: 'Maya Alvarez', role: 'Designer · brings home $4,150 a month' },
    { name: 'Tom Alvarez', role: 'Teacher · brings home $3,600 a month' },
    { name: 'Leo Alvarez', role: 'Age 9 · piano, soccer and school lunches' },
    { name: 'Sofia Alvarez', role: 'Age 6 · art supplies and library books' },
  ],
};

// Monthly plan per category. `budget` is what the household planned to
// spend in November; the actual spend is the sum of the transactions below.
export const CATEGORIES = [
  { id: 'housing', name: 'Housing', budget: 1850, color: '#33565c', icon: '⌂', blurb: 'Mortgage, insurance and the homeowners’ association.' },
  { id: 'groceries', name: 'Groceries', budget: 720, color: '#5b8c5a', icon: '❋', blurb: 'Weekly shops, the farmers market and the monthly Costco run.' },
  { id: 'transport', name: 'Transport', budget: 380, color: '#4a7fa5', icon: '➤', blurb: 'Fuel, metro cards, parking and the odd car wash.' },
  { id: 'utilities', name: 'Utilities', budget: 310, color: '#b98a1f', icon: '✦', blurb: 'Electricity, water, gas, internet and phone top-ups.' },
  { id: 'dining', name: 'Dining out', budget: 240, color: '#c96f3f', icon: '◐', blurb: 'Takeaway, pizza nights and weekend brunch.' },
  { id: 'entertainment', name: 'Entertainment', budget: 180, color: '#8e6bbf', icon: '♪', blurb: 'Cinema, concerts, games and the odd arcade afternoon.' },
  { id: 'health', name: 'Health', budget: 220, color: '#3f9d8f', icon: '+', blurb: 'Pharmacy, dentist, vitamins and clinic visits.' },
  { id: 'kids', name: 'Kids & school', budget: 260, color: '#e07856', icon: '✎', blurb: 'School lunches, lessons, sport and school trips.' },
  { id: 'clothing', name: 'Clothing', budget: 120, color: '#7d7d9e', icon: '◍', blurb: 'Shoes and winter layers for two growing children.' },
  { id: 'subscriptions', name: 'Subscriptions', budget: 85, color: '#5c8a8a', icon: '↻', blurb: 'Music, video, news, audiobooks and learning apps.' },
  { id: 'savings', name: 'Savings', budget: 2600, color: '#1e5c46', icon: '⬢', blurb: 'Moved to the goals on payday — emergency, holiday, car, college.' },
  { id: 'misc', name: 'Everyday misc', budget: 150, color: '#a08c6a', icon: '•', blurb: 'Hardware, gifts and the small things that have no category.' },
];

export function findCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}

// November 2026, every transaction. Income first, then spending in date
// order. The sums per category are asserted in the tests.
export const TRANSACTIONS = [
  // Income
  { id: 'i01', date: '2026-11-01', payee: 'Maya Alvarez — salary', category: 'income', amount: 4150.00, type: 'income', note: 'Monthly pay, design studio' },
  { id: 'i02', date: '2026-11-01', payee: 'Tom Alvarez — salary', category: 'income', amount: 3600.00, type: 'income', note: 'Monthly pay, Riverside School' },
  { id: 'i03', date: '2026-11-14', payee: 'Freelance design — Maya', category: 'income', amount: 520.00, type: 'income', note: 'Logo work for a local café' },
  { id: 'i04', date: '2026-11-30', payee: 'Bank interest', category: 'income', amount: 28.00, type: 'income', note: 'Savings account interest' },
  // Spending
  { id: 't01', date: '2026-11-01', payee: 'Music streaming', category: 'subscriptions', amount: 10.99, type: 'expense', note: 'Monthly plan' },
  { id: 't02', date: '2026-11-01', payee: 'Emergency fund transfer', category: 'savings', amount: 1500.00, type: 'expense', note: 'Payday — straight to the emergency fund' },
  { id: 't03', date: '2026-11-02', payee: 'GreenMart', category: 'groceries', amount: 86.40, type: 'expense', note: 'Weekly shop' },
  { id: 't04', date: '2026-11-02', payee: 'School lunches', category: 'kids', amount: 65.00, type: 'expense', note: 'Leo & Sofia, November lunches' },
  { id: 't05', date: '2026-11-03', payee: 'Mortgage payment', category: 'housing', amount: 1650.00, type: 'expense', note: 'Maple Street house' },
  { id: 't06', date: '2026-11-03', payee: 'Noodle House', category: 'dining', amount: 42.50, type: 'expense', note: 'Tuesday takeaway' },
  { id: 't07', date: '2026-11-03', payee: 'Video streaming', category: 'subscriptions', amount: 15.49, type: 'expense', note: 'Monthly plan' },
  { id: 't08', date: '2026-11-04', payee: 'Fuel — Shell station', category: 'transport', amount: 48.20, type: 'expense', note: 'Full tank' },
  { id: 't09', date: '2026-11-04', payee: 'Hardware store', category: 'misc', amount: 34.20, type: 'expense', note: 'Light bulbs and a door hinge' },
  { id: 't10', date: '2026-11-05', payee: 'Home insurance', category: 'housing', amount: 120.00, type: 'expense', note: 'Monthly premium' },
  { id: 't11', date: '2026-11-05', payee: 'Cinema — family film', category: 'entertainment', amount: 32.00, type: 'expense', note: 'Four tickets, Saturday matinee' },
  { id: 't12', date: '2026-11-05', payee: 'Cloud storage', category: 'subscriptions', amount: 2.99, type: 'expense', note: 'Photo backup' },
  { id: 't13', date: '2026-11-06', payee: 'GreenMart', category: 'groceries', amount: 112.75, type: 'expense', note: 'Weekly shop' },
  { id: 't14', date: '2026-11-06', payee: 'Electricity', category: 'utilities', amount: 118.60, type: 'expense', note: 'October usage, billed November' },
  { id: 't15', date: '2026-11-07', payee: 'Metro cards', category: 'transport', amount: 60.00, type: 'expense', note: 'Two monthly passes' },
  { id: 't16', date: '2026-11-07', payee: 'Pharmacy', category: 'health', amount: 28.40, type: 'expense', note: 'Cold medicine and plasters' },
  { id: 't17', date: '2026-11-08', payee: 'Pizza night', category: 'dining', amount: 28.75, type: 'expense', note: 'Two large pizzas, delivery' },
  { id: 't18', date: '2026-11-08', payee: 'Homeowners’ association', category: 'housing', amount: 80.00, type: 'expense', note: 'Monthly dues' },
  { id: 't19', date: '2026-11-09', payee: 'Farmers market', category: 'groceries', amount: 38.20, type: 'expense', note: 'Vegetables and eggs' },
  { id: 't20', date: '2026-11-09', payee: 'Board game', category: 'entertainment', amount: 24.99, type: 'expense', note: 'A rainy-Sunday game for the family' },
  { id: 't21', date: '2026-11-10', payee: 'Water bill', category: 'utilities', amount: 42.35, type: 'expense', note: 'Monthly water' },
  { id: 't22', date: '2026-11-10', payee: 'Art supplies', category: 'kids', amount: 32.50, type: 'expense', note: 'Paints and sketchbooks for Sofia' },
  { id: 't23', date: '2026-11-11', payee: 'Fuel — Shell station', category: 'transport', amount: 52.40, type: 'expense', note: 'Full tank' },
  { id: 't24', date: '2026-11-11', payee: 'Kids’ shoes', category: 'clothing', amount: 54.00, type: 'expense', note: 'Leo outgrew his old pair again' },
  { id: 't25', date: '2026-11-12', payee: 'Internet', category: 'utilities', amount: 65.00, type: 'expense', note: 'Fibre broadband, monthly' },
  { id: 't26', date: '2026-11-12', payee: 'Dentist copay', category: 'health', amount: 85.00, type: 'expense', note: 'Leo’s six-month check-up' },
  { id: 't27', date: '2026-11-12', payee: 'News app', category: 'subscriptions', amount: 9.99, type: 'expense', note: 'Monthly subscription' },
  { id: 't28', date: '2026-11-13', payee: 'GreenMart', category: 'groceries', amount: 94.60, type: 'expense', note: 'Weekly shop' },
  { id: 't29', date: '2026-11-13', payee: 'Gift wrap & cards', category: 'misc', amount: 18.45, type: 'expense', note: 'Birthday cards and wrapping paper' },
  { id: 't30', date: '2026-11-14', payee: 'Sushi', category: 'dining', amount: 64.20, type: 'expense', note: 'Date night, Maya & Tom' },
  { id: 't31', date: '2026-11-15', payee: 'Parking', category: 'transport', amount: 18.50, type: 'expense', note: 'Downtown, Saturday' },
  { id: 't32', date: '2026-11-15', payee: 'Piano lesson', category: 'kids', amount: 60.00, type: 'expense', note: 'Leo, monthly lesson' },
  { id: 't33', date: '2026-11-15', payee: 'Fitness app', category: 'subscriptions', amount: 12.99, type: 'expense', note: 'Monthly subscription' },
  { id: 't34', date: '2026-11-15', payee: 'Holiday fund transfer', category: 'savings', amount: 600.00, type: 'expense', note: 'Mid-month — Japan trip jar' },
  { id: 't35', date: '2026-11-15', payee: 'College fund transfer', category: 'savings', amount: 500.00, type: 'expense', note: 'Mid-month — kids’ college jar' },
  { id: 't36', date: '2026-11-16', payee: 'Costco run', category: 'groceries', amount: 148.90, type: 'expense', note: 'Bulk pantry and freezer stock-up' },
  { id: 't37', date: '2026-11-16', payee: 'Streaming rental', category: 'entertainment', amount: 12.99, type: 'expense', note: 'Friday film night at home' },
  { id: 't38', date: '2026-11-17', payee: 'Coffee & bagels', category: 'dining', amount: 18.40, type: 'expense', note: 'Morning stop on the school run' },
  { id: 't39', date: '2026-11-18', payee: 'Fuel — Shell station', category: 'transport', amount: 46.00, type: 'expense', note: 'Top-up' },
  { id: 't40', date: '2026-11-18', payee: 'Vitamins', category: 'health', amount: 22.60, type: 'expense', note: 'Family multivitamins' },
  { id: 't41', date: '2026-11-19', payee: 'Gas bill', category: 'utilities', amount: 48.50, type: 'expense', note: 'Heating, monthly' },
  { id: 't42', date: '2026-11-19', payee: 'Soccer fees', category: 'kids', amount: 45.00, type: 'expense', note: 'Leo, winter season' },
  { id: 't43', date: '2026-11-20', payee: 'GreenMart', category: 'groceries', amount: 76.45, type: 'expense', note: 'Weekly shop' },
  { id: 't44', date: '2026-11-20', payee: 'Winter socks & gloves', category: 'clothing', amount: 44.75, type: 'expense', note: 'Two sets, both children' },
  { id: 't45', date: '2026-11-21', payee: 'Car wash', category: 'transport', amount: 15.00, type: 'expense', note: 'Saturday wash' },
  { id: 't46', date: '2026-11-21', payee: 'Burger joint', category: 'dining', amount: 36.90, type: 'expense', note: 'Lunch after soccer' },
  { id: 't47', date: '2026-11-21', payee: 'Audiobooks', category: 'subscriptions', amount: 14.99, type: 'expense', note: 'Monthly subscription' },
  { id: 't48', date: '2026-11-22', payee: 'Concert tickets', category: 'entertainment', amount: 58.00, type: 'expense', note: 'Two tickets, December show' },
  { id: 't49', date: '2026-11-23', payee: 'Farmers market', category: 'groceries', amount: 41.30, type: 'expense', note: 'Vegetables and bread' },
  { id: 't50', date: '2026-11-23', payee: 'Household bits', category: 'misc', amount: 43.75, type: 'expense', note: 'Cleaning supplies and batteries' },
  { id: 't51', date: '2026-11-24', payee: 'Takeaway Thai', category: 'dining', amount: 44.25, type: 'expense', note: 'No-cook Tuesday' },
  { id: 't52', date: '2026-11-24', payee: 'Mobile top-up', category: 'utilities', amount: 22.00, type: 'expense', note: 'Prepaid top-up, Tom’s phone' },
  { id: 't53', date: '2026-11-25', payee: 'Fuel — Shell station', category: 'transport', amount: 54.00, type: 'expense', note: 'Full tank' },
  { id: 't54', date: '2026-11-25', payee: 'Library books', category: 'kids', amount: 12.00, type: 'expense', note: 'Replacement fee, one lost book' },
  { id: 't55', date: '2026-11-26', payee: 'Eye drops', category: 'health', amount: 12.00, type: 'expense', note: 'Pharmacy' },
  { id: 't56', date: '2026-11-26', payee: 'Kids’ learning app', category: 'subscriptions', amount: 15.50, type: 'expense', note: 'Monthly subscription' },
  { id: 't57', date: '2026-11-27', payee: 'GreenMart', category: 'groceries', amount: 85.75, type: 'expense', note: 'Weekly shop' },
  { id: 't58', date: '2026-11-27', payee: 'School trip', category: 'kids', amount: 30.00, type: 'expense', note: 'Leo’s museum trip' },
  { id: 't59', date: '2026-11-28', payee: 'Metro top-up', category: 'transport', amount: 48.00, type: 'expense', note: 'Monthly pass top-up' },
  { id: 't60', date: '2026-11-28', payee: 'Brunch café', category: 'dining', amount: 26.80, type: 'expense', note: 'Saturday brunch, all four' },
  { id: 't61', date: '2026-11-29', payee: 'Arcade', category: 'entertainment', amount: 14.27, type: 'expense', note: 'Sunday afternoon with the kids' },
  { id: 't62', date: '2026-11-30', payee: 'First aid', category: 'health', amount: 8.00, type: 'expense', note: 'Plasters and antiseptic' },
  { id: 't63', date: '2026-11-30', payee: 'Clinic visit', category: 'health', amount: 30.00, type: 'expense', note: 'Sofia’s check-up copay' },
];

// What the household actually spent per category in November. These are
// the sums of the transactions above, written out so the tests can check
// the arithmetic both ways.
export const ACTUALS = {
  housing: 1850.00,
  groceries: 684.35,
  transport: 342.10,
  utilities: 296.45,
  dining: 261.80,
  entertainment: 142.25,
  health: 186.00,
  kids: 244.50,
  clothing: 98.75,
  subscriptions: 82.94,
  savings: 2600.00,
  misc: 96.40,
};

// Savings goals. `current` is the balance after November's transfers.
export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', target: 12000, current: 9450, note: 'Six months of essentials, for the month nobody plans for.', monthly: 1500 },
  { id: 'holiday', name: 'Family holiday — Japan', target: 4500, current: 2860, note: 'Flights and a week in Kyoto, planned for next spring.', monthly: 600 },
  { id: 'car', name: 'New family car', target: 15000, current: 6200, note: 'Replacing the 2014 hatchback before it gives up.', monthly: 0 },
  { id: 'college', name: 'Kids’ college fund', target: 25000, current: 8750, note: 'A little each month, for Leo and Sofia further down the road.', monthly: 500 },
];

// Recurring bills. The five November bills are paid and match transactions
// above; the December ones are still to come.
export const BILLS = [
  { id: 'b01', name: 'Mortgage payment', amount: 1650.00, due: '2026-11-03', status: 'paid', note: 'Maple Street house' },
  { id: 'b02', name: 'Home insurance', amount: 120.00, due: '2026-11-05', status: 'paid', note: 'Monthly premium' },
  { id: 'b03', name: 'Electricity', amount: 118.60, due: '2026-11-06', status: 'paid', note: 'October usage' },
  { id: 'b04', name: 'Water bill', amount: 42.35, due: '2026-11-10', status: 'paid', note: 'Monthly water' },
  { id: 'b05', name: 'Internet', amount: 65.00, due: '2026-11-12', status: 'paid', note: 'Fibre broadband' },
  { id: 'b06', name: 'Gym membership', amount: 45.00, due: '2026-12-01', status: 'upcoming', note: 'Family membership' },
  { id: 'b07', name: 'Mobile plan', amount: 89.00, due: '2026-12-02', status: 'upcoming', note: 'Two lines, shared data' },
  { id: 'b08', name: 'Video streaming', amount: 15.49, due: '2026-12-03', status: 'upcoming', note: 'Monthly plan' },
  { id: 'b09', name: 'Car insurance', amount: 132.00, due: '2026-12-05', status: 'upcoming', note: 'Monthly premium' },
  { id: 'b10', name: 'Piano lessons', amount: 60.00, due: '2026-12-07', status: 'upcoming', note: 'Leo, monthly lesson' },
];

// Six months of income, money out (spending plus savings moved) and money
// saved. November is computed from the transactions above.
export const TREND = [
  { month: 'Jun', income: 8120, out: 5940, saved: 1850 },
  { month: 'Jul', income: 8240, out: 6180, saved: 1720 },
  { month: 'Aug', income: 8190, out: 6420, saved: 1540 },
  { month: 'Sep', income: 8310, out: 5870, saved: 2100 },
  { month: 'Oct', income: 8275, out: 6050, saved: 1980 },
  { month: 'Nov', income: 8298, out: 6885.54, saved: 2600 },
];

// --- Formatting and arithmetic -------------------------------------------

export function money(n) {
  const sign = n < 0 ? '−$' : '$';
  return sign + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  const sign = n < 0 ? '−$' : '$';
  return sign + Math.abs(Math.round(n)).toLocaleString('en-US');
}

export function pct(n) {
  return (Math.round(n * 10) / 10).toFixed(1) + '%';
}

export function fmtDate(iso) {
  const [, m, d] = iso.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return names[m - 1] + ' ' + d;
}

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// A working copy of the base data: the site edits this, never the constants.
export function buildBase() {
  return {
    transactions: TRANSACTIONS.map((t) => ({ ...t })),
    categories: CATEGORIES.map((c) => ({ ...c })),
    goals: GOALS.map((g) => ({ ...g })),
    bills: BILLS.map((b) => ({ ...b })),
  };
}

export function categoryActual(db, id) {
  return db.transactions
    .filter((t) => t.type === 'expense' && t.category === id)
    .reduce((a, t) => a + t.amount, 0);
}

export function monthTotals(db) {
  const income = db.transactions.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const spent = db.transactions.filter((t) => t.type === 'expense' && t.category !== 'savings').reduce((a, t) => a + t.amount, 0);
  const saved = categoryActual(db, 'savings');
  const out = spent + saved;
  const planned = db.categories.reduce((a, c) => a + c.budget, 0);
  return {
    income,
    spent,
    saved,
    out,
    planned,
    leftToAssign: income - planned,
    underBudget: planned - out,
    savingsRate: income > 0 ? (saved / income) * 100 : 0,
  };
}

export function categoryRows(db) {
  return db.categories.map((c) => {
    const actual = categoryActual(db, c.id);
    return { ...c, actual, left: c.budget - actual, used: c.budget > 0 ? (actual / c.budget) * 100 : 0 };
  });
}

export function biggestCategory(db) {
  const rows = categoryRows(db).filter((r) => r.id !== 'savings');
  return rows.reduce((a, b) => (b.actual > a.actual ? b : a), rows[0]);
}

export function goalsTotal(db) {
  return db.goals.reduce((a, g) => a + g.current, 0);
}

export function upcomingBills(db) {
  return db.bills.filter((b) => b.status === 'upcoming');
}

export function paidBillsTotal(db) {
  return db.bills.filter((b) => b.status === 'paid').reduce((a, b) => a + b.amount, 0);
}

export function recentTransactions(db, n) {
  return [...db.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id.localeCompare(a.id)))
    .slice(0, n);
}
