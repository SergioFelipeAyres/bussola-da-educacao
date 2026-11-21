/* Ajustes de leitura no topo: "Alto contraste" e "Letra maior". São botões separados, porque são
   necessidades diferentes: quem precisa de contraste nem sempre precisa de letra grande, e vice-versa.
   - Alto contraste (versão para baixa visão): cores do e-MAG, sem animações decorativas e com letra
     mínima de 16 px (src/contraste.css).
   - Letra maior: o site inteiro 25% maior, como o "A+" dos sites do governo.
   A escolha fica guardada no navegador. O <head> de cada página já aplica as duas antes de desenhar,
   para não piscar. */
(() => {
  const html = document.documentElement;
  const liga = (id, chave, valor, guarda) => {
    const b = document.getElementById(id);
    if (!b) return;
    const aplica = (on) => {
      if (on) html.dataset[chave] = valor; else delete html.dataset[chave];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    };
    aplica(html.dataset[chave] === valor);
    b.addEventListener('click', () => {
      const on = html.dataset[chave] !== valor;
      aplica(on);
      try { localStorage.setItem(guarda, on ? valor : 'normal'); } catch (e) { /* navegação privada: vale só nesta visita */ }
    });
  };
  liga('contraste', 'contraste', 'alto', 'contraste');
  liga('letra', 'letra', 'grande', 'letra');
})();
