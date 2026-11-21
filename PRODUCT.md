# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Leitor principal: o público leigo em geral.** Famílias e cidadãos sem formação em estatística ou letramento em dados, que querem entender como a tecnologia está chegando às escolas brasileiras. Quando houver conflito entre públicos, a escolha que favorece esse leitor vence.

Públicos secundários, citados na página Sobre: gestores escolares, professores e jornalistas. Eles se beneficiam do rigor (base, margem de erro, como citar), mas não definem o nível de complexidade.

Situação de uso típica: leitura no celular, muitas vezes chegando por um dado compartilhado, com pouco tempo e sem contexto prévio sobre a pesquisa.

## Product Purpose

A Bússola da Educação (bussoladaeducacao.com.br) transforma as tabelas publicadas da pesquisa **TIC Educação 2025** (NIC.br/Cetic.br) em pictogramas, frases simples e gráficos, cobrindo dois públicos da pesquisa: **escolas** (conexão, equipamentos, regras sobre celular e IA, proteção de dados, vigilância, plataformas) e **gestores escolares** (perfil, tecnologia na rotina da gestão, uso de IA).

É o produto da dissertação *Visualização de dados como prática comunicacional: escolhas visuais, mediação e produção de sentidos* (Mestrado Profissional em Comunicação Digital e Cultura de Dados, FGV). A pergunta por trás dele: como apresentar dados de pesquisa de um jeito que leitores sem formação em estatística consigam ler, entender e usar?

**Sucesso = ser compreendido:** um leitor leigo lê um dado e o entende corretamente, sem ajuda. Compartilhamento, citação e continuidade são bem-vindos, mas não são o critério principal.

## Positioning

Não é um portal de tabelas nem um dashboard analítico: é uma aplicação testada de princípios de design da informação (Isotype, linguagem simples, integridade estatística) a dados públicos reais, como argumento de pesquisa. O diferencial é tornar a incerteza legível para leigos (margem de erro dita como faixa, base sempre visível) em vez de escondê-la ou exibi-la em notação técnica.

## Operating Context

