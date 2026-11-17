---
name: Bússola da Educação
description: TIC Educação 2025 em linguagem simples, num caderno escolar pautado com margem rosa, lições numeradas, marca-texto, pictogramas, uma cor por tema e margem de erro sempre visível.
colors:
  azul-bussola: "#2f5fd0"
  azul-profundo: "#2448b8"
  azul-claro: "#3b6be6"
  amarelo-norte: "#ffd166"
  teal-conexao: "#0b8a7f"
  laranja-equipamentos: "#c95f0e"
  roxo-regras: "#591987"
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
    fontFamily: "Bricolage Grotesque, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.9rem, 7.4vw, 5.6rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.8vw, 2.1rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  card-title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  number:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.2vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  lead:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 2.4vw, 1.65rem)"
    fontWeight: 600
    lineHeight: 1.3
  statement:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.05em"
  annotation:
    fontFamily: "Caveat, cursive"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.1
rounded:
  traco: "1px"
  fita: "2px"
  folha: "3px"
  card: "6px"
  pill: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.875rem"
  lg: "1.25rem"
  xl: "2.25rem"
components:
  button-primary:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.painel}"
    typography: "{typography.body}"
    padding: "0.55rem 1.15rem 0.55rem 1rem"
  button-secondary:
    backgroundColor: "{colors.papel-azulado}"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "0.4rem 0.7rem"
  nav-link:
    textColor: "{colors.tinta-suave}"
    typography: "{typography.label}"
    padding: "0.5rem 0.8rem"
  nav-link-active:
    textColor: "{colors.tinta}"
  segment-option-active:
    backgroundColor: "{colors.painel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
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
    backgroundColor: "{colors.papel-azulado}"
    textColor: "{colors.tinta}"
    padding: "clamp(2.25rem, 6vw, 4.5rem) 2.5rem"
  button-retry:
    backgroundColor: "{colors.painel}"
    textColor: "{colors.tinta}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    padding: "0.5rem 1rem"
  skip-link:
    backgroundColor: "{colors.azul-bussola}"
    textColor: "{colors.painel}"
    rounded: "{rounded.card}"
    padding: "0.6rem 1rem"
  section-index-link:
    backgroundColor: "{colors.painel}"
    textColor: "{colors.tinta}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    padding: "0.45rem 0.95rem 0.45rem 0.75rem"
    height: "2.5rem"
  porta:
    backgroundColor: "{colors.painel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    padding: "clamp(1.25rem, 2.5vw, 1.75rem)"
  note:
    backgroundColor: "{colors.trilho}"
    textColor: "{colors.tinta-suave}"
    rounded: "{rounded.card}"
    padding: "0.45rem 0.7rem"
  bar-track:
    backgroundColor: "{colors.trilho}"
    rounded: "{rounded.pill}"
    height: "0.85rem"
---

# Design System: Bússola da Educação

## Overview

**Creative North Star: "O Caderno Escolar"**

A Bússola é desenhada como um caderno escolar aberto, organizado com o rigor de uma página de produto moderna. Dentro da moldura, a folha é branca e pautada (uma linha azul-clara a cada 30px), com a margem dupla rosa à esquerda e furos de fichário na faixa antes dela; fora da moldura fica a mesa, em Papel Azulado. Cada seção é uma lição numerada ("Lição 01") sobre um fio na cor do capítulo (conexão em teal, equipamentos em laranja, regras e IA em roxo, comunicação em rosa), com a pastilha de ícone do tema ao lado do título, e fecha com um quadro "Para pensar". O amarelo é o marca-texto do caderno: grifa a palavra-chave do título, os números da manchete, o número em destaque do mapa (em Tinta, como todo texto grifado) e o link ativo da navegação. "Você sabia?" é um post-it preso com fita; o filtro é uma questão de múltipla escolha; o "Ir para" são marcadores de página adesivos.

O sistema é preciso e tátil. Cartões são folhas soltas sobre o caderno: fundo branco, borda de 1px, cantos de 3px e sombra baixa. Os botões principais são etiquetas com dois cantos chanfrados. Rótulos curtos (navegação, sobretítulos de controle, eixos, a etiqueta de fonte da capa) vão em mono, como anotações de régua; títulos e números ficam na Bricolage Grotesque e toda frase, inclusive a margem de erro, a base e o rodapé, na Atkinson Hyperlegible Next. Anotações à mão em Caveat ("← toque numa região!", "marque só uma!") são só enfeite: nunca carregam dado e ficam fora do leitor de tela. A densidade continua baixa: uma ideia por cartão, a frase em linguagem simples antes do gráfico e a base e a margem de erro no rodapé de cada cartão.

O sistema rejeita explicitamente o visual de **relatório acadêmico** (tabelas cheias, notação estatística, texto miúdo como protagonista) e o visual **alarmista** (vermelho e cores de alerta para dramatizar números). A seriedade vem da integridade dos dados, não de um visual austero.

