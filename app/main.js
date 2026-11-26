// Hearth & Ledger — router and interactions. Hash routing, no build step.
// The household's data lives in data.js; this file keeps the working copy
// (base data plus the household's own changes) in localStorage, renders the
// view for the current hash, and wires every control on the page.

import { buildBase } from './data.js';
import { dashboardView, transactionsView, budgetsView, goalsView, billsView, reportsView, settingsView, notFoundView } from './views.js';

const STORE_KEY = 'hearth-ledger-v1';
const app = document.getElementById('app');
const nav = document.getElementById('nav-links');

// --- State: base month plus the household's edits, kept on this device. ---

function loadDb() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return buildBase();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.categories)) return buildBase();
    return parsed;
  } catch (e) {
    return buildBase();
  }
}

function saveDb() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(db));
  } catch (e) { /* private mode: the page still works for this visit */ }
}

let db = loadDb();

// Transaction list filters, kept while the household is on the page.
let txFilter = { category: 'all', type: 'all', q: '' };

// --- Router ----------------------------------------------------------------

const ROUTES = {
  '': () => dashboardView(db),
  transactions: () => transactionsView(db, txFilter),
  budgets: () => budgetsView(db),
  goals: () => goalsView(db),
  bills: () => billsView(db),
  reports: () => reportsView(db),
  settings: () => settingsView(db),
};

function setActiveNav(route) {
  if (!nav) return;
  nav.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === route);
  });
}

function render() {
  const hash = window.location.hash || '#/';
  const parts = hash.slice(2).split('/').filter(Boolean);
  const route = parts[0] || '';
  const view = ROUTES[route];
  app.innerHTML = view ? view() : notFoundView();
  setActiveNav('#/' + route);
  wirePage(route);
  window.scrollTo(0, 0);
}

// --- Wiring: every control on the rendered page does what it says. ---------

function wirePage(route) {
  if (route === 'transactions') wireTransactions();
  if (route === 'budgets') wireBudgets();
  if (route === 'goals') wireGoals();
  if (route === 'bills') wireBills();
  if (route === 'settings') wireSettings();

  // Delete and edit buttons appear on the transactions table.
  app.querySelectorAll('[data-del-tx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      db.transactions = db.transactions.filter((t) => t.id !== btn.dataset.delTx);
      saveDb();
      render();
    });
  });
  app.querySelectorAll('[data-edit-tx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = db.transactions.find((x) => x.id === btn.dataset.editTx);
      if (!t) return;
      document.getElementById('tx-edit-id').value = t.id;
      document.getElementById('tx-date').value = t.date;
      document.getElementById('tx-payee').value = t.payee;
      document.getElementById('tx-category').value = t.category === 'income' ? 'income' : t.category;
      document.getElementById('tx-amount').value = t.amount.toFixed(2);
      document.getElementById('tx-type').value = t.type;
      document.getElementById('tx-note').value = t.note || '';
      document.getElementById('tx-submit').textContent = 'Save changes';
      document.getElementById('tx-cancel-edit').hidden = false;
      document.getElementById('tx-form-hint').textContent = 'Editing “' + t.payee + '” — save to keep the change, or cancel to leave it as it was.';
      document.getElementById('tx-payee').focus();
      window.scrollTo(0, 0);
    });
  });
}

