// Hearth & Ledger — views. Each view is a pure function of the household
// data (plus a small filter object) returning an HTML string. The router in
// main.js drops the string into #app and wires the controls.

import { HOUSEHOLD, TREND, money, money0, pct, fmtDate, esc, findCategory, categoryRows, monthTotals, biggestCategory, goalsTotal, upcomingBills, paidBillsTotal, recentTransactions } from './data.js';
import { donut, trendBars, budgetBars, savingsLine, goalRing } from './charts.js';

function statCard(label, value, sub, tone) {
  return `<div class="stat-card${tone ? ' tone-' + tone : ''}">
    <span class="stat-label">${label}</span>
    <span class="stat-value">${value}</span>
    <span class="stat-sub">${sub}</span>
  </div>`;
}

function txRow(t, withDelete) {
  const cat = t.category === 'income' ? { name: 'Income', color: '#1e5c46' } : findCategory(t.category);
  const sign = t.type === 'income' ? '+' : '−';
  const cls = t.type === 'income' ? 'tx-amount in' : 'tx-amount out';
  return `<tr>
    <td class="tx-date">${fmtDate(t.date)}</td>
    <td><b>${esc(t.payee)}</b>${t.note ? `<span class="tx-note">${esc(t.note)}</span>` : ''}</td>
    <td><span class="cat-chip" style="--chip:${cat ? cat.color : '#888'}">${cat ? esc(cat.name) : esc(t.category)}</span></td>
    <td class="${cls}">${sign}${money(t.amount)}</td>
    ${withDelete ? `<td class="tx-actions"><button type="button" class="mini-btn" data-edit-tx="${t.id}">Edit</button> <button type="button" class="mini-btn danger" data-del-tx="${t.id}">Delete</button></td>` : ''}
  </tr>`;
}

// Dashboard ----------------------------------------------------------------

export function dashboardView(db) {
  const totals = monthTotals(db);
  const rows = categoryRows(db);
  const slices = rows.map((r) => ({ label: r.name, value: r.actual, color: r.color }));
  const watch = [...rows].sort((a, b) => b.used - a.used).slice(0, 5);
  const recent = recentTransactions(db, 6);
  const upcoming = upcomingBills(db).slice(0, 3);
  const big = biggestCategory(db);
  const over = rows.filter((r) => r.used > 100);
  const under = rows.filter((r) => r.used < 100 && r.id !== 'savings').sort((a, b) => a.used - b.used)[0];
  return `
  <section class="hero">
    <div>
      <p class="eyebrow">${HOUSEHOLD.month} · ${HOUSEHOLD.name}</p>
      <h1>Every dollar has a job.</h1>
      <p class="lede">${esc(HOUSEHOLD.tagline)} November is nearly done: the household brought in <b>${money(totals.income)}</b>, moved <b>${money(totals.saved)}</b> to savings, and is <b>${money(totals.underBudget)} under plan</b> with ${money(totals.leftToAssign)} still to assign.</p>
      <p class="hero-links"><a class="btn" href="#/transactions">Add a transaction →</a> <a class="btn ghost" href="#/budgets">Check the budgets →</a></p>
    </div>
    <div class="hero-card">
      <span class="stat-label">Saved this month</span>
      <span class="hero-big">${money(totals.saved)}</span>
      <span class="stat-sub">${pct(totals.savingsRate)} of income — the best saving month since June</span>
      <div class="hero-goal"><span>Emergency fund</span><b>${money0(db.goals[0].current)} of ${money0(db.goals[0].target)}</b></div>
      <div class="hbar-track"><div class="hbar-fill" style="width:${((db.goals[0].current / db.goals[0].target) * 100).toFixed(1)}%"></div></div>
    </div>
  </section>

  <section class="stats">
    ${statCard('Income', money(totals.income), '2 salaries + freelance + interest', 'green')}
    ${statCard('Spent', money(totals.spent), 'Everything except savings', '')}
    ${statCard('Saved', money(totals.saved), pct(totals.savingsRate) + ' of income', 'green')}
    ${statCard('Left to assign', money(totals.leftToAssign), 'Income minus the whole plan', 'gold')}
  </section>

  <section class="grid-2">
    <div class="panel">
      <h2>Where November’s money went</h2>
      <p class="panel-sub">${money(totals.out)} out in all, savings included. Housing is the biggest slice, as ever.</p>
      ${donut(slices, money0(totals.out), 'money out')}
    </div>
    <div class="panel">
      <h2>Budget watch</h2>
      <p class="panel-sub">The five categories closest to — or over — their limit. <a href="#/budgets">All budgets →</a></p>
      ${budgetBars(watch)}
      <div class="insight">
        <b>Heads up:</b> ${over.length ? over.map((r) => `${r.name} is ${money(r.actual - r.budget)} over its ${money0(r.budget)} limit`).join('; ') + '.' : 'nothing is over budget.'}
        ${under ? ` ${under.name} is the most under plan, with ${money0(under.left)} still to spend.` : ''}
      </div>
    </div>
  </section>

  <section class="grid-2">
    <div class="panel">
      <h2>Latest transactions</h2>
      <p class="panel-sub">${db.transactions.length} transactions this month. <a href="#/transactions">See them all →</a></p>
      <table class="tx-table"><tbody>${recent.map((t) => txRow(t, false)).join('')}</tbody></table>
    </div>
    <div class="panel">
      <h2>Coming up</h2>
      <p class="panel-sub">${upcomingBills(db).length} bills still to pay before December 7, totalling ${money(upcomingBills(db).reduce((a, b) => a + b.amount, 0))}. <a href="#/bills">All bills →</a></p>
      <ul class="bill-list">${upcoming.map((b) => `<li><span><b>${esc(b.name)}</b><span class="tx-note">${esc(b.note)}</span></span><span class="bill-due">${fmtDate(b.due)} · <b>${money(b.amount)}</b></span></li>`).join('')}</ul>
      <h2 class="subhead">Savings goals</h2>
      <p class="panel-sub">${money0(goalsTotal(db))} tucked away across ${db.goals.length} goals. <a href="#/goals">All goals →</a></p>
      <ul class="goal-mini">${db.goals.map((g) => `<li>${goalRing(g)}<span><b>${esc(g.name)}</b><span class="tx-note">${money0(g.current)} of ${money0(g.target)}</span></span></li>`).join('')}</ul>
      <p class="insight"><b>Biggest spend:</b> ${big.name} at ${money(big.actual)} — ${pct((big.actual / totals.spent) * 100)} of everything spent.</p>
    </div>
  </section>`;
}

