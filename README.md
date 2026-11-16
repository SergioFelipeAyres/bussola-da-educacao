# Bússola da Educação

Painel interativo com os dados de **gestores escolares** e **escolas** da pesquisa
**TIC Educação 2025** (NIC.br/Cetic.br), feito como produto da dissertação
*Visualização de dados como prática comunicacional: escolhas visuais, mediação e produção de sentidos* (Mestrado Profissional em
Comunicação Digital e Cultura de Dados, FGV).

O objetivo é tornar os dados compreensíveis para leitores não especializados, aplicando
princípios de design da informação: pictogramas no estilo Isotype, uma cor de destaque,
frases em linguagem simples ("7 em cada 10"), base e margem de erro sempre visíveis,
leitura confortável no celular e texto grande (nenhum texto abaixo de 14px), pensando
em pessoas idosas e com baixa visão. O visual é o de um caderno escolar: folha pautada
com margem, lições numeradas, marca-texto e uma pergunta "Para pensar" no fim de cada seção.

## O que tem no painel

- **Início**: apresentação do site com os principais números de gestores e de escolas.
- **Escolas**: camadas de acesso à internet, tipo e velocidade da conexão, problemas de
  conexão, equipamentos, regras sobre celular e IA, proteção de dados, câmeras e biometria,
  redes sociais e plataformas.
- **Gestores**: perfil (sexo, idade, cor ou raça, formação, tempo no cargo), tecnologia na
  rotina da gestão e uso de inteligência artificial.
- **Sobre**: o projeto, a pesquisa, os princípios de design, autoria e como citar.
- **Filtro de recorte** (região, área, rede, porte etc.) e **comparação entre grupos** com
  margem de erro.

## Estrutura

```
index.html              página (o site inteiro; as abas abrem em /, /escolas, /gestores e /sobre)
escolas.html, gestores.html, sobre.html
                        páginas de entrada dos endereços /escolas etc.: só abrem a aba certa do index.html
src/site.css            entrada do Tailwind: paleta (@theme) e famílias de fonte
src/painel.css          estilos do painel (gráficos, filtro, cartões, escala de texto)
src/caderno.css         a linguagem visual do caderno escolar (folha, lições, marca-texto)
css/site.css            CSS compilado a partir de src/ (vai versionado; não editar à mão)
js/dash-shim.js         carrega os dados e redesenha a página quando o filtro muda
js/painel.js            desenho dos gráficos
js/libras.js            "Ver em Libras": lista dos vídeos com intérprete (sem endereço, o botão mostra "em breve")
data/*.json             dados em formato longo (uma linha por indicador, recorte e resposta)
scripts/atualizar_dados.py  converte as tabelas .xlsx do Cetic.br nos arquivos de /data
DESIGN.md               sistema visual: cores, tipografia, componentes e regras
PRODUCT.md              público, propósito e compromissos do produto
```

O site é estático e não precisa de build para ser publicado: o CSS compilado
(`css/site.css`) vai no repositório.

## Ver localmente

Os dados são carregados com `fetch`, então a página precisa de um servidor (abrir o
arquivo direto no navegador não funciona):

```bash
python -m http.server 8000
# abra http://localhost:8000
```

No Windows, sem Python:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .claude/serve.ps1 -Port 8000
```

## Mudar o visual

O CSS é escrito em `src/` e compilado com o [Tailwind CSS](https://tailwindcss.com/) v4
(precisa do Node.js):

```bash
npm install
npm run css         # gera css/site.css uma vez
npm run css:watch   # recompila a cada mudança em src/ ou no HTML
```

Depois de mudar `src/*.css` (ou classes do Tailwind no HTML), rode `npm run css` e
versione o `css/site.css` junto. As regras do visual (paleta, tamanhos mínimos de texto,
contraste) estão no `DESIGN.md`.

## Publicar no GitHub Pages

Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.
O site fica em `https://<usuario>.github.io/<repositorio>/`.

## Atualizar os dados

1. Baixe no [Cetic.br](https://cetic.br/pt/pesquisa/educacao/) os zips de tabelas de
   gestores e de escolas e extraia cada um numa pasta.
2. Rode:

```bash
pip install openpyxl
python scripts/atualizar_dados.py pasta_gestores pasta_escolas
```

A lista de tabelas de escolas usadas fica no início do script (`ESCOLAS`).
Recortes cruzados (por exemplo, escolas particulares do Sudeste) não existem nas tabelas
publicadas; exigem os microdados da pesquisa.

## Fonte

Núcleo de Informação e Coordenação do Ponto BR. (2026). *Pesquisa sobre o uso das
tecnologias de informação e comunicação nas escolas brasileiras: TIC Educação 2025*
[Tabelas, v1.0]. Proporções, margens de erro e totais estimados.
