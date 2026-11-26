// Hearth & Ledger — charts. Every chart is plain SVG built from numbers,
// no library, no canvas, no network. Each function takes data and returns
// an SVG string, so the tests can check the figures land in the markup.

import { money, money0, pct } from './data.js';

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

// Donut of spending by category. `slices` is [{label, value, color}].
// `center` is the big figure written in the middle.
export function donut(slices, center, centerLabel) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  const cx = 110;
  const cy = 110;
  const r = 84;
  const inner = 58;
  let angle = 0;
  let paths = '';
  for (const s of slices) {
    if (s.value <= 0 || total <= 0) continue;
    const frac = s.value / total;
    const sweep = frac * 360;
    const [x1, y1] = polar(cx, cy, r, angle);
    const [x2, y2] = polar(cx, cy, r, angle + sweep);
    const [ix2, iy2] = polar(cx, cy, inner, angle + sweep);
    const [ix1, iy1] = polar(cx, cy, inner, angle);
    const large = sweep > 180 ? 1 : 0;
    paths += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${ix2.toFixed(1)} ${iy2.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${ix1.toFixed(1)} ${iy1.toFixed(1)} Z" fill="${s.color}"><title>${s.label}: ${money0(s.value)} (${pct(frac * 100)})</title></path>`;
    angle += sweep;
  }
  const legend = slices
    .map(
      (s) =>
        `<li><span class="dot" style="background:${s.color}"></span>${s.label}<b>${money0(s.value)}</b><span class="share">${pct(total > 0 ? (s.value / total) * 100 : 0)}</span></li>`,
    )
    .join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 220 220" class="donut" role="img" aria-label="Spending by category donut chart">
    ${paths}
    <text x="110" y="104" class="donut-center" text-anchor="middle">${center}</text>
    <text x="110" y="124" class="donut-label" text-anchor="middle">${centerLabel}</text>
  </svg><ul class="legend">${legend}</ul></div>`;
}

// Grouped bars: income vs money out, one pair per month.
export function trendBars(months) {
  const max = Math.max(...months.map((m) => Math.max(m.income, m.out)));
  const w = 560;
  const h = 240;
  const base = 210;
  const slot = w / months.length;
  const barW = Math.min(34, slot / 3);
  let bars = '';
  let labels = '';
  months.forEach((m, i) => {
    const x = slot * i + slot / 2;
    const hIn = (m.income / max) * 170;
    const hOut = (m.out / max) * 170;
    bars += `<rect x="${(x - barW - 3).toFixed(1)}" y="${(base - hIn).toFixed(1)}" width="${barW}" height="${hIn.toFixed(1)}" rx="3" fill="#1e5c46"><title>${m.month} income ${money0(m.income)}</title></rect>`;
    bars += `<rect x="${(x + 3).toFixed(1)}" y="${(base - hOut).toFixed(1)}" width="${barW}" height="${hOut.toFixed(1)}" rx="3" fill="#c96f3f"><title>${m.month} money out ${money0(m.out)}</title></rect>`;
    labels += `<text x="${x.toFixed(1)}" y="228" class="chart-label" text-anchor="middle">${m.month}</text>`;
    labels += `<text x="${x.toFixed(1)}" y="14" class="chart-label" text-anchor="middle">${money0(m.income)}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="Income versus money out, June to November 2026">
    <line x1="0" y1="${base}" x2="${w}" y2="${base}" class="chart-axis" />
    ${bars}${labels}
  </svg>
  <p class="chart-key"><span class="dot" style="background:#1e5c46"></span>Income <span class="dot" style="background:#c96f3f"></span>Money out</p>`;
}

// Horizontal bars for budget use, one row per category.
export function budgetBars(rows) {
  return rows
    .map((r) => {
      const used = Math.min(r.used, 100);
      const over = r.used > 100;
      const cls = over ? 'hbar-fill over' : r.used > 85 ? 'hbar-fill warm' : 'hbar-fill';
      return `<div class="hbar-row">
        <div class="hbar-head"><span class="hbar-name"><span class="dot" style="background:${r.color}"></span>${r.name}</span>
        <span class="hbar-nums">${money0(r.actual)} of ${money0(r.budget)} · ${pct(r.used)}</span></div>
        <div class="hbar-track"><div class="${cls}" style="width:${used.toFixed(1)}%"></div></div>
        <div class="hbar-foot">${over ? `<span class="over-tag">Over by ${money(r.actual - r.budget)}</span>` : `<span>${money(r.left)} left</span>`}</div>
      </div>`;
    })
    .join('');
}

// Small line chart of monthly savings, June to November. The points sit
// inside a horizontal pad so the end labels and dots are never clipped.
export function savingsLine(months) {
  const w = 560;
  const h = 150;
  const max = Math.max(...months.map((m) => m.saved)) * 1.15;
  const pad = 32;
  const step = (w - pad * 2) / (months.length - 1);
  const pts = months.map((m, i) => [pad + i * step, h - 24 - (m.saved / max) * (h - 48)]);
  const line = pts.map((p, i) => (i === 0 ? `M ${p[0].toFixed(1)} ${p[1].toFixed(1)}` : `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)).join(' ');
  const dots = pts
    .map((p, i) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5" fill="#1e5c46"><title>${months[i].month}: saved ${money0(months[i].saved)}</title></circle>`)
    .join('');
  const labels = months
    .map((m, i) => `<text x="${pts[i][0].toFixed(1)}" y="${h - 6}" class="chart-label" text-anchor="middle">${m.month}</text>`)
    .join('');
  const values = months
    .map((m, i) => `<text x="${pts[i][0].toFixed(1)}" y="${(pts[i][1] - 10).toFixed(1)}" class="chart-label" text-anchor="middle">${money0(m.saved)}</text>`)
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="Monthly savings, June to November 2026">
    <path d="${line}" fill="none" stroke="#1e5c46" stroke-width="3" stroke-linejoin="round" />
    ${dots}${values}${labels}
  </svg>`;
}

// Goal progress ring: a single circular gauge.
export function goalRing(goal) {
  const done = Math.min(goal.current / goal.target, 1);
  const r = 34;
  const c = 2 * Math.PI * r;
  const off = c * (1 - done);
  return `<svg viewBox="0 0 84 84" class="goal-ring" role="img" aria-label="${goal.name} ${pct(done * 100)} funded">
    <circle cx="42" cy="42" r="${r}" fill="none" stroke="#e8dfcf" stroke-width="9" />
    <circle cx="42" cy="42" r="${r}" fill="none" stroke="#1e5c46" stroke-width="9" stroke-linecap="round"
      stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 42 42)" />
    <text x="42" y="47" class="ring-pct" text-anchor="middle">${pct(done * 100)}</text>
  </svg>`;
}
