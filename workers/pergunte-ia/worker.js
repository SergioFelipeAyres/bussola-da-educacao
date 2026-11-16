/*
 * "Pergunte à Bússola" · ajuda da IA (Cloudflare Workers AI)
 *
 * A IA NÃO responde a pergunta e NÃO produz números. Ela só reescreve o que o leitor digitou num português
 * simples e correto, com as palavras que a caixa do site conhece ("conequissao no nordesti" → "conexão no Nordeste").
 * O site pega a frase reescrita e responde com os dados, pelas regras de sempre (js/pergunte.js).
 *
 * Recebe:  POST { "q": "texto do leitor" }
 * Devolve: { "q": "pergunta reescrita" }  ou  { "q": "" } quando não é sobre a pesquisa
 */

const ORIGENS = ['https://bussoladaeducacao.com.br', 'https://www.bussoladaeducacao.com.br', 'http://localhost:8000', 'http://127.0.0.1:8000'];

const SISTEMA = `Você ajuda a caixa de perguntas de um site sobre a pesquisa TIC Educação (tecnologia nas escolas brasileiras e seus gestores).
Muitos leitores escrevem com erros de ortografia, sem acento, com gíria ou abreviação. Sua única tarefa é REESCREVER a pergunta do leitor em português correto e simples, usando as palavras da lista abaixo, para que a caixa reconheça o tema e o grupo.

Regras:
- Não responda a pergunta. Não invente números. Não acrescente tema, grupo, lugar ou comparação que o leitor não pediu.
- Mantenha "mais", "menos", "qual região", "onde", "ou" etc. quando o leitor comparar grupos.
- Corrija nomes de lugares e grupos (ex.: "nordesti" → "Nordeste", "particulá" → "particular", "rurau" → "rural").
- Se a pergunta não tiver relação com escolas, gestores escolares ou tecnologia na educação, devolva vazio.
- Responda SOMENTE com JSON, sem explicação: {"q": "pergunta reescrita"} ou {"q": ""}.

Temas que a caixa conhece (escolas): internet na escola; internet para os alunos; computador e internet para os alunos; motivos para não ter internet; problemas com a internet (cai, qualidade ruim, sinal, pacote de dados, manutenção, pagar o plano, muitos acessos); velocidade da internet; fibra ótica; tipo de conexão (cabo, satélite, rádio, rede de celular 3G/4G/5G); alunos por computador; tipos de computador (computador de mesa, notebook, tablet); última compra de equipamentos; robótica; material maker; equipamentos audiovisuais; smart TV; celulares da escola; guia sobre o uso de IA; regras para o celular; proteção de dados; sistemas digitais na gestão; projetos de educação digital e midiática; reconhecimento facial; identificação por digital; câmeras de vídeo; alunos podem usar IA; comunicação com as famílias (WhatsApp, e-mail, site, redes sociais); redes sociais da escola.
Temas que a caixa conhece (gestores): gestores que usam IA; para que os gestores usam IA; onde a IA ajudou; reuniões com professores sobre tecnologia; reuniões com as famílias sobre tecnologia; temas das reuniões; professores sabem usar tecnologia nas aulas; a tecnologia está integrada ao ensino; formação dos gestores (graduação, especialização, mestrado, doutorado); tempo na direção; função de quem dirige escolas rurais; idade dos gestores; cor ou raça dos gestores; gestoras mulheres.
Grupos: regiões Norte, Nordeste, Sudeste, Sul, Centro-Oeste; escolas rurais ou urbanas; capital ou interior; escolas públicas, municipais, estaduais ou particulares; escolas pequenas ou grandes; escolas que vão até os anos iniciais, anos finais ou ensino médio; e, para gestores: mulheres ou homens, cor ou raça (branca, preta, parda, indígena, amarela), idade (jovens, 41 a 50 anos, mais de 50). Estados e cidades podem ficar como o leitor escreveu, só com a grafia corrigida.

Exemplos:
leitor: "quantas escola tem conequissao no nordesti" → {"q": "quantas escolas têm internet no Nordeste?"}
leitor: "as escola particulá tem camera" → {"q": "as escolas particulares têm câmeras de vídeo?"}
leitor: "qual regiao os diretor usa mais o chatgepeté" → {"q": "qual região os gestores usam mais IA?"}
leitor: "quem ganhou o jogo" → {"q": ""}`;

const cors = (origem) => ({
  'Access-Control-Allow-Origin': ORIGENS.includes(origem) ? origem : ORIGENS[0],
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin'
});
const json = (obj, origem, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(origem) } });

export default {
  async fetch(req, env) {
    const origem = req.headers.get('Origin') || '';
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors(origem) });
    if (req.method !== 'POST') return json({ erro: 'use POST' }, origem, 405);
    // só o próprio site (e o servidor local) pode usar a cota gratuita
    if (!ORIGENS.includes(origem)) return json({ erro: 'origem não permitida' }, origem, 403);

    let q = '';
    try { q = String((await req.json()).q || '').trim().slice(0, 300); } catch { return json({ erro: 'json inválido' }, origem, 400); }
    if (q.length < 3) return json({ q: '' }, origem);

    try {
      const r = await env.AI.run(env.MODELO || '@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: [{ role: 'system', content: SISTEMA }, { role: 'user', content: 'leitor: "' + q.replace(/"/g, "'") + '"' }],
        max_tokens: 120,
        temperature: 0
      });
      // o Workers AI às vezes já devolve o JSON como objeto, às vezes como texto
      const resp = r && r.response;
      let saida = '';
      if (resp && typeof resp === 'object') saida = String(resp.q || '');
      else {
        const m = String(resp || '').match(/\{[\s\S]*\}/);
        if (m) { try { saida = String(JSON.parse(m[0]).q || ''); } catch { /* resposta fora do formato: ignora */ } }
      }
      // só texto curto e simples volta para o site
      saida = saida.replace(/[<>{}]/g, '').trim().slice(0, 300);
      return json({ q: saida }, origem);
    } catch (e) {
      // cota do dia esgotada ou modelo fora do ar: o site segue só com as palavras-chave
      return json({ q: '', erro: 'ia indisponível' }, origem, 503);
    }
  }
};
