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

- Site estático, sem etapa de build, publicado no GitHub Pages com domínio próprio (`CNAME`).
- Páginas: Início (fato aleatório "Você sabia?", mapa das 5 regiões, portas para Escolas e Gestores), Escolas, Gestores, Sobre. `escolas.html`, `gestores.html` e `sobre.html` só redirecionam para a aba certa de `index.html`.
- Dados em formato longo em `data/*.json`, gerados por `scripts/atualizar_dados.py` a partir das tabelas .xlsx do Cetic.br.
- Filtro de recorte (região, área, rede, porte etc.) e comparação entre grupos com margem de erro.
- Gráficos desenhados em HTML/SVG sem biblioteca externa (o d3 saiu; a escala do Compare grupos é uma função própria), lógica em `js/painel.js` e `js/dash-shim.js`.
- O grupo escolhido vai no endereço (`?grupo=regiao-norte`), para links compartilhados mostrarem o mesmo número.
- Servidor local: `.claude/serve.ps1` na porta 8000 (ou `python -m http.server 8000`).

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
