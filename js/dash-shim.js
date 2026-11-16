/*
 * Camada mínima de dados para a versão site do painel.
 * Carrega os arquivos JSON de /data, calcula os totais derivados
 * e redesenha a página quando os filtros ou a largura da tela mudam.
 */
(function () {
  var SOURCES = { gestores: 'data/gestores.json', escolas: 'data/escolas.json', indicadores: 'data/indicadores.json' };
  var DEFAULTS = { recorte: 'TOTAL|Total', cmp_ind: 'e_internet', cmp_cat: 'REGIÃO' };
  var store = {}, calcs = {}, calcCache = {}, callbacks = [], params = Object.assign({}, DEFAULTS);

  function run() {
    callbacks.forEach(function (fn) {
      try { fn(); } catch (e) { console.error('[painel]', e); }
    });
  }

  // carrega um arquivo de dados; conexão parada vira erro depois de TEMPO ms, para a página
  // poder mostrar "Tentar de novo" em vez de ficar carregando para sempre
  var TEMPO = 45000;
  function carregar(id) {
    store[id] = { status: 'loading', data: [] };
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, TEMPO);
    fetch(SOURCES[id], ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + r.statusText); return r.json(); })
      .then(function (rows) { store[id] = { status: 'ok', data: rows }; })
      .catch(function (e) { store[id] = { status: 'error', data: [], message: String(e) }; })
      .then(function () { clearTimeout(timer); run(); });
  }
  // cada arquivo só é baixado na primeira vez que um desenho pede por ele (dash.data):
  // a página Sobre não baixa nada, e cada aba baixa só o que mostra

  window.dash = {
    colors: [1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return 'var(--cds-chart-categorical-' + i + ')'; }),
    data: function (id) {
      if (store[id]) return store[id];
      if (SOURCES[id]) { carregar(id); return store[id]; }
      var c = calcs[id];
      if (!c) return { status: 'missing', data: [] };
      var inputs = c.inputs.map(function (i) { return window.dash.data(i); });
      var bad = inputs.find(function (x) { return x.status !== 'ok'; });
      if (bad) return { status: bad.status, data: [] };
      var key = inputs.map(function (x) { return x.data; });
      if (!calcCache[id] || calcCache[id].key.some(function (k, i) { return k !== key[i]; })) {
        calcCache[id] = { key: key, value: { status: 'ok', data: c.fn.apply(null, key) } };
      }
      return calcCache[id].value;
    },
    onData: function (fn) { callbacks.push(fn); try { fn(); } catch (e) { console.error('[painel]', e); } },
    calc: function (id, def) { calcs[id] = def; },
    loader: function () {},
    params: function () { return Object.assign({}, params); },
    setParams: function (p) { Object.assign(params, p); run(); },
    resetParams: function () { params = Object.assign({}, DEFAULTS); run(); },
    refresh: function () {},
    // busca de novo só os arquivos que falharam
    retry: function () {
      var falhos = Object.keys(SOURCES).filter(function (id) { return store[id] && store[id].status === 'error'; });
      falhos.forEach(carregar);
      if (falhos.length) run();
    },
    setLink: function (name) { try { history.replaceState(null, '', '#' + name); } catch (e) { /* ignore */ } }
  };

  var t = null, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(t); t = setTimeout(run, 150);
  });
})();
