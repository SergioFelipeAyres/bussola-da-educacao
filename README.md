# Bússola da Educação

Painel interativo com os dados de **gestores escolares** e **escolas** da pesquisa
**TIC Educação 2025** (NIC.br/Cetic.br), feito como produto da dissertação
*Visualização de dados como prática comunicacional: escolhas visuais, mediação e produção de sentidos* (Mestrado Profissional em
Comunicação Digital e Cultura de Dados, FGV).

O objetivo é tornar os dados compreensíveis para leitores não especializados, aplicando
princípios de design da informação: pictogramas no estilo Isotype, uma cor de destaque,
frases em linguagem simples ("7 em cada 10"), base e margem de erro sempre visíveis e
leitura confortável no celular.

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
index.html              página
css/painel.css          tokens de design (tema claro e escuro) e estilos
js/dash-shim.js         carrega os dados e redesenha a página quando o filtro muda
js/painel.js            desenho dos gráficos
data/*.json             dados em formato longo (uma linha por indicador, recorte e resposta)
vendor/d3-7.9.0.min.js  biblioteca d3
scripts/atualizar_dados.py  converte as tabelas .xlsx do Cetic.br nos arquivos de /data
```

Não há etapa de build: é um site estático.

## Ver localmente

Os dados são carregados com `fetch`, então a página precisa de um servidor (abrir o
arquivo direto no navegador não funciona):

```bash
python -m http.server 8000
# abra http://localhost:8000
```

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
