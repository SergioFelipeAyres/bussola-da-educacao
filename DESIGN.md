---
name: Bússola da Educação
description: TIC Educação 2025 em linguagem simples, com pictogramas, uma cor por tema e margem de erro sempre visível.
colors:
  azul-bussola: "#2f5fd0"
  azul-profundo: "#2448b8"
  azul-claro: "#3b6be6"
  amarelo-norte: "#ffd166"
  teal-conexao: "#0b8a7f"
  laranja-equipamentos: "#c95f0e"
  roxo-regras: "#7346d0"
  rosa-comunicacao: "#c73674"
  grafite-comparacao: "#454d60"
  verde-positivo: "#2c9a6a"
  vermelho-negativo: "#cf4339"
  tinta: "#1b1d24"
  tinta-suave: "#5d6170"
  papel-azulado: "#f4f6fb"
  painel: "#ffffff"
  linha: "#e2e3ea"
  trilho: "#e9eaf0"
  cinza-secundario: "#a9adbd"
  cinza-grupo: "#80869a"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 4.4rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "2.16rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  number:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  statement:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  segment: "8px"
  icon-tile: "14px"
  card: "16px"
  feature: "22px"
  hero: "24px"
  pill: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.875rem"
  lg: "1.25rem"
  xl: "2.25rem"
components:
  button-primary:
    backgroundColor: "{colors.azul-bussola}"
    textColor: "{colors.painel}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1rem 0.55rem 0.8rem"
  button-secondary:
    backgroundColor: "{colors.papel-azulado}"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.7rem"
  nav-link:
    textColor: "{colors.tinta-suave}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.8rem"
  nav-link-active:
    backgroundColor: "{colors.azul-bussola}"
    textColor: "{colors.painel}"
    rounded: "{rounded.pill}"
  segment-option-active:
    backgroundColor: "{colors.painel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.segment}"
    padding: "0.35rem 0.75rem"
  card:
    backgroundColor: "{colors.painel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    padding: "1.15rem"
  kpi:
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    padding: "1.15rem"
  hero:
    backgroundColor: "{colors.azul-profundo}"
    textColor: "{colors.painel}"
    rounded: "{rounded.hero}"
    padding: "clamp(1.6rem, 4vw, 3rem)"
  bar-track:
    backgroundColor: "{colors.trilho}"
    rounded: "{rounded.pill}"
    height: "0.85rem"
---

# Design System: Bússola da Educação

## Overview

**Creative North Star: "O Atlas Escolar"**

A Bússola é desenhada como um atlas didático moderno: cada tema da pesquisa é um capítulo com cor própria (conexão em teal, equipamentos em laranja, regras e IA em roxo, comunicação em rosa), e o leitor sempre sabe em que capítulo está pela cor do ícone, do filete e do número principal. A capa de cada página é uma faixa em degradê azul com a rosa dos ventos em marca-d'água e o norte em amarelo; dali para baixo, o papel é claro, azulado e calmo, para que a cor dos dados fale mais alto.

O sistema é amigável e tátil. Cartões arredondados com sombra suave e filete colorido no topo, botões em pílula, ícones em pastilhas tingidas e pictogramas que acendem um a um convidam ao toque no celular, que é o ambiente padrão. A densidade é baixa: uma ideia por cartão, a frase em linguagem simples antes do gráfico e a base e a margem de erro no rodapé de cada cartão.

O sistema rejeita explicitamente o visual de **relatório acadêmico** (tabelas cheias, notação estatística, texto miúdo como protagonista) e o visual **alarmista** (vermelho e cores de alerta para dramatizar números). A seriedade vem da integridade dos dados, não de um visual austero.

**Key Characteristics:**
- Uma cor por tema, aplicada no ícone, no filete, no número-chave e no destaque do gráfico.
- Capas em degradê azul com a rosa dos ventos e o norte em amarelo.
- Superfícies brancas sobre papel azulado, com cantos de 16px e sombra ambiente leve.
- Uma única família tipográfica (Plus Jakarta Sans), com peso 800 para títulos e números.
- Pictogramas Isotype, barras em trilho arredondado e margem de erro sempre desenhada.
- Movimento que revela os dados em sequência e respeita `prefers-reduced-motion`.

## Colors

Um azul de orientação como voz principal, cinco cores de capítulo saturadas e de luminosidade média, e neutros levemente azulados que nunca competem com os dados.

