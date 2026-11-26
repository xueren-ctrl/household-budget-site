# Hearth & Ledger — a household budget site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/xueren-ctrl/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/xueren-ctrl/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

One household's whole budget: the Alvarez family (two adults, two children)
and their November 2026 — income, spending by category, budgets, savings
goals, bills and six months of reports. Every dollar is given a job before
the month starts, and every figure on the site is computed from the 67
transactions listed in `app/data.js`, so no view can disagree with another.

## Pages

- **Dashboard** — the month at a glance: income, spending, savings, money
  left to assign, where the money went (donut), the five budgets closest to
  their limit, latest transactions, upcoming bills and goal progress.
- **Transactions** — all 67 entries with category/type/search filters, and a
  form to add, edit or delete a transaction. Changes land in every total,
  chart and budget bar at once, and are kept on the device.
- **Budgets** — twelve envelopes with a limit each; edit any limit and the
  bars, totals and dashboard follow.
- **Goals** — four savings goals with progress rings and time-to-finish, plus
  add-money and create-goal forms.
- **Bills** — five November bills paid, five December bills coming up, with
  mark-paid toggles.
- **Reports** — income vs money out and monthly savings, June–November 2026,
  plus November spending ranked by category.
- **Settings** — the household, data stored on the device only, CSV export
  and reset to the sample month.

## Run it

```sh
node serve.ts        # http://localhost:8080
node --test test/site.test.mjs
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The site is plain static files under `app/` — no build step, no network
requests, no external fonts or libraries. It works on a desktop and on a
phone. `main.ts` (Node 22, standard library only) copies `app/` and
`screenshots/` to the output directory and writes `dossier.json` with the
vendored make.fun library.