// Transactions ---------------------------------------------------------------

export function transactionsView(db, filter) {
  const f = filter || { category: 'all', type: 'all', q: '' };
  let list = [...db.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id.localeCompare(a.id)));
  if (f.category !== 'all') list = list.filter((t) => t.category === f.category);
  if (f.type !== 'all') list = list.filter((t) => t.type === f.type);
  if (f.q) {
    const q = f.q.toLowerCase();
    list = list.filter((t) => (t.payee + ' ' + (t.note || '')).toLowerCase().includes(q));
  }
  const shownOut = list.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const shownIn = list.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const catOptions = ['all', ...db.categories.map((c) => c.id)]
    .map((id) => `<option value="${id}"${f.category === id ? ' selected' : ''}>${id === 'all' ? 'All categories' : esc(db.categories.find((c) => c.id === id).name)}</option>`)
    .join('');
  return `
  <section class="page-head">
    <div><p class="eyebrow">November 2026</p><h1>Transactions</h1>
    <p class="lede">Every dollar in and out, ${db.transactions.length} entries. Add one below — it lands in the totals everywhere at once.</p></div>
    <div class="page-total"><span>Showing ${list.length} entries</span><b>${money(shownIn)} in · ${money(shownOut)} out</b></div>
  </section>

  <section class="panel">
    <h2>Add a transaction</h2>
    <form id="tx-form" class="form-grid">
      <input type="hidden" id="tx-edit-id" value="">
      <label>Date<input id="tx-date" type="date" value="2026-11-30" required></label>
      <label>What was it?<input id="tx-payee" type="text" placeholder="e.g. GreenMart" required></label>
      <label>Category<select id="tx-category">${db.categories.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}<option value="income">Income</option></select></label>
      <label>Amount ($)<input id="tx-amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Type<select id="tx-type"><option value="expense">Spending</option><option value="income">Income</option></select></label>
      <label class="wide">Note (optional)<input id="tx-note" type="text" placeholder="e.g. Weekly shop"></label>
      <span class="form-actions"><button class="btn" type="submit" id="tx-submit">Add transaction</button>
      <button class="btn ghost" type="button" id="tx-cancel-edit" hidden>Cancel edit</button></span>
    </form>
    <p class="form-hint" id="tx-form-hint">New entries are saved on this device and included in every total, chart and budget bar.</p>
  </section>

  <section class="panel">
    <div class="filter-bar">
      <label>Category <select id="flt-category">${catOptions}</select></label>
      <label>Type <select id="flt-type">
        <option value="all"${f.type === 'all' ? ' selected' : ''}>All types</option>
        <option value="expense"${f.type === 'expense' ? ' selected' : ''}>Spending</option>
        <option value="income"${f.type === 'income' ? ' selected' : ''}>Income</option>
      </select></label>
      <label>Search <input id="flt-q" type="search" placeholder="Payee or note…" value="${esc(f.q)}"></label>
      <button class="btn ghost" type="button" id="flt-clear">Clear filters</button>
    </div>
    ${list.length ? `<table class="tx-table"><thead><tr><th>Date</th><th>What</th><th>Category</th><th>Amount</th><th></th></tr></thead>
    <tbody>${list.map((t) => txRow(t, true)).join('')}</tbody></table>`
      : `<p class="empty">No transactions match those filters. <button class="mini-btn" type="button" id="flt-clear-2">Clear filters</button></p>`}
  </section>`;
}

