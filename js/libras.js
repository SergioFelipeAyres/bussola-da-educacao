/*
 * "Ver em Libras": vídeos com intérprete humano nas partes que o leitor mais precisa entender.
 *
 * Para publicar um vídeo, preencha o endereço na lista VIDEOS abaixo. Vale:
 *   - um arquivo de vídeo do próprio site (ex.: 'videos/libras/como-ler.mp4');
 *   - um link do YouTube ou do Vimeo (ex.: 'https://www.youtube.com/watch?v=XXXX').
 * Os botões aparecem sempre. Enquanto o endereço estiver vazio, o botão daquele trecho fica
 * tracejado, marcado "em breve", e não abre nada (avisa o leitor surdo de que o vídeo está a caminho).
 *
 * A tradução automática do texto da página fica com o VLibras (widget do governo federal, em index.html).
 */
(() => {
  const VIDEOS = {
    inicio: '',        // abertura do Início: o que é a Bússola e como usar
    'como-ler': '',    // guia "Como ler este painel"
    conexao: '',       // Escolas · Conexão
    equipamentos: '',  // Escolas · Equipamentos
    regras: '',        // Escolas · Regras, IA e proteção de dados
    comunicacao: '',   // Escolas · Comunicação e plataformas
    perfil: '',        // Gestores · Quem são os gestores
    tecnologia: '',    // Gestores · Tecnologia na gestão
    ia: '',            // Gestores · Inteligência artificial
    comparar: '',      // Compare grupos
    sobre: ''          // Sobre a pesquisa e o projeto
  };
  const TITULOS = { inicio: 'Bússola da Educação', 'como-ler': 'Como ler este painel', sobre: 'Sobre' };
  const MAO = '<svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11.5V5.5a1.5 1.5 0 0 1 3 0V10M10 9.5V4a1.5 1.5 0 0 1 3 0v6M13 9.5V5a1.5 1.5 0 0 1 3 0v6M16 10.5V8a1.5 1.5 0 0 1 3 0v6a7 7 0 0 1-7 7h-.6a6.4 6.4 0 0 1-5-2.4L3.6 15.4a1.5 1.5 0 0 1 2.3-1.9L7 14.6"/></svg>';

  // ---------- janela do vídeo (uma só para o site todo) ----------
  let janela = null;
  const abreVideo = (id, titulo) => {
    if (!janela) {
      janela = document.createElement('dialog');
      janela.className = 'tg-libras-janela'; janela.setAttribute('aria-labelledby', 'libras-titulo');
      janela.innerHTML = '<div class="tg-libras-top"><h2 id="libras-titulo"></h2><button type="button" class="tg-guide-x" aria-label="Fechar o vídeo em Libras"><svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="tg-libras-player"></div>';
      janela.querySelector('button').addEventListener('click', () => janela.close());
      janela.addEventListener('click', (e) => { if (e.target === janela) janela.close(); });
      // ao fechar, o vídeo para (tirar o player do DOM interrompe também o YouTube e o Vimeo)
      janela.addEventListener('close', () => janela.querySelector('.tg-libras-player').replaceChildren());
      document.body.append(janela);
    }
    const url = VIDEOS[id], player = janela.querySelector('.tg-libras-player');
    janela.querySelector('h2').textContent = 'Em Libras: ' + titulo;
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/), vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (yt || vm) {
      const f = document.createElement('iframe');
      f.src = yt ? 'https://www.youtube-nocookie.com/embed/' + yt[1] : 'https://player.vimeo.com/video/' + vm[1];
      f.title = 'Vídeo em Libras: ' + titulo; f.allow = 'fullscreen; picture-in-picture'; f.allowFullscreen = true;
      player.replaceChildren(f);
    } else {
      const v = document.createElement('video');
      v.controls = true; v.playsInline = true; v.preload = 'metadata'; v.src = url;
      v.setAttribute('aria-label', 'Vídeo em Libras: ' + titulo);
      player.replaceChildren(v);
    }
    janela.showModal();
  };

  // ---------- botões ----------
  const botao = (id, titulo) => {
    const tem = !!VIDEOS[id];
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tg-libras' + (tem ? '' : ' tg-libras-embreve'); b.dataset.libras = id;
    b.innerHTML = MAO + '<span>Ver em Libras</span>' + (tem ? '' : '<small>em breve</small>');
    // o nome falado começa pelo texto visível ("Ver em Libras", "em breve"), para o comando de voz achar o botão
    b.setAttribute('aria-label', (tem ? 'Ver em Libras: ' : 'Ver em Libras, em breve: ') + titulo);
    if (tem) b.addEventListener('click', () => abreVideo(id, titulo));
    else b.setAttribute('aria-disabled', 'true');
    return b;
  };
  // os botões entram depois que o painel.js montou as seções (o "Recolher" é criado por ele)
  const monta = () => {
  // abertura do Início e do Sobre: depois da etiqueta de fonte da capa
  [['inicio', '.tg-hero-home .tg-hero-copy'], ['sobre', '#sobre .tg-hero']].forEach(([id, sel]) => {
    const alvo = document.querySelector(sel); const b = alvo && botao(id, TITULOS[id]);
    if (b) { b.classList.add('tg-libras-capa'); alvo.append(b); }
  });
  // guia "Como ler": no topo, ao lado do botão de fechar
  const topo = document.querySelector('#como-ler .tg-guide-top');
  const bg = topo && botao('como-ler', TITULOS['como-ler']);
  if (bg) topo.querySelector('.tg-guide-x').before(bg);
  // seções de Escolas e Gestores e o Compare: na cabeça da seção, antes de "Recolher"
  document.querySelectorAll('#escolas > .tg-sec[id], #gestores > .tg-sec[id], #comparar').forEach((sec) => {
    const head = sec.querySelector(':scope > .tg-sec-head'); if (!head || !(sec.id in VIDEOS)) return;
    const b = botao(sec.id, head.querySelector('.tg-sec-title').textContent.trim()); if (!b) return;
    const rec = head.querySelector(':scope > .tg-sec-toggle');
    // os dois botões ficam juntos: quando não cabem ao lado do título, descem os dois para a linha de baixo, à direita
    const grupo = document.createElement('div'); grupo.className = 'tg-sec-botoes';
    if (rec) { rec.before(grupo); grupo.append(b, rec); } else { head.append(grupo); grupo.append(b); }
  });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monta); else monta();
})();

/*
 * Botão do VLibras (widget do governo federal) no canto de baixo, à direita.
 * O widget o desenha fixo no meio da altura da tela, à direita, e ali ele cobria os valores das barras
 * no celular. Ele vive num shadow DOM aberto (#vlibras-access-wrapper), onde o CSS da página não chega:
 * quando o botão aparece, entra uma regra dentro dele. Se o widget mudar e o elemento não existir, nada acontece.
 */
(() => {
  const CSS = '#vlibras-access{top:auto!important;bottom:calc(16px + env(safe-area-inset-bottom,0px))!important}';
  const ajusta = () => {
    const raiz = document.getElementById('vlibras-access-wrapper')?.shadowRoot;
    if (!raiz || raiz.querySelector('style[data-bussola]')) return !!raiz;
    const s = document.createElement('style'); s.dataset.bussola = ''; s.textContent = CSS; raiz.append(s);
    return true;
  };
  if (ajusta()) return;
  const mo = new MutationObserver(() => { if (ajusta()) mo.disconnect(); });
  mo.observe(document.body, { childList: true });
  setTimeout(() => mo.disconnect(), 30000); // o widget não veio (sem rede): para de esperar
})();
