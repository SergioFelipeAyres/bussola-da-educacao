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
- Páginas: Início (fato aleatório "Você sabia?", mapa das 5 regiões, portas para Escolas e Gestores), Escolas, Gestores, Sobre. `escolas.html`, `gestores.html` e `sobre.html` só redirecionam para a aba certa de `index.html`.
- Dados em formato longo em `data/*.json`, gerados por `scripts/atualizar_dados.py` a partir das tabelas .xlsx do Cetic.br. São baixados sob demanda (`js/dash-shim.js`): cada arquivo só na primeira vez que um desenho o pede, e a página Sobre não baixa nenhum.
- Filtro de recorte (região, área, rede, porte etc.) e comparação entre grupos com margem de erro.
- "Pergunte à Bússola" (`js/pergunte.js`): o leitor escreve uma pergunta ("qual o meio de comunicação mais usado no Nordeste?") e recebe o número com as mesmas regras do painel. Reconhece tema e grupo por palavras-chave, e nenhum número é gerado fora dos dados. Quando as palavras-chave não reconhecem a pergunta (erros de grafia como "conequissao", gíria), ou quando o leitor toca em "Não era isso?", uma IA (Worker da Cloudflare em `workers/pergunte-ia`, cota gratuita) só reescreve a pergunta em português correto; a versão reescrita passa pelas mesmas palavras-chave e o leitor vê "Entendi sua pergunta como: …". Sem o endereço do Worker em `IA_URL`, ou com a cota esgotada, a caixa funciona só com as palavras-chave. Cruzamentos que a pesquisa não publica são explicados. Cobre os 41 temas dos cartões de Escolas e Gestores (simples, como "escolas com internet", ou em ranking, como "o motivo mais citado" e "a faixa de idade mais comum"; quando a pergunta cita um item, como "mestrado" ou "Instagram", a resposta fala dele) e todos os grupos do filtro: região, área, capital ou interior, rede, tamanho da escola, até que série vai e, em Gestores, sexo, cor ou raça e idade. "Negros" responde com pretos e pardos separados, como a pesquisa publica. Perguntas como "qual região tem menos internet?" ou "onde os gestores mais usam IA?" comparam todos os grupos daquele tipo, com a regra das margens, e levam ao Compare grupos já no indicador e no tipo de grupo. Estados e capitais viram a região deles, com o aviso de que a pesquisa não publica números por estado. A página `testes/pergunte.html` confere tudo isso depois de cada mudança: 71 perguntas escritas à mão e uma varredura que faz todas as comparações possíveis (cada tema × cada tipo de grupo × "mais" e "menos") e confere, contra os dados, o grupo apontado e o empate pelas margens. Aberta no Início, logo depois da capa; em Escolas e Gestores, no botão "Perguntar" ao lado de "Como ler". "Ver no painel" leva ao cartão, já no grupo da pergunta.
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
- Autoria: Sérgio Felipe Ayres (autor) e Danielle Sanches de Almeida (orientadora), FGV. Código aberto no GitHub.

## Evidence on Hand

- Dados reais: `data/escolas.json`, `data/gestores.json`, `data/indicadores.json`.
- Fotos de autoria: `img/autor.webp`, `img/orientadora.jpg`.
- Referências acadêmicas citadas no Sobre: Bateman et al. (2010), Knaflic (2016), Spinillo (2023), Dastani (2002).
- Não existem depoimentos, métricas de uso ou resultados de testes com usuários publicados; não fabricar.

## Product Principles

1. **O leigo primeiro.** Se um leitor sem letramento em dados não entende, não está pronto, mesmo que esteja correto.
2. **Frase antes do gráfico.** Cada visualização é ancorada por uma afirmação em linguagem simples.
3. **Integridade visível.** Base e margem de erro nunca somem; nada sugere uma conclusão que os dados não sustentam.
4. **Celular é o padrão.** Tudo funciona numa coluna e ao toque.
5. **Ninguém fica de fora.** Todo dado visual tem equivalente em texto e áudio.

## Accessibility & Inclusion

Meta formal: **WCAG 2.2 AA** (contraste, navegação por teclado, leitor de tela, alternativas textuais para todos os gráficos). Leitores com baixo letramento em dados e estatística são o público-alvo, então clareza de linguagem é requisito, não acabamento.

O público inclui **pessoas idosas e com baixa visão**, e a acessibilidade é levada à risca:

- **Tamanho de texto:** nenhum texto visível abaixo de 14px; texto corrido em 17px, notas e legendas em 15px, a frase de cada gráfico em 19px. Tudo em rem, para acompanhar o tamanho de letra e o zoom do leitor. Na dúvida, o texto sobe.
- **Contraste:** texto pequeno na cor do tema usa o tom mais escuro (`--sec-texto`); texto sobre amarelo (marca-texto, post-it) é sempre em Tinta, porque as cores de tema não passam de 4.5:1 no amarelo.
- **Enfeites não carregam informação:** anotações à mão ficam escondidas do leitor de tela e nunca dizem algo que o leitor precise saber.
- **Movimento:** toda animação respeita `prefers-reduced-motion`.
- **Sem usar as mãos:** o site não traz controle próprio por rosto ou cabeça (pediria a câmera, e a imagem do rosto é dado sensível pela LGPD); ele funciona com os recursos do aparelho (rastreamento da cabeça, controle por voz, acionadores, controle pelo olhar). Para isso, todo controle tem 44px também com mouse, o nome falado começa pelo texto visível e nada depende só de passar o mouse ou de arrastar. A seção "Acessibilidade" do Sobre explica cada recurso em linguagem simples.
- **Libras:** o widget VLibras (governo federal) traduz qualquer texto da página, inclusive as frases que mudam com o filtro e o "Ler em texto". Para as partes que o leitor surdo mais precisa entender (abertura, guia "Como ler", cada seção, Compare e Sobre), há lugar para vídeos com intérprete humano ("Ver em Libras", em `js/libras.js`); sem vídeo, o botão aparece marcado "em breve". A tradução automática erra termos de estatística: os vídeos com intérprete são o caminho de qualidade, e testar com leitores surdos é parte do trabalho.