### Primary
- **Azul Bússola** (azul-bussola): a cor da marca e do capítulo "geral". Logo, link ativo da navegação, botão principal, totais e o tema padrão de qualquer seção sem cor própria.
- **Azul Profundo e Azul Claro** (azul-profundo, azul-claro): os dois extremos do degradê das capas (135°), com um brilho roxo radial no canto superior direito. Usados apenas nas capas.
- **Amarelo Norte** (amarelo-norte): o norte da rosa dos ventos. Destaca a palavra-chave do título grande da capa (texto grande, acima de 3:1). Só aparece sobre o degradê azul e nunca em texto corrido: os números em negrito da frase de abertura ficam em branco 800.

### Secondary
As cores de capítulo. Cada uma tinge a seção inteira por meio da variável `--sec`.
- **Teal Conexão** (teal-conexao): acesso à internet, tipo e velocidade da conexão.
- **Laranja Equipamentos** (laranja-equipamentos): equipamentos e tecnologia na rotina da gestão.
- **Roxo Regras** (roxo-regras): regras sobre celular, IA e proteção de dados.
- **Rosa Comunicação** (rosa-comunicacao): redes sociais, plataformas e comunicação.
- **Grafite Comparação** (grafite-comparacao): a comparação entre grupos. Também substitui, dentro de uma seção, a cor de categoria que coincidiria com a cor do tema.

### Tertiary
- **Verde Positivo e Vermelho Negativo** (verde-positivo, vermelho-negativo): só nas setas de direção das comparações, que são neutras quanto à significância. Nunca preenchem áreas, fundos ou títulos.

### Neutral
- **Tinta** (tinta): texto principal, traço de referência do Brasil nas barras e base da faixa de margem de erro (com 16% de opacidade).
- **Tinta Suave** (tinta-suave): texto secundário, rodapés de base, notas e links inativos da navegação.
- **Papel Azulado** (papel-azulado): fundo da página.
- **Painel** (painel): cartões, barra de navegação e controles.
- **Linha** (linha): bordas de cartões e divisórias de rodapé.
- **Trilho** (trilho): trilhos das barras, fundo do controle segmentado e estados de hover.
- **Cinza Secundário** (cinza-secundario): figuras restantes dos pictogramas (com 45% de opacidade) e marcas que devem recuar.
- **Cinza do Grupo** (cinza-grupo): o grupo de comparação que não é o foco, por exemplo "homens" no gráfico por sexo. Tem 3:1 contra o branco e contra o Trilho, o mínimo para elementos gráficos.

### Named Rules
**The Capítulo Rule.** Cada seção tem exatamente uma cor de tema. Ela aparece na pastilha do ícone (com 15% de mistura sobre branco), no filete sob o título, no filete de 4px no topo dos cartões, no número-chave e no destaque do gráfico. Nenhuma outra cor saturada disputa com ela dentro da seção.

**The Tom de Texto Rule.** A cor pura do capítulo (`--sec`) é para preenchimentos, ícones, filetes e números grandes. Todo texto pequeno na cor do capítulo e todo fundo de botão com texto branco usam `--sec-texto`, a mesma cor 15% mais escura em oklab (`color-mix(in oklab, var(--sec) 85%, #000)`), que fica acima de 4.9:1 no branco, no papel e nos fundos tingidos. Teal e laranja puros não passam em 4.5:1.

**The Escala de Um Tom Rule.** Categorias ordenadas (idade, velocidade, frequência) usam tons de uma só cor, derivados da cor do tema: o claro é a cor com 28% de mistura sobre branco e o escuro, com 78% de mistura sobre preto, no espaço oklab.

**The Sem Alarme Rule.** Vermelho não é cor de tema nem de fundo. Um dado ruim é dito com palavras e mostrado com a cor do seu capítulo, nunca pintado de alerta.

## Typography

**Display Font:** Plus Jakarta Sans (com system-ui, -apple-system, Segoe UI, Roboto e sans-serif como reserva)
**Body Font:** Plus Jakarta Sans

**Character:** Uma geométrica humanista que fica calorosa e firme no peso 800 e legível no 400. Uma família só, com contraste de peso, mantém o tom de livro didático acessível, sem a frieza técnica.

### Hierarchy
- **Display** (800; clamp(2.6rem, 6vw, 4.4rem); 1; -0.025em): título da capa da página inicial. A segunda palavra vem em Amarelo Norte.
- **Headline** (800; 2.16rem, ou 1.65rem abaixo de 620px; 1.15): títulos das capas de Escolas, Gestores e Sobre, com no máximo 20ch.
- **Title** (800; 1.6rem; 1.2; -0.02em): títulos de seção, sempre sublinhados pelo filete de 4px na cor do tema.
- **Number** (800; 2rem; 1.1; algarismos tabulares): números-chave dos destaques, na cor do tema.
- **Statement** (400, com negrito 600; 1.0625rem; 1.4): a frase em linguagem simples que abre cada gráfico ("7 em cada 10…").
- **Body** (400; 0.9375rem; 1.5): texto corrente, rótulos de barra e controles. Textos longos ficam em 62ch no máximo.
- **Label** (600; 0.8125rem; 0.06em; caixa alta): sobretítulos. Na mesma medida, sem caixa alta e em Tinta Suave, a linha de base e margem de erro.

