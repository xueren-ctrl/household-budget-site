// Hearth & Ledger — logic tests. Run: node --test test/site.test.mjs
// Checks the November figures add up, the views render what they promise,
// and the charts carry the data. No browser needed.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HOUSEHOLD, CATEGORIES, TRANSACTIONS, ACTUALS, GOALS, BILLS, TREND,
  money, money0, pct, fmtDate, buildBase, findCategory,
  categoryActual, monthTotals, categoryRows, biggestCategory,
  goalsTotal, upcomingBills, paidBillsTotal, recentTransactions,
} from '../app/data.js';
import { donut, trendBars, budgetBars, savingsLine, goalRing } from '../app/charts.js';
import {
  dashboardView, transactionsView, budgetsView, goalsView,
  billsView, reportsView, settingsView, notFoundView,
} from '../app/views.js';

const db = buildBase();
const totals = monthTotals(db);

test('transaction sums match the stated category actuals', () => {
  for (const c of CATEGORIES) {
    const sum = categoryActual(db, c.id);
    assert.ok(Math.abs(sum - ACTUALS[c.id]) < 0.005, `${c.id}: summed ${sum} vs stated ${ACTUALS[c.id]}`);
  }
});

test('month totals are the ones the site shows', () => {
  assert.equal(totals.income, 8298);
  assert.ok(Math.abs(totals.spent - 4285.54) < 0.005, 'spent ' + totals.spent);
  assert.equal(totals.saved, 2600);
  assert.ok(Math.abs(totals.out - 6885.54) < 0.005, 'out ' + totals.out);
  assert.equal(totals.planned, 7115);
  assert.equal(totals.leftToAssign, 1183);
  assert.ok(Math.abs(totals.underBudget - 229.46) < 0.005, 'under ' + totals.underBudget);
  assert.ok(Math.abs(totals.savingsRate - 31.33) < 0.05, 'rate ' + totals.savingsRate);
});

test('transactions are well formed: 67 entries, unique ids, November dates', () => {
  assert.equal(TRANSACTIONS.length, 67);
  assert.equal(TRANSACTIONS.filter((t) => t.type === 'income').length, 4);
  assert.equal(TRANSACTIONS.filter((t) => t.type === 'expense').length, 63);
  const ids = new Set();
  for (const t of TRANSACTIONS) {
    assert.ok(!ids.has(t.id), 'duplicate id ' + t.id);
    ids.add(t.id);
    assert.ok(t.date.startsWith('2026-11-'), t.id + ' date ' + t.date);
    assert.ok(t.amount > 0, t.id + ' amount');
    assert.ok(t.type === 'income' || findCategory(t.category), t.id + ' category ' + t.category);
  }
});

test('budgets add up and dining is the only overspend', () => {
  const rows = categoryRows(db);
  assert.equal(rows.length, 12);
  const over = rows.filter((r) => r.used > 100);
  assert.equal(over.length, 1);
  assert.equal(over[0].id, 'dining');
  assert.ok(Math.abs(over[0].actual - over[0].budget - 21.8) < 0.005, 'dining over by ' + (over[0].actual - over[0].budget));
  const groceries = rows.find((r) => r.id === 'groceries');
  assert.ok(Math.abs(groceries.left - 35.65) < 0.005, 'groceries left ' + groceries.left);
});

test('goals add up and percentages are sane', () => {
  assert.equal(goalsTotal(db), 27260);
  for (const g of GOALS) {
    assert.ok(g.current > 0 && g.current < g.target, g.id + ' progress');
    assert.ok(g.target > 0, g.id + ' target');
  }
  const emergency = GOALS.find((g) => g.id === 'emergency');
  assert.ok(Math.abs((emergency.current / emergency.target) * 100 - 78.8) < 0.2, 'emergency pct');
});

test('bills: five paid matching transactions, five upcoming', () => {
  const paid = BILLS.filter((b) => b.status === 'paid');
  const upcoming = upcomingBills(db);
  assert.equal(paid.length, 5);
  assert.equal(upcoming.length, 5);
  assert.ok(Math.abs(paidBillsTotal(db) - 1995.95) < 0.005, 'paid ' + paidBillsTotal(db));
  assert.ok(Math.abs(upcoming.reduce((a, b) => a + b.amount, 0) - 341.49) < 0.005, 'upcoming sum');
  // Every paid bill has a matching transaction on the same date and amount.
  for (const b of paid) {
    const match = TRANSACTIONS.find((t) => t.date === b.due && Math.abs(t.amount - b.amount) < 0.005);
    assert.ok(match, 'no transaction for paid bill ' + b.name);
  }
});

