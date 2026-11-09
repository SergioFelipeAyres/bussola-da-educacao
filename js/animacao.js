/*
 * Animações do painel.
 * 1. Entrada ao rolar: cartões e blocos ganham .tg-reveal e, ao entrar na tela, .tg-in.
 *    As animações dos gráficos (CSS) só rodam dentro de .tg-in, então acontecem quando o leitor vê.
 * 2. Números contando: 0 → valor ao aparecer; valor antigo → novo quando o filtro muda.
 * 3. Linhas de gráfico recebem --i (posição) para entrarem uma depois da outra.
 * Nada disso roda com "reduzir movimento" ativado no sistema.
 */
(() => {
  if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const root = document.getElementById('painel');
  const REVEAL = '.tg-hero > *, .tg-fact, .tg-home-stats,.tg-feature, .tg-kpi, .tg-card, .tg-sec-head, .tg-cite, .tg-filter';
  const NUMS = '.tg-home-num, .tg-kpi-num,.tg-val, .tg-stack-legend b, .tg-dot-val b';
  const ROWS = '.tg-bar-row, .tg-dot-row, .tg-lik-row, .tg-isorow, .tg-stack-legend > div, .tg-stack > div';
  const DUR = 900;

  // ---------- números ----------
  const RE = /^(\D*?)(\d{1,3}(?:\.\d{3})*(?:,\d+)?|\d+(?:,\d+)?)(.*)$/s;
  const parse = (txt) => {
    const m = RE.exec(txt.trim()); if (!m) return null;
    const dec = (m[2].split(',')[1] || '').length;
    return { pre: m[1], val: Number(m[2].replace(/\./g, '').replace(',', '.')), dec, suf: m[3] };
  };
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const count = (el, from, delay = 0) => {
    const p = parse(el.__final || el.textContent); if (!p) return;
    el.__final = el.__final || el.textContent;
    const nf = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec });
    const id = (el.__run || 0) + 1; el.__run = id;
    const t0 = performance.now() + delay;
    const step = (now) => {
      if (el.__run !== id) return;
      const t = Math.max(0, Math.min(1, (now - t0) / DUR));
      el.__last = t >= 1 ? el.__final : p.pre + nf.format(from + (p.val - from) * ease(t)) + p.suf;
      el.textContent = el.__last;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // garantia: se o navegador pausar os quadros (aba em segundo plano), o valor final aparece mesmo assim
    setTimeout(() => { if (el.__run === id && el.textContent !== el.__final) { el.__last = el.__final; el.textContent = el.__final; } }, delay + DUR + 300);
  };
  const countIn = (scope, delay) => {
    const list = scope.matches && scope.matches(NUMS) ? [scope] : [...scope.querySelectorAll(NUMS)];
    list.forEach((el) => { if (parse(el.textContent)) count(el, 0, delay); });
  };

  // ---------- posição das linhas (--i) ----------
  const index = (scope) => {
    const els = scope.matches && scope.matches(ROWS) ? [scope] : [...scope.querySelectorAll(ROWS)];
    els.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => c.matches(ROWS));
      el.style.setProperty('--i', Math.min(sibs.indexOf(el), 12));
    });
  };

  // ---------- entrada ao rolar ----------
  const io = new IntersectionObserver((entries) => {
    let n = 0;
    for (const e of entries) {
      const el = e.target;
      if (e.isIntersecting) {
        if (el.classList.contains('tg-in')) continue;
        const d = Math.min(n++, 5) * 80;
        el.style.setProperty('--d', d + 'ms');
        el.classList.add('tg-in');
        countIn(el, d + 150);
      } else if (!el.offsetParent) {
        // a tela foi trocada: anima de novo quando voltar
        el.classList.remove('tg-in');
      }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  const watch = (scope) => scope.querySelectorAll(REVEAL).forEach((el) => {
    if (el.closest('.tg-shot') || el.__watched) return;
    el.__watched = true; el.classList.add('tg-reveal'); io.observe(el);
  });
  index(root); watch(root);

  // ---------- redesenhos (filtro, aba) ----------
  const inRevealed = (node) => { const r = node.closest && node.closest('.tg-reveal'); return !r || r.classList.contains('tg-in'); };
  new MutationObserver((muts) => {
    for (const m of muts) {
      const t = m.target.nodeType === 3 ? m.target.parentElement : m.target;
      if (!t || t.closest('.tg-shot')) continue;
      // número reescrito pelo painel (ex.: KPI ao trocar o recorte)
      const num = t.closest(NUMS);
      if (num) {
        const txt = num.textContent;
        if (txt === num.__last || txt === num.__final) continue;
        const old = num.__final ? parse(num.__final) : null;
        num.__final = txt; num.__last = null;
        if (inRevealed(num) && parse(txt)) count(num, old ? old.val : 0);
        continue;
      }
      for (const a of m.addedNodes) {
        if (a.nodeType !== 1) continue;
        index(a);
        if (inRevealed(a)) a.querySelectorAll(NUMS).forEach((el) => { if (parse(el.textContent)) count(el, 0, 150); });
      }
    }
  }).observe(root, { childList: true, subtree: true, characterData: true });
})();