### Named Rules
**The Frase Primeiro Rule.** Em todo cartão de gráfico, a afirmação em Statement vem antes da figura. Um gráfico sem frase não está pronto.

**The Números Tabulares Rule.** Todo valor numérico (barras, comparações, legendas, destaques) usa `font-variant-numeric: tabular-nums`, para que as colunas de números se alinhem.

## Layout

- **Coluna única primeiro:** tudo funciona numa coluna no celular. O contêiner tem largura máxima de 76rem, centralizado, com respiro lateral de 16px (ou a área segura do aparelho) até 900px e de 2.5rem a partir daí.
- **Grade de cartões:** `auto-fit` com colunas de no mínimo 22rem. A partir de 73rem, um cartão pode ocupar duas colunas para não deixar buraco. Os destaques usam colunas de no mínimo 13.5rem. Seções em proporção 2:1 se dividem a partir de 900px.
- **Ritmo:** 2.25rem entre seções, 0.875rem entre cartões e dentro deles, e 1.15rem de padding interno nos cartões.
- **Capa da página inicial:** uma coluna no celular; a partir de 900px, texto e cartão "Você sabia?" lado a lado (1.15fr para minmax(19rem, 25rem)).
- **Pontos de quebra observados:** 480, 520, 560, 620, 720, 900 e 1080px. Abaixo de 560px, os links da navegação vão para uma segunda linha e perdem os ícones.
- **Navegação fixa no topo** e, ao rolar Escolas e Gestores, um filtro de recorte compacto fixo logo abaixo dela. As âncoras compensam essa altura.

## Elevation & Depth

Profundidade em camadas suaves: cartões brancos sobre papel azulado, com uma sombra ambiente dupla e tingida de azul-marinho, e não cinza. A elevação marca o que é objeto (cartão, capa, cartão de destaque), e as superfícies interativas ganham sombra quando estão ativas.

### Shadow Vocabulary
- **Ambiente** (`box-shadow: 0 1px 2px rgba(20,30,70,.06), 0 10px 28px -14px rgba(20,30,70,.22)`): todos os cartões, destaques, filtro e citação.
- **Filete de capítulo** (`box-shadow: inset 0 4px 0 var(--sec), <ambiente>`): cartões dentro de uma seção temática.
- **Capa** (`box-shadow: 0 18px 40px -22px #2448b8`): faixa em degradê das capas.
- **Flutuante** (`box-shadow: 0 30px 60px -24px rgba(5,12,45,.6), 0 2px 6px rgba(5,12,45,.15)`): o cartão "Você sabia?" sobre a capa, inclinado 1.2° no desktop.
- **Pílula ativa** (`box-shadow: 0 4px 14px -6px #2f5fd0`): link ativo da navegação.
- **Filtro fixo** (`box-shadow: 0 10px 28px -12px rgba(20,30,70,.35)`, com desfoque de fundo de 10px): barra de recorte fixa.

### Named Rules
**The Sombra Tingida Rule.** Sombras são sempre azul-marinho translúcido (rgba(20,30,70,…)), nunca preto puro, para continuar na família do papel azulado.

## Shapes

Formas arredondadas e amigáveis, em uma escala clara: 8px para opções do controle segmentado, 14px para as pastilhas de ícone, 16px para cartões, cerca de 22px para o cartão "Você sabia?", 24px para as capas e pílula (999px) para botões, links da navegação e trilhos das barras. Bordas de 1px em Linha, com 70% de opacidade quando há sombra. A rosa dos ventos (círculos concêntricos, marcas cardeais e agulha amarelo/branco), girada -12°, é a única silhueta decorativa e aparece só nas capas.

## Components

### Buttons
- **Shape:** pílula (999px).
- **Primary:** fundo no tom de texto do tema (`--sec-texto`), texto branco em 700, 0.9375rem, padding de 0.55rem 1rem 0.55rem 0.8rem e ícone à esquerda. Exemplo: "Outro dado".
- **Secondary:** fundo Papel Azulado, borda de 1px em Linha, texto em 0.8125rem e padding de 0.4rem 0.7rem.
- **Hover / Focus:** no hover, a borda escurece para Tinta Suave. No foco, contorno de 2px em Tinta (ou na cor do tema) com 2px de afastamento. Mudanças de cor levam 0.4s ao trocar o tema.

