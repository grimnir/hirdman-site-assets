/* Hirdman site behavior. Every block is guarded by the presence of its markup, so one file serves every page. */
(() => {
  document.documentElement.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Top bar: solid on scroll, active link, mobile menu ---------- */
  const top = $('#top');
  if (top) {
    const onScroll = () => top.classList.toggle('solid', window.scrollY > 40);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    const norm = p => (p.replace(/\/$/, '').split('/').pop() || 'index').replace(/\.html$/, '') || 'index';
    const here = norm(location.pathname);
    $$('#top .nav a').forEach(a => { const href = a.getAttribute('href') || ''; if (!href.startsWith('http') && norm(href) === here) a.classList.add('active'); });
    // Owner (08.11): anything that leaves these pages (scanner, demo, tools, Tech Library, legal) opens in a new tab,
    // so the visitor keeps the page they were reading. Site pages are linked relatively; the absolute site root stays in place.
    $$('a[href^="http"]').forEach(a => {
      const sameHost = a.hostname === location.hostname;
      if (sameHost && a.pathname.replace(/\/$/, '') === '') return;
      a.target = '_blank'; a.rel = 'noopener';
      if (!sameHost && !a.querySelector('svg')) a.classList.add('ext');
    });
    const burger = $('#burger'), nav = $('#nav');
    if (burger && nav) {
      burger.setAttribute('aria-controls', 'nav');
      const setOpen = (open, refocus) => {
        nav.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', String(open));
        if (!open && refocus) burger.focus();
      };
      burger.addEventListener('click', () => {
        const open = !nav.classList.contains('open');
        // Both calls to action are hidden from the bar on phones, so the open menu carries them.
        if (open && !nav.querySelector('.m-cta')) $$('.top-cta a.btn').forEach(cta => { const a = cta.cloneNode(true); a.className = (cta.classList.contains('ghost') ? 'btn ghost' : 'btn') + ' sm m-cta'; nav.append(a); });
        setOpen(open, false);
      });
      // Audit 08.11 (M5): Escape closes and returns focus; Tab past the menu closes it instead of moving under it.
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false, true); });
      // The menu precedes the burger in the DOM, so Tab from the open burger would skip it; send it into the menu.
      burger.addEventListener('keydown', e => { if (e.key === 'Tab' && !e.shiftKey && nav.classList.contains('open')) { const first = nav.querySelector('a'); if (first) { e.preventDefault(); first.focus(); } } });
      nav.addEventListener('focusout', e => { if (nav.classList.contains('open') && e.relatedTarget && !nav.contains(e.relatedTarget) && e.relatedTarget !== burger) setOpen(false, false); });
      document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) setOpen(false, false); });
      nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false, false); });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  {
    const items = $$('[data-reveal]');
    if (reduced || !('IntersectionObserver' in window)) items.forEach(el => el.classList.add('in'));
    else {
      const groups = new Map();
      items.forEach(el => { const p = el.parentElement; const n = groups.get(p) || 0; groups.set(p, n + 1); el.style.transitionDelay = `${Math.min(n, 8) * 70}ms`; });
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
      items.forEach(el => io.observe(el));
    }
  }

  /* ---------- Count-up numbers ---------- */
  function countUp(el, dur = 1200) {
    const to = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduced) { el.textContent = pre + to + suf; return; }
    const t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / dur); const e = 1 - Math.pow(1 - k, 3); el.textContent = pre + Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  {
    const nums = $$('.num[data-count]').filter(el => !el.closest('#feed') && !el.closest('#stats'));
    if (nums.length) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target, 1400); io.unobserve(e.target); } }), { threshold: 0.5 });
      nums.forEach(el => io.observe(el));
    }
  }

  /* ---------- Word split for display type ---------- */
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => { const s = document.createElement('span'); s.className = 'w'; s.textContent = w; el.append(s); if (i < words.length - 1) el.append(' '); });
    return [...el.querySelectorAll('.w')];
  }

  /* ---------- Home hero: network canvas and entrance ---------- */
  const hero = $('#hero'), canvas = $('#net');
  if (hero && canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, pts = [], mouse = { x: -1e4, y: -1e4 }, running = true, last = 0, idleT = performance.now();
    function resize() {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(40, Math.min(80, Math.round(W * H / 16000)));
      pts = Array.from({ length: n }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * 14, vy: (Math.random() - .5) * 14, r: 1.2 + Math.random() * 1.6, red: i % 23 === 0 }));
    }
    function frame(now) {
      if (!running) return;
      // The network settles after 12 s without a pointer; it wakes on the next move.
      if (!reduced && now - idleT > 12000) { running = false; return; }
      const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
      ctx.clearRect(0, 0, W, H);
      const L = 130;
      if (!reduced) for (const p of pts) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        if (dx * dx + dy * dy < 220 * 220) { p.vx += dx / 2200; p.vy += dy / 2200; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .995; p.vy *= .995;
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < L) { const al = (1 - d / L) * .32; ctx.strokeStyle = (a.red || b.red) ? `rgba(255,59,92,${al})` : `rgba(23,241,215,${al})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      for (const p of pts) { ctx.fillStyle = p.red ? 'rgba(255,59,92,.9)' : 'rgba(23,241,215,.85)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
      if (!reduced) requestAnimationFrame(frame);
    }
    resize();
    addEventListener('resize', () => { resize(); if (reduced) frame(0); });
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; idleT = performance.now(); if (!running) { running = true; last = idleT; requestAnimationFrame(frame); } });
    hero.addEventListener('pointerleave', () => { mouse.x = -1e4; mouse.y = -1e4; });
    new IntersectionObserver(es => { const vis = es[0].isIntersecting; if (vis && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); } if (!vis) running = false; }).observe(hero);
    requestAnimationFrame(frame);

    const h1 = $('#h1');
    if (hasGsap && !reduced && h1) {
      const words = splitWords(h1);
      gsap.set('.hero .kicker, #lead, .hero-ctas, .stat', { autoAlpha: 0 });
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .to('.hero .kicker', { autoAlpha: 1, duration: .6 }, .2)
        .from(words, { y: 34, autoAlpha: 0, stagger: .05, duration: .7 }, .25)
        .to('#lead', { autoAlpha: 1, duration: .8 }, '-=.5')
        .to('.hero-ctas', { autoAlpha: 1, duration: .6 }, '-=.5')
        .fromTo('.stat', { y: 24 }, { autoAlpha: 1, y: 0, stagger: .1, duration: .7, onStart: () => $$('#stats .num').forEach(el => countUp(el, 1600)) }, '-=.3');
      const qx = gsap.quickTo('#heroGrid', 'x', { duration: .8, ease: 'power3' }), qy = gsap.quickTo('#heroGrid', 'y', { duration: .8, ease: 'power3' }), gx = gsap.quickTo('.hero .glow', 'x', { duration: 1.2, ease: 'power3' });
      hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5; qx(nx * 18); qy(ny * 12); gx(nx * 40); });
    } else {
      $$('#stats .num').forEach(el => countUp(el));
    }
  }

  /* ---------- Section headings: word reveal ---------- */
  if (hasGsap && !reduced) $$('h2[data-words]').forEach(h => {
    const words = splitWords(h);
    gsap.from(words, { y: 26, autoAlpha: 0, filter: 'blur(8px)', stagger: .045, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
  });

  /* ---------- Raw feed becomes decisions ---------- */
  const feed = $('#feed');
  if (feed) {
    const rows = $$('#feed .raw'), tags = $$('#feed .tag'), tiers = $$('#feed .tier');
    const finish = () => { rows.forEach(r => r.classList.toggle('drop', r.dataset.verdict === 'drop')); $$('#feed .num').forEach(el => countUp(el)); };
    if (!hasGsap || reduced) finish();
    else {
      gsap.set(tags, { autoAlpha: 0, scale: .6, transformOrigin: 'right center' });
      // #feedOut, the section's conclusion, is not animated: it came last, 3.5 s after the trigger, so a reader
      // scrolling on never saw it (audit 11.11).
      gsap.set(tiers, { autoAlpha: 0, y: 12 });
      gsap.timeline({ scrollTrigger: { trigger: '#feed', start: 'top 70%', once: true }, defaults: { ease: 'power3.out' } })
        .from(rows, { x: -26, autoAlpha: 0, stagger: .12, duration: .5 })
        .to(tags, { autoAlpha: 1, scale: 1, stagger: .14, duration: .45, ease: 'back.out(1.8)' }, '+=.3')
        .call(() => rows.forEach(r => { if (r.dataset.verdict === 'drop') r.classList.add('drop'); }), null, '-=.2')
        .to(tiers, { autoAlpha: 1, y: 0, stagger: .1, duration: .5, onStart: () => $$('#feed .num').forEach(el => countUp(el, 1000)) });
    }
  }

  /* ---------- /contact: the native Tilda form record moves into the request card (zb5fp) ---------- */
  const formSlot = $('#contact-form-slot');
  if (formSlot) {
    const moveForm = () => {
      const rec = [...document.querySelectorAll('.t-rec')].find(r => r.querySelector('form.t-form') && !formSlot.contains(r));
      if (rec) formSlot.append(rec);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', moveForm); else moveForm();
  }

  /* ---------- Reverse check graph: always on screen, a timed flow through the rounds ---------- */
  // Owner 11.11 (aop7z, variant 6 «Поток», phones and desktop): every node and edge is drawn from the
  // start in shadow, dashes run along the edges, and a timed cycle lights the steps one after another.
  // Scroll drove it before: on a phone the rounds sit on rows 1/3/6/9, 4/5, 2/7, 8/10 of the tree, so
  // the top left the screen before the bottom was drawn. The cycle stands still off screen and under
  // the pause button (WCAG 2.2.2, motion past 5 s); reduced motion gets the finished graph, still.
  const rvSvg = $('#rvSvg');
  if (rvSvg) {
    const NS = 'http://www.w3.org/2000/svg';
    const svgEl = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; };
    const ru = document.documentElement.lang === 'ru';
    // The right column is 276 wide: john.d@old-aceme.example filled 236 edge to edge, the Russian label overflowed it.
    const RV = {
      src:    { x: 126, y: 290, w: 226, h: 84, k: 'src', l: 'Corporate account', s: 'login, password, sign-in site' },
      login:  { x: 392, y: 110, w: 244, h: 56, k: 'id', l: 'John.D', s: 'login from the breach' },
      mailp:  { x: 392, y: 220, w: 244, h: 56, k: 'id', l: 'john.d@', s: 'mailbox name before @' },
      pass:   { x: 392, y: 330, w: 244, h: 56, k: 'id', l: 'SecretJohn1986!', s: 'password: name + year + symbol' },
      dom:    { x: 392, y: 440, w: 244, h: 56, k: 'id', l: 'secretadminpanel.example', s: 'unique domain' },
      mail:   { x: 775, y: 60,  w: 276, h: 52, k: 'acc', l: 'john.d@mail.example', s: 'personal mailbox' },
      old:    { x: 775, y: 140, w: 276, h: 52, k: 'acc', l: 'john.d@old-aceme.example', s: 'previous employer' },
      nick:   { x: 775, y: 220, w: 276, h: 52, k: 'acc', l: 'john_d87', s: 'username, same rule' },
      shop:   { x: 775, y: 300, w: 276, h: 52, k: 'acc', l: 'shop-partner.example', s: 'same password, work email' },
      admin:  { x: 775, y: 380, w: 276, h: 52, k: 'bad', l: 'admin.aceme.example', s: 'admin login without email' },
      portal: { x: 560, y: 510, w: 236, h: 52, k: 'bad', l: 'portal.aceme.example', s: 'corporate portal' },
    };
    // Russian edition: the graph labels follow the page language; coordinates and logic stay shared.
    if (ru) {
      const RU = { src: ['Корпоративная учётка', 'логин, пароль, сайт входа'], login: ['Иванов.П', 'логин из утечки'], mailp: ['ivanov.p@', 'имя ящика до @'], pass: ['СекретИван1986!', 'пароль: имя + год + символ'], dom: ['skrytaya-panel.example', 'уникальный домен'], mail: ['ivanov.p@mail.example', 'личная почта'], old: ['ivanov.p@old-aceme.example', 'прошлое место работы'], nick: ['ivanov_p87', 'никнейм, та же схема'], shop: ['shop-partner.example', 'тот же пароль, рабочая почта'], admin: ['admin.aceme.example', 'логин admin без e-mail'], portal: ['portal.aceme.example', 'корпоративный портал'] };
      for (const k in RU) { RV[k].l = RU[k][0]; RV[k].s = RU[k][1]; }
    }
    // Phones (owner 09.11): an indented tree, one node per row: [depth, row]. The edge runs down a spine
    // at the parent's left and turns into the child, so the graph reads top to bottom.
    const vertical = matchMedia('(max-width: 640px)').matches;
    const TREE = { src: [0, 0], login: [1, 1], nick: [2, 2], mailp: [1, 3], mail: [2, 4], old: [2, 5], pass: [1, 6], shop: [2, 7], portal: [3, 8], dom: [1, 9], admin: [2, 10] };
    const VW = 340, INDENT = 18, ROW = 62, NODE_H = 50, PAD = 4;
    if (vertical) {
      for (const id in TREE) {
        const [depth, row] = TREE[id], left = PAD + depth * INDENT;
        Object.assign(RV[id], { w: VW - PAD - left, h: NODE_H, x: (left + VW - PAD) / 2, y: NODE_H / 2 + PAD + row * ROW });
      }
      rvSvg.setAttribute('viewBox', `0 0 ${VW} ${NODE_H + 2 * PAD + 10 * ROW}`);
      rvSvg.classList.add('rv-v');
    }
    const treeEdge = (a, b) => {
      const x = a.x - a.w / 2 + INDENT / 2, y = b.y, r = 6;
      return `M${x} ${a.y + a.h / 2} L${x} ${y - r} Q${x} ${y} ${x + r} ${y} L${b.x - b.w / 2} ${y}`;
    };
    const ends = (a, b) => b.x > a.x ? [[a.x + a.w / 2, a.y], [b.x - b.w / 2, b.y]] : [[a.x - a.w / 2, a.y], [b.x + b.w / 2, b.y]];
    const edgePath = e => {
      const a = RV[e[0]], b = RV[e[1]];
      if (vertical) return treeEdge(a, b);
      // admin sits between shop and portal: the side-to-side curve crossed its box (34 of 201 sample points).
      if (e[0] === 'shop' && e[1] === 'portal') return 'M775 326 Q758 460 678 510';
      const [[x1, y1], [x2, y2]] = ends(a, b), mx = (x1 + x2) / 2;
      return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
    };
    const CHIP = ru ? { portal: '2FA', other: 'закрыто' } : { portal: '2FA on', other: 'fixed' };
    // [from, to, kind, step]: step 0 takes the record's four identifiers out, steps 1-3 are the rounds,
    // step 4 (the captions' fifth) gives every risky link its fix.
    const EDGES = [
      ['src', 'login', 'id', 0], ['src', 'mailp', 'id', 0], ['src', 'pass', 'id', 0], ['src', 'dom', 'id', 0],
      ['mailp', 'mail', 'acc', 1], ['mailp', 'old', 'acc', 1],
      ['login', 'nick', 'acc', 2], ['pass', 'shop', 'acc', 2],
      ['dom', 'admin', 'bad', 3], ['shop', 'portal', 'bad', 3],
    ];
    const FIXED = ['shop', 'admin', 'portal'];
    const gE = rvSvg.querySelector('#rvEdges'), gN = rvSvg.querySelector('#rvNodes'), gM = rvSvg.querySelector('#rvMarks');
    const defs = rvSvg.querySelector('defs') || svgEl('defs', {}, rvSvg);
    const halo = svgEl('radialGradient', { id: 'rvHalo' }, defs);
    svgEl('stop', { offset: 0, 'stop-color': '#f2fffd' }, halo);
    svgEl('stop', { offset: .35, 'stop-color': '#17F1D7', 'stop-opacity': .55 }, halo);
    svgEl('stop', { offset: 1, 'stop-color': '#17F1D7', 'stop-opacity': 0 }, halo);
    // One record per edge: the shadowed path, the lit path over it, its particle; `start` is set below.
    const edges = EDGES.map(e => {
      const d = edgePath(e), k = e[0] + '-' + e[1];
      const base = svgEl('path', { d, class: 'rv-e ' + e[2], 'data-edge': k }, gE);
      const lit = svgEl('path', { d, class: 'rv-l ' + e[2] }, gE);
      const dot = svgEl('g', { class: 'rv-dot', opacity: 0 }, gM);
      svgEl('circle', { r: 10, fill: 'url(#rvHalo)' }, dot);
      svgEl('circle', { r: 2.8, class: 'rv-core' }, dot);
      return { k, to: e[1], step: e[3], base, lit, dot, len: base.getTotalLength(), start: 0 };
    });
    const cutEdge = edges.find(e => e.k === 'pass-shop');
    // A node in shadow, its lit frame, its fixed frame, and its labels twice: the shadowed copy stays
    // readable underneath (--muted-2 on the node fill is 5.26:1), the lit copy fades in over it.
    const nodes = {};
    for (const id in RV) {
      const n = RV[id], box = { x: n.x - n.w / 2, y: n.y - n.h / 2, width: n.w, height: n.h, rx: 14 };
      const g = svgEl('g', { class: 'rv-n', 'data-id': id }, gN);
      svgEl('rect', { ...box, class: 'rv-nd ' + n.k }, g);
      const litFrame = svgEl('rect', { ...box, class: 'rv-nr ' + n.k }, g);
      const fixFrame = svgEl('rect', { ...box, class: 'rv-nx' }, g);
      const text = (cls, dy, s) => { const t = svgEl('text', { class: cls, x: n.x, y: n.y + dy, 'text-anchor': 'middle' }, g); t.textContent = s; return t; };
      text('rv-tl dim', -3, n.l); const tl = text('rv-tl lit', -3, n.l);
      text('rv-ts dim', 16, n.s); const ts = text('rv-ts lit', 16, n.s);
      nodes[id] = { litFrame, fixFrame, tl, ts, cues: [] };
    }
    const chips = FIXED.map(id => {
      const n = RV[id];
      const g = svgEl('g', { class: 'rv-chip', opacity: 0, transform: `translate(${n.x + n.w / 2 - 10} ${n.y - n.h / 2 - (vertical ? 0 : 6)})` }, gM);
      svgEl('rect', { x: -58, y: -10, width: 60, height: 20, rx: 10 }, g);
      svgEl('text', { x: -28, y: 4, 'text-anchor': 'middle' }, g).textContent = id === 'portal' ? CHIP.portal : CHIP.other;
      return g;
    });
    const cutPt = cutEdge.base.getPointAtLength(cutEdge.len * .5);
    const cut = svgEl('g', { class: 'rv-cut', opacity: 0, transform: `translate(${cutPt.x} ${cutPt.y})` }, gM);
    svgEl('line', { x1: -7, y1: -7, x2: 7, y2: 7 }, cut); svgEl('line', { x1: 7, y1: -7, x2: -7, y2: 7 }, cut);

    // One cycle, in seconds: a step's edges start GAP apart, a particle runs each in RUN and the node it
    // reaches lights on arrival; then the fixes CHIP_GAP apart, a hold, a fade back to shadow and a rest.
    const RUN = .85, GAP = .22, HOLD = .55, CHIP_GAP = .25, CHIP_IN = .3, LAST_HOLD = 1.6, FADE = .9, REST = .7;
    const capAt = [];
    nodes.src.cues.push({ start: .1 });
    let at = .6;
    for (let step = 0; step < 4; step++) {
      const es = edges.filter(e => e.step === step);
      capAt.push(at);
      es.forEach((e, j) => { e.start = at + j * GAP; nodes[e.to].cues.push({ start: e.start + RUN * .8 }); });
      at += (es.length - 1) * GAP + RUN + HOLD;
    }
    capAt.push(at);
    const cutOn = at, chipOn = FIXED.map((_, j) => at + CHIP_GAP + j * CHIP_GAP);
    FIXED.forEach((id, j) => nodes[id].cues.push({ start: chipOn[j], fix: true }));
    const fadeAt = at + CHIP_GAP + FIXED.length * CHIP_GAP + CHIP_IN + LAST_HOLD, CYCLE = fadeAt + FADE + REST;

    const clamp = v => Math.min(1, Math.max(0, v));
    const ease = p => p < .5 ? 2 * p * p : 1 - (2 - 2 * p) ** 2 / 2;
    const caps = $$('#caps .cap');
    let capOn = null;
    const draw = (t, clock) => {
      const ramp = (start, dur) => clamp((t - start) / dur);
      const f = clamp(1 - (t - fadeAt) / FADE), c = ramp(cutOn, .4) * f;
      // Offsets wrap at 11, the period of stroke-dasharray 2 9 on .rv-e/.rv-l in site.css and, by hand, in
      // site.tilda.css (the copy the live pages load): change all three together.
      const drift = -(clock * 9 % 11), rush = -(clock * 28 % 11);
      for (const e of edges) {
        e.base.style.strokeDashoffset = drift;
        e.lit.style.opacity = ease(ramp(e.start, .6)) * f * (e === cutEdge ? 1 - .7 * c : 1);
        e.lit.style.strokeDashoffset = rush;
        const raw = (t - e.start) / RUN;
        if (raw > 0 && raw < 1) {
          const pt = e.base.getPointAtLength(e.len * ease(raw));
          e.dot.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
          e.dot.setAttribute('opacity', Math.min(1, raw * 8, (1 - raw) * 8).toFixed(2));
        } else e.dot.setAttribute('opacity', 0);
      }
      for (const id in nodes) {
        const n = nodes[id]; let litLevel = 0, fixLevel = 0;
        for (const q of n.cues) { const a = ramp(q.start, .35) * f; if (q.fix) fixLevel = Math.max(fixLevel, a); else litLevel = Math.max(litLevel, a); }
        n.litFrame.style.opacity = litLevel * (1 - fixLevel); n.fixFrame.style.opacity = fixLevel;
        n.tl.style.opacity = n.ts.style.opacity = Math.max(litLevel, fixLevel);
      }
      chips.forEach((g, j) => g.setAttribute('opacity', (ramp(chipOn[j], CHIP_IN) * f).toFixed(2)));
      cut.setAttribute('opacity', c.toFixed(2));
      // The first caption leads the rest as well: the graph is back in shadow and the record comes next.
      let cap = 0;
      if (t < fadeAt) capAt.forEach((s, i) => { if (t >= s) cap = i; });
      if (cap !== capOn) { capOn = cap; caps.forEach((el, i) => el.classList.toggle('on', i === cap)); }
    };

    if (reduced) {
      rvSvg.classList.add('rv-still');
      draw(fadeAt - .01, 0);
      caps.forEach(c => c.classList.add('on'));
    } else {
      const L = ru ? { pause: 'Остановить анимацию', play: 'Запустить анимацию' } : { pause: 'Pause animation', play: 'Play animation' };
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'rv-pause';
      (rvSvg.closest('.rv-stage') || rvSvg.parentNode).prepend(btn);
      const canObserve = 'IntersectionObserver' in window;
      let t = 0, clock = 0, last = 0, raf = 0, paused = false, onScreen = !canObserve;
      const label = () => { btn.textContent = paused ? L.play : L.pause; };
      const frame = now => {
        const dt = Math.min(.1, (now - last) / 1000); last = now;
        t = (t + dt) % CYCLE; clock += dt; draw(t, clock);
        raf = requestAnimationFrame(frame);
      };
      const run = () => { if (!raf && onScreen && !paused) { last = performance.now(); raf = requestAnimationFrame(frame); } };
      const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
      btn.addEventListener('click', () => { paused = !paused; label(); if (paused) stop(); else run(); });
      // The last queued entry is the current state when several arrive in one callback.
      if (canObserve) new IntersectionObserver(entries => { onScreen = entries[entries.length - 1].isIntersecting; if (onScreen) run(); else stop(); }).observe(rvSvg);
      label(); draw(0, 0); run();
    }
  }

  /* ---------- Process line, bento, rows, generic GSAP reveals ---------- */
  if (hasGsap && !reduced) {
    if ($('#procLine')) {
      gsap.fromTo('#procLine', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 70%', end: 'bottom 55%', scrub: 1 } });
      gsap.from('#steps .step', { autoAlpha: 0, y: 14, stagger: .12, duration: .6, ease: 'power2.out', scrollTrigger: { trigger: '#steps', start: 'top 80%', once: true } });
    }
    if ($('#bento')) gsap.from('#bento .tile', { y: 34, autoAlpha: 0, stagger: .09, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '#bento', start: 'top 78%', once: true } });
    if ($('#rows')) gsap.from('#rows .row', { x: -22, autoAlpha: 0, stagger: .08, duration: .6, ease: 'power3.out', scrollTrigger: { trigger: '#rows', start: 'top 80%', once: true } });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ---------- Request form: composes an e-mail until a backend is connected ---------- */
  $$('form[data-mail]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(f);
    const lines = [...d.entries()].filter(([, v]) => String(v).trim()).map(([k, v]) => `${k}: ${v}`);
    const subject = encodeURIComponent(f.dataset.subject || 'Request from hirdman.pro');
    const body = encodeURIComponent(lines.join('\n'));
    location.href = `mailto:${f.dataset.mail}?subject=${subject}&body=${body}`;
    f.classList.add('sent');
    // A mail handler may be missing on a locked-down workstation: keep the plain address in view.
    setTimeout(() => { if (document.hasFocus()) f.classList.add('failed'); }, 2500);
  }));
})();

// Home page: the top-bar primary CTA repeats the hero CTA, so it appears only after the hero is scrolled past
(() => {
  const hero = document.querySelector('#hero .hero-ctas') || document.querySelector('#hero'), top = document.querySelector('#top');
  if (!hero || !top || !('IntersectionObserver' in window)) return;
  top.classList.add('has-hero');
  // watches the hero buttons themselves: the duplicate is hidden only while they are on screen
  new IntersectionObserver(([e]) => top.classList.toggle('past-hero', !e.isIntersecting), { rootMargin: '-72px 0px 0px 0px', threshold: 0 }).observe(hero);
})();

// A link to a FAQ answer (home stat -> /how-it-works#raw-records) lands on a closed <details>: open the one the
// hash names. Runs again on load, because Tilda may still be laying out the page when this script first runs.
(() => {
  const openNamed = () => {
    const el = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el && el.tagName === 'DETAILS') el.open = true;
  };
  openNamed();
  window.addEventListener('load', openNamed);
  window.addEventListener('hashchange', openNamed);
})();

// Links to the previous hirdman.pro (social posts, emails) point at its section anchors; send them to the matching new page
(() => {
  const OLD_ANCHORS = {
    rec1001301481: '/about',           // Introducing
    rec1022963401: '/how-it-works',    // How Hirdman Works
    rec1001267276: '/integrations',    // API Integration
    rec1246570471: '/services',        // Security Intelligence
    rec997967251: '/contact',          // Request a Free Check
    zeropopup: '/cases', zeropopup2: '/cases', zeropopup3: '/cases'
  };
  const to = OLD_ANCHORS[location.hash.slice(1)];
  if (!to) return;
  if (to.charAt(0) !== '#') { location.replace(to); return; }
  const el = document.querySelector(to);
  if (el) { history.replaceState(null, '', to); el.scrollIntoView(); }
})();

// Home page: the in-house triage calculator (ideas 09.11, 06), adapted from domain-scanner web2/js/calc.js.
// Every record takes the average minutes; infostealer records take the session test on top. The page renders
// the default example (1,000 records); this only follows the sliders. Nothing leaves the browser.
(() => {
  const card = document.querySelector('#triage-cost .calc');
  if (!card) return;
  const RATES = { USD: { min: 20, max: 200, step: 5, value: 95 }, EUR: { min: 20, max: 160, step: 5, value: 55 } };
  const RATE_SOURCE = {
    USD: 'Default: US median wage for information security analysts, $62/h (BLS, May 2025, the latest release), plus 3.1% wage growth to June 2026 and benefits and taxes (wages are 68.5% of employer cost, BLS, June 2026).',
    EUR: 'Default: a rough estimate. EU analyst base pay of about €36–42/h (recruiter benchmarks, 2025–26), plus employer costs.',
  };
  const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
  const money = (v, cur) => new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format(v);
  // rounded so a figure never reads as a quote
  const approx = (v, cur) => {
    if (!v) return money(0, cur);
    let unit = 10;
    if (v >= 100000) unit = 1000;
    else if (v >= 1000) unit = 100;
    return '≈ ' + money(Math.round(v / unit) * unit, cur);
  };
  const duration = m => {
    if (m < 60) return m + ' min';
    const hours = Math.floor(m / 60) + ' h';
    return m % 60 ? hours + ' ' + (m % 60) + ' min' : hours;
  };
  const input = n => card.querySelector(`input[name="${n}"]`);
  const out = n => card.querySelector(`[data-out="${n}"]`);
  const figs = [...card.querySelectorAll('.calc-fig-v')];
  const src = card.querySelector('.calc-src');
  const curBtns = [...card.querySelectorAll('.calc-cur button')];
  let cur = 'USD', touched = false;
  const paint = (el, shown, spoken) => {
    out(el.name).textContent = shown;
    el.setAttribute('aria-valuetext', spoken);
    el.style.setProperty('--fill', Math.round((el.value - el.min) / (el.max - el.min) * 1000) / 10 + '%');
  };
  function update() {
    const records = +input('records').value;
    const share = +input('stealers').value;
    const average = +input('average').value;
    const extra = +input('extra').value;
    const rate = +input('rate').value;
    const stealers = Math.round(records * share / 100);
    const hours = (records * average + stealers * extra) / 60;
    paint(input('records'), nf.format(records), nf.format(records) + ' records');
    paint(input('stealers'), share + '%', share + ' percent');
    paint(input('average'), duration(average), average + ' minutes');
    paint(input('extra'), duration(extra), extra + ' minutes');
    paint(input('rate'), money(rate, cur) + ' / h', money(rate, cur) + ' per hour');
    figs[0].textContent = nf.format(Math.round(hours));
    figs[1].textContent = nf.format(Math.round(hours * 10 / 40) / 10);
    figs[2].textContent = approx(Math.round(hours * rate), cur);
    figs[3].textContent = duration(average);
    // at a 0% share the session test multiplies by zero records; say so instead of looking broken
    input('extra').closest('.calc-field').classList.toggle('is-idle', share === 0);
    src.textContent = RATE_SOURCE[cur];
    curBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cur === cur)));
  }
  const engaged = () => {
    if (touched) return;
    touched = true;
    (window.dataLayer = window.dataLayer || []).push({ event: 'hm_calc', hm_location: 'triage-cost' });
  };
  card.addEventListener('input', e => { if (e.target.matches('.calc-range')) { update(); engaged(); } });
  curBtns.forEach(b => b.addEventListener('click', () => {
    cur = b.dataset.cur;
    const r = RATES[cur], el = input('rate');
    Object.assign(el, { min: r.min, max: r.max, step: r.step });
    el.value = r.value;
    update(); engaged();
  }));
  update();
})();

// Funnel events for GTM (ideas 09.11, 19): pushed to dataLayer only. GTM-5ZT423G9 picks them up; since 10.11 it is a
// Tilda cookie-type script in the project HEAD, so nothing leaves the page before consent. hm_cta: a click on a call to action, with where it sits and where it leads.
// hm_form_start / hm_form_submit: the Tilda free-check form. hm_scroll: 50 and 90 percent of a page.
(() => {
  const dl = () => (window.dataLayer = window.dataLayer || []);
  const CTA = /(^|\/)contact(\.html)?(#|$)|^#contact$|^mailto:|scan\.hirdman\.pro|demo\.hirdman\.pro|\/tools\/|^tools\//;
  const where = el => {
    if (el.closest('header')) return 'header';
    if (el.closest('footer')) return 'footer';
    if (el.closest('.trust')) return 'trust';
    const sec = el.closest('section[id]');
    if (sec) return sec.id;
    const section = el.closest('section');
    const h = section && section.querySelector('h1, h2');
    return h ? h.textContent.trim().slice(0, 40) : 'page';
  };
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!CTA.test(href)) return;
    const target = href.startsWith('mailto:') ? 'mailto' : href.replace(/^https?:\/\//, '').split('?')[0];
    dl().push({ event: 'hm_cta', hm_location: where(a), hm_target: target, hm_label: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 60) });
  }, true);

  let started = false, sent = false;
  document.addEventListener('focusin', e => {
    if (started || !e.target.closest || !e.target.closest('form.t-form')) return;
    started = true;
    dl().push({ event: 'hm_form_start', hm_form: 'free_check' });
  });
  // Tilda shows .js-successbox after a successful send; its own event name differs between versions
  const submitted = () => { if (sent) return; sent = true; dl().push({ event: 'hm_form_submit', hm_form: 'free_check' }); };
  document.addEventListener('tildaform:aftersuccess', submitted, true);
  if ('MutationObserver' in window) {
    const watch = () => document.querySelectorAll('form.t-form .js-successbox').forEach(box => {
      const shown = () => { if (box.offsetParent !== null && box.textContent.trim()) submitted(); };
      new MutationObserver(shown).observe(box, { attributes: true, attributeFilter: ['style', 'class'] });
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch);
    else watch();
  }

  const marks = [50, 90], seen = new Set();
  addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (h <= 0) return;
    const p = scrollY / h * 100;
    for (const m of marks) {
      if (p < m || seen.has(m)) continue;
      seen.add(m);
      dl().push({ event: 'hm_scroll', hm_depth: m });
    }
  }, { passive: true });
})();
