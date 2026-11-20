/* Alto contraste (versão para baixa visão): o botão do topo liga e desliga; a escolha fica guardada
   no navegador. O <head> de cada página já aplica a escolha antes de desenhar, para não piscar. */
(() => {
  const html = document.documentElement, b = document.getElementById('contraste');
  if (!b) return;
  const aplica = (on) => {
    if (on) html.dataset.contraste = 'alto'; else delete html.dataset.contraste;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  };
  aplica(html.dataset.contraste === 'alto');
  b.addEventListener('click', () => {
    const on = html.dataset.contraste !== 'alto';
    aplica(on);
    try { localStorage.setItem('contraste', on ? 'alto' : 'normal'); } catch (e) { /* navegação privada: vale só nesta visita */ }
  });
})();
