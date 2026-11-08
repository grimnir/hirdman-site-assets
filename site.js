/* Hirdman site behaviour. Every block is guarded by the presence of its markup, so one file serves every page. */
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
    if (burger && nav) burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      // The primary call to action is hidden from the bar on phones, so the open menu carries it.
      if (open && !nav.querySelector('.m-cta')) { const cta = document.querySelector('.top-cta a.btn:not(.ghost)'); if (cta) { const a = cta.cloneNode(true); a.className = 'btn sm m-cta'; nav.append(a); } }
    });
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
      gsap.set(tiers, { autoAlpha: 0, y: 12 });
      gsap.set('#feedOut', { autoAlpha: 0 });
      gsap.timeline({ scrollTrigger: { trigger: '#feed', start: 'top 70%', once: true }, defaults: { ease: 'power3.out' } })
        .from(rows, { x: -26, autoAlpha: 0, stagger: .12, duration: .5 })
        .to(tags, { autoAlpha: 1, scale: 1, stagger: .14, duration: .45, ease: 'back.out(1.8)' }, '+=.3')
        .call(() => rows.forEach(r => { if (r.dataset.verdict === 'drop') r.classList.add('drop'); }), null, '-=.2')
        .to(tiers, { autoAlpha: 1, y: 0, stagger: .1, duration: .5, onStart: () => $$('#feed .num').forEach(el => countUp(el, 1000)) })
        .to('#feedOut', { autoAlpha: 1, duration: .6 });
    }
  }

  /* ---------- Reverse check graph: data-driven SVG, scroll-driven rounds ---------- */
  const rvSvg = $('#rvSvg');
  if (rvSvg) {
    const NS = 'http://www.w3.org/2000/svg';
    const svgEl = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; };
    const RV = {
      src:    { x: 126, y: 290, w: 226, h: 84, k: 'src', l: 'Corporate account', s: 'login, password, sign-in site' },
      login:  { x: 392, y: 110, w: 244, h: 56, k: 'id', l: 'John.D', s: 'login from the breach' },
      mailp:  { x: 392, y: 220, w: 244, h: 56, k: 'id', l: 'john.d@', s: 'mailbox name before @' },
      pass:   { x: 392, y: 330, w: 244, h: 56, k: 'id', l: 'SecretJohn1986!', s: 'password: name + year + symbol' },
      dom:    { x: 392, y: 440, w: 244, h: 56, k: 'id', l: 'secretadminpanel.example', s: 'unique domain' },
      mail:   { x: 775, y: 60,  w: 236, h: 52, k: 'acc', l: 'john.d@mail.example', s: 'personal mailbox' },
      old:    { x: 775, y: 140, w: 236, h: 52, k: 'acc', l: 'john.d@old-aceme.example', s: 'previous employer' },
      nick:   { x: 775, y: 220, w: 236, h: 52, k: 'acc', l: 'john_d87', s: 'username, same rule' },
      shop:   { x: 775, y: 300, w: 236, h: 52, k: 'acc', l: 'shop-partner.example', s: 'same password, work e-mail' },
      admin:  { x: 775, y: 380, w: 236, h: 52, k: 'bad', l: 'admin.aceme.example', s: 'admin login without e-mail' },
      portal: { x: 560, y: 510, w: 236, h: 52, k: 'bad', l: 'portal.aceme.example', s: 'corporate portal' },
    };
    // Russian edition: the graph labels follow the page language; coordinates and logic stay shared.
    if (document.documentElement.lang === 'ru') {
      const RU = { src: ['Корпоративная учётка', 'логин, пароль, сайт входа'], login: ['Иванов.П', 'логин из утечки'], mailp: ['ivanov.p@', 'имя ящика до @'], pass: ['СекретИван1986!', 'пароль: имя + год + символ'], dom: ['skrytaya-panel.example', 'уникальный домен'], mail: ['ivanov.p@mail.example', 'личная почта'], old: ['ivanov.p@old-aceme.example', 'прошлое место работы'], nick: ['ivanov_p87', 'никнейм, та же схема'], shop: ['shop-partner.example', 'тот же пароль, рабочая почта'], admin: ['admin.aceme.example', 'логин admin без e-mail'], portal: ['portal.aceme.example', 'корпоративный портал'] };
      for (const k in RU) { RV[k].l = RU[k][0]; RV[k].s = RU[k][1]; }
    }
    const CHIP = document.documentElement.lang === 'ru' ? { portal: '2FA', other: 'закрыто' } : { portal: '2FA on', other: 'fixed' };
    const STEPS = [
      { nodes: ['src', 'login', 'mailp', 'pass', 'dom'], edges: [['src', 'login', 'id'], ['src', 'mailp', 'id'], ['src', 'pass', 'id'], ['src', 'dom', 'id']] },
      { nodes: ['mail', 'old'], edges: [['mailp', 'mail', 'acc'], ['mailp', 'old', 'acc']] },
      { nodes: ['nick', 'shop'], edges: [['login', 'nick', 'acc'], ['pass', 'shop', 'acc']] },
      { nodes: ['admin', 'portal'], edges: [['dom', 'admin', 'bad'], { from: 'shop', to: 'portal', k: 'bad', d: 'M775 326 Q758 460 678 510' }] },
      { nodes: [], edges: [], fix: ['shop', 'admin', 'portal'], cut: [['pass', 'shop']] },
    ];
    const gE = rvSvg.querySelector('#rvEdges'), gN = rvSvg.querySelector('#rvNodes'), gM = rvSvg.querySelector('#rvMarks');
    const ends = (a, b) => b.x > a.x ? [[a.x + a.w / 2, a.y], [b.x - b.w / 2, b.y]] : [[a.x - a.w / 2, a.y], [b.x + b.w / 2, b.y]];
    const edgeEls = [], nodeEls = {}, stepEls = [];
    STEPS.forEach(st => {
      const se = { edges: [], nodes: [], comets: [] };
      st.edges.forEach(e => {
        const from = Array.isArray(e) ? e[0] : e.from, to = Array.isArray(e) ? e[1] : e.to, k = Array.isArray(e) ? e[2] : e.k;
        let d = e.d;
        if (!d) { const [[x1, y1], [x2, y2]] = ends(RV[from], RV[to]); const mx = (x1 + x2) / 2; d = `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`; }
        const p = svgEl('path', { d, class: 'e ' + k, 'data-edge': from + '-' + to }, gE);
        se.edges.push(p); se.comets.push(svgEl('circle', { class: 'comet', r: 3.4, opacity: 0 }, gM)); edgeEls.push(p);
      });
      st.nodes.forEach(id => {
        const n = RV[id];
        const g = svgEl('g', { class: 'node', 'data-id': id }, gN);
        svgEl('rect', { class: 'nb ' + n.k, x: n.x - n.w / 2, y: n.y - n.h / 2, width: n.w, height: n.h, rx: 14 }, g);
        svgEl('text', { class: 'nl', x: n.x, y: n.y - 3, 'text-anchor': 'middle' }, g).textContent = n.l;
        svgEl('text', { class: 'ns', x: n.x, y: n.y + 16, 'text-anchor': 'middle' }, g).textContent = n.s;
        nodeEls[id] = g; se.nodes.push(g);
      });
      stepEls.push(se);
    });
    const fixMarks = STEPS[4].cut.map(([a, b]) => {
      const p = gE.querySelector(`[data-edge="${a}-${b}"]`);
      const pt = p.getPointAtLength(p.getTotalLength() * .5);
      const g = svgEl('g', { class: 'cutx', transform: `translate(${pt.x} ${pt.y})`, opacity: 0 }, gM);
      svgEl('line', { x1: -7, y1: -7, x2: 7, y2: 7 }, g); svgEl('line', { x1: 7, y1: -7, x2: -7, y2: 7 }, g);
      return { el: g, edge: p };
    });
    const chips = STEPS[4].fix.map(id => {
      const n = RV[id];
      const g = svgEl('g', { class: 'fixchip', transform: `translate(${n.x + n.w / 2 - 10} ${n.y - n.h / 2 - 6})`, opacity: 0 }, gM);
      svgEl('rect', { x: -58, y: -10, width: 60, height: 20, rx: 10 }, g);
      svgEl('text', { x: -28, y: 4, 'text-anchor': 'middle' }, g).textContent = id === 'portal' ? CHIP.portal : CHIP.other;
      return { el: g, node: nodeEls[id] };
    });
    const caps = $$('#caps .cap');
    const showFinal = () => {
      edgeEls.forEach(p => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = 0; });
      Object.values(nodeEls).forEach(g => { g.style.opacity = 1; g.style.transform = ''; });
      caps.forEach(c => c.classList.add('on'));
      fixMarks.forEach(m => { m.el.setAttribute('opacity', 1); m.edge.style.opacity = .25; });
      chips.forEach(c => { c.el.setAttribute('opacity', 1); c.node.querySelector('rect').setAttribute('stroke', '#43e39a'); });
    };
    if (!hasGsap || reduced) showFinal();
    else {
      edgeEls.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.dataset.len = L; });
      const build = pin => {
        gsap.set(Object.values(nodeEls), { autoAlpha: 0, scale: .6, transformOrigin: '50% 50%' });
        const section = rvSvg.closest('section');
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin
          ? { trigger: section, start: 'top top', end: '+=' + (section.dataset.pinEnd || 2800), pin: true, scrub: 1, anticipatePin: 1 }
          : { trigger: rvSvg, start: 'top 75%', end: 'bottom 45%', scrub: 1 } });
        stepEls.forEach((se, i) => {
          tl.addLabel('s' + i);
          tl.call(() => caps.forEach((c, k) => c.classList.toggle('on', k === i)));
          se.edges.forEach((p, k) => {
            const L = +p.dataset.len, comet = se.comets[k], pos = tl.duration(), o = { t: 0 };
            tl.to(p, { strokeDashoffset: 0, duration: 1 }, pos + k * .35);
            tl.to(o, { t: 1, duration: 1, onUpdate() { const pt = p.getPointAtLength(L * o.t); comet.setAttribute('cx', pt.x); comet.setAttribute('cy', pt.y); comet.setAttribute('opacity', o.t > 0 && o.t < 1 ? 1 : 0); } }, pos + k * .35);
          });
          if (se.nodes.length) tl.to(se.nodes, { autoAlpha: 1, scale: 1, duration: .6, stagger: .25, ease: 'back.out(1.7)' }, '<0.45');
          if (STEPS[i].fix) {
            fixMarks.forEach(m => { tl.to(m.edge, { opacity: .25, duration: .4 }); tl.to(m.el, { opacity: 1, duration: .3 }, '<'); });
            chips.forEach(c => { tl.to(c.node.querySelector('rect'), { stroke: '#43e39a', duration: .4 }, '<'); tl.to(c.el, { opacity: 1, duration: .3 }, '<0.1'); });
          }
          tl.to({}, { duration: .6 });
        });
      };
      gsap.matchMedia().add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, ctx => build(ctx.conditions.desktop));
    }
  }

  /* ---------- Process line, bento, rows, generic GSAP reveals ---------- */
  if (hasGsap && !reduced) {
    if ($('#procLine')) {
      gsap.fromTo('#procLine', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 70%', end: 'bottom 55%', scrub: 1 } });
      gsap.from('#steps .step', { autoAlpha: .18, y: 14, stagger: .12, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 72%', end: 'bottom 52%', scrub: 1 } });
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