test('trend: November matches the month totals, six months in order', () => {
  assert.equal(TREND.length, 6);
  assert.deepEqual(TREND.map((m) => m.month), ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']);
  const nov = TREND[5];
  assert.equal(nov.income, totals.income);
  assert.ok(Math.abs(nov.out - totals.out) < 0.005, 'nov out');
  assert.equal(nov.saved, totals.saved);
  for (const m of TREND) {
    assert.ok(m.saved < m.out, m.month + ' saved under out');
    assert.ok(m.out < m.income, m.month + ' out under income');
  }
});

test('formatting covers every format used', () => {
  assert.equal(money(8298), '$8,298.00');
  assert.equal(money(0), '$0.00');
  assert.equal(money(-5.5), '−$5.50');
  assert.equal(money0(6885.54), '$6,886');
  assert.equal(pct(31.333), '31.3%');
  assert.equal(fmtDate('2026-11-03'), 'Nov 3');
  assert.equal(fmtDate('2026-11-30'), 'Nov 30');
});

test('biggest spending category is housing', () => {
  assert.equal(biggestCategory(db).id, 'housing');
});

test('recent transactions are the latest first', () => {
  const recent = recentTransactions(db, 6);
  assert.equal(recent.length, 6);
  assert.equal(recent[0].date, '2026-11-30');
  assert.ok(recent[0].id >= recent[1].id || recent[0].date > recent[1].date, 'ordered');
});

test('charts carry the figures', () => {
  const rows = categoryRows(db);
  const d = donut(rows.map((r) => ({ label: r.name, value: r.actual, color: r.color })), '$6,886', 'money out');
  assert.match(d, /<svg/);
  assert.match(d, /\$6,886/);
  assert.match(d, /Housing/);
  assert.match(d, /26\.9%/); // housing share of money out
  const bars = trendBars(TREND);
  assert.match(bars, /Jun/);
  assert.match(bars, /Nov/);
  assert.match(bars, /\$8,298/);
  const hb = budgetBars(rows);
  assert.match(hb, /Over by \$21\.80/);
  assert.match(hb, /Groceries/);
  const line = savingsLine(TREND);
  assert.match(line, /\$2,600/);
  assert.match(line, /<path/);
  const ring = goalRing(GOALS[0]);
  assert.match(ring, /78\.8%/);
});

test('dashboard shows the headline figures', () => {
  const html = dashboardView(db);
  assert.match(html, /\$8,298\.00/);
  assert.match(html, /\$2,600\.00/);
  assert.match(html, /\$1,183\.00/);
  assert.match(html, /Housing/);
  assert.match(html, /Clinic visit/);
  assert.match(html, /Emergency fund/);
  assert.match(html, /Dining out/);
});

test('transactions view filters by category, type and search', () => {
  const all = transactionsView(db, { category: 'all', type: 'all', q: '' });
  assert.match(all, /67 entries/);
  assert.match(all, /Add a transaction/);
  const groceries = transactionsView(db, { category: 'groceries', type: 'all', q: '' });
  assert.match(groceries, /8 entries/);
  assert.ok(groceries.includes('GreenMart'));
  assert.ok(!groceries.includes('Mortgage payment'));
  const income = transactionsView(db, { category: 'all', type: 'income', q: '' });
  assert.match(income, /4 entries/);
  assert.ok(income.includes('Freelance design'));
  const search = transactionsView(db, { category: 'all', type: 'all', q: 'sushi' });
  assert.match(search, /1 entries/);
  assert.ok(search.includes('Sushi'));
  const none = transactionsView(db, { category: 'all', type: 'all', q: 'zzzqqq' });
  assert.match(none, /No transactions match/);
});

test('budgets view lists every envelope with its limit form', () => {
  const html = budgetsView(db);
  for (const c of CATEGORIES) assert.ok(html.includes(c.name), c.name);
  assert.match(html, /Over by \$21\.80/);
  assert.match(html, /Save limit/);
  assert.match(html, /\$7,115\.00/);
});

test('goals view shows all four goals and the new-goal form', () => {
  const html = goalsView(db);
  for (const g of GOALS) assert.ok(html.includes(g.name), g.name);
  assert.match(html, /\$27,260/);
  assert.match(html, /Start a new goal/);
  assert.match(html, /Add to goal/);
});

test('bills view separates paid from upcoming', () => {
  const html = billsView(db);
  assert.match(html, /Coming up/);
  assert.match(html, /Gym membership/);
  assert.match(html, /Mark paid/);
  assert.match(html, /Paid ✓/);
  assert.match(html, /\$1,995\.95/);
});

test('reports view has the six-month table and category ranking', () => {
  const html = reportsView(db);
  assert.match(html, /Income vs money out/);
  assert.match(html, /Savings, month by month/);
  assert.match(html, /\$2,600/);
  for (const m of TREND) assert.ok(html.includes(m.month), m.month);
  assert.match(html, /November spending by category/);
});

test('settings view names the household and the data controls', () => {
  const html = settingsView(db);
  for (const m of HOUSEHOLD.members) assert.ok(html.includes(m.name), m.name);
  assert.match(html, /Download transactions \(CSV\)/);
  assert.match(html, /Reset to the sample month/);
});

test('unknown route gets a helpful page', () => {
  assert.match(notFoundView(), /isn’t in the budget/);
  assert.match(notFoundView(), /dashboard/);
});