// Budgets --------------------------------------------------------------------

export function budgetsView(db) {
  const totals = monthTotals(db);
  const rows = categoryRows(db);
  const dining = rows.find((r) => r.id === 'dining');
  const groceries = rows.find((r) => r.id === 'groceries');
  return `
  <section class="page-head">
    <div><p class="eyebrow">November 2026</p><h1>Budgets</h1>
    <p class="lede">Twelve envelopes, one for each part of the month. Set a limit, watch the bar fill, and move money between envelopes when life happens.</p></div>
    <div class="page-total"><span>Planned ${money(totals.planned)}</span><b>${money(totals.out)} used · ${money(totals.underBudget)} under plan</b></div>
  </section>
  <section class="grid-cards">
    ${rows.map((r) => `<article class="budget-card${r.used > 100 ? ' over' : ''}">
      <header><span class="cat-icon" style="background:${r.color}">${r.icon}</span>
      <span><h2>${r.name}</h2><span class="tx-note">${esc(r.blurb)}</span></span></header>
      <div class="hbar-track"><div class="hbar-fill${r.used > 100 ? ' over' : r.used > 85 ? ' warm' : ''}" style="width:${Math.min(r.used, 100).toFixed(1)}%"></div></div>
      <p class="budget-nums"><b>${money(r.actual)}</b> of ${money(r.budget)} · ${pct(r.used)} used</p>
      <p class="budget-left">${r.used > 100 ? `<span class="over-tag">Over by ${money(r.actual - r.budget)}</span>` : `${money(r.left)} left to spend`}</p>
      <form class="budget-edit" data-cat="${r.id}">
        <label>Monthly limit $<input type="number" min="0" step="1" value="${r.budget}" aria-label="${r.name} monthly limit"></label>
        <button class="btn small" type="submit">Save limit</button>
      </form>
    </article>`).join('')}
  </section>
  <section class="panel">
    <h2>How the plan adds up</h2>
    <p>Income ${money(totals.income)} − planned ${money(totals.planned)} = <b>${money(totals.leftToAssign)} left to assign</b>. The household keeps that unassigned on purpose: it becomes next month’s buffer if nothing needs it, and the first thing raided when the car does.</p>
    <p class="panel-sub">Tip: ${dining && dining.used > 100 ? `dining out is the only envelope over its limit this month, by ${money(dining.actual - dining.budget)}. Moving ${money(25)} from groceries — ${money(groceries.left)} under plan — would cover it.` : 'every envelope is inside its limit this month.'}</p>
  </section>`;
}

// Goals ----------------------------------------------------------------------

