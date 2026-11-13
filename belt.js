// Hirdman pipeline ("Belt"): mounts into <div id="hirdman-belt"> inside a shadow root, so the piece's
// styles and the site's stay apart. Built by mkembed.py from the client page; edit that page, not this file.
(() => {
  const mount = document.getElementById('hirdman-belt');
  if (!mount || mount.shadowRoot) return;
  const root = mount.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>:host{display:block;font-family:var(--font);color:var(--ink);line-height:1.55;text-align:left;
  color-scheme:dark;
  --bg:#030807;
  --panel:#071212;
  --line:rgba(23,241,215,.16);
  --line-strong:rgba(23,241,215,.42);
  --ink:#eafffb;
  --muted:#9edbd4;
  --muted-2:#6d8d88;
  --teal:#17F1D7;
  --teal-ink:#03201b;
  --amber:#ffb84d;
  --red-ink:#ff6b84;
  --font:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
}
*{box-sizing:border-box}
button{font-family:inherit;cursor:pointer}
button:focus-visible{outline:2px solid var(--teal);outline-offset:3px}
.rm{margin:12px 0 0;color:var(--muted-2);font-size:13.5px}
/* ---------- The piece (this block is what moves to the site) ---------- */
.hp{margin:0}
/* The phone drawing on a tablet: one readable column instead of a stretched one. */
.hp.phone{max-width:480px;margin-inline:auto}
.hp-cap{display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"pips text btn";gap:8px 16px;align-items:center;margin:0 0 10px;padding:6px 6px 6px 14px;border:1px solid var(--line);border-radius:14px;background:var(--panel)}
.hp.phone .hp-cap{grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"pips pips" "text btn";gap:6px 10px;padding:8px 6px 6px 12px}
.hp.phone .hp-texts p{line-height:1.3;font-size:13.5px}
/* Each pip is a button that jumps to its step: a 14x4 bar inside a 24 px target. */
.hp-pips{grid-area:pips;display:flex}
.hp-pips button{flex:0 0 auto;width:24px;height:24px;padding:0;border:0;border-radius:6px;background:transparent;display:grid;place-items:center}
.hp-pips button::before{content:"";width:14px;height:4px;border-radius:2px;background:rgba(23,241,215,.22);transition:background .3s}
.hp-pips button:hover::before{background:rgba(23,241,215,.55)}
.hp-pips button.on::before{background:var(--teal)}
/* The way out of the story: a real link from the first frame, filled once the decisions are in. */
.hp-cta{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px;margin:10px 0 0;padding:8px 8px 8px 14px;border:1px solid var(--line);border-radius:14px;background:var(--panel)}
.hp-cta p{margin:0;color:var(--muted);font-size:15px;transition:color .35s}
.hp-btn{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:10px;border:1px solid var(--line-strong);color:var(--ink);font-size:15px;font-weight:700;text-decoration:none;transition:background .35s,color .35s,border-color .35s}
.hp-btn:hover{background:rgba(23,241,215,.08)}
.hp-btn:focus-visible{outline:2px solid var(--teal);outline-offset:3px}
.hp.done .hp-cta p{color:var(--ink)}
.hp.done .hp-btn{background:var(--teal);border-color:var(--teal);color:#000}
.hp.done .hp-btn:hover{background:#14d9c1}
.hp.phone .hp-cta{padding:10px}
.hp.phone .hp-btn{flex:1 1 100%;justify-content:center}
.hp-texts{grid-area:text;display:grid;min-width:0}
.hp-texts p{grid-area:1/1;margin:0;font-size:15px;line-height:1.45;color:var(--muted);opacity:0;visibility:hidden;transition:opacity .35s,visibility 0s .35s}
.hp-texts p.on{opacity:1;visibility:visible;transition:opacity .35s}
.hp-texts b{color:var(--ink);font-weight:700;margin-right:.45em}
.hp-pause{grid-area:btn;display:inline-flex;align-items:center;gap:8px;min-height:44px;min-width:44px;padding:0 14px;border-radius:10px;border:1px solid var(--line-strong);background:transparent;color:var(--ink);font-size:14px;font-weight:600}
.hp-pause:hover{background:rgba(23,241,215,.08)}
.hp-pause:active{transform:translateY(1px)}
.hp-pause svg{width:14px;height:14px;fill:currentColor}
.hp-pause[hidden]{display:none}
/* The script reserves this box from the viewBox before the fonts arrive; min-width lets the cell shrink. */
.hp-stage{min-width:0;max-width:100%}
.pl{width:100%;height:auto;display:block}

/* SVG text. Shadow labels use --muted-2: 5.58:1 on the page, 5.26:1 on node fill. */
.pl text{font-family:var(--font)}
.t13{font-size:13px;font-weight:600} .t12{font-size:12px;font-weight:600} .t11{font-size:11.5px;font-weight:500}
.t15{font-size:15px;font-weight:700} .t10{font-size:11px;font-weight:700}
.ink{fill:var(--ink)} .mut{fill:var(--muted)} .dim{fill:var(--muted-2)}
.k-own{fill:var(--teal)} .k-acc{fill:var(--amber)} .k-bad{fill:var(--red-ink)}
.on-chip{fill:#1a0207}
.ic{fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
</style><figure class="hp" id="hp">
    <div class="hp-cap">
      <div class="hp-pips" id="pips" role="group" aria-label="Steps"></div>
      <div class="hp-texts" id="caps"></div>
      <button type="button" class="hp-pause" id="pause" aria-label="Pause animation"><svg viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1.5" width="3.6" height="11" rx="1"/><rect x="8.4" y="1.5" width="3.6" height="11" rx="1"/></svg><span>Pause</span></button>
    </div>
    <div class="hp-stage" id="stage"></div>
    <div class="hp-cta"><p>One domain is enough to start.</p><a class="hp-btn" id="cta" href="https://hirdman.pro/contact">Request a free check</a></div>
  </figure><p class="rm" id="rm" hidden>Motion is reduced in your system settings, so the finished frame is shown.</p>`;
  // The piece reaches the page through this narrow document: its ids live in the shadow root, its meter too.
  const doc = { getElementById: id => root.getElementById(id), createElementNS: (a, b) => document.createElementNS(a, b), createElement: a => document.createElement(a), body: root, fonts: document.fonts, documentElement: {} };
  (function (document) {

  document.documentElement.lang = 'en';
  const NS = 'http://www.w3.org/2000/svg';
  const S = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; };
  const H = (tag, cls, parent, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (parent) parent.append(e); return e; };
  const T = (parent, x, y, str, cls, anchor) => { const e = S('text', { x, y, class: cls }, parent); if (anchor) e.setAttribute('text-anchor', anchor); e.textContent = str; return e; };
  const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const lerp = (a, b, p) => a + (b - a) * p;
  const win = (t, a, b) => clamp((t - a) / (b - a));
  const op = (el, v) => { el.style.opacity = v < .002 ? 0 : v > .998 ? 1 : +v.toFixed(3); };
  const mv = (el, x, y, extra = '') => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})${extra}`);
  // Seeded random: the same particles every loop, so the piece stays a pure function of t.
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let r = Math.imul(seed ^ seed >>> 15, 1 | seed); r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r; return ((r ^ r >>> 14) >>> 0) / 4294967296; };

  // ---------- Shared content: names and data are examples from reserved space only ----------
  const ICON = {
    globe: 'M8 1.3a6.7 6.7 0 1 0 0 13.4A6.7 6.7 0 1 0 8 1.3Z M1.3 8h13.4 M8 1.3c-2.4 2.1-2.4 11.3 0 13.4 M8 1.3c2.4 2.1 2.4 11.3 0 13.4',
    cert: 'M2.5 1.8h11v8.4h-11z M5 4.6h6 M5 7.2h3 M11 10.2v4.2l-1.2-.9-1.2.9v-4.2',
    clock: 'M8 1.5a6.5 6.5 0 1 0 0 13A6.5 6.5 0 1 0 8 1.5Z M8 4.4V8l2.6 1.7',
    radar: 'M8 1.5a6.5 6.5 0 1 0 0 13A6.5 6.5 0 1 0 8 1.5Z M8 5a3 3 0 1 0 0 6A3 3 0 1 0 8 5Z M8 8l4.4-4.4',
    archive: 'M1.8 2.6h12.4v3.6H1.8z M2.8 6.2v7.2h10.4V6.2 M6.2 9h3.6',
    guess: 'M1.8 3.5h7 M1.8 7h5 M1.8 10.5h3.6 M11 6.8a2.6 2.6 0 1 0 0 5.2a2.6 2.6 0 1 0 0-5.2Z M12.9 11.6l1.6 1.6',
    reg: 'M3 1.5h6.5L13 5v9.5H3z M9.5 1.5V5H13 M8 7.4v5 M5.5 9.9h5',
    db: 'M2.5 3.6c0-2.1 11-2.1 11 0s-11 2.1-11 0Z M2.5 3.6v8.8c0 2.1 11 2.1 11 0V3.6 M2.5 8c0 2.1 11 2.1 11 0',
    decide: 'M1.8 4.6l1.5 1.5 2.6-2.9 M8 4.6h6.2 M1.8 11l1.5 1.5 2.6-2.9 M8 11h6.2',
    forum: 'M1.5 2.5h9v6h-5l-2.5 2v-2h-1.5z M12 5.5h2.5v6H13v2l-2.5-2H6.5V10',
    key: 'M5.2 3.6a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z M7.9 7.6l6.3 6.3 M11.6 11.3l1.5-1.5 M13.1 12.8l1.1-1.1',
    lock: 'M3.5 7.5h9v7h-9z M5.5 7.5V5a2.5 2.5 0 0 1 5 0v2.5 M8 10.2v1.8',
    door: 'M3.5 14.5V1.5h9v13 M1.5 14.5h13 M10 8.2v.6',
    plane: 'M14.5 1.8L1.5 7.2l4.8 1.8 1.8 5.2 2.6-3.4 3.4 2.4z M6.3 9l8.2-7.2',
    people: 'M5.5 3a2.2 2.2 0 1 0 0 4.4a2.2 2.2 0 1 0 0-4.4Z M1.5 13.5c.3-2.4 1.8-3.6 4-3.6s3.7 1.2 4 3.6 M11 4a1.9 1.9 0 1 1 0 3.8 M12.2 9.9c1.4.4 2.1 1.6 2.3 3.6',
    repo: 'M3 1.5h7l3 3v10H3z M6.5 7.5L5 9l1.5 1.5 M9.5 7.5L11 9l-1.5 1.5',
    app: 'M4.5 1.5h7v13h-7z M7 12.3h2 M6.5 4.2h3',
    code: 'M5 4.5L1.8 8 5 11.5 M11 4.5L14.2 8 11 11.5 M9.2 3.5l-2.4 9',
    dumps: 'M2 3.8c0-1.6 12-1.6 12 0s-12 1.6-12 0Z M2 3.8v3c0 1.6 12 1.6 12 0v-3 M2 6.8v3c0 1.6 12 1.6 12 0v-3 M2 9.8v2.6c0 1.6 12 1.6 12 0V9.8',
    raw: 'M3 1.5h7l3 3v10H3z M8 5.8a1.6 1.6 0 1 0 0 3.2a1.6 1.6 0 1 0 0-3.2Z M5.3 12.8c.3-1.6 1.3-2.4 2.7-2.4s2.4.8 2.7 2.4',
    tracker: 'M1.8 3.5h1.6 M5.6 3.5h8.6 M1.8 8h1.6 M5.6 8h8.6 M1.8 12.5h1.6 M5.6 12.5h4.6 M12.2 10.6l1.2 1.4 1.4-2.6',
  };
  const COL = { own: '#17F1D7', acc: '#ffb84d', bad: '#ff3b5c', fix: '#43e39a', node: '#081211', panel: '#071212' };
  const RGB = { own: '23,241,215', acc: '255,184,77', bad: '255,59,92', fix: '67,227,154' };
  // Twelve steps: the ETL runs before anything else; one domain opens up the scope, then the belt.
  const CAPS = [
    ['ETL', 'Forums, stealer logs and dumps that weigh terabytes are parsed, junk goes out, OCR reads PDF and video.'],
    ['Your domain', 'You give us one domain.'],
    ['Scope', 'We map it the way an attacker would: subdomains, related domains of the group, third parties with access, and the people.'],
    ['Collection', 'Many sources return your hosts, forgotten ones included, and look-alike names.'],
    ['Ports', 'Every host gets its open ports.'],
    ['Versions and CVE', 'Each service is read with its version and checked against known CVEs.'],
    ['Leak search', 'Your domains, hosts and people become search keys in the database and the raw records.'],
    ['Cleaning', 'A duplicate folds into its twin, a generated set is cut.'],
    ['Reverse check', 'A shared password leads from a work mailbox to personal mail; the profile of jd.ops fills in.'],
    ['Users', 'Stealer logs show infected home PCs; raw leaks add home mail and personal details, for staff and suppliers alike.'],
    ['Privileged account', 'A personal login turns out to be the admin of admin.aceme.example.'],
    ['Your portal', 'Everything lands in your portal: the tier, one action and its evidence. Brand Protection and Asset management get their share.'],
  ];
  // One verb per station, steps 4 to 10 (scope is step 2, collection step 3, the decisions step 11).
  // Two lines where the width is short (the phone, the orbit's dial), one line elsewhere.
  const STN2 = ['Scan|ports', 'Versions|and CVE', 'Search|leaks', 'Clean', 'Reverse|check', 'Check|users', 'Flag|admin'];
  const STN = STN2.map(n => n.replace('|', ' '));
  const stK = j => j === 6 ? 'bad' : j >= 3 ? 'acc' : 'own';
  // Source names come from the site's own copy (methodology, services, index) and the first mockup.
  const INTEL = [['forum', 'Closed forums'], ['key', 'Stealer logs'], ['lock', 'Private sources'], ['door', 'Dark web'], ['plane', 'Telegram channels'], ['people', 'Social networks'], ['repo', 'Repos'], ['tracker', 'Data breach tracker'], ['app', 'Mobile apps, APK'], ['code', 'Code analysis']];
  const DUMPS = ['dumps', 'Dumps, up to terabytes'];
  const PERIM = [['cert', 'Certificate logs'], ['clock', 'DNS history'], ['radar', 'Scan engines'], ['archive', 'Web archives'], ['guess', 'Name guessing'], ['reg', 'Registrations']];
  // Every figure below is published on the site's home page or counted in code (collect.py STEPS).
  const FIG = { db: 'over 106 bn records', raw: '46 bn raw records', steps: '25 collection steps', tb: 'up to terabytes' };
  // What one domain opens up before collection: the attacker's first map of a target.
  const SCOPE = [['Subdomains', 'admin, dev, vpn'], ['Related domains', 'same group, shared staff'], ['Third parties', 'suppliers with access'], ['People', 'roles, habits, profiles']];
  const scopeOn = (t, i) => clamp((t - at(2) - .1 - i * .35) / .4);
  // Where the sorted records go besides the decisions list.
  const OUTLETS = [['Brand Protection', 'look-alikes, takedowns'], ['Asset management', 'hosts, ports, versions']];
  // The lead's profile as an attacker would build it: label, value, lit class, the press that fills it, a lag in px.
  const PROFILE = [['Work mail', 'jd.ops@aceme.example', 'ink', 4, 0], ['Personal mail', 'same password', 'k-acc', 4, 18], ['Home PC', 'stealer log', 'k-acc', 5, 0], ['Role', 'admin', 'k-bad', 6, 0]];
  const ROWS = [
    { t: 'Fix now', k: 'bad', a: 'Close the admin login', e: 'reverse check' },
    { t: 'Fix now', k: 'bad', a: 'john.d: reset, second factor', e: 'stealer log' },
    { t: 'This week', k: 'acc', a: 'Brief m.lee on phishing', e: 'raw leaks' },
    { t: 'This week', k: 'acc', a: 'HR vendor: move to SSO', e: 'supplier, home mail' },
    { t: 'This week', k: 'acc', a: 'dev: close port 3389', e: 'forgotten host' },
    { t: 'This week', k: 'acc', a: 'Take down acerne.example', e: 'new registration' },
  ];
  // Shared clock: twelve steps of D seconds, a hold on the finished list, then the fade.
  const D = 1.9, at = k => .3 + k * D, FADE = at(11) + 4, LEN = FADE + 1.2, STILL = FADE - .05;
  const stageOf = t => Math.max(0, Math.min(11, Math.floor((t - .3) / D)));
  const reach = (t, k, dur = .5) => clamp((t - at(k)) / dur);

  // ---------- Shared drawing helpers ----------
  const icon = (parent, name, x, y, stroke, sc = 1) => {
    const g = S('g', { transform: `translate(${x} ${y})${sc !== 1 ? ` scale(${sc})` : ''}` }, parent);
    S('path', { d: ICON[name], class: 'ic', stroke }, g);
    return g;
  };
  // A box whose texts the checker holds inside it: <g class="bx"><rect class="box"> + texts.
  const box = (parent, x, y, w, h, o = {}) => {
    const g = S('g', { class: 'bx' }, parent);
    S('rect', { x, y, width: w, height: h, rx: o.rx ?? 10, class: 'box', fill: o.fill || COL.node, stroke: o.stroke || 'rgba(23,241,215,.3)', 'stroke-width': o.sw ?? 1.3 }, g);
    return g;
  };
  // Glow gradients, one per kind; each piece puts exactly one glow circle on its lead item.
  const glowDefs = svg => {
    const defs = S('defs', {}, svg);
    for (const k in RGB) {
      const rg = S('radialGradient', { id: `gl-${k}` }, defs);
      S('stop', { offset: '0', 'stop-color': '#f2fffd', 'stop-opacity': '1' }, rg);
      S('stop', { offset: '.32', 'stop-color': `rgb(${RGB[k]})`, 'stop-opacity': '.55' }, rg);
      S('stop', { offset: '1', 'stop-color': `rgb(${RGB[k]})`, 'stop-opacity': '0' }, rg);
    }
    return defs;
  };
  const glow = (parent, r = 16) => { const g = S('g', { class: 'glow', opacity: 0 }, parent); const c = S('circle', { r, fill: 'url(#gl-own)' }, g); S('circle', { r: 2.6, fill: '#f2fffd' }, g); g.kind = k => c.setAttribute('fill', `url(#gl-${k})`); return g; };
  // Polyline with rounded corners, plus a position lookup by distance (pure, no DOM).
  function track(pts, r = 10) {
    const seg = []; let len = 0;
    for (let i = 1; i < pts.length; i++) { const [x1, y1] = pts[i - 1], [x2, y2] = pts[i], l = Math.hypot(x2 - x1, y2 - y1); seg.push({ x1, y1, x2, y2, l, s: len }); len += l; }
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], [cx, cy] = pts[i + 1];
      const l1 = Math.hypot(bx - ax, by - ay), l2 = Math.hypot(cx - bx, cy - by), rr = Math.min(r, l1 / 2, l2 / 2);
      d += ` L${(bx - (bx - ax) / l1 * rr).toFixed(1)} ${(by - (by - ay) / l1 * rr).toFixed(1)} Q${bx} ${by} ${(bx + (cx - bx) / l2 * rr).toFixed(1)} ${(by + (cy - by) / l2 * rr).toFixed(1)}`;
    }
    d += ` L${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`;
    const at = s => { s = Math.max(0, Math.min(len, s)); for (const q of seg) if (s <= q.s + q.l || q === seg[seg.length - 1]) { const p = q.l ? (s - q.s) / q.l : 0; return [lerp(q.x1, q.x2, p), lerp(q.y1, q.y2, p)]; } };
    return { d, len, at };
  }
  // Text width before layout: one hidden SVG in the page measures labels in the loaded face.
  const meter = S('svg', { width: 0, height: 0, style: 'position:absolute;left:-9999px', 'aria-hidden': 'true' });
  document.body.append(meter);
  const tw = (str, cls) => { const e = T(meter, 0, 0, str, cls); const w = e.getComputedTextLength(); e.remove(); return w; };

  // A source chip: icon and name in one pill, coloured by kind. Returns its box for streams.
  const chipW = (label, noIcon) => Math.ceil(tw(label, 't11')) + (noIcon ? 16 : 30);
  function chip(parent, x, y, ic, label, k, o = {}) {
    const h = o.h || 22, w = chipW(label, o.noIcon);
    const g = box(parent, x, y, w, h, { rx: 6, stroke: `rgba(${RGB[k]},.38)`, sw: 1 });
    if (!o.noIcon) icon(g, ic, x + 7, y + (h - 12) / 2, k === 'own' ? COL.own : COL.acc, .75);
    T(g, x + (o.noIcon ? 8 : 23), y + h / 2 + 4, label, 't11 mut');
    return { g, x, y, w, h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
  }
  // Lays chips out in wrapping rows inside a width; returns the chip boxes in order.
  function chipFlow(parent, list, k, x0, y0, maxW, o = {}) {
    const gap = o.gap ?? 6, rowH = (o.h || 22) + (o.rowGap ?? 6), out = [];
    let x = x0, y = y0;
    for (const [ic, label] of list) {
      const w = chipW(label, o.noIcon);
      if (x + w > x0 + maxW && x > x0) { x = x0; y += rowH; }
      out.push(chip(parent, x, y, ic, label, k, o)); x += w + gap;
    }
    return out;
  }
  // Streams: thin dashed lines that always run (the shadow state), plus dots riding them.
  function streams(parent, list) {
    const g = S('g', {}, parent), items = list.map(({ pts, k, r = 8, w = 1.2, a = .34, from = null }) => {
      const tr = track(pts, r);
      const p = S('path', { d: tr.d, fill: 'none', stroke: `rgba(${RGB[k]},${a})`, 'stroke-width': w, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round' }, g);
      return { tr, p, k, from };
    });
    const dots = items.map((it, i) => [0, 1].map(j => ({ c: S('circle', { r: 1.9, fill: COL[it.k] }, g), off: (i * .37 + j * .5) % 1 })));
    return {
      g,
      draw(t, speed = 1, on = 1) {
        items.forEach((it, i) => {
          // A line whose step has not come yet waits at a third of its strength.
          if (it.from != null) op(it.p, .35 + .65 * reach(t, it.from));
          it.p.style.strokeDashoffset = (-t * 16).toFixed(1);
          for (const d of dots[i]) { const f = (t * speed * 70 / it.tr.len + d.off) % 1, [x, y] = it.tr.at(f * it.tr.len); d.c.setAttribute('cx', x.toFixed(1)); d.c.setAttribute('cy', y.toFixed(1)); op(d.c, on * Math.min(1, f * 6, (1 - f) * 6)); }
        });
      },
    };
  }
  // The first-tier ETL: a heavy machine with three jobs; its slots churn while it runs.
  function etl(parent, x, y, w, h, o = {}) {
    const g = box(parent, x, y, w, h, { rx: 12, stroke: 'rgba(255,184,77,.5)', sw: 1.5, fill: COL.panel });
    const hy = o.headY ?? 24, sh = o.slotH ?? 18;
    T(g, x + 14, y + hy, 'ETL', 't15 ink');
    if (o.side) T(g, x + w - 12, y + hy, o.side, 't11 mut', 'end');
    const jobs = ['Parse, drop junk', 'OCR over PDF', 'Video OCR'];
    const slots = [], sx = x + 12, sw = w - 24;
    jobs.forEach((j, i) => {
      const yy = y + hy + 12 + i * (o.pitch || 24);
      S('rect', { x: sx, y: yy, width: sw, height: sh, rx: 4, fill: COL.node, stroke: 'rgba(255,184,77,.25)' }, g);
      slots.push(S('line', { x1: sx + 4, x2: sx + sw - 4, y1: yy + sh / 2, y2: yy + sh / 2, stroke: 'rgba(255,184,77,.55)', 'stroke-width': sh - 8, 'stroke-dasharray': '1.5 5' }, g));
      // The job name sits on its own solid plate so the churn never runs under the text.
      S('rect', { x: sx + 4, y: yy + 2, width: Math.ceil(tw(j, 't11')) + 12, height: sh - 4, rx: 3, fill: COL.node }, g);
      T(g, sx + 10, yy + sh / 2 + 4, j, 't11 ink');
    });
    return { g, x, y, w, h, draw(t) { slots.forEach((s, i) => { s.style.strokeDashoffset = (-t * (26 + i * 9)).toFixed(1); }); } };
  }
  // A store with its published figure: label, figure, optional sub line.
  function store(parent, x, y, w, ic, label, fig, sub, k = 'acc', o = {}) {
    const c = o.compact ? 6 : 0, h = (sub ? 62 : 46) - c, g = box(parent, x, y, w, h, { rx: 10, stroke: `rgba(${RGB[k]},.45)` });
    icon(g, ic, x + 10, y + 10 - c / 2, k === 'own' ? COL.own : COL.acc, .85);
    T(g, x + 30, y + 21 - c / 2, label, 't12 ink');
    T(g, x + 10, y + 39 - c, fig, 't13 ' + (k === 'own' ? 'k-own' : 'k-acc'));
    if (sub) T(g, x + 10, y + 55, sub, 't11 mut');
    return { g, x, y, w, h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
  }
  // The output: one list, each row a ready instruction (tier, action, evidence). Rows stand in
  // the shadow colour from the first frame (5.26:1) and light up as their card reaches the end of the belt.
  function decisions(parent, x, y, w, o = {}) {
    const rh = o.rh || 56, compact = !!o.compact, head = o.head ?? 52;
    const h = head + ROWS.length * rh + 4;
    const panel = box(parent, x, y, w, h, { rx: 14, stroke: 'rgba(67,227,154,.5)', sw: 1.5, fill: COL.panel });
    icon(panel, 'decide', x + 14, y + (compact ? 10 : 16), COL.fix, 1);
    T(panel, x + 38, y + (compact ? 23 : 29), 'To act on', 't15 ink');
    if (compact) T(panel, x + w - 12, y + 23, 'in your portal', 't11 mut', 'end');
    else T(panel, x + 14, y + 46, 'in your portal', 't11 mut');
    const rows = ROWS.map((r, i) => {
      const ry = y + head + i * rh, g = S('g', {}, parent);
      const bh = rh - (compact ? 3 : 6), rb = box(g, x + 8, ry, w - 16, bh, { rx: 8, stroke: `rgba(${RGB[r.k]},.22)` });
      const litG = S('g', {}, rb);
      S('rect', { x: x + 8, y: ry, width: w - 16, height: bh, rx: 8, fill: 'none', stroke: `rgba(${RGB[r.k]},.7)`, 'stroke-width': 1.3 }, litG);
      const put = (layer, lit) => {
        if (compact) {
          const tt = T(layer, x + 18, ry + 13, '', 't12');
          S('tspan', { class: lit ? 'k-' + r.k : 'dim' }, tt).textContent = r.t + '  ';
          S('tspan', { class: lit ? 'ink' : 'dim' }, tt).textContent = r.a;
          T(layer, x + 18, ry + 27, 'Evidence: ' + r.e, 't11 ' + (lit ? 'mut' : 'dim'));
        } else {
          T(layer, x + 18, ry + 17, r.t, 't10 ' + (lit ? 'k-' + r.k : 'dim'));
          T(layer, x + 18, ry + 33, r.a, 't13 ' + (lit ? 'ink' : 'dim'));
          T(layer, x + 18, ry + 46, 'Evidence: ' + r.e, 't11 ' + (lit ? 'mut' : 'dim'));
        }
      };
      const shade = S('g', {}, rb); put(shade, false); put(litG, true);
      return { g, litG, shade };
    });
    return { rows, b: y + h };
  }

  function outlets(parent, x, y, w, o = {}) {
    const h = o.h || 34, gap = o.gap ?? 8;
    return OUTLETS.map(([a, b], i) => {
      const yy = y + i * (h + gap), g = box(parent, x, yy, w, h, { rx: 10, stroke: 'rgba(67,227,154,.4)', fill: COL.panel });
      const hl = S('rect', { x, y: yy, width: w, height: h, rx: 10, fill: 'none', stroke: COL.fix, 'stroke-width': 1.3 }, g); op(hl, 0);
      const ty = o.two ? yy + 16 : yy + h / 2 + 4;
      const lt = litText(g, g, x + 12, ty, a, 't12');
      if (o.two) T(g, x + 12, ty + 14, b, 't11 mut'); else T(g, x + w - 12, ty, b, 't11 mut', 'end');
      return { els: [lt, hl], cy: yy + h / 2, b: yy + h };
    });
  }

  // jd.ops's profile, dark from the first frame; each row lights as the lead passes the press that fills it.
  // grid: the phone's 2x2 cells; otherwise one row under another.
  function profile(parent, lit, x, y, w, o = {}) {
    // Rows 30 apart: at 26 a 12 px value ran into the 11.5 px label under it (verify, 12.11).
    const grid = !!o.grid, h = grid ? 88 : 156, hy = grid ? 15 : 19;
    const g = box(parent, x, y, w, h, { rx: 12, stroke: 'rgba(255,184,77,.45)', fill: COL.panel });
    const head = litText(g, lit, x + 12, y + hy, 'jd.ops', 't13');
    T(g, x + w - 12, y + hy, 'profile', 't11 mut', 'end');
    S('line', { x1: x + 10, x2: x + w - 10, y1: y + hy + 7, y2: y + hy + 7, stroke: 'rgba(255,184,77,.2)' }, g);
    const rows = PROFILE.map(([a, b, cls, j, lag], i) => {
      const cx = grid ? x + 12 + (i % 2) * w / 2 : x + 12, cy = grid ? y + 37 + (i >> 1) * 30 : y + 44 + i * 30;
      return { j, lag, els: [litText(g, lit, cx, cy, a, 't11', null, 'mut'), litText(g, lit, cx, cy + 14, b, 't12', null, cls)] };
    });
    // past(j): how far the lead is beyond press j, in px of belt.
    return { draw(past, L) { op(head, clamp(past(4) / 24 + .3) * L); rows.forEach(r => { const v = clamp((past(r.j) - r.lag) / 24 + .3) * L; r.els.forEach(e => op(e, v)); }); } };
  }
  // What the ETL throws away: scraps fall out of its floor into a bin, all the time it runs.
  function junk(parent, [fa, fb, fy], [ta, tb, ty], n = 6) {
    const g = S('g', { class: 'junk' }, parent), R = rng(11);
    const bits = Array.from({ length: n }, (_, i) => ({ el: S('rect', { x: -2.5, y: -2, width: 5, height: 4, rx: 1, fill: i % 2 ? 'rgba(255,184,77,.75)' : 'rgba(158,219,212,.6)' }, g), fx: lerp(fa, fb, R()), tx: lerp(ta, tb, R()), ph: R(), rot: R() * 90 }));
    return { draw(t) { for (const s of bits) { const p = (t / 1.3 + s.ph) % 1; mv(s.el, lerp(s.fx, s.tx, p), lerp(fy, ty, p * p), ` rotate(${(s.rot + p * 140).toFixed(0)})`); op(s.el, Math.min(1, p * 8, (1 - p) * 5)); } } };
  }

  // The red pill that marks the privileged account, and the tag on the shared-password link.
  const adminChip = parent => { const g = S('g', {}, parent); S('rect', { width: 46, height: 16, rx: 8, fill: COL.bad }, g); T(g, 23, 12, 'admin', 't10 on-chip', 'middle'); return g; };
  const passTag = parent => {
    const g = S('g', {}, parent), w = Math.ceil(tw('same password', 't11')) + 14;
    T(box(g, 0, 0, w, 18, { rx: 5, fill: COL.panel, stroke: 'rgba(255,184,77,.6)' }), 7, 13, 'same password', 't11 k-acc');
    return { g, w };
  };

  // ---------- Shared phone frame: sources, ETL, stores on top; decisions at the bottom ----------
  // Two source columns (amber intelligence left, teal perimeter right) drain into collector
  // bars, so the bundles never cross a chip. The middle band (y0 to y1) belongs to the variant.
  function phoneFrame(base, lit, top, midH) {
    const o = { noIcon: true, h: 18, gap: 4, rowGap: 4 };
    const A = chipFlow(base, [DUMPS, ...INTEL], 'acc', 6, 2, 224, o);
    const Tc = chipFlow(base, PERIM, 'own', 238, 2, 114, o);
    const yb = Math.max(...A.map(c => c.b), ...Tc.map(c => c.b)) + 7, ey = yb + 20;
    S('line', { x1: 8, x2: 226, y1: yb, y2: yb, stroke: 'rgba(255,184,77,.5)', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, base);
    S('line', { x1: 240, x2: 350, y1: yb, y2: yb, stroke: 'rgba(23,241,215,.5)', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, base);
    const E = etl(base, 6, ey, 176, 80, { headY: 18, pitch: 17, slotH: 14, side: FIG.tb });
    const cb = box(base, 190, ey, 162, 80, { rx: 12, stroke: 'rgba(23,241,215,.45)', sw: 1.3, fill: COL.panel });
    const domLit = litText(cb, lit, 202, ey + 18, 'aceme.example', 't13');
    T(cb, 202, ey + 32, 'your domain', 't11 mut');
    S('line', { x1: 200, x2: 342, y1: ey + 40, y2: ey + 40, stroke: 'rgba(23,241,215,.2)' }, cb);
    const colLit = litText(cb, lit, 202, ey + 57, 'Collect', 't12');
    T(cb, 202, ey + 72, FIG.steps, 't11 k-own');
    // The junk bin under the ETL floor, between the two lines that run down to the stores.
    const J = junk(base, [96, 150, ey + 80], [94, 148, ey + 96]);
    T(box(base, 84, ey + 94, 74, 18, { rx: 6, stroke: 'rgba(109,141,136,.6)' }), 92, ey + 107, 'Junk out', 't11 mut');
    const sy = ey + 120;
    const db = store(base, 6, sy, 172, 'db', 'Leak database', FIG.db, null, 'acc', { compact: true });
    const raw = store(base, 182, sy, 170, 'raw', 'Raw leaks', FIG.raw, null, 'acc', { compact: true });
    const SC = chipFlow(base, SCOPE.map(([a]) => ['', a]), 'own', 6, sy + 46, 346, o);
    const scopeLit = SC.map(c => { const r = S('rect', { x: c.x, y: c.y, width: c.w, height: c.h, rx: 6, fill: 'none', stroke: COL.own, 'stroke-width': 1.3 }, lit); op(r, 0); return r; });
    const y0 = Math.max(...SC.map(c => c.b)) + 8;
    const SA = streams(base, A.map((c, i) => ({ pts: [[lerp(16, 216, i / (A.length - 1)), yb], [lerp(20, 168, i / (A.length - 1)), ey]], k: 'acc', w: i === 0 ? 2.4 : 1.1 })));
    const STl = streams(base, Tc.map((c, i) => ({ pts: [[lerp(248, 342, i / (Tc.length - 1)), yb], [lerp(250, 340, i / (Tc.length - 1)), ey]], k: 'own', w: 1.1 })));
    const PI = streams(base, [{ pts: [[60, ey + 80], [60, sy]], k: 'acc', w: 2 }, { pts: [[150, ey + 80], [150, ey + 84], [230, ey + 84], [230, sy]], k: 'acc', w: 2 }]);
    const DEC = decisions(top, 6, y0 + midH, 346, { compact: true, rh: 34, head: 30 });
    const OUTL = outlets(top, 6, DEC.b + 8, 346, { h: 24, gap: 6 });
    return { db, raw, y0, y1: y0 + midH, DEC, OUTL, vbH: OUTL[1].b + 2,
      // Where the variant's middle band picks up the collection line.
      inCollect: [354, ey + 57],
      draw(t, L) { E.draw(t); J.draw(t); SA.draw(t); STl.draw(t, 1, reach(t, 2)); PI.draw(t); op(domLit, reach(t, 1) * L); op(colLit, reach(t, 3) * L); scopeLit.forEach((r, i) => op(r, scopeOn(t, i) * L)); } };
  }

  // ---------- Shared piece scaffold ----------
  // A label that lights when its step is reached: shadow copy plus lit copy on top.
  function litText(parent, lit, x, y, str, cls, anchor, litCls = 'ink') {
    T(parent, x, y, str, cls + ' dim', anchor);
    const e = T(lit, x, y, str, cls + ' ' + litCls, anchor); op(e, 0); return e;
  }
  const lines2 = (parent, lit, x, y, str, cls, anchor, litCls) => str.split('|').map((s, i) => litText(parent, lit, x, y + i * 14, s, cls, anchor, litCls));
  const spread = (n, a, b) => Array.from({ length: n }, (_, i) => lerp(a, b, n > 1 ? i / (n - 1) : .5));

  // ---------- Variant 2: conveyor belt, side view ----------
  // Cards ride the belt continuously. Each card's look is a pure function of its position:
  // passing a press changes it. The lead (admin, later jd.ops) passes press j in the middle of
  // step j + 4 (j + 3 until scope became step 2 on 12.11). Its duplicate and its generated twin
  // ride as sheets behind it, so the fold and the cut happen under the Clean press on the Cleaning
  // step; as separate cards a belt pitch narrower than a card put them a step and a half away from it.
  // The first two cards feed Brand Protection and Asset management (OUTLETS order), so they stay first.
  // The supplier (12.11): an HR contractor with access and no corporate mail, found through a home mailbox.
  const CARDS = [
    { h: 'acerne', s: 'look-alike', k: 'acc', row: 5 },
    { h: 'dev', p: '3389', sw: 'OpenSSH 7.4', s: 'forgotten', row: 4, cve: 1 },
    { h: 'hr-vendor', s: 'third party', r: 'k.ross', rs: 'home mail', row: 3 },
    { h: 'www', p: '443', sw: 'nginx 1.18', r: 'm.lee', rs: 'forum dump', row: 2 },
    { h: 'portal', p: '443', sw: 'IIS 10.0', r: 'john.d', rs: 'stealer log', row: 1 },
    { h: 'admin', p: '8443', sw: 'Tomcat 9.0', r: 'jd.ops', rs: 'personal', row: 0, lead: 1, cve: 1 },
  ];
  const LEAD = CARDS.findIndex(c => c.lead), JOHN = CARDS.findIndex(c => c.row === 1);
  const V2 = {
    aria: 'Side view of a conveyor belt: sources feed the ETL, which throws junk into a bin; one domain opens up subdomains, related domains, third parties and people; record cards, a supplier among them, ride under seven presses and change at each; at the reverse check the profile of jd.ops fills in: work mail, personal mail, a home PC in a stealer log, the admin role; a duplicate folds, a generated record drops off, and finished cards rise into the findings to act on in your portal, with Brand Protection and Asset management fed alongside.',
    vb: { desktop: [1160, 580], phone: [358, 640] },
    make(layout) {
      const P = layout === 'phone';
      const svg = S('svg', {}); glowDefs(svg);
      const base = S('g', {}, svg), mid = S('g', {}, svg), lit = S('g', {}, svg), cardsG = S('g', {}, svg), fx = S('g', {}, svg), top = S('g', {}, svg);
      let DEC, OUTL, E, J, PR, H, frameDraw = () => {};
      const heads = [], scope = [];
      const flows = [];
      // Geometry: belt top line, press x positions, direction (+1 left to right, -1 on the phone).
      let G;
      if (P) {
        // The middle band: the belt (132) and, under the press names, the profile (88 + gaps).
        const F = phoneFrame(base, lit, top, 232); DEC = F.DEC; OUTL = F.OUTL; H = F.vbH; frameDraw = F.draw;
        const y0 = F.y0;
        G = { dir: -1, x0: 346, xEnd: 18, belt: y0 + 92, beam: y0 + 22, xs: spread(7, 318, 30), cw: 26, ch: 18, gap: 40, lab: y0 + 112 };
        PR = profile(base, lit, 6, y0 + 136, 346, { grid: true });
        const [cx, cy] = F.inCollect;
        flows.push({ pts: [[cx - 2, cy], [356, cy], [356, G.belt - 30], [348, G.belt - 30]], k: 'own', w: 2, from: 3 });
        flows.push({ pts: [[F.db.cx, F.db.b], [F.db.cx, y0 + 6], [G.xs[2], y0 + 6], [G.xs[2], G.beam]], k: 'acc', w: 2, from: 6 });
        flows.push({ pts: [[F.raw.cx, F.raw.b], [F.raw.cx, y0 + 12], [G.xs[5], y0 + 12], [G.xs[5], G.beam]], k: 'acc', w: 2, from: 9 });
        G.out = [[G.xEnd, G.belt - 9], [4, G.belt - 9], [4, F.y1 + 14], [6, F.y1 + 14]];
        G.feeds = OUTL.map(o => [[4, F.y1 + 14], [4, o.cy], [6, o.cy]]);
      } else {
        H = 580;
        G = { dir: 1, x0: 236, xEnd: 880, belt: 470, beam: 336, xs: spread(7, 404, 812), cw: 92, ch: 54, gap: 96, lab: 0 };
        // Sources: one column, every chip with its own line into the bundle.
        const list = [[DUMPS, 'acc'], ...INTEL.map(c => [c, 'acc']), ...PERIM.map(c => [c, 'own'])];
        const chips = list.map(([c, k], i) => chip(base, 16, 12 + i * 25 + (k === 'own' ? 14 : 0), c[0], c[1], k));
        const A = chips.slice(0, 10), Tc = chips.slice(10);
        E = etl(base, 240, 12, 214, 116, { side: FIG.tb });
        A.forEach((c, i) => flows.push({ pts: [[c.r, c.cy], [186 + i * 3, c.cy], [186 + i * 3, 28 + i * 9], [240, 28 + i * 9]], k: 'acc', w: i === 0 ? 2.6 : 1.1 }));
        const db = store(base, 476, 12, 186, 'db', 'Leak database', FIG.db, 'by domain and host');
        const raw = store(base, 476, 84, 186, 'raw', 'Raw leaks', FIG.raw, 'mail, documents, details');
        flows.push({ pts: [[E.x + E.w, 43], [db.x, 43]], k: 'acc', w: 2 }, { pts: [[E.x + E.w, 115], [raw.x, 115]], k: 'acc', w: 2 });
        // The junk bin under the ETL's right corner, clear of the line from the database at x 540.
        J = junk(base, [432, 450, 128], [440, 512, 174]);
        const bin = box(base, 424, 170, 104, 40, { stroke: 'rgba(109,141,136,.6)' });
        T(bin, 436, 186, 'Junk out', 't12 mut'); T(bin, 436, 201, 'spam, noise', 't11 dim');
        // jd.ops's profile over the last presses: right of the "Check users" label (ends ~714), left of the line at 920.
        PR = profile(base, lit, 720, 128, 196);
        // The domain and its scope over the start of the belt, then the collection hopper.
        const px = 240, py = 140, pw = 170, ph = 172;
        const pnl = box(base, px, py, pw, ph, { rx: 12, stroke: 'rgba(23,241,215,.5)', fill: COL.panel });
        heads.push([litText(pnl, lit, px + 12, py + 18, 'aceme.example', 't13'), 1]);
        T(pnl, px + 12, py + 33, 'your domain', 't11 mut');
        S('line', { x1: px + 10, x2: px + pw - 10, y1: py + 42, y2: py + 42, stroke: 'rgba(23,241,215,.2)' }, pnl);
        SCOPE.forEach(([a, b], i) => { const y = py + 50 + i * 30; scope.push(litText(pnl, lit, px + 12, y + 11, a, 't12')); T(pnl, px + 12, y + 24, b, 't11 mut'); });
        const hx = G.x0 + 8, hy = 380;
        Tc.forEach((c, i) => flows.push({ pts: [[c.r, c.cy], [196 + i * 3, c.cy], [196 + i * 3, hy - 22 + i * 2], [hx - 14 + i * 5, hy - 22 + i * 2], [hx - 14 + i * 5, hy]], k: 'own', from: 2 }));
        flows.push({ pts: [[315, py + ph], [315, 366], [hx + 18, 366], [hx + 18, hy]], k: 'own', w: 2, from: 2 });
        S('path', { d: `M${hx - 26} ${hy} L${hx - 8} ${hy + 30} L${hx + 8} ${hy + 30} L${hx + 26} ${hy}Z`, fill: '#071513', stroke: 'rgba(23,241,215,.45)' }, base);
        heads.push([litText(base, lit, hx + 30, hy + 12, 'Collect', 't13'), 3]);
        T(base, hx + 30, hy + 27, FIG.steps, 't11 k-own');
        flows.push({ pts: [[G.xs[2], db.b], [G.xs[2], G.beam]], k: 'acc', w: 2, from: 6 });
        flows.push({ pts: [[raw.r, raw.cy + 8], [G.xs[5], raw.cy + 8], [G.xs[5], G.beam]], k: 'acc', w: 2, from: 9 });
        // Six rows since the supplier joined: 58 a row keeps the list and both outlets inside 580.
        DEC = decisions(top, 930, 40, 222, { rh: 58 });
        OUTL = outlets(top, 930, 452, 222, { h: 38, two: true });
        G.out = [[G.xEnd + 20, G.belt - 30], [920, G.belt - 30], [920, 70], [930, 70]];
        G.feeds = OUTL.map(o => [[920, G.belt - 30], [920, o.cy], [930, o.cy]]);
      }
      // Lines run under the boxes, so a line that passes a store reads as passing behind it.
      const FL = streams(base, flows); base.prepend(FL.g);
      const { dir, belt, beam, xs, cw, ch } = G;
      // The belt: rollers at both ends, a running top surface.
      const xa = Math.min(G.x0, G.xEnd) - 10, xb = Math.max(G.x0, G.xEnd) + 10;
      S('rect', { x: xa, y: belt, width: xb - xa, height: P ? 10 : 16, rx: P ? 5 : 8, fill: '#06100f', stroke: 'rgba(23,241,215,.35)' }, mid);
      for (const x of [xa + (P ? 5 : 8), xb - (P ? 5 : 8)]) S('circle', { cx: x, cy: belt + (P ? 5 : 8), r: P ? 3 : 5, fill: 'none', stroke: 'rgba(23,241,215,.5)' }, mid);
      const run = S('line', { x1: xa + 10, x2: xb - 10, y1: belt + 1.5, y2: belt + 1.5, stroke: 'rgba(23,241,215,.5)', 'stroke-width': 2, 'stroke-dasharray': '6 10' }, mid);
      // Presses hang from one beam; each head dips when a card passes under it.
      S('line', { x1: Math.min(...xs) - 26, x2: Math.max(...xs) + 26, y1: beam, y2: beam, stroke: 'rgba(23,241,215,.4)', 'stroke-width': 3, 'stroke-linecap': 'round' }, mid);
      const NAMES = P ? STN2 : STN;
      const headY = belt - ch - (P ? 20 : 9), hw = P ? 18 : 40;
      const presses = xs.map((x, j) => {
        const k = stK(j);
        const arm = S('line', { x1: x, x2: x, y1: beam, y2: headY, stroke: `rgba(${RGB[k]},.45)`, 'stroke-width': 2 }, mid);
        const head = S('rect', { x: x - hw / 2, y: headY, width: hw, height: P ? 8 : 12, rx: 3, fill: '#0a1a18', stroke: `rgba(${RGB[k]},.6)` }, mid);
        const hl = S('rect', { x: x - hw / 2, y: headY, width: hw, height: P ? 8 : 12, rx: 3, fill: 'none', stroke: COL[k], 'stroke-width': 1.6 }, lit); op(hl, 0);
        const ly = P ? G.lab : beam - (j % 2 ? 26 : 10);
        const labs = lines2(base, lit, x, ly, NAMES[j], P ? 't11' : 't12', 'middle');
        return { x, arm, head, hl, labs };
      });
      if (!P) { S('rect', { x: xs[3] - 30, y: belt + 40, width: 60, height: 22, rx: 6, fill: COL.node, stroke: 'rgba(109,141,136,.6)' }, base); T(base, xs[3], belt + 55, 'cut', 't11 mut', 'middle'); }
      const OUT = streams(base, [{ pts: G.out, k: 'fix', w: 2.4, a: .45 }, ...G.feeds.map(pts => ({ pts, k: 'fix', w: 1.8, a: .45 }))]);
      const els = CARDS.map(c => {
        const g = S('g', { class: 'card' }, cardsG), o = { g, last: '' };
        // The lead's two sheets sit behind it: a duplicate and a generated record about jd.ops.
        if (c.lead) o.sheets = [0, 1].map(n => {
          const sg = S('g', {}, g), sb = box(sg, -cw / 2, -ch, cw, ch, { rx: P ? 4 : 7, fill: COL.node, stroke: 'rgba(255,184,77,.6)' });
          let txt = null;
          if (n && !P) { txt = S('g', {}, sb); T(txt, -cw / 2 + 7, -ch + 15, 'jd.ops', 't12 ink'); T(txt, -cw / 2 + 7, -ch + 31, 'generated', 't11 mut'); }
          return { sg, txt };
        });
        const bx = box(g, -cw / 2, -ch, cw, ch, { rx: P ? 4 : 7, fill: COL.node, stroke: 'rgba(23,241,215,.6)' });
        o.rect = bx.firstChild;
        if (!P) {
          o.name = T(bx, -cw / 2 + 7, -ch + 15, '', 't12 ink');
          o.sub = T(bx, -cw / 2 + 7, -ch + 31, '', 't11 mut');
          o.sub2 = T(bx, -cw / 2 + 7, -ch + 46, '', 't11 k-acc');
          // A version with a known CVE is amber from the moment it is read.
          o.pills = [c.p, c.sw].filter(Boolean).map((s, i) => { const amb = i === 1 && c.cve, pg = S('g', {}, bx), w = Math.ceil(tw(s, 't10')) + 10; S('rect', { x: -cw / 2 + 6, y: -ch + 19 + i * 16, width: w, height: 14, rx: i ? 7 : 3, fill: amb ? '#2a1d08' : '#0c2522', stroke: amb ? COL.acc : COL.own }, pg); T(pg, -cw / 2 + 11, -ch + 30 + i * 16, s, amb ? 't10 k-acc' : 't10 k-own'); return pg; });
        } else {
          o.pills = [0, 1].map(i => S('rect', { x: -cw / 2 + 4, y: -ch + 5 + i * 5, width: i ? 12 : 8, height: 3, rx: 1.5, fill: COL.own }, bx));
        }
        return o;
      });
      const linkEl = S('path', { fill: 'none', stroke: COL.acc, 'stroke-width': 1.6, 'stroke-dasharray': '3 3' }, fx);
      const { g: linkTag, w: ltW } = passTag(fx);
      const halo = glow(fx, P ? 14 : 22);
      const chipAdm = adminChip(fx);
      // Distance along the belt from where cards enter to press j.
      const toPress = j => Math.abs(xs[j] - G.x0);
      // Belt travel X(t): cards pour in fast, then the belt settles to one press per step.
      const pitch = Math.abs(xs[1] - xs[0]), v = pitch / D, t0 = at(3), tA = at(4) + D / 2;
      const XA = toPress(0) + LEAD * G.gap, span = tA - t0, c2 = (v * span - XA) / (span * span), c1 = v - 2 * c2 * span;
      const X = t => t < t0 ? 0 : t < tA ? c1 * (t - t0) + c2 * (t - t0) * (t - t0) : XA + (t - tA) * v;
      const lenB = Math.abs(G.xEnd - G.x0);
      const past = (d, j) => clamp((d - toPress(j)) / 10 + .5);
      function draw(t, L) {
        if (E) E.draw(t);
        if (J) J.draw(t);
        frameDraw(t, L);
        FL.draw(t); OUT.draw(t, 1.2, reach(t, 8) * L);
        const Xt = X(t);
        run.style.strokeDashoffset = (-Xt * dir).toFixed(1);
        op(lit, L);
        const pos = [];
        CARDS.forEach((c, i) => {
          const o = els[i];
          const d = Xt - i * G.gap;
          let a = d > 0 && t >= t0 ? 1 : 0;
          // Past the end a card rides the lift up towards the list and fades.
          a *= 1 - clamp((d - lenB) / (P ? 20 : 60));
          const x = G.x0 + dir * Math.min(d, lenB), y = belt - Math.max(0, d - lenB) * (P ? .6 : 1.4);
          pos[i] = [x, y, d];
          mv(o.g, x, y); op(o.g, a * L);
          const s = j => past(d, j);
          if (o.sheets) {
            // Search leaks fans the sheets out; Clean folds the duplicate in and drops the other.
            const fan = clamp((d - toPress(2) + 8) / 24), fc = clamp((d - toPress(3) + 4) / (P ? 22 : 44));
            const [s1, s2] = o.sheets, sp = P ? 5 : 9;
            mv(s1.sg, -dir * sp * fan * (1 - fc), 0); op(s1.sg, fan * (1 - win(fc, .6, 1)));
            // On the phone the labels sit under the belt, so the cut sheet slides off sideways there.
            mv(s2.sg, -dir * (2 * sp * fan + fc * (P ? 30 : 56)), fc * fc * (P ? 8 : 64)); op(s2.sg, fan * (1 - win(fc, .55, 1)));
            if (s2.txt) op(s2.txt, fc > .08 ? 1 : 0);
          }
          const isRec = c.r && s(2) >= .5, red = c.lead && s(6) >= .5;
          const k = red ? 'bad' : isRec || c.k === 'acc' ? 'acc' : 'own';
          o.rect.setAttribute('stroke', COL[k]);
          if (!P) {
            const nm = isRec ? c.r : c.h;
            let sub = isRec ? c.rs : c.s || '', sub2 = '';
            if (c.lead && s(4) >= .5) sub2 = 'linked';
            if (c.lead && s(5) >= .5) sub2 = 'raw leaks';
            if (c.lead && s(6) >= .5) sub2 = 'admin';
            // john.d is linked when the lead reaches Reverse check, not when john.d passes it.
            if (i === JOHN && past(Xt - LEAD * G.gap, 4) >= .5) sub2 = 'linked';
            // The scanned port pill takes the place of the 'forgotten' note.
            if (c.s && c.p && s(0) >= .5) sub = '';
            const key = nm + sub + sub2 + k;
            if (key !== o.last) {
              o.last = key; o.name.textContent = nm; o.sub.textContent = sub; o.sub2.textContent = sub2;
              o.sub2.setAttribute('class', 't11 ' + (k === 'bad' ? 'k-bad' : 'k-acc'));
            }
            o.pills.forEach((p, j) => op(p, isRec ? 0 : s(j)));
          } else {
            o.pills.forEach((p, j) => { op(p, c.p ? s(j) * (isRec ? .9 : 1) : 0); p.setAttribute('fill', COL[j === 1 && c.cve && !isRec ? 'acc' : k]); });
          }
          o.rect.setAttribute('fill', k === 'bad' ? '#2a0a12' : COL.node);
        });
        // Press heads dip as a card passes; they light once their step is reached.
        presses.forEach((p, j) => {
          let bump = 0; for (const q of pos) bump = Math.max(bump, 1 - Math.abs(q[0] - p.x) / (P ? 14 : 26));
          const dip = bump * (P ? 4 : 8);
          p.head.setAttribute('y', headY + dip); p.hl.setAttribute('y', headY + dip); p.arm.setAttribute('y2', headY + dip);
          const vv = reach(t, j + 4); op(p.hl, vv); p.labs.forEach(e => op(e, vv));
        });
        heads.forEach(([e, k]) => op(e, reach(t, k)));
        scope.forEach((e, i) => op(e, scopeOn(t, i)));
        const [lx, ly, ld] = pos[LEAD], [jx, , jd] = pos[JOHN];
        PR.draw(j => ld - toPress(j), L);
        // The link holds from Reverse check until either end of it leaves the belt.
        const lk = clamp((ld - toPress(4)) / 20) * (1 - clamp((Math.max(ld, jd) - lenB) / 20));
        const yy = belt - ch - 6;
        linkEl.setAttribute('d', `M${lx.toFixed(1)} ${yy} C${lx.toFixed(1)} ${yy - 30} ${jx.toFixed(1)} ${yy - 30} ${jx.toFixed(1)} ${yy}`);
        op(linkEl, lk * L);
        mv(linkTag, (lx + jx) / 2 - ltW / 2, yy - 40); op(linkTag, P ? 0 : lk * L);
        const leadA = ld > 0 && t >= t0 ? 1 - clamp((ld - lenB) / 40) : 0;
        halo.kind(past(ld, 6) >= .5 ? 'bad' : past(ld, 2) >= .5 ? 'acc' : 'own'); mv(halo, lx, belt - ch / 2); op(halo, leadA * L);
        mv(chipAdm, lx - 23, ly - ch - 22); op(chipAdm, (past(ld, 6) >= .5 ? 1 : 0) * leadA * L);
        // Each finished card lights its own row as it reaches the end of the belt.
        DEC.rows.forEach((r, ri) => {
          const ci = CARDS.findIndex(c => c.row === ri), dd = pos[ci][2];
          const vv = clamp((dd - lenB) / (P ? 20 : 40)) * L; op(r.litG, vv); op(r.shade, 1 - vv);
        });
        // The look-alike card feeds Brand Protection, the forgotten host feeds Asset management.
        OUTL.forEach((o, i) => { const vv = clamp((pos[i][2] - lenB) / (P ? 20 : 40)) * L; o.els.forEach(e => op(e, vv)); });
      }
      // h: the viewBox height the variant actually drew (the phone height follows the content).
      return { svg, h: H, len: LEN, fadeAt: FADE, still: STILL, stage: stageOf, draw };
    },
  };

  // ---------- Runtime: one piece; the layout follows the width the piece gets ----------
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hp = document.getElementById('hp'), stage = document.getElementById('stage');
  const pause = document.getElementById('pause'), capsEl = document.getElementById('caps'), pipsEl = document.getElementById('pips');
  const capEls = CAPS.map(([b, txt]) => { const p = H('p', '', capsEl); H('b', '', p, b); p.append(txt); return p; });
  // A pip jumps to the start of its step; the piece is a function of t, so any moment is a valid frame.
  const pipEls = CAPS.map(([b], i) => {
    const e = H('button', '', pipsEl); e.type = 'button'; e.setAttribute('aria-label', `Step ${i + 1} of ${CAPS.length}: ${b}`);
    e.addEventListener('click', () => { if (!piece) return; piece.t = at(i) + .05; paint(); kick(); });
    return e;
  });
  // The desktop drawing needs 1000 px for its 11 px labels to stay at 9.5 px or more (768 gave 7.0, 1024 gave 9.4);
  // narrower, the phone drawing takes over, capped at 480 px by the CSS so a tablet does not stretch it to 1172 px.
  // The width on offer is the parent's content box (the piece itself is capped in phone mode); in a shadow root, the host's.
  const avail = () => { const p = hp.parentElement || hp.getRootNode().host, cs = getComputedStyle(p); return p.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); };
  const layoutOf = () => avail() < 1000 ? 'phone' : 'desktop';

  let piece = null, layout = layoutOf(), playing = !reduce, raf = 0, last = 0, visible = false, lastIdx = -1;
  function frame(now) {
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    if (!piece || !visible || !playing) { raf = 0; return; }
    piece.t = (piece.t + dt) % piece.len; paint();
    raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && playing && visible && !reduce && piece) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  // The dynamic layer fades back to the shadow map at the end of each loop.
  function paint() {
    const t = piece.t, L = t < piece.fadeAt ? 1 : clamp(1 - (t - piece.fadeAt) / .9);
    piece.draw(t, L);
    const idx = t >= piece.fadeAt + .9 ? 0 : piece.stage(t);
    if (idx !== lastIdx) {
      lastIdx = idx;
      capEls.forEach((p, i) => p.classList.toggle('on', i === idx));
      pipEls.forEach((p, i) => { p.classList.toggle('on', i <= idx); if (i === idx) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current'); });
      // The last step fills the call to action.
      hp.classList.toggle('done', idx === CAPS.length - 1);
    }
  }
  function render() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    const keep = piece ? piece.t : null;
    hp.className = 'hp ' + layout;
    piece = V2.make(layout);
    const w = V2.vb[layout][0], h = Math.ceil(piece.h); stage.style.aspectRatio = `${w} / ${h}`;
    piece.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    piece.svg.setAttribute('class', `pl ${layout}`);
    piece.svg.setAttribute('role', 'img'); piece.svg.setAttribute('aria-label', V2.aria);
    stage.textContent = ''; stage.append(piece.svg);
    piece.t = reduce ? piece.still : keep ?? 0; lastIdx = -1;
    paint(); kick();
  }
  // Before the fonts arrive, reserve the box so the page does not jump.
  { const [w, h] = V2.vb[layout]; stage.style.aspectRatio = `${w} / ${h}`; hp.className = 'hp ' + layout; }
  pause.addEventListener('click', () => {
    playing = !playing;
    pause.querySelector('span').textContent = playing ? 'Pause' : 'Play';
    pause.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
    pause.querySelector('svg').innerHTML = playing ? '<rect x="2" y="1.5" width="3.6" height="11" rx="1"/><rect x="8.4" y="1.5" width="3.6" height="11" rx="1"/>' : '<path d="M3 1.6v10.8a.6.6 0 0 0 .9.5l8.6-5.4a.6.6 0 0 0 0-1L3.9 1.1a.6.6 0 0 0-.9.5Z"/>';
    kick();
  });
  if (reduce) { pause.hidden = true; document.getElementById('rm').hidden = false; }
  new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; if (visible) kick(); }), { threshold: .05 }).observe(hp);
  // A rotated phone or a resized window crosses the threshold: redraw in the other layout, same moment.
  new ResizeObserver(() => { const l = layoutOf(); if (piece && l !== layout) { layout = l; render(); } }).observe(hp);
  window.__pipe = { get t() { return piece && piece.t; }, set t(v) { piece.t = v; paint(); }, get len() { return piece.len; }, get still() { return piece.still; }, get layout() { return layout; } };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(render);

  })(doc);
})();