**Key Characteristics:**
- Uma cor por tema, aplicada no fio da lição, no ícone, no número-chave, no destaque do gráfico e no quadro "Para pensar".
- Folha pautada com margem dupla rosa e furos de fichário; cada seção é uma "Lição" numerada.
- Marca-texto amarelo atrás da palavra-chave, dos números da manchete e do link ativo; o texto grifado continua em Tinta.
- Capas direto na folha, sem fundo próprio; "Você sabia?" num post-it amarelo preso com fita.
- Folhas brancas com cantos de 3px e sombra baixa; botões principais em etiqueta chanfrada.
- Bricolage Grotesque para títulos, manchetes e números (800); Atkinson Hyperlegible Next para o texto corrido; Atkinson Hyperlegible Mono só para rótulos de medida.
- Pictogramas Isotype, barras como traços de marca-texto sobre um trilho fino, e margem de erro sempre desenhada como barra de erro. Dentro dos cartões de gráfico o caderno se cala: o dado fica sozinho em cena, e a papelaria fica na moldura, nos títulos e nas notas. Entre os cartões de gráfico (Escolas e Gestores), a pauta quase some: o papel a 92% passa por cima dela, da margem rosa até a borda da folha.
- Movimento que revela os dados em sequência e respeita `prefers-reduced-motion`.

## Colors

Um azul de orientação como voz principal, cinco cores de capítulo saturadas e de luminosidade média, e neutros levemente azulados que nunca competem com os dados.

### Primary
- **Azul Bússola** (azul-bussola): a cor da marca e do capítulo "geral". Logo, link ativo da navegação, botão principal, totais e o tema padrão de qualquer seção sem cor própria.
- **Azul Profundo e Azul Claro** (azul-profundo, azul-claro): Azul Profundo é a cor dos links em texto corrido. Azul Claro fica reservado; as capas não usam mais degradê.
- **Amarelo Norte** (amarelo-norte): o marca-texto do caderno (a 92% sobre branco) e o post-it "Você sabia?" (a 62% sobre branco). Nunca é cor de texto, e todo texto sobre o amarelo (grifado ou no post-it) é Tinta: as cores de tema ficam abaixo de 4.5:1 no amarelo (teal e laranja chegam a 2.9:1 no marca-texto), e Tinta passa de 11:1.