export function goalsView(db) {
  const total = goalsTotal(db);
  const targets = db.goals.reduce((a, g) => a + g.target, 0);
  return `
  <section class="page-head">
    <div><p class="eyebrow">Saving with a purpose</p><h1>Goals</h1>
    <p class="lede">Four jars on the shelf, each with a job. November’s transfers — ${db.goals.filter((g) => g.monthly > 0).map((g) => `${money(g.monthly)} to ${esc(g.name)}`).join(', ')} — are already in.</p></div>
    <div class="page-total"><span>${money0(total)} saved of ${money0(targets)} planned</span><b>${pct((total / targets) * 100)} of the way there</b></div>
  </section>
  <section class="grid-cards">
    ${db.goals.map((g) => {
      const done = Math.min(g.current / g.target, 1);
      const monthsLeft = g.monthly > 0 ? Math.max(Math.ceil((g.target - g.current) / g.monthly), 0) : null;
      return `<article class="goal-card">
      <div class="goal-top">${goalRing(g)}
        <span><h2>${esc(g.name)}</h2><span class="tx-note">${esc(g.note)}</span></span></div>
      <p class="goal-nums"><b>${money(g.current)}</b> of ${money(g.target)} · ${money(g.target - g.current)} to go</p>
      <div class="hbar-track"><div class="hbar-fill" style="width:${(done * 100).toFixed(1)}%"></div></div>
      <p class="goal-eta">${monthsLeft === null ? 'No monthly transfer set — add money when you can.' : monthsLeft === 0 ? 'Fully funded. Well done.' : `About ${monthsLeft} month${monthsLeft === 1 ? '' : 's'} to go at ${money(g.monthly)} a month.`}</p>
      <form class="goal-add" data-goal="${g.id}">
        <label>Add $<input type="number" min="1" step="1" value="50" aria-label="Amount to add to ${esc(g.name)}"></label>
        <button class="btn small" type="submit">Add to goal</button>
      </form>
    </article>`;
    }).join('')}
  </section>
  <section class="panel">
    <h2>Start a new goal</h2>
    <form id="goal-form" class="form-grid">
      <label>Goal name<input id="goal-name" type="text" placeholder="e.g. New washing machine" required></label>
      <label>Target ($)<input id="goal-target" type="number" min="1" step="1" placeholder="1000" required></label>
      <label>Already saved ($)<input id="goal-current" type="number" min="0" step="1" value="0"></label>
      <label>Monthly transfer ($)<input id="goal-monthly" type="number" min="0" step="1" value="0"></label>
      <span class="form-actions"><button class="btn" type="submit">Create goal</button></span>
    </form>
    <p class="form-hint">A goal with no monthly transfer still counts: add money whenever there is some spare.</p>
  </section>`;
}

// Bills ----------------------------------------------------------------------

export function billsView(db) {
  const paid = db.bills.filter((b) => b.status === 'paid');
  const upcoming = upcomingBills(db);
  const upcomingTotal = upcoming.reduce((a, b) => a + b.amount, 0);
  const row = (b) => `<tr>
    <td><b>${esc(b.name)}</b><span class="tx-note">${esc(b.note)}</span></td>
    <td>${fmtDate(b.due)}</td>
    <td><b>${money(b.amount)}</b></td>
    <td>${b.status === 'paid' ? '<span class="pill paid">Paid ✓</span>' : '<span class="pill due">Due</span>'}</td>
    <td class="tx-actions"><button type="button" class="mini-btn" data-toggle-bill="${b.id}">${b.status === 'paid' ? 'Mark unpaid' : 'Mark paid'}</button></td>
  </tr>`;
  return `
  <section class="page-head">
    <div><p class="eyebrow">Nothing missed, nothing late</p><h1>Bills &amp; recurring</h1>
    <p class="lede">Every regular payment in one list. Five November bills are paid; five December bills are lined up, totalling ${money(upcomingTotal)}.</p></div>
    <div class="page-total"><span>Paid in November: ${money(paidBillsTotal(db))}</span><b>Coming up: ${money(upcomingTotal)}</b></div>
  </section>
  <section class="grid-2">
    <div class="panel">
      <h2>Coming up</h2>
      <table class="tx-table"><thead><tr><th>Bill</th><th>Due</th><th>Amount</th><th>Status</th><th></th></tr></thead>
      <tbody>${upcoming.map(row).join('')}</tbody></table>
    </div>
    <div class="panel">
      <h2>Paid</h2>
      <table class="tx-table"><thead><tr><th>Bill</th><th>Due</th><th>Amount</th><th>Status</th><th></th></tr></thead>
      <tbody>${paid.map(row).join('')}</tbody></table>
      <p class="insight"><b>Tip:</b> the mortgage, insurance, electricity, water and internet all left the account on their due dates — the paid bills above match the transactions on the same dates.</p>
    </div>
  </section>`;
}

// Reports --------------------------------------------------------------------

