/*
 * "Pergunte à Bússola": o leitor escreve uma pergunta do jeito dele e recebe o número da pesquisa.
 * Não usa IA: procura um TEMA e um GRUPO por palavras-chave e responde com os dados do próprio site,
 * pelas mesmas regras do painel ("N em cada 10" ou "em cada 100", margem de erro como faixa, "o mais usado"
 * só quando as margens não se tocam). Cruzamentos que a pesquisa não publica (ex.: particulares do Nordeste)
 * são explicados, e cada grupo aparece separado.
 *
 * Fica aberta no Início (#pergunte) e numa janela em Escolas e Gestores (botão "Perguntar", ao lado de
 * "Como ler este painel"). "Ver no painel" leva ao cartão certo, já no grupo da pergunta (window.mostraNoPainel,
 * definido no painel.js).
 *
 * Para ensinar uma palavra nova, acrescente-a à expressão "kw" do tema ou à lista GRUPOS.
 */
(() => {
  const sem = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const n1 = (v) => v.toFixed(1).replace('.', ',');
  const ESCOLA = '<path d="M12 2.5L2.5 8.5h19z"/><path d="M4.5 9.5h15V21h-5.5v-5h-4v5H4.5z"/>';
  const PESSOA = '<circle cx="12" cy="5.6" r="3.4"/><path d="M5.5 22v-6.5a6.5 6.5 0 0 1 13 0V22z"/>';

  // ---------- grupos: palavras → recorte das tabelas ----------
  const GRUPOS = [
    [/centro[ -]?oeste/, 'REGIÃO', 'Centro-Oeste'], [/\bnordeste\b/, 'REGIÃO', 'Nordeste'], [/\bsudeste\b/, 'REGIÃO', 'Sudeste'],
    [/\bsul\b/, 'REGIÃO', 'Sul'], [/\bnorte\b/, 'REGIÃO', 'Norte'],
    [/\brura(l|is)\b|\bcampo\b/, 'ÁREA', 'Rural'], [/\burbanas?\b|\bcidades?\b/, 'ÁREA', 'Urbana'],
    [/\bcapita(l|is)\b/, 'LOCALIZAÇÃO', 'Capital'], [/\binterior\b/, 'LOCALIZAÇÃO', 'Interior'],
    [/\bparticular(es)?\b|\bprivadas?\b/, 'DEPENDÊNCIA ADMINISTRATIVA', 'Particular'],
    [/\bmunicipa(l|is)\b|\bprefeitura\b/, 'DEPENDÊNCIA ADMINISTRATIVA', 'Municipal'], [/\bestadua(l|is)\b/, 'DEPENDÊNCIA ADMINISTRATIVA', 'Estadual'],
    [/\bpublicas?\b/, 'DEPENDÊNCIA ADMINISTRATIVA', 'Públicas (Municipal, Estadual e Federal)'],
    [/\bhomens\b/, 'SEXO', 'Masculino']
  ];
  const NOME_TIPO = { 'REGIÃO': 'Região', 'ÁREA': 'Urbana ou rural', 'LOCALIZAÇÃO': 'Capital ou interior', 'DEPENDÊNCIA ADMINISTRATIVA': 'Pública ou particular', 'SEXO': 'Sexo' };
  const segCurto = (s) => s.replace(' (Municipal, Estadual e Federal)', '');
  const ENTRE = { Rural: 'escolas rurais', Urbana: 'escolas urbanas', Capital: 'escolas das capitais', Interior: 'escolas do interior', Particular: 'escolas particulares', Municipal: 'escolas municipais', Estadual: 'escolas estaduais' };
  const nomeGrupo = (cat, seg) => cat === 'REGIÃO' ? 'escolas da região ' + seg : cat === 'SEXO' ? 'gestores homens' : ENTRE[seg] || 'escolas públicas';
  const quem = (t, cat, seg) => !cat ? 'No Brasil' : t.ds === 'gestores'
    ? (cat === 'REGIÃO' ? 'Entre os gestores da região ' + seg : cat === 'SEXO' ? 'Entre os gestores homens' : 'Entre os gestores das ' + nomeGrupo(cat, seg))
    : 'Entre as ' + nomeGrupo(cat, seg);

  // ---------- temas: palavras → indicador e cartão do painel ----------
  // a ordem importa: os temas mais específicos vêm antes (ex.: "internet para os alunos" antes de "internet")
  const TEMAS = [
    { nome: 'Comunicação', sec: 'pink', ds: 'escolas', card: 'card-canais', kw: /comunica|mensage|aplicativo|whats|zap|telegram|plataforma|familias|\bpais\b/, ranking: true, verbo: 'usam',
      itens: [['WhatsApp', 'F4A', 'WhatsApp'], ['Telegram', 'F4A', 'Telegram'], ['plataforma ou ambiente virtual de aprendizagem', 'G4A', ''], ['aplicativo próprio da escola', 'F5', '']] },
    { nome: 'Redes sociais', sec: 'pink', ds: 'escolas', card: 'card-redes', kw: /rede social|redes sociais|instagram|facebook|youtube|tiktok|twitter/, ranking: true, verbo: 'têm perfil nele',
      itens: [['Instagram', 'F3', 'Instagram'], ['Facebook', 'F3', 'Facebook'], ['YouTube', 'F3', 'YouTube'], ['TikTok', 'F3', 'TikTok'], ['X (Twitter)', 'F3', 'Twitter ou X']] },
    { nome: 'Fibra ótica', sec: 'teal', ds: 'escolas', card: 'card-tipo-conexao', kw: /fibra/, ind: 'A2', resp: 'Conexão via fibra ótica',
      txt: 'das escolas com internet estão conectadas por fibra ótica', txtG: 'das que têm internet estão conectadas por fibra ótica' },
    { nome: 'Computador e internet para os alunos', sec: 'teal', ds: 'escolas', card: 'card-camadas', kw: /computador|notebook|tablet/, ind: 'A8', txt: 'escolas oferecem computador e internet aos alunos' },
    { nome: 'Internet para os alunos', sec: 'teal', ds: 'escolas', card: 'card-camadas', kw: /(internet|conex|wi.?fi).*(aluno|estudante)|(aluno|estudante).*(internet|conex|wi.?fi)/, ind: 'A7', txt: 'escolas oferecem internet para os alunos' },
    { nome: 'Internet na escola', sec: 'teal', ds: 'escolas', card: 'card-camadas', kw: /internet|conectad|conexao|wi.?fi/, ind: 'A1', txt: 'escolas têm acesso à internet' },
    { nome: 'Robótica', sec: 'orange', ds: 'escolas', card: 'card-recursos', kw: /robotica|\brobo/, ind: 'B15', txt: 'escolas têm material para aulas de robótica' },
    { nome: 'Gestores que usam IA', sec: 'purple', ds: 'gestores', card: 'card-ia-adocao', pessoa: true,
      kw: /(gestor|diretor).*(\bia\b|inteligencia artificial|chatgpt)|(\bia\b|inteligencia artificial|chatgpt).*(gestor|diretor)/, ind: 'D9A', txt: 'gestores já usam inteligência artificial na gestão da escola' },
    { nome: 'Guia sobre o uso de IA', sec: 'purple', ds: 'escolas', card: 'card-politicas',
      kw: /(guia|regra|orienta|norma).*(\bia\b|inteligencia artificial)|(\bia\b|inteligencia artificial).*(guia|regra|orienta|norma)/, ind: 'E5A', txt: 'escolas têm um guia sobre o uso de inteligência artificial' },
    { nome: 'Alunos podem usar IA', sec: 'purple', ds: 'escolas', card: 'card-politicas', kw: /\bia\b|inteligencia artificial|chatgpt/, ind: 'E5B', txt: 'escolas permitem que os alunos usem inteligência artificial' },
    { nome: 'Regras para o celular', sec: 'purple', ds: 'escolas', card: 'card-politicas', kw: /celular|telefone|smartphone/, ind: 'C3C', txt: 'escolas têm regras para o uso do celular pelos alunos' },
    { nome: 'Proteção de dados', sec: 'purple', ds: 'escolas', card: 'card-politicas', kw: /protecao de dados|dados pessoais|lgpd|privacidade/, ind: 'H1', txt: 'escolas têm política de proteção de dados' },
    { nome: 'Reconhecimento facial', sec: 'purple', ds: 'escolas', card: 'card-vigilancia', kw: /facial|reconhecimento|camera|vigilancia/, ind: 'E4B', txt: 'escolas usam reconhecimento facial dos alunos' },
    { nome: 'Gestoras mulheres', sec: 'blue', ds: 'gestores', card: 'card-sexo', pessoa: true, kw: /mulher|gestoras|diretoras/, ind: 'A1', resp: 'Feminino', txt: 'gestores escolares são mulheres' }
  ];
  const EXEMPLOS = ['Qual o meio de comunicação mais usado no Nordeste?', 'Quantas escolas rurais têm internet?', 'Quantos gestores usam IA no Sul?', 'Escolas particulares têm robótica?'];

  // ---------- dados: os mesmos que o painel carrega (dash.data baixa na primeira vez) ----------
  const dados = (ds) => new Promise((ok) => {
    const tenta = () => { const d = window.dash && window.dash.data(ds); if (d && d.status === 'ok') ok(d.data); else if (d && d.status === 'error') ok(null); else setTimeout(tenta, 150); };
    tenta();
  });
  const linha = (rows, ind, grupo, resp, cat, seg) => rows.find((r) => r.ind === ind && (r.grupo || '') === grupo && r.resp === resp && r.cat === (cat || 'TOTAL') && r.seg === (seg || 'Total'));

  // regras do painel
  const precisaCem = (v) => v >= 90 || v < 10;
  const freq = (v, cem) => { if (v >= 99.5 && v < 100) return 'quase 100 em cada 100'; const n = cem ? Math.round(v) : Math.round(v / 10), s = n + (cem ? ' em cada 100' : ' em cada 10'); return Math.abs(v - (cem ? n : n * 10)) < 0.05 ? s : 'cerca de ' + s; };
  const faixa = (r) => r.moe ? 'pode variar entre ' + n1(Math.max(0, r.pct - r.moe)) + '% e ' + n1(Math.min(100, r.pct + r.moe)) + '%' : 'sem margem de erro estimada';
  const separa = (a, b) => a.pct - (a.moe || 0) > b.pct + (b.moe || 0);
  // "1 em cada 10" pede o verbo no singular
  const SING = { 'têm': 'tem', 'usam': 'usa', 'são': 'é', 'estão': 'está', 'oferecem': 'oferece', 'permitem': 'permite' };
  const verbo1 = (n, txt) => /^(cerca de )?1 em cada/.test(n) ? txt.replace(/^((?:escolas|gestores escolares|gestores) )?(já )?(\S+)/, (m, s, j, v) => (s || '') + (j || '') + (SING[v] || v)) : txt;

  // ---------- desenho da resposta ----------
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const iso = (v, pessoa) => '<div class="tg-perg-iso" aria-hidden="true">' + Array.from({ length: 10 }, (_, i) => '<svg viewBox="0 0 24 24"' + (i < Math.round(v / 10) ? ' class="on"' : '') + '>' + (pessoa ? PESSOA : ESCOLA) + '</svg>').join('') + '</div>';
  const entendi = (t, cat, seg) => '<p class="tg-perg-entendi">Entendi: <b>' + t.nome + '</b><b>' + (cat ? NOME_TIPO[cat] + ': ' + segCurto(seg) : 'Brasil') + '</b></p>';
  const irBotao = (t, cat, seg, rotulo) => {
    const b = el('button', 'tg-perg-ir', esc(rotulo) + ' <span aria-hidden="true">→</span>'); b.type = 'button';
    b.addEventListener('click', () => {
      const j = b.closest('dialog'); if (j) j.close();
      if (window.mostraNoPainel) window.mostraNoPainel(t.ds, cat ? cat + '|' + seg : 'TOTAL|Total', t.card);
    });
    return b;
  };
  const cartao = (t) => { const c = el('article', 'tg-perg-res'); c.style.setProperty('--sec', 'var(--v-' + t.sec + ')'); return c; };

  const responde = async (t, cat, seg) => {
    const c = cartao(t), rows = await dados(t.ds), q = quem(t, cat, seg);
    if (!rows) { c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">Não foi possível carregar os dados. Verifique a conexão e tente de novo.</p>'; return c; }
    if (t.ranking) {
      const its = t.itens.map(([l, ind, g]) => ({ l, r: linha(rows, ind, g, 'Sim', cat, seg), br: linha(rows, ind, g, 'Sim') })).filter((x) => x.r).sort((a, b) => b.r.pct - a.r.pct);
      if (!its.length) { c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">A pesquisa não tem esse número para esse grupo.</p>'; return c; }
      const [a, b] = its, cem = its.some((x) => precisaCem(x.r.pct)), n = freq(a.r.pct, cem);
      const frase = b && !separa(a.r, b.r)
        ? q + ', os mais usados são <strong>' + a.l + '</strong> e <strong>' + b.l + '</strong>: com a margem de erro, não dá para dizer qual vem primeiro.'
        : q + ', o mais usado é <strong>' + a.l + '</strong>: <strong>' + n + '</strong> ' + (cat ? '' : 'escolas ') + verbo1(n, t.verbo) + '.';
      c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">' + frase + '</p>' + iso(a.r.pct) +
        '<p class="tg-perg-var">' + esc(a.l) + ': ' + n1(a.r.pct) + '% (' + faixa(a.r) + ')' + (cat && a.br ? '. No Brasil, ' + n1(a.br.pct) + '%.' : '.') + '</p>' +
        '<ul class="tg-perg-lista">' + its.map((x) => '<li><span>' + esc(x.l) + '</span><span class="v">' + n1(x.r.pct) + '%</span><span class="tr" aria-hidden="true"><i style="width:' + x.r.pct + '%"></i></span></li>').join('') + '</ul>';
      c.append(irBotao(t, cat, seg, 'Ver no painel, com a margem de cada um'));
      return c;
    }
    const resp = t.resp || 'Sim', r = linha(rows, t.ind, t.grupo || '', resp, cat, seg), br = linha(rows, t.ind, t.grupo || '', resp);
    if (!r) { c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">A pesquisa não tem esse número para esse grupo.</p>'; return c; }
    const cem = precisaCem(r.pct) || !!(cat && br && precisaCem(br.pct)), n = freq(r.pct, cem);
    const txt = cat ? (t.txtG || t.txt.replace(/^(escolas|gestores escolares|gestores) /, '')) : t.txt;
    let vs = '';
    if (cat && br) { const d = Math.round((r.pct - br.pct) * 10) / 10; vs = ' No Brasil, ' + freq(br.pct, cem) + ' (' + n1(br.pct) + '%)' + (d ? ': são ' + n1(Math.abs(d)) + (Math.abs(d) < 2 ? ' ponto ' : ' pontos ') + (d > 0 ? 'a mais' : 'a menos') + ' no grupo.' : '.'); }
    c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">' + q + ', <strong>' + n + '</strong> ' + verbo1(n, txt) + '.</p>' + iso(r.pct, t.pessoa) +
      '<p class="tg-perg-var">' + n1(r.pct) + '% (' + faixa(r) + ').' + vs + '</p>';
    c.append(irBotao(t, cat, seg, 'Ver no painel'));
    return c;
  };

  const pergunta = async (txt, saida) => {
    const q = ' ' + sem(txt) + ' ';
    const t = TEMAS.find((x) => x.kw.test(q));
    let gs = GRUPOS.filter(([re]) => re.test(q)).map(([, c, s]) => [c, s]);
    if (t && t.ds === 'escolas') gs = gs.filter(([c]) => c !== 'SEXO');
    saida.replaceChildren();
    if (!t) {
      const c = el('article', 'tg-perg-res tg-perg-nao', '<p class="tg-perg-frase">Ainda não sei responder essa.</p><p class="tg-perg-var">Pergunte sobre um destes temas, com ou sem um grupo (uma região, escolas rurais ou urbanas, públicas ou particulares):</p><ul>' + TEMAS.map((x) => '<li>' + x.nome + '</li>').join('') + '</ul>');
      saida.append(c); return;
    }
    const tipos = [...new Set(gs.map(([c]) => c))];
    if (tipos.length > 1) {
      // cruzamento de grupos: a pesquisa não publica; cada grupo aparece separado
      saida.append(el('article', 'tg-perg-res tg-perg-nao', '<p class="tg-perg-frase">A pesquisa não publica o número das <strong>' + gs.map(([c, s]) => nomeGrupo(c, s)).join(' e ') + '</strong> ao mesmo tempo: nesse cruzamento a amostra fica pequena demais para um número confiável.</p><p class="tg-perg-var">Veja cada grupo separado:</p>'));
      for (const c of await Promise.all(gs.slice(0, 2).map(([c, s]) => responde(t, c, s)))) saida.append(c);
      return;
    }
    for (const c of await Promise.all((gs.length ? gs.slice(0, 3) : [[null, null]]).map(([c, s]) => responde(t, c, s)))) saida.append(c);
  };

  // ---------- a caixa (a mesma no Início e na janela) ----------
  let n = 0;
  const caixa = (alvo, titulo) => {
    const id = 'perg-' + (++n);
    const form = el('form', 'tg-perg-caixa'); form.setAttribute('role', 'search');
    form.innerHTML = '<label class="tg-perg-tit" for="' + id + '">' + titulo + '</label>' +
      '<div class="tg-perg-linha"><input id="' + id + '" type="search" autocomplete="off" enterkeyhint="search" placeholder="Ex.: qual o meio de comunicação mais usado no Nordeste?">' +
      '<button type="submit" class="tg-etq">Perguntar</button></div><div class="tg-perg-ex"><span class="tg-perg-ex-lab">Experimente:</span></div>';
    const saida = el('div', 'tg-perg-saida'); saida.setAttribute('aria-live', 'polite');
    const inp = form.querySelector('input'), ex = form.querySelector('.tg-perg-ex');
    form.addEventListener('submit', (e) => { e.preventDefault(); if (inp.value.trim()) pergunta(inp.value, saida); });
    EXEMPLOS.forEach((t) => { const b = el('button', 'tg-perg-chip'); b.type = 'button'; b.textContent = t; b.addEventListener('click', () => { inp.value = t; pergunta(t, saida); }); ex.append(b); });
    alvo.append(form, saida);
    return inp;
  };

  const monta = () => {
    // Início: aberta, logo depois da capa
    const ini = document.getElementById('pergunte');
    if (ini) caixa(ini, 'Faça uma pergunta, a pesquisa responde');
    // Escolas e Gestores: botão "Perguntar" ao lado de "Como ler este painel", abrindo uma janela
    const guiaBtn = document.querySelector('#topo .tg-guide-btn'), guia = document.getElementById('como-ler');
    if (!guiaBtn || !guia) return;
    const j = el('dialog', 'tg-guide tg-perg-janela'); j.id = 'pergunte-janela'; j.setAttribute('aria-labelledby', 'pergunte-janela-tit');
    j.innerHTML = '<div class="tg-guide-top"><h2 class="tg-guide-title" id="pergunte-janela-tit">Pergunte à Bússola</h2><button type="button" class="tg-guide-x" aria-label="Fechar"><svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="tg-guide-body"></div>';
    guia.after(j);
    const inp = caixa(j.querySelector('.tg-guide-body'), 'O que você quer saber?');
    j.querySelector('.tg-guide-x').addEventListener('click', () => j.close());
    j.addEventListener('click', (e) => { if (e.target === j) j.close(); });
    const b = el('button', 'tg-guide-btn tg-perg-btn', '<svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>Perguntar');
    b.type = 'button'; b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-controls', j.id);
    b.addEventListener('click', () => { j.showModal(); inp.focus(); });
    // "Como ler" e "Perguntar" lado a lado (quebram para a linha de baixo se não couberem)
    const par = el('div', 'tg-head-botoes'); guiaBtn.before(par); par.append(guiaBtn, b);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monta); else monta();
})();