function wireTransactions() {
  const form = document.getElementById('tx-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('tx-edit-id').value;
    const type = document.getElementById('tx-type').value;
    const category = document.getElementById('tx-category').value;
    const entry = {
      id: editId || ('u' + Date.now().toString(36)),
      date: document.getElementById('tx-date').value,
      payee: document.getElementById('tx-payee').value.trim(),
      category: type === 'income' ? 'income' : category,
      amount: Math.round(Number(document.getElementById('tx-amount').value) * 100) / 100,
      type,
      note: document.getElementById('tx-note').value.trim(),
    };
    if (!entry.payee || !(entry.amount > 0) || !entry.date) return;
    if (editId) {
      const i = db.transactions.findIndex((t) => t.id === editId);
      if (i >= 0) db.transactions[i] = entry;
    } else {
      db.transactions.push(entry);
    }
    saveDb();
    txFilter = { category: 'all', type: 'all', q: '' };
    render();
  });
  document.getElementById('tx-cancel-edit').addEventListener('click', () => render());

  // When "income" is picked as the type, the category stops mattering.
  const typeSel = document.getElementById('tx-type');
  const catSel = document.getElementById('tx-category');
  typeSel.addEventListener('change', () => {
    catSel.disabled = typeSel.value === 'income';
  });

  const applyFilters = () => {
    txFilter = {
      category: document.getElementById('flt-category').value,
      type: document.getElementById('flt-type').value,
      q: document.getElementById('flt-q').value.trim(),
    };
    render();
    const again = document.getElementById('flt-q');
    if (again && document.activeElement !== again) {
      // Keep the caret where the household left it while typing.
      if (txFilter.q) {
        again.focus();
        again.setSelectionRange(again.value.length, again.value.length);
      }
    }
  };
  document.getElementById('flt-category').addEventListener('change', applyFilters);
  document.getElementById('flt-type').addEventListener('change', applyFilters);
  document.getElementById('flt-q').addEventListener('input', applyFilters);
  const clear = () => {
    txFilter = { category: 'all', type: 'all', q: '' };
    render();
  };
  document.getElementById('flt-clear').addEventListener('click', clear);
  const clear2 = document.getElementById('flt-clear-2');
  if (clear2) clear2.addEventListener('click', clear);
}

function wireBudgets() {
  app.querySelectorAll('.budget-edit').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cat = db.categories.find((c) => c.id === form.dataset.cat);
      const value = Math.max(0, Math.round(Number(form.querySelector('input').value) || 0));
      if (!cat) return;
      cat.budget = value;
      saveDb();
      render();
    });
  });
}

function wireGoals() {
  app.querySelectorAll('.goal-add').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const goal = db.goals.find((g) => g.id === form.dataset.goal);
      const value = Math.round(Number(form.querySelector('input').value) || 0);
      if (!goal || !(value > 0)) return;
      goal.current = Math.round((goal.current + value) * 100) / 100;
      saveDb();
      render();
    });
  });
  const form = document.getElementById('goal-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('goal-name').value.trim();
    const target = Math.round(Number(document.getElementById('goal-target').value) || 0);
    const current = Math.round(Number(document.getElementById('goal-current').value) || 0);
    const monthly = Math.round(Number(document.getElementById('goal-monthly').value) || 0);
    if (!name || !(target > 0)) return;
    db.goals.push({
      id: 'g' + Date.now().toString(36),
      name,
      target,
      current: Math.min(current, target),
      note: 'A goal the household added themselves.',
      monthly,
    });
    saveDb();
    render();
  });
}

function wireBills() {
  app.querySelectorAll('[data-toggle-bill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bill = db.bills.find((b) => b.id === btn.dataset.toggleBill);
      if (!bill) return;
      bill.status = bill.status === 'paid' ? 'upcoming' : 'paid';
      saveDb();
      render();
    });
  });
}

function wireSettings() {
  document.getElementById('export-csv').addEventListener('click', () => {
    const head = 'date,payee,category,type,amount,note';
    const rows = [...db.transactions]
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id.localeCompare(b.id)))
      .map((t) => [t.date, '"' + t.payee.replace(/"/g, '""') + '"', t.category, t.type, t.amount.toFixed(2), '"' + (t.note || '').replace(/"/g, '""') + '"'].join(','));
    const blob = new Blob([[head, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alvarez-household-november-2026.csv';
    a.click();
    URL.revokeObjectURL(url);
    document.getElementById('settings-hint').textContent = 'Downloaded ' + rows.length + ' transactions as a CSV file.';
  });
  document.getElementById('reset-data').addEventListener('click', () => {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* private mode */ }
    db = buildBase();
    render();
    document.getElementById('settings-hint').textContent = 'Back to the original November 2026 figures — every change cleared.';
  });
}

// --- Header: mobile nav toggle. --------------------------------------------

const navToggle = document.getElementById('nav-toggle');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
}

// Screenshot mode for deterministic captures: ?shot=dashboard|budgets|
// reports|phone renders one view without waiting for interaction.
const shot = new URLSearchParams(window.location.search).get('shot');
if (shot) {
  const map = { dashboard: '#/', budgets: '#/budgets', reports: '#/reports', phone: '#/' };
  if (map[shot] && window.location.hash !== map[shot]) window.location.hash = map[shot];
}

window.addEventListener('hashchange', render);
render();