### Chips (seletor de recorte)
- **Abas de dimensão:** texto Tinta Suave em 500 e sublinhado de 2.5px na cor do tema quando selecionadas (texto em Tinta, 700). Rolam de lado, com esmaecimento na borda.
- **Controle segmentado de grupo:** trilho em Trilho com raio de 10px. A opção ativa vira uma pastilha branca de 8px com sombra mínima e texto em 700.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Painel. Os destaques usam a cor do tema com 9% de mistura sobre branco e borda com 28%.
- **Shadow Strategy:** Ambiente, com o filete de capítulo dentro das seções.
- **Border:** 1px em Linha.
- **Internal Padding:** 1.15rem. O rodapé de base fica separado por um fio de 1px e encostado no fim do cartão.

### Inputs / Fields
- **Select:** fundo Papel Azulado, borda de 1px em Linha, raio do cartão e padding de 0.4rem 0.6rem. No foco, contorno de 2px em Tinta.

### Navigation
- Barra fixa no topo com fundo em Papel Azulado a 88% de opacidade, desfoque de 10px e fio inferior. Marca: logo em quadrado azul de 1.75rem com a bússola em branco, e "Educação" em 800 Azul Bússola. Links em pílula, Tinta Suave em 500, com ícone. Hover sobre Trilho; ativo em pílula Azul Bússola com texto branco e Pílula ativa. No celular, os links quebram para uma linha própria distribuída e sem ícones.

### Capa (Hero)
Faixa em degradê de 135° de Azul Profundo para Azul Claro, com brilho radial roxo, raio de 24px e padding de clamp(1.6rem, 4vw, 3rem). A rosa dos ventos fica em marca-d'água à direita. Sobretítulo em branco a 82%, título em 800 branco com a palavra-chave em Amarelo Norte e números da frase de abertura em branco 800.

### Barra com margem de erro (componente-assinatura)
Trilho em pílula de 0.85rem em Trilho, preenchimento na cor do tema, faixa de margem de erro em Tinta a 16% que ultrapassa o trilho em 0.15rem, e traço vertical de 2px em Tinta marcando o valor do Brasil. O valor fica à direita em algarismos tabulares, 600, com no mínimo 3.6rem. As barras crescem da esquerda em sequência; a margem e o traço aparecem depois.

### Pictograma Isotype
Fileira de 10 figuras em SVG (cada uma vale 10%), preenchidas na cor do tema e o restante em Trilho. As figuras acendem em sequência, só por opacidade.

### Destaque (KPI)
Cartão tingido com rótulo em Tinta 600, número em Number na cor do tema e linha de comparação em Tinta Suave, 0.8125rem.

### Pastilha de ícone de seção
Ícone de traço de 1.9 em pastilha de 3rem com raio de 14px, fundo na cor do tema a 15% sobre branco e traço na cor do tema, ao lado do título com filete.

## Do's and Don'ts

### Do:
- **Do** defina `--sec` em cada nova seção e deixe ícone, filete, número e destaque do gráfico herdarem dela.
- **Do** abra cada gráfico com uma frase em linguagem simples e feche cada cartão com a base e a margem de erro em 0.8125rem Tinta Suave.
- **Do** desenhe a margem de erro em toda barra e comparação, e comece as barras no zero.
- **Do** use Plus Jakarta Sans em 800 para títulos e números, e algarismos tabulares em todo valor.
- **Do** use sombras azul-marinho translúcidas e os raios da escala (8, 14, 16, 22, 24px e pílula).
- **Do** coloque toda animação dentro de `prefers-reduced-motion: no-preference` e garanta que impressão e imagem de compartilhamento saiam completas.
- **Do** mantenha contraste WCAG 2.2 AA: texto sobre o degradê só em branco (ou branco a 82% ou mais) Amarelo Norte só sobre o azul e só no título grande; texto pequeno na cor do capítulo sempre em `--sec-texto`.

### Don't:
- **Don't** faça o painel parecer um relatório acadêmico: nada de tabelas densas como forma principal, notação estatística crua (IC, p, σ) ou texto miúdo como protagonista.
- **Don't** use vermelho, laranja de alerta ou ícones de perigo para dramatizar um número. As setas verde e vermelha só indicam direção.
- **Don't** use duas cores de tema na mesma seção, nem a cor de um capítulo em outro.
- **Don't** rotule diferenças entre grupos como "reais" ou "empates", nem dê cores diferentes aos grupos comparados.
- **Don't** use Amarelo Norte sobre fundo claro.
- **Don't** use sombras pretas puras nem cantos retos em cartões e botões.