- Site estático publicado no GitHub Pages com domínio próprio (`CNAME`), sem build na publicação. O CSS é escrito em `src/` com Tailwind CSS v4 e compilado com `npm run css` em `css/site.css`, que vai versionado.
- Páginas: Início (fato aleatório "Você sabia?", mapa das 5 regiões com o indicador escolhido numa rosa dos ventos e o número de cada região num post-it, portas para Escolas e Gestores), Escolas, Gestores, Acessibilidade, Sobre. `escolas.html`, `gestores.html`, `sobre.html` e `acessibilidade.html` só redirecionam para a aba certa de `index.html`.
- Dados em formato longo em `data/*.json`, gerados por `scripts/atualizar_dados.py` a partir das tabelas .xlsx do Cetic.br. São baixados sob demanda (`js/dash-shim.js`): cada arquivo só na primeira vez que um desenho o pede, e a página Sobre não baixa nenhum.
- Filtro de recorte (região, área, rede, porte etc.) e comparação entre grupos com margem de erro.
- "Pergunte à Bússola" (`js/pergunte.js`): não há texto livre: o leitor toca numa das perguntas prontas ("qual o meio de comunicação mais usado no Nordeste?"): as perguntas são geradas dos próprios dados (função `prontas()`), para cobrir tudo o que o painel deixa escolher. São cerca de 3.200: cada um dos 41 temas no Brasil, cada tema em cada grupo que as tabelas publicam (os mesmos do filtro), cada indicador do Compare grupos (`MEAS`, em `painel.js`) comparado por cada tipo de grupo e, nos rankings que têm frase por item (`focoTxt`), cada item no Brasil, em cada grupo e comparado ("Quantas escolas rurais usam WhatsApp?", "Escolas que usam Telegram: urbanas ou rurais?"); os usos da IA só no Brasil, com a base dita na pergunta e na resposta ("Entre os gestores que usam IA na gestão…"). Só entra a pergunta que tem resposta nas tabelas, e a pergunta repetida sai. A caixa usa as de até 70 caracteres e no máximo 2 longas (mais de 48) por vez, para os tamanhos variarem sem encher a caixa; no computador, no máximo 1 das 3 linhas pode ter menos de 3 perguntas, e no celular as longas ficam de fora; a cada visita sorteia tema a tema (cada tema com a mesma chance, por mais perguntas que tenha), misturando Brasil, grupos e comparações, no máximo 2 por capítulo e 2 por tema, e mostra as que cabem em 3 linhas, com pelo menos uma pergunta de cada um dos 7 capítulos do painel (Conexão, Equipamentos, Regras e IA, Comunicação, Quem são os gestores, Tecnologia na gestão e IA dos gestores) e pelo menos 4 temas diferentes; no celular, onde cabem 3 perguntas, as 3 são de capítulos diferentes. Na janela de Escolas e Gestores, só entram perguntas daquela aba (um capítulo de cada da aba), e as do grupo escolhido no painel vêm primeiro; depois que o leitor toca uma pergunta, a lista não muda mais sozinha. Se a caixa for estreita demais para cumprir tudo, vale o melhor sorteio, nesta prioridade: capítulos, temas, linhas cheias. Alguns temas têm uma frase mais curta só para o botão (`PRED`), para caberem. Não há botão para sortear outras e recebe o número com as mesmas regras do painel. Cada pergunta pronta passa pelo reconhecimento de tema e grupo por palavras-chave, e nenhum número é gerado fora dos dados. A IA que reescrevia perguntas digitadas com erro de grafia (Worker em `workers/pergunte-ia`) não é mais chamada pela caixa; o código fica para a bateria de testes. Cruzamentos que a pesquisa não publica são avisados ("a pesquisa não publica um número que junte…"), sem explicar o motivo, e cada grupo aparece separado. Cobre os 41 temas dos cartões de Escolas e Gestores (simples, como "escolas com internet", ou em ranking, como "o motivo mais citado" e "a faixa de idade mais comum"; quando a pergunta cita um item, como "mestrado" ou "Instagram", a resposta fala dele) e todos os grupos do filtro: região, área, capital ou interior, rede, tamanho da escola, até que série vai e, em Gestores, sexo, cor ou raça e idade. "Negros" responde com pretos e pardos separados, como a pesquisa publica. Perguntas como "qual região tem menos internet?" ou "onde os gestores mais usam IA?" comparam todos os grupos daquele tipo, com a regra das margens, e levam ao Compare grupos já no indicador e no tipo de grupo. Estados e capitais viram a região deles, com o aviso de que a pesquisa não publica números por estado. A página `testes/pergunte.html` confere tudo isso depois de cada mudança: 80 perguntas escritas à mão, 5 casos da ajuda da IA (com uma IA de mentira, sem gastar a cota) e uma varredura que faz todas as comparações possíveis (cada tema × cada tipo de grupo × "mais" e "menos") e confere, contra os dados, o grupo apontado e o empate pelas margens. Aberta no Início, logo depois da capa; em Escolas e Gestores, no botão "Perguntar" ao lado de "Como ler". "Ver no painel" leva ao cartão, já no grupo da pergunta.
- Gráficos desenhados em HTML/SVG sem biblioteca externa (o d3 saiu; a escala do Compare grupos é uma função própria), lógica em `js/painel.js` e `js/dash-shim.js`.
- O grupo escolhido vai no endereço (`?grupo=regiao-norte`), para links compartilhados mostrarem o mesmo número.
- Servidor local: `.claude/serve.ps1` (porta 8000 por padrão; `-Port` muda) ou `python -m http.server 8000`.
- Sistema visual: "O Caderno Escolar", descrito em `DESIGN.md` (fonte da verdade do visual) e resumido em `.impeccable/design.json`.

## Capabilities and Constraints

- Somente as **tabelas publicadas (v1.0)**: proporções, margens de erro e totais estimados a partir de amostra. Recortes cruzados (ex.: escolas particulares do Sudeste) não existem nelas e exigiriam microdados; não inventar.
- Comparações entre grupos são **descritivas**: mostram diferença em pontos percentuais e a margem de cada grupo, sem teste de significância. Não rotular diferenças como "reais" nem "empates"; setas neutras indicam só a direção.
- Barras sempre a partir do zero.
- Todo gráfico tem versão em texto que também pode ser ouvida.
- Idioma: português do Brasil.
- Terminologia da pesquisa: "gestores", "escolas", "base", "margem de erro", "recorte". Na interface, o leitor vê "grupo" ("Ver os números de…", "Um grupo por vez"); "recorte" aparece só no guia "Como ler", explicado como o nome que a pesquisa dá a cada grupo.

## Brand Commitments

- Nome: **Bússola da Educação**; marca com ícone de bússola.
- Voz: linguagem simples e direta, frases curtas, proporções humanizadas ("7 em cada 10"), margem dita como faixa ("pode variar entre 59% e 64%").
- Fonte sempre creditada: NIC.br/Cetic.br, TIC Educação 2025, com o "Como citar" na página Sobre.
- Autoria: Sérgio Felipe Ayres (autor) e Danielle Sanches de Almeida (orientadora), FGV. Código no GitHub, livre para uso não comercial (PolyForm Noncommercial 1.0.0 para o código, CC BY-NC 4.0 para textos e design; ver `LICENCA.md`).