### Secondary
As cores de capítulo. Cada uma tinge a seção inteira por meio da variável `--sec`.
- **Teal Conexão** (teal-conexao): acesso à internet, tipo e velocidade da conexão.
- **Laranja Equipamentos** (laranja-equipamentos): equipamentos e tecnologia na rotina da gestão.
- **Roxo Regras** (roxo-regras): regras sobre celular, IA e proteção de dados. É um roxo-uva escuro de propósito: o roxo antigo (#7346d0) tinha a mesma claridade do Azul Bússola e, na deuteranopia, as duas cores ficavam idênticas (veja The Daltonismo Rule).
- **Rosa Comunicação** (rosa-comunicacao): redes sociais, plataformas e comunicação. Fora das seções, só na margem dupla da folha (a 55% e a 32% sobre branco).
- **Grafite Comparação** (grafite-comparacao): a comparação entre grupos. Também substitui, dentro de uma seção, a cor de categoria que coincidiria com a cor do tema.

### Tertiary
- **Verde Positivo e Vermelho Negativo** (verde-positivo, vermelho-negativo): só nas setas de direção das comparações, que são neutras quanto à significância. Nunca preenchem áreas, fundos ou títulos.

### Neutral
- **Tinta** (tinta): texto principal, traço de referência do Brasil nas barras e barra de erro da margem (linha de 2px com pontinhas). Essas duas marcas levam um contorno branco fino (`drop-shadow` em Painel), para ficarem visíveis sobre qualquer cor de barra, inclusive o roxo escuro.
- **Tinta Suave** (tinta-suave): texto secundário, rodapés de base, notas e links inativos da navegação.
- **Papel Azulado** (papel-azulado): a mesa, fora da moldura, e o fundo do mapa e dos desenhos do guia (estes com quadriculado).
- **Painel** (painel): a folha do caderno (com as pautas em Azul Bússola a 15%), cartões, barra de navegação e controles.
- **Linha** (linha): bordas de cartões e divisórias de rodapé.
- **Trilho** (trilho): trilhos das barras, fundo do controle segmentado e estados de hover.
- **Cinza Secundário** (cinza-secundario): figuras restantes dos pictogramas (com 45% de opacidade) e marcas que devem recuar.
- **Cinza do Grupo** (cinza-grupo): o grupo de comparação que não é o foco, por exemplo "homens" no gráfico por sexo. Tem 3:1 contra o branco e contra o Trilho, o mínimo para elementos gráficos.

### Named Rules
**The Capítulo Rule.** Cada seção tem exatamente uma cor de tema. Ela aparece no fio e no rótulo da lição, na pastilha do ícone (12% de mistura sobre branco, borda a 30%), no número-chave, no destaque do gráfico e no quadro "Para pensar" (borda tracejada e ícone). Nenhuma outra cor saturada disputa com ela dentro da seção.

**The Tom de Texto Rule.** A cor pura do capítulo (`--sec`) é para preenchimentos, ícones, filetes e números grandes. Todo texto pequeno na cor do capítulo e todo fundo de botão com texto branco usam `--sec-texto`, a mesma cor 15% mais escura em oklab (`color-mix(in oklab, var(--sec) 85%, #000)`), que fica acima de 4.9:1 no branco, no papel e nos fundos tingidos. Teal e laranja puros não passam em 4.5:1.

**The Daltonismo Rule.** Duas cores de capítulo nunca podem se confundir nos três tipos principais de daltonismo (protanopia, deuteranopia e tritanopia). A conferência simula cada tipo (matrizes de Machado et al., 2009, severidade total) e mede a diferença entre os pares em CIEDE2000. O Azul Bússola, que é a marca, fica fixo; as outras cores se ajustam a ele. Como o daltonismo vermelho-verde apaga justamente o que separa azul de roxo, a separação entre os dois vem da claridade: o Roxo Regras é bem mais escuro que o azul. Em novembro de 2026, a pior diferença do roxo contra o azul passou de 0,6 (deuteranopia, cores idênticas) para 13,6. Pares que ainda ficam próximos num dos tipos (rosa × grafite na protanopia, laranja × rosa na tritanopia) aparecem sempre com o nome do capítulo escrito ao lado (navegação, legenda, destaques): a cor nunca é o único jeito de saber o capítulo (WCAG 1.4.1).

**The Escala de Um Tom Rule.** Categorias ordenadas (idade, velocidade, frequência) usam tons de uma só cor, derivados da cor do tema: o claro é a cor com 28% de mistura sobre branco e o escuro, com 78% de mistura sobre preto, no espaço oklab.

**The Sem Alarme Rule.** Vermelho não é cor de tema nem de fundo. Um dado ruim é dito com palavras e mostrado com a cor do seu capítulo, nunca pintado de alerta.

## Typography

**Display Font:** Bricolage Grotesque (eixo óptico 12–96; reserva na fonte do texto)
**Body Font:** Atkinson Hyperlegible Next (com system-ui, -apple-system, Segoe UI, Roboto e sans-serif como reserva)
**Label Font:** Atkinson Hyperlegible Mono (só rótulos curtos: navegação, etiqueta de fonte da capa, sobretítulos de controle, eixos e "Lição 01"; nunca frases)
**Annotation Font:** Caveat 600 (só anotações à mão decorativas, com `aria-hidden`; nunca dado nem instrução necessária)

No Tailwind (`src/site.css`), `--font-sans`, `--font-display` e `--font-mono` são as três famílias; no CSS do painel, `--font-display` (Bricolage) marca títulos, cartões e números.

**Character:** Uma grotesca de personalidade, com eixo óptico e junções marcadas, que dá voz de cartaz escolar aos títulos e números; um texto desenhado para legibilidade máxima (letras como I, l e 1 nunca se confundem), pensado para o leitor leigo; e a mono da mesma família como a escrita miúda de uma régua. A mono nunca carrega frases: só medida e orientação.

### Hierarchy
- **Display** (800; clamp(2.9rem, 7.4vw, 5.6rem); 1; -0.02em): título da capa da página inicial. A segunda palavra vem grifada de marca-texto.
- **Headline** (800; clamp(2.1rem, 4.6vw, 3.5rem); 1.08; -0.02em): títulos das capas de Escolas, Gestores e Sobre, com no máximo 19ch; o fim do título ("conectadas e equipadas", "como usa a tecnologia") vem grifado.
- **Title** (800; clamp(1.6rem, 2.8vw, 2.1rem); 1.1; -0.03em): títulos de seção, ao lado da pastilha de ícone na cor do tema (sem sublinhado).
- **Number** (800; clamp(2rem, 3.2vw, 2.5rem); 1.1; algarismos tabulares): números-chave dos destaques, na cor do tema.
- **Lead** (600 a 800; clamp(1.3rem, 2.4vw, 1.65rem); 1.3): frases de destaque fora dos gráficos: a linha fina da capa do Início, o texto do post-it "Você sabia?", o grupo escolhido no filtro ("Brasil (todas as escolas)") e o dado das portas do Início.
- **Statement** (400, com negrito 600; 1.1875rem (19px); 1.4): a frase em linguagem simples que abre cada gráfico ("7 em cada 10…"), com no máximo 62ch, logo abaixo do título do cartão; a nota sobre as cores vem depois dela, encostada no gráfico (título → frase → nota → gráfico).
- **Body** (400; 1.0625rem (17px); 1.5): texto corrente, rótulos de barra e controles. Textos longos ficam em 62ch no máximo.
- **Label** (Atkinson Hyperlegible Mono 500; 0.875rem (14px); 0.05em; caixa alta): navegação, "Você está vendo", rótulos dos blocos do filtro, "Ir para", nome das portas e a etiqueta de fonte da capa. A linha de base e fonte de cada cartão, a margem de erro dos destaques e o rodapé são frases: ficam em Caption (Atkinson Next, 0.875 a 0.9375rem, Tinta Suave).

### Named Rules
**The Frase Primeiro Rule.** Em todo cartão de gráfico, a afirmação em Statement vem antes da figura. Um gráfico sem frase não está pronto. A frase é montada com os dados do recorte (`lead()` em `js/painel.js`) e diz o número em "N em cada 10"; "o mais citado" só aparece quando as faixas da margem de erro do 1º e do 2º não se tocam, senão a frase cita os dois ou diz a faixa ("vai de … a …"). Numa frase com dois números, os dois usam a mesma base (`comBase`): "95 em cada 100 … mas só 62 em cada 100", nunca "95 em cada 100 … 6 em cada 10". O painel não usa "metade": 50% é "5 em cada 10", como nos destaques.

**The Enfeite Calado Rule.** Texto gerado por CSS que é só enfeite (as letras a, b, c das alternativas do filtro, o número das questões, "Lição 01") usa texto alternativo vazio (`content: "…" / ""`), para o leitor de tela não ler. Layout de texto nunca usa `nowrap` em grupos de botões: com a letra do navegador em 200%, tudo precisa quebrar linha; media queries de layout de texto ficam em `em`, para acompanhar esse tamanho.

**The Piso de 14px Rule.** Nenhum texto visível fica abaixo de 14px (0.875rem). Única exceção de escrita: os rótulos dentro do mapa são escritos nas unidades do desenho, com `max(10.5px, calc(14px / var(--esc)))`, em que `--esc` é a escala do mapa na tela (o painel.js mede a cada desenho); assim ficam com 14px ou mais em qualquer largura, de 320px ao desktop. No celular o nome da região sai da caixa alta, para caber. Vale para tudo: notas, legendas, rótulos em mono, base e margem de erro, rodapé, a barra de filtro fixa e o guia "Como ler", que só aparecem depois. Todos os tamanhos são em rem, exceto os rótulos do mapa. O texto corrido tem 17px, as notas e legendas 15px (`--cds-font-size-caption`), o título do cartão 21px e a frase de cada gráfico 19px. Os tamanhos em rem acompanham o tamanho de letra e o zoom escolhidos pelo leitor. O público inclui pessoas idosas e com baixa visão: na dúvida, o texto sobe, nunca desce.

**The Margem Esquerda Rule.** Texto corrido fica sempre alinhado à esquerda, nunca justificado (`text-align: justify` não entra no site), seguindo o critério 1.4.8 (Apresentação Visual) das WCAG, que pede texto não justificado. O motivo são dois públicos que a Bússola quer alcançar:
- **Dislexia:** o justificado estica os espaços entre as palavras de forma desigual, e os vãos se alinham de uma linha para outra em "rios" brancos que cortam o parágrafo. Para quem tem dislexia, esses rios competem com as palavras, fazem o olho saltar de linha e as letras parecerem se mover. No alinhamento à esquerda, o espaço entre as palavras é sempre o mesmo e todo começo de linha está no mesmo lugar, o que dá um ponto fixo para voltar a cada linha.
- **Baixa visão:** quem lê com zoom de 200% ou mais, ou com lupa de tela, vê poucas palavras por linha. Numa coluna estreita o justificado abre buracos enormes (uma palavra longa como "matrículas" basta), e quem usa lupa acompanha uma janela pequena do texto, em que os espaços irregulares dificultam saber onde termina uma palavra e começa a próxima. O mesmo vale para o celular.

Números em colunas de tabela e de lista seguem alinhados à direita (`tabular-nums`), e textos curtos centrados (avisos de erro, legendas do mapa) continuam como estão: a regra é para parágrafos e frases.

**The Números Tabulares Rule.** Todo valor numérico (barras, comparações, legendas, destaques) usa `font-variant-numeric: tabular-nums`, para que as colunas de números se alinhem.

## Layout

- **Coluna única primeiro:** tudo funciona numa coluna no celular. A partir de 900px, o conteúdo fica numa folha de 76rem com 5.75rem à esquerda (furos, margem dupla rosa e 2.5rem até o conteúdo) e 2.5rem à direita, com borda direita de 1px em Linha; abaixo de 900px a folha ocupa a tela, sem margem nem furos, com respiro de 16px (ou a área segura do aparelho).
- **Lições:** cada seção abre com um fio de 2px na cor do capítulo, 1.5rem acima do título, com "Lição 01" (contador por página, em Label no tom de texto do tema) no começo do fio. O fim das abas tem um fio de 1px em Linha. A capa não tem fio próprio.
- **Para pensar:** cada seção de Escolas e Gestores termina num quadro com uma pergunta aberta, sem números (para não ficar errada quando o grupo muda).
- **Grade de cartões:** `auto-fit` com colunas de no mínimo 22rem. A partir de 73rem, um cartão pode ocupar duas colunas para não deixar buraco. Os destaques usam colunas de no mínimo 13.5rem. Seções em proporção 2:1 se dividem a partir de 900px.
- **Ritmo:** 3rem entre seções, 0.875rem entre cartões e dentro deles, e 1.15rem de padding interno nos cartões.
- **Capa da página inicial:** uma coluna no celular; a partir de 900px, texto e post-it "Você sabia?" lado a lado (1.25fr para minmax(19rem, 24rem)).
- **Pontos de quebra observados:** 480, 520, 560, 620, 720, 900 e 1080px. Abaixo de 560px, os links da navegação vão para uma segunda linha.
- **Ordem de leitura em Escolas e Gestores:** capa, filtro de recorte, destaques, índice de seções ("Ir para") e as seções na ordem do índice, terminando em "Compare grupos".
- **Navegação fixa no topo** e, ao rolar Escolas e Gestores, uma barra fixa de uma linha logo abaixo dela, em qualquer tela: "Você está vendo: <grupo> · Mudar · Topo". O nome do grupo quebra em duas linhas em vez de ser cortado; "Mudar" leva ao filtro principal. As âncoras compensam a altura real da barra.
- **Alvos de 44px em qualquer ponteiro:** todo controle que não seja link no meio de uma frase tem pelo menos 44px de altura também com mouse, porque quem navega com o cursor da cabeça, do olhar ou de um acionador usa "mouse". Na cabeça das lições, "Ver em Libras" e "Recolher" ficam juntos e descem para a linha de baixo quando não cabem.
- **Nome falado = texto visível:** o nome que o leitor de tela anuncia começa pelo texto do botão ("Ver em Libras, em breve: Conexão"), para o controle por voz achar o botão pelo que está escrito.
- **Celular (até 560px):** na barra fixa, "Você está vendo" e o texto "Topo" saem (fica a seta); "Mudar" leva ao filtro principal já aberto; o filtro principal começa recolhido, com "Você está vendo" e o botão "Mudar grupo" (vira "Fechar" quando aberto); os destaques ficam em 2 colunas, e o total vira uma faixa de uma linha ("129,7 mil Escolas representadas").
- **Fim das abas de dados:** depois de "Compare grupos", um bloco leva à outra aba com um dado real ("Agora veja quem dirige as escolas") e a "Como citar".
- **Chegada:** ao ir para um cartão pelo endereço (Ver no painel, link compartilhado), ele ganha um anel na cor do capítulo por um instante.
- **Fim do Início:** duas portas lado a lado (colunas de no mínimo 22rem), que viram uma coluna no celular.

## Elevation & Depth

Profundidade baixa, de folhas soltas sobre o caderno aberto na mesa: a folha pautada tem uma sombra longa e suave sobre a mesa; cartões brancos têm uma linha de 1px e uma sombra curta tingida de azul-marinho. Só o post-it "Você sabia?" e os marcadores do "Ir para" saem do plano.

### Shadow Vocabulary
- **Ambiente** (`box-shadow: 0 1px 0 rgba(20,30,70,.04), 0 8px 24px -18px rgba(20,30,70,.28)`): cartões, destaques, filtro, portas e citação.
- **Filete de capítulo** (`box-shadow: inset 0 3px 0 var(--sec), <ambiente>`): só nas portas do Início e no bloco do fim das abas, que levam a outra página.
- **Capa:** sem sombra nem fundo; a capa está direto na folha pautada.
- **Post-it** (`box-shadow: 0 22px 34px -22px rgba(5,12,45,.5)`): o "Você sabia?", inclinado 1.6° com movimento permitido, com uma fita translúcida no topo.
- **Marcador** (`box-shadow: inset 0 5px 0 var(--sec), 0 6px 12px -10px rgba(20,30,70,.55)`): os links do "Ir para", levemente tortos.
- **Navegação ativa:** sem sombra; o nome vem grifado de marca-texto.
- **Filtro fixo** (`box-shadow: 0 10px 28px -12px rgba(20,30,70,.35)`, com desfoque de fundo de 10px): barra de recorte fixa.
- **Fundo do guia** (`::backdrop` em `rgba(12,18,40,.55)` com desfoque de 3px): a página escurece em azul-marinho atrás da janela "Como ler".

### Named Rules
**The Sombra Tingida Rule.** Sombras são sempre azul-marinho translúcido, nunca preto puro, para continuar na família do papel azulado: rgba(20,30,70,…) nas sombras ambiente e, nas mais fortes (cartão flutuante, botão e janela do guia), `rgba(var(--sombra-escura),…)`, com `--sombra-escura: 5,12,45`.

## Shapes

Formas de papelaria: 2px para o post-it e os marcadores (fita); 3px para as folhas (cartões, destaques, filtro, citação, portas); 6px para botões, chips, pastilhas, "Para pensar", guia; pílula (999px) só nos trilhos das barras do mapa; botões principais em etiqueta, com os cantos superior esquerdo e inferior direito chanfrados em 9px (o chanfro vai num `::before`, para o contorno de foco não ser cortado). Bordas de 1px em Linha. Avisos e notas são caixas tingidas inteiras, nunca uma borda lateral colorida. A folha pautada é a textura do sistema; o quadriculado fica só no mapa e nos desenhos do guia. As alternativas do filtro são bolinhas de 1.5rem com a letra em mono (a, b, c…), como num gabarito.

## Components

### Buttons
- **Shape:** etiqueta chanfrada (primários) ou 6px (secundários).
- **Primary:** fundo em Tinta (padrão, "Como ler este painel") ou no tom de texto do tema (`--sec-texto`, "Outro dado", "Ver o painel completo"), texto branco em 700, 0.9375rem, padding de 0.55rem 1.15rem 0.55rem 1rem e ícone à esquerda. No hover, o fundo escurece 18%.
- **Secondary:** fundo Papel Azulado, borda de 1px em Linha, texto em 0.9375rem e padding de 0.4rem 0.7rem.
- **Hover / Focus:** no hover, a borda escurece para Tinta Suave. No foco, contorno de 2px em Tinta (ou na cor do tema) com 2px de afastamento. Mudanças de cor levam 0.4s ao trocar o tema.
- **Tentar de novo (erro de carregamento):** botão branco de 6px com borda Linha, texto 700 no tom de texto do tema, abaixo da mensagem "Não foi possível carregar os dados. Verifique a conexão e tente de novo." em Tinta Suave, centralizada no lugar do gráfico. Sem vermelho (regra Sem Alarme).
- **Pular para o conteúdo:** botão de 6px Azul Bússola com texto branco 700, fora da tela até receber foco pelo teclado; é o primeiro item da página.

### Chips (seletor de recorte)
- **Questão de múltipla escolha:** no filtro principal, cada bloco é uma questão numerada ("1. Onde fica a escola", "2. Tipo de escola" e, em Gestores, "Quem dirige"), com o rótulo em Label e os tipos de grupo como alternativas a, b, c…: bolinha vazada em Tinta Suave, preenchida em Tinta com a letra branca quando marcada (texto em 700). Questões separadas por fio tracejado. De início só aparecem os tipos mais procurados (Escolas: região, urbana ou rural, rede; Gestores: região, rede, sexo); "Mais tipos de grupo (N)", em link sublinhado, mostra os outros. Os grupos (Norte, Nordeste…) entram dentro da própria questão da alternativa escolhida (as questões são itens do filtro via `display:contents`, e a ordem vem do painel.js), alinhados com as alternativas, sob um rótulo com o tipo escolhido ("Região:"), que vira o pedido em azul durante a escolha ("Escolha a região:"). O Brasil não é alternativa: com um grupo escolhido, "← Voltar para o Brasil todo" aparece logo abaixo de "Você está vendo". Uma anotação à mão "marque só uma!" fica acima do quadro (só no desktop).
- **Vocabulário:** a interface diz "grupo", nunca "recorte" (o termo da pesquisa fica explicado no guia).
- **Duas etapas:** tocar numa dimensão só mostra os grupos dela, com o pedido "Escolha a região:" (lido pelo leitor de tela); os grupos são botões de 6px com uma bolinha de rádio (vazia, ou com miolo branco e aro grosso em Tinta quando marcada). Os dados mudam ao escolher o grupo. No celular, o filtro recolhe depois da escolha e o foco volta para "Mudar grupo".
- **Grupo no endereço:** o grupo vai na URL (`/escolas?grupo=regiao-norte`); o link compartilhado, "Copiar link", recarregar e o Voltar do navegador mantêm ou desfazem o grupo.
- **Controle segmentado de grupo:** trilho em Trilho com raio de 10px. A opção ativa vira uma pastilha branca de 8px com sombra mínima e texto em 700.

### Cards / Containers
- **Corner Style:** 3px.
- **Background:** Painel. Os destaques formam uma linha de células brancas separadas por fios de 1px em Linha, desenhados em cada célula (`box-shadow: 0 0 0 1px`) e não no fundo da grade, para que uma célula que sobra numa linha não deixe um bloco cinza; sem filete; o total fica numa célula com 5% de azul.
- **Shadow Strategy:** Ambiente.
- **Border:** 1px em Linha.
- **Internal Padding:** 1.15rem. O rodapé de base fica separado por um fio de 1px e encostado no fim do cartão.

### Inputs / Fields
- **Select:** fundo Papel Azulado, borda de 1px em Linha, raio do cartão e padding de 0.4rem 0.6rem. No foco, contorno de 2px em Tinta.

### Navigation
- Barra fixa no topo com fundo em Papel Azulado a 92% de opacidade, desfoque de 10px e fio inferior. Marca: logo em quadrado azul de 1.75rem com a bússola em branco, e "Educação" em 800 Azul Bússola. Links em Label (mono, caixa alta), Tinta Suave, sem ícone; o ativo fica em Tinta, grifado de marca-texto. No celular, os links quebram para uma linha própria distribuída.

### Capa (Hero)
Direto na folha pautada, sem fundo, sem fio e sem ilustração. Título em Tinta 800, com a palavra-chave (Início) ou o fim do título (Escolas, Gestores) grifado de marca-texto; manchete de Escolas e Gestores em Tinta com os números grifados em 800; texto corrido em Tinta Suave até 52ch; abaixo, a etiqueta de fonte em mono ("—— Fonte: TIC Educação 2025 · NIC.br/Cetic.br"). Não há sobretítulo acima do título. Em Escolas e Gestores, a frase da capa é uma manchete com um achado só, até 46ch, em clamp(1.0625rem, 1.6vw, 1.3rem).

### Post-it "Você sabia?"
Amarelo Norte a 62% sobre branco, cantos de 2px, sem borda, fita translúcida azulada de 6.5rem no topo, inclinado 1.6°. Todo o texto em Tinta, inclusive o número (a cor do tema fica na pastilha do ícone e nos pictogramas); o botão "Outro dado" em etiqueta no tom de texto do tema.

### Saiba mais (termos técnicos)
Termos que o leitor leigo pode não conhecer ganham um "Saiba mais" fechado, logo depois da nota do cartão e antes do gráfico (título → frase → nota → Saiba mais → gráfico), com o mesmo componente do guia "Como ler" (`details.tg-lesson-mais.tg-card-mais`). O resumo diz o assunto ("Saiba mais: o que é Mbps"), para o leitor de tela e o controle por voz. Hoje explicam: Projeto Político Pedagógico e currículo, Mbps e Gbps, material maker e Smart TV, sistemas digitais e educação digital e midiática, ambiente virtual de aprendizagem e educação midiática (em Gestores). No filtro, "Escolas que vão até" mostra uma dica fixa abaixo das alternativas (anos iniciais, anos finais e Educação Profissional) enquanto esse tipo de grupo está aberto ou escolhido. Na caixa de perguntas, os mesmos termos ganham uma nota curta quando aparecem na resposta (lista `TERMOS` em `js/pergunte.js`); as duas versões do texto devem dizer o mesmo.

### Pergunte à Bússola
Caixa de pergunta numa folha (borda de 1px, cantos de 3px, sombra ambiente): título em Lead (Bricolage 800), campo de 3.25rem de altura com borda de 1.5px em Tinta Suave e foco em Azul Bússola, botão "Perguntar" em etiqueta Tinta, e exemplos clicáveis em chips tracejados (como alternativas de rascunho). A resposta é outra folha com o faixa interna de 3px no topo (box-shadow inset), na cor do tema da pergunta: "Entendi:" com o tema e o grupo em pastilhas (o leitor confere o que a caixa entendeu), a frase em Statement com o número em Bricolage 800, uma fileira de 10 pictogramas, o percentual com a faixa em Caption, a lista com barras de marca-texto quando a pergunta é "o mais usado" ou compara grupos ("qual região tem mais…?", com "Comparar:" na pastilha e "Ver a comparação no painel →"), e "Ver no painel →" sublinhado. Quando a IA reescreveu a pergunta, uma linha em Caption e Tinta Suave abre a resposta: "Entendi sua pergunta como: **“…”**". Depois de uma resposta das palavras-chave, "Não era isso? Tentar entender de outro jeito" usa o mesmo estilo sublinhado de "Ver no painel" (sem seta); enquanto espera, o botão desativa e o texto vira "Tentando entender de outro jeito…". Em Escolas e Gestores, "Perguntar" é uma etiqueta em Azul Bússola ao lado de "Como ler este painel", e a caixa abre na janela do guia.

### Ver em Libras
Botão no tom de texto do tema, borda de 1px em Linha, raio de 6px, ícone de mão em traço de 1.7px e "Ver em Libras" em 700. Fica na cabeça de cada seção (antes de "Recolher"; no celular só o ícone, com nome para o leitor de tela), no topo do guia "Como ler" e abaixo da etiqueta de fonte da capa do Início e do Sobre. Abre uma janela com o vídeo (arquivo do site, YouTube ou Vimeo) em 16:9, na mesma família da janela do guia. Aparece sempre: sem vídeo, fica tracejado, em Tinta Suave, marcado "em breve", e não abre nada (`aria-disabled`). O botão azul flutuante do VLibras é do próprio widget e não segue o sistema.

### Para pensar
Nota de margem no fim de cada seção de Escolas e Gestores, quieta: borda tracejada de 1px na cor do tema a 55%, fundo branco, raio de 6px, padding de .9rem 1.1rem; lápis de contorno no tom de texto do tema, sem pastilha; "Para pensar" em Bricolage 800 no tom de texto do tema e a pergunta em Tinta, até 70ch. É uma nota (`role="note"`), não um título, e some com a seção recolhida.

### Barra com margem de erro (componente-assinatura)
Trilho fino e liso (1px em Linha) com 1rem de altura, que marca os 100%; o preenchimento na cor do tema, a 85%, é um traço de marca-texto com as pontas levemente tortas (`clip-path`); margem de erro como barra de erro: linha de 2px em Tinta no meio do traço, com pontinhas de 8px nas duas pontas (contraste alto sobre o branco e sobre a cor), e traço vertical de 2px em Tinta marcando o valor do Brasil. O valor fica à direita em algarismos tabulares, 600, com no mínimo 3.6rem. As barras crescem da esquerda em sequência; a margem e o traço aparecem depois.

### Pictograma Isotype
Fileira de 10 figuras em SVG (cada uma vale 10%), preenchidas na cor do tema e o restante em Trilho. As figuras acendem em sequência, só por opacidade.

### Destaque (KPI)
Célula da linha de destaques, sem filete, com rótulo em Tinta 600, número em Number na cor do tema e linha de comparação em Caption (Atkinson Next 0.9375rem) Tinta Suave. O número aparece já no valor final; só conta do valor antigo ao novo quando o leitor troca de grupo.

### Índice de seções
Linha "Ir para" logo depois dos destaques de Escolas e Gestores: rótulo em Label e um marcador de página adesivo por seção, com fundo do tema a 15% sobre branco, faixa de 5px na cor do tema no topo, cantos superiores de 2px e inclinação alternada de -1.2° e 0.9° (sem inclinação com movimento reduzido); no hover, fundo a 26%. As âncoras usam o roteamento do painel. No filtro fixo, o botão "Topo" leva de volta ao início da aba.

### Portas do Início
Fim da página inicial: duas portas (Escolas em teal, Gestores em roxo), cada uma inteira clicável, com o nome do público em Label, um dado real em frase (número em 800 no tom de texto do tema), o pictograma de 10 figuras, uma linha do que há no painel e "Ver o painel… →". Abaixo, uma linha leva ao guia "Como ler o painel".

### Notas e avisos
Caixa em Trilho com raio de 6px e padding de 0.45rem 0.7rem, texto 0.9375rem em Tinta Suave, sem borda lateral. Usada na nota "sem margem de erro estimada" (o asterisco no valor fica em Tinta, negrito) e na explicação de "Um recorte por vez".

### Barra empilhada de faixas ordenadas
Até 4 faixas à vista para o leitor leigo. Quando a pesquisa tem mais (Velocidade: 7), faixas vizinhas são somadas (Até 50 Mbps, 51 a 250 Mbps, Mais de 250 Mbps) e as faixas originais, com a margem de erro de cada uma, ficam em "Ver em texto ou ouvir"; a nota do cartão avisa isso.

### Pastilha de ícone de seção
Ícone de traço de 1.9 em pastilha de 2.75rem com raio de 6px, fundo na cor do tema a 12% sobre branco, borda a 30% e traço na cor do tema, ao lado do título.

## Do's and Don'ts

### Do:
- **Do** defina `--sec` em cada nova seção e deixe fio da lição, ícone, número, destaque do gráfico e "Para pensar" herdarem dela.
- **Do** abra cada gráfico com uma frase em linguagem simples e feche cada cartão com a base e a fonte em Caption 0.875rem Tinta Suave, sobre um fio tracejado. "Ler em texto" termina com uma frase pronta para citar (frase do cartão, grupo, fonte e tabela).
- **Do** mostre no máximo 5 barras de início numa lista longa; as outras ficam atrás de "Ver os outros N".
- **Do** desenhe a margem de erro em toda barra e comparação, e comece as barras no zero.
- **Do** use Bricolage Grotesque em 800 para títulos e números, Atkinson Hyperlegible Next no texto, Atkinson Hyperlegible Mono só para rótulos de medida, e algarismos tabulares em todo valor.
- **Do** use sombras azul-marinho translúcidas e curtas, cantos de 3px nas folhas e 6px nos controles, etiqueta chanfrada nos botões principais.
- **Do** coloque toda animação dentro de `prefers-reduced-motion: no-preference` e garanta que impressão e imagem de compartilhamento saiam completas.
- **Do** mantenha contraste WCAG 2.2 AA: texto corrido em Tinta ou Tinta Suave sobre a folha; Amarelo Norte só como marca-texto ou post-it, sempre com texto em Tinta por cima; texto pequeno na cor do capítulo sempre em `--sec-texto`.
- **Do** termine cada nova seção de Escolas e Gestores com um "Para pensar": uma pergunta aberta, sem números, que leve o leitor à escola que ele conhece.
- **Do** compile o CSS com `npm run css` depois de mudar `src/*.css` ou classes do Tailwind no HTML; `css/site.css` vai versionado.

### Don't:
- **Don't** faça o painel parecer um relatório acadêmico: nada de tabelas densas como forma principal, notação estatística crua (IC, p, σ) ou texto miúdo como protagonista.
- **Don't** use vermelho, laranja de alerta ou ícones de perigo para dramatizar um número. As setas verde e vermelha só indicam direção.
- **Don't** use duas cores de tema na mesma seção, nem a cor de um capítulo em outro.
- **Don't** rotule diferenças entre grupos como "reais" ou "empates", nem dê cores diferentes aos grupos comparados.
- **Don't** use Amarelo Norte como cor de texto.
- **Don't** use carimbo ou selo: parecem validação oficial dos dados.
- **Don't** use anotações à mão para dizer algo que o leitor precise saber: são enfeite, com `aria-hidden`.
- **Don't** use sombras pretas puras, degradês de fundo nas capas nem sobretítulos acima dos títulos.
- **Don't** use mono em frases para o leitor: ela é escrita de régua, não voz.
- **Don't** marque avisos, notas ou cartões com borda lateral colorida; o acento de capítulo é o fio da lição.
