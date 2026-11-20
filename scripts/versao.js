// Carimba a versão de cada CSS e JS no endereço que as páginas usam (css/site.css?v=1a2b3c4d).
// O GitHub Pages deixa o navegador reaproveitar esses arquivos por uns 10 minutos: sem a versão, quem abriu o site
// pouco antes de uma publicação recebe o HTML novo com o CSS ou o JS antigo (o grifo some, o mapa novo quebra).
// A versão é um resumo do conteúdo do arquivo: só muda quando o arquivo muda.
// Roda sozinho no fim de `npm run css`; depois de mexer só num .js, rode `npm run versao` antes do commit.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const raiz = path.join(__dirname, '..');
const PAGINAS = ['index.html', '404.html'];
const versao = (arq) => crypto.createHash('sha1').update(fs.readFileSync(path.join(raiz, arq))).digest('hex').slice(0, 8);

let mudou = 0;
for (const pag of PAGINAS) {
  const f = path.join(raiz, pag);
  if (!fs.existsSync(f)) continue;
  const antes = fs.readFileSync(f, 'utf8');
  // href="css/x.css", src="/js/y.js", com ou sem ?v= anterior
  const depois = antes.replace(/((?:href|src)=")(\/?)((?:css|js)\/[\w.-]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")/g,
    (m, a, barra, arq, b) => fs.existsSync(path.join(raiz, arq)) ? a + barra + arq + '?v=' + versao(arq) + b : m);
  if (depois !== antes) { fs.writeFileSync(f, depois); mudou++; }
}
console.log(mudou ? 'versões atualizadas em ' + mudou + ' página(s)' : 'versões já em dia');