## Evidence on Hand

- Dados reais: `data/escolas.json`, `data/gestores.json`, `data/indicadores.json`.
- Fotos de autoria: `img/autor.webp`, `img/orientadora.jpg`.
- Referências acadêmicas citadas no Sobre: Bateman et al. (2010), Knaflic (2016), Spinillo (2023), Dastani (2002).
- Não existem depoimentos, métricas de uso ou resultados de testes com usuários publicados; não fabricar.

## Product Principles

1. **O leigo primeiro.** Se um leitor sem letramento em dados não entende, não está pronto, mesmo que esteja correto.
2. **Frase antes do gráfico.** Cada visualização é ancorada por uma afirmação em linguagem simples. Com um grupo escolhido, a frase diz o grupo e como ele fica perto do Brasil.
3. **Integridade visível.** Base e margem de erro nunca somem; nada sugere uma conclusão que os dados não sustentam.
4. **Celular é o padrão.** Tudo funciona numa coluna e ao toque.
5. **Ninguém fica de fora.** Todo dado visual tem equivalente em texto e áudio.

## Accessibility & Inclusion

Meta formal: **WCAG 2.2 AA** (contraste, navegação por teclado, leitor de tela, alternativas textuais para todos os gráficos). Leitores com baixo letramento em dados e estatística são o público-alvo, então clareza de linguagem é requisito, não acabamento.

O público inclui **pessoas idosas e com baixa visão**, e a acessibilidade é levada à risca:

- **Tamanho de texto:** nenhum texto visível abaixo de 14px; texto corrido em 17px, notas e legendas em 15px, a frase de cada gráfico em 19px. Tudo em rem, para acompanhar o tamanho de letra e o zoom do leitor. No alto contraste, o mínimo sobe para 16px. Na dúvida, o texto sobe.
- **Contraste:** texto pequeno na cor do tema usa o tom mais escuro (`--sec-texto`); texto sobre amarelo (marca-texto, post-it) é sempre em Tinta, porque as cores de tema não passam de 4.5:1 no amarelo.
- **Alto contraste (versão para baixa visão):** botão no topo, com o ícone padrão de contraste (círculo meio preenchido), como nos sites do governo (e-MAG). Liga fundo preto, texto branco, links, grifos e botões em amarelo, e as cores dos capítulos em versões claras (acima de 7:1 no preto), para os gráficos manterem o código de cores; somem pautas, quadriculado, furos e sombras, e os cartões ganham borda. Pensado para quem usa lupa de tela, também tira todo movimento (entrada ao rolar, contagem dos números, rolagem suave, post-it voando), endireita o que é inclinado, sobe a letra mínima para 16px e deixa o texto um pouco mais encorpado e espaçado. A escolha fica guardada no navegador (`localStorage`) e é aplicada no `<head>`, antes de a página aparecer. Estilos em `src/contraste.css` (tudo sob `html[data-contraste]`), botão em `js/contraste.js`.
- **Letra maior:** botão ao lado do alto contraste (duas letras A, como o "A+" do e-MAG), separado dele porque são necessidades diferentes. Aumenta o site inteiro em 25%, vale nos dois modos de cor e também fica guardado no navegador. Até a barra ter 78em, os dois botões mostram só o ícone.
- **Enfeites não carregam informação:** anotações à mão ficam escondidas do leitor de tela e nunca dizem algo que o leitor precise saber.
- **Movimento:** toda animação respeita `prefers-reduced-motion` e some no alto contraste (`reduzMovimento()` no JavaScript).
- **Sem usar as mãos:** o site não traz controle próprio por rosto ou cabeça (pediria a câmera, e a imagem do rosto é dado sensível pela LGPD); ele funciona com os recursos do aparelho (rastreamento da cabeça, controle por voz, acionadores, controle pelo olhar). Para isso, todo controle tem 44px também com mouse, o nome falado começa pelo texto visível e nada depende só de passar o mouse ou de arrastar. A seção "Acessibilidade" do Sobre explica cada recurso em linguagem simples.
- **Libras:** o widget VLibras (governo federal) traduz qualquer texto da página, inclusive as frases que mudam com o filtro e o "Ler em texto". O botão dele fica no canto de baixo, à direita, para não cobrir os números no celular. Para as partes que o leitor surdo mais precisa entender (abertura, guia "Como ler", cada seção, Compare e Sobre), há lugar para vídeos com intérprete humano ("Ver em Libras", em `js/libras.js`); sem vídeo, o botão aparece marcado "em breve". A tradução automática erra termos de estatística: os vídeos com intérprete são o caminho de qualidade, e testar com leitores surdos é parte do trabalho.