export function reportsView(db) {
  const totals = monthTotals(db);
  const rows = categoryRows(db).filter((r) => r.id !== 'savings').sort((a, b) => b.actual - a.actual);
  const avgSaved = TREND.reduce((a, m) => a + m.saved, 0) / TREND.length;
  const avgOut = TREND.reduce((a, m) => a + m.out, 0) / TREND.length;
  return `
  <section class="page-head">
    <div><p class="eyebrow">June – November 2026</p><h1>Reports</h1>
    <p class="lede">Six months of the household’s money, side by side. November saved the most and spent the most — the car fund and the holiday jar both got a push.</p></div>
    <div class="page-total"><span>Average saved a month: ${money(avgSaved)}</span><b>Average out: ${money(avgOut)}</b></div>
  </section>
  <section class="grid-2">
    <div class="panel">
      <h2>Income vs money out</h2>
      <p class="panel-sub">Money out includes the transfers to savings. Income has held steady near ${money(8200)} a month.</p>
      ${trendBars(TREND)}
      <table class="mini-table"><thead><tr><th>Month</th><th>Income</th><th>Money out</th><th>Saved</th><th>Savings rate</th></tr></thead>
      <tbody>${TREND.map((m) => `<tr><td>${m.month}</td><td>${money(m.income)}</td><td>${money(m.out)}</td><td>${money(m.saved)}</td><td>${pct((m.saved / m.income) * 100)}</td></tr>`).join('')}</tbody></table>
    </div>
    <div class="panel">
      <h2>Savings, month by month</h2>
      <p class="panel-sub">November’s ${money(2600)} is the best month of the six — ${money(totals.saved - TREND[4].saved)} more than October.</p>
      ${savingsLine(TREND)}
      <div class="insight"><b>What changed:</b> the freelance logo job (${money(520)}) went straight to the holiday jar, and the household skipped two takeaways it would usually have had.</div>
    </div>
  </section>
  <section class="panel">
    <h2>November spending by category</h2>
    <p class="panel-sub">Ranked by what actually left the account, savings aside.</p>
    ${budgetBars(rows)}
    <p class="insight"><b>Reading the month:</b> housing takes ${pct((rows.find((r) => r.id === 'housing').actual / totals.spent) * 100)} of spending, groceries ${pct((rows.find((r) => r.id === 'groceries').actual / totals.spent) * 100)}. Dining out is the only overspend; every other envelope finished under its limit.</p>
  </section>`;
}

// Settings -------------------------------------------------------------------

export function settingsView(db) {
  return `
  <section class="page-head">
    <div><p class="eyebrow">Household setup</p><h1>Settings</h1>
    <p class="lede">Who this budget belongs to, and what happens to the numbers you change.</p></div>
  </section>
  <section class="grid-2">
    <div class="panel">
      <h2>The household</h2>
      <ul class="member-list">${HOUSEHOLD.members.map((m) => `<li><b>${esc(m.name)}</b><span class="tx-note">${esc(m.role)}</span></li>`).join('')}</ul>
      <p class="panel-sub">Budget month: <b>${HOUSEHOLD.month}</b> · Currency: <b>US dollars ($)</b> · Figures are the household’s own sample month, kept on this device.</p>
    </div>
    <div class="panel">
      <h2>Your data</h2>
      <p>Everything you add or change — transactions, budget limits, bills marked paid, money added to goals — is stored in this browser only, on this device. Nothing is sent anywhere: the site makes no network requests at all.</p>
      <p class="btn-row">
        <button class="btn" type="button" id="export-csv">Download transactions (CSV)</button>
        <button class="btn ghost" type="button" id="reset-data">Reset to the sample month</button>
      </p>
      <p class="form-hint" id="settings-hint">Reset brings back the original November 2026 figures and clears every change you made.</p>
    </div>
  </section>
  <section class="panel">
    <h2>How this budget works</h2>
    <p>Each dollar of income is given a job before the month starts: twelve envelopes with a limit. Spending fills the envelopes; savings is an envelope too, moved out on payday before it can be spent. What is left over — ${money(monthTotals(db).leftToAssign)} this month — stays unassigned as the household’s buffer. At the end of the month the envelopes empty and the plan starts again, with the goals carrying over.</p>
    <p class="panel-sub">Built as a single static site: no accounts, no tracking, no network calls. The figures are a realistic sample household, not any real family’s money.</p>
  </section>`;
}

export function notFoundView() {
  return `<section class="panel"><h1>That page isn’t in the budget</h1>
  <p>The link you followed doesn’t match a page on this site. The household keeps seven pages: dashboard, transactions, budgets, goals, bills, reports and settings.</p>
  <p><a class="btn" href="#/">Back to the dashboard →</a></p></section>`;
}
