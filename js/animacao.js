/*
 * Animações do painel.
 * 1. Entrada ao rolar: cartões e blocos ganham .tg-reveal e, ao entrar na tela, .tg-in.
 *    As animações dos gráficos (CSS) só rodam dentro de .tg-in, então acontecem quando o leitor vê.
 * 2. Números dos destaques contando do valor antigo ao novo quando o filtro muda. Na chegada, o número já
 *    aparece no valor final: um print ou um link compartilhado nunca mostra um número no meio da contagem.
 * 3. Linhas de gráfico recebem --i (posição) para entrarem uma depois da outra.
 * Nada disso roda com "reduzir movimento" ativado no sistema nem no alto contraste (pensado para baixa
 * visão: com lupa de tela, um bloco que entra se mexendo pode estar invisível no pedaço que a pessoa vê).
 * Se o alto contraste for ligado depois, o CSS mostra tudo parado e a contagem dos números para.
 */
(() => {
  const altoContraste = () => document.documentElement.dataset.contraste === 'alto';
  if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches || altoContraste() || !('IntersectionObserver' in window)) return;
  const root = document.getElementById('painel');
  const REVEAL = '.tg-hero > *, .tg-fact, .tg-porta, .tg-indice, .tg-kpi, .tg-card, .tg-sec-head, .tg-cite, .tg-filter';
  // só os números grandes dos destaques contam; os valores dos gráficos aparecem já no valor final,
  // para nunca mostrarem, durante a contagem, um número que contradiz a frase logo acima
  const NUMS = '.tg-kpi-n'; // o número grande do destaque (o "95" de "95 em cada 100")
  const ROWS = '.tg-bar-row, .tg-dot-row, .tg-lik-row, .tg-isorow, .tg-stack-legend > div, .tg-stack > div';
  const DUR = 650;

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
      } else if (!el.offsetParent) {
        // a tela foi trocada: anima de novo quando voltar
        el.classList.remove('tg-in');
      }
    }
  }, { rootMargin: '0px 0px 4% 0px', threshold: 0 });

  const watch = (scope) => scope.querySelectorAll(REVEAL).forEach((el) => {
    // o Compare é ferramenta de consulta: aparece já desenhado, sem entrada animada
    if (el.closest('.tg-shot, #card-comparar') || el.__watched) return;
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
        if (old && inRevealed(num) && parse(txt) && !altoContraste()) count(num, old.val);
        continue;
      }
      for (const a of m.addedNodes) {
        if (a.nodeType !== 1) continue;
        index(a);
      }
    }
  }).observe(root, { childList: true, subtree: true, characterData: true });
})();
