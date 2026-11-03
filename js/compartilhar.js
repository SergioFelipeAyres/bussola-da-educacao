/*
 * Botão de compartilhar em cada cartão de gráfico.
 * Gera uma imagem PNG do cartão (com marca, recorte e fonte) e oferece:
 * compartilhar a imagem (celular), baixar, WhatsApp, Facebook, X e copiar link.
 * A biblioteca html-to-image só é carregada no primeiro uso.
 */
(() => {
  const LIB = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js';
  const root = document.getElementById('painel');
  const LOGO = '<svg class="nav-logo" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6"/><path fill-rule="evenodd" d="M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zm0 1.7a6.8 6.8 0 1 1 0 13.6a6.8 6.8 0 1 1 0-13.6z"/><path d="M16.6 7.4l-3.2 6-2.8-2.8z"/><path d="M7.4 16.6l3.2-6 2.8 2.8z" opacity=".55"/></svg>';
  const ICON_SHARE = '<svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4M8.2 13.2l7.6 4"/></svg>';
  const IC = {
    share: '<path d="M12 3v12M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12v7.5h14V12"/>',
    baixar: '<path d="M12 3v12M7.5 10.5L12 15l4.5-4.5"/><path d="M4.5 19.5h15"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1-1.2 1.8.8"/>',
    facebook: '<path d="M14 21v-7.5h2.6l.4-3H14V8.7c0-.9.3-1.5 1.6-1.5H17V4.5a19 19 0 0 0-2.3-.1C12.4 4.4 11 5.8 11 8.3v2.2H8.5v3H11V21"/>',
    x: '<path d="M4.5 4.5l15 15M19.5 4.5l-15 15"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
  };
  const svg = (k) => '<svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true">' + IC[k] + '</svg>';

  let libP = null;
  const loadLib = () => libP || (libP = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = LIB;
    s.onload = () => res(window.htmlToImage); s.onerror = () => { libP = null; rej(new Error('lib')); };
    document.head.append(s);
  }));

  const titleOf = (card) => {
    const h = card.querySelector('.tg-card-title');
    if (h) return h.textContent.trim();
    const sec = card.closest('.tg-sec'); const t = sec && sec.querySelector('.tg-sec-title');
    return t ? t.textContent.trim() : 'Bússola da Educação';
  };
  const recorteOf = (card) => {
    if (!card.closest('#gestores, #escolas')) return '';
    const sel = document.getElementById('tg-recorte');
    const opt = sel && sel.selectedOptions[0];
    return opt && sel.value !== 'TOTAL|Total' ? opt.textContent.trim() : 'Brasil';
  };
  const linkOf = (card) => location.origin + location.pathname + '#' + card.id;
  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

  // monta uma cópia do cartão com cabeçalho e rodapé, fora da tela
  const buildShot = (card) => {
    const shot = document.createElement('div'); shot.className = 'tg-shot';
    const head = document.createElement('div'); head.className = 'tg-shot-head';
    head.innerHTML = '<span class="tg-shot-brand">' + LOGO + '<span>Bússola da <b>Educação</b></span></span>';
    const rec = recorteOf(card);
    if (rec) { const r = document.createElement('span'); r.className = 'tg-shot-rec'; r.textContent = 'Recorte: ' + rec; head.append(r); }
    const clone = card.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('.tg-share, .tg-alt').forEach((b) => b.remove());
    clone.querySelectorAll('[id]').forEach((el) => { if (!el.closest('svg')) el.removeAttribute('id'); });
    // seletores viram texto para sair legíveis na imagem
    const cloneSels = [...clone.querySelectorAll('select')];
    card.querySelectorAll('select').forEach((s, i) => {
      const c = cloneSels[i]; if (!c) return;
      const b = document.createElement('b'); b.className = 'tg-shot-sel'; b.textContent = s.selectedOptions[0] ? s.selectedOptions[0].textContent : '';
      c.replaceWith(b);
    });
    clone.querySelectorAll('label').forEach((l) => l.removeAttribute('for'));
    const foot = document.createElement('div'); foot.className = 'tg-shot-foot';
    foot.textContent = 'Fonte: NIC.br/Cetic.br, TIC Educação 2025 · ' + location.host + location.pathname.replace(/\/$/, '');
    shot.append(head, clone, foot);
    root.append(shot);
    return shot;
  };

  const makeBlob = async (card) => {
    const lib = await loadLib();
    const shot = buildShot(card);
    try {
      const bg = getComputedStyle(document.body).backgroundColor;
      return await lib.toBlob(shot, { pixelRatio: 2, backgroundColor: bg, style: { position: 'static', left: '0', top: '0' } });
    } finally { shot.remove(); }
  };

  const download = (blob, name) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  // ---------- menu ----------
  const menu = document.createElement('div');
  menu.className = 'tg-share-menu'; menu.setAttribute('role', 'menu'); menu.hidden = true;
  document.body.append(menu);
  let openBtn = null;
  const status = (txt) => { const s = menu.querySelector('.tg-share-status'); if (s) s.textContent = txt; };

  const close = () => {
    menu.hidden = true;
    if (openBtn) { openBtn.setAttribute('aria-expanded', 'false'); openBtn = null; }
  };

  const open = (btn, card) => {
    if (openBtn === btn) { close(); return; }
    close(); openBtn = btn; btn.setAttribute('aria-expanded', 'true');
    const title = titleOf(card), rec = recorteOf(card), url = linkOf(card);
    const text = title + (rec && rec !== 'Brasil' ? ' (' + rec + ')' : '') + ' — dados da TIC Educação 2025 na Bússola da Educação';
    const file = 'bussola-da-educacao-' + slug(title) + (rec && rec !== 'Brasil' ? '-' + slug(rec) : '') + '.png';
    const canShareFiles = !!(navigator.canShare && navigator.canShare({ files: [new File([''], 'x.png', { type: 'image/png' })] }));
    const items = [];
    if (canShareFiles) items.push(['share', 'Compartilhar imagem', async () => {
      const blob = await makeBlob(card);
      const f = new File([blob], file, { type: 'image/png' });
      try { await navigator.share({ files: [f], title: title, text: text + ' ' + url }); } catch (e) { if (e.name !== 'AbortError') throw e; }
    }]);
    items.push(['baixar', 'Baixar imagem', async () => { download(await makeBlob(card), file); }]);
    items.push(['whatsapp', 'WhatsApp', () => window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank', 'noopener')]);
    items.push(['facebook', 'Facebook', () => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank', 'noopener')]);
    items.push(['x', 'X', () => window.open('https://x.com/intent/post?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank', 'noopener')]);
    items.push(['link', 'Copiar link', async () => { await navigator.clipboard.writeText(url); return 'Link copiado.'; }]);

    menu.replaceChildren();
    for (const [k, label, fn] of items) {
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem'); b.className = 'tg-share-item';
      b.innerHTML = svg(k); b.append(document.createTextNode(label));
      b.addEventListener('click', async () => {
        const keep = k === 'share' || k === 'baixar' || k === 'link';
        if (keep) { status(k === 'link' ? '' : 'Gerando imagem…'); b.disabled = true; }
        try {
          const msg = await fn();
          if (keep) { status(msg || ''); if (!msg) close(); }
          else close();
        } catch (e) {
          console.error('[compartilhar]', e);
          status(k === 'link' ? 'Não foi possível copiar. Link: ' + url : 'Não foi possível gerar a imagem.');
        } finally { b.disabled = false; }
      });
      menu.append(b);
    }
    const hint = document.createElement('p'); hint.className = 'tg-share-hint';
    hint.textContent = canShareFiles ? 'Nas opções de rede social vai o link do gráfico.' : 'Nas redes sociais vai o link do gráfico. Para enviar a imagem, baixe-a e anexe na conversa ou no post.';
    const st = document.createElement('p'); st.className = 'tg-share-status'; st.setAttribute('role', 'status');
    menu.append(hint, st);

    menu.hidden = false;
    const r = btn.getBoundingClientRect(), mw = menu.offsetWidth, mh = menu.offsetHeight;
    let x = r.right + window.scrollX - mw; x = Math.max(window.scrollX + 8, Math.min(x, window.scrollX + document.documentElement.clientWidth - mw - 8));
    let y = r.bottom + window.scrollY + 6;
    if (r.bottom + 6 + mh > window.innerHeight && r.top - 6 - mh > 0) y = r.top + window.scrollY - 6 - mh;
    menu.style.left = x + 'px'; menu.style.top = y + 'px';
    menu.querySelector('button').focus();
  };

  document.addEventListener('click', (e) => { if (!menu.hidden && !menu.contains(e.target) && !e.target.closest('.tg-share')) close(); });
  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') { const b = openBtn; close(); if (b) b.focus(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const bs = [...menu.querySelectorAll('button')], i = bs.indexOf(document.activeElement);
      bs[(i + (e.key === 'ArrowDown' ? 1 : bs.length - 1)) % bs.length].focus(); e.preventDefault();
    }
  });
  window.addEventListener('resize', close);
  window.addEventListener('hashchange', close);

  // ---------- botões ----------
  document.querySelectorAll('.tg-card').forEach((card) => {
    if (!card.id || !card.querySelector('.tg-chart')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tg-share';
    b.setAttribute('aria-label', 'Compartilhar: ' + titleOf(card)); b.title = 'Compartilhar';
    b.setAttribute('aria-haspopup', 'menu'); b.setAttribute('aria-expanded', 'false');
    b.innerHTML = ICON_SHARE;
    b.addEventListener('click', () => open(b, card));
    card.classList.add('tg-has-share');
    card.prepend(b);
  });
})();
