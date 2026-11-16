/*
 * "Pergunte à Bússola": o leitor escreve uma pergunta do jeito dele e recebe o número da pesquisa.
 * Não usa IA: procura um TEMA e um GRUPO por palavras-chave e responde com os dados do próprio site,
 * pelas mesmas regras do painel ("N em cada 10" ou "em cada 100", margem de erro como faixa, "o mais citado"
 * só quando as margens não se tocam). Cruzamentos que a pesquisa não publica (ex.: particulares do Nordeste)
 * são explicados, e cada grupo aparece separado.
 *
 * Fica aberta no Início (#pergunte) e numa janela em Escolas e Gestores (botão "Perguntar", ao lado de
 * "Como ler este painel"). "Ver no painel" leva ao cartão certo, já no grupo da pergunta (window.mostraNoPainel,
 * definido no painel.js).
 *
 * Para ensinar uma palavra nova, acrescente-a à expressão "kw" do tema ou à lista GRUPOS.
 * A ordem dos TEMAS importa: o primeiro que casar com a pergunta vence, então os mais específicos vêm antes.
 */
(() => {
  const sem = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const n1 = (v) => v.toFixed(1).replace('.', ',');
  const ESCOLA = '<path d="M12 2.5L2.5 8.5h19z"/><path d="M4.5 9.5h15V21h-5.5v-5h-4v5H4.5z"/>';
  const PESSOA = '<circle cx="12" cy="5.6" r="3.4"/><path d="M5.5 22v-6.5a6.5 6.5 0 0 1 13 0V22z"/>';

  // ---------- grupos: palavras → recorte das tabelas ----------
  const SO_GESTOR = ['SEXO', 'COR OU RAÇA', 'FAIXA ETÁRIA'];
  const GRUPOS = [
    [/centro[ -]?oeste/, 'REGIÃO', 'Centro-Oeste'], [/\bnordeste\b/, 'REGIÃO', 'Nordeste'], [/\bsudeste\b/, 'REGIÃO', 'Sudeste'],
    [/\bsul\b/, 'REGIÃO', 'Sul'], [/\bnorte\b/, 'REGIÃO', 'Norte'],
    [/\brura(l|is)\b|\bcampo\b/, 'ÁREA', 'Rural'], [/\burbanas?\b|\bcidades?\b/, 'ÁREA', 'Urbana'],
    [/\bcapita(l|is)\b/, 'LOCALIZAÇÃO', 'Capital'], [/\binterior\b/, 'LOCALIZAÇÃO', 'Interior'],
    [/\bparticular(es)?\b|\bprivadas?\b/, 'DEPENDÊNCIA ADMINISTRATIVA', 'Particular'],
    [/\bmunicipa(l|is)\b|\bprefeitura\b/, 'DEPENDÊNCIA ADMINISTRATIVA', 'Municipal'], [/\bestadua(l|is)\b/, 'DEPENDÊNCIA ADMINISTRATIVA', 'Estadual'],
    [/\bpublicas?\b/, 'DEPENDÊNCIA ADMINISTRATIVA', 'Públicas (Municipal, Estadual e Federal)'],
    // tamanho da escola (número de matrículas)
    [/\bpequenas?\b|\bate 50 (matriculas|alunos)\b|\bmenos de 50 (matriculas|alunos)\b/, 'PORTE', 'Até 50 matrículas'],
    [/\b51 a 150\b/, 'PORTE', 'De 51 a 150 matrículas'], [/\b151 a 300\b/, 'PORTE', 'De 151 a 300 matrículas'],
    [/\b301 a 500\b/, 'PORTE', 'De 301 a 500 matrículas'], [/\b501 a 1\.?000\b/, 'PORTE', 'De 501 a 1.000 matrículas'],
    [/\bgrandes?\b|\bmais de (1\.?000|mil) (matriculas|alunos)\b/, 'PORTE', 'Mais de 1.000 matrículas'],
    // até que série vai
    [/ensino medio|\bmedio\b|educacao profissional|\btecnic/, 'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO', 'Até Ensino Médio ou Educação Profissional'],
    [/anos finais|fundamental (2|ii)\b|6.? ao 9.? ano/, 'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO', 'Até anos finais do Ensino Fundamental'],
    [/anos iniciais|fundamental (1|i)\b|1.? ao 5.? ano/, 'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO', 'Até anos iniciais do Ensino Fundamental'],
    // só em Gestores: sexo, cor ou raça e idade
    [/\bmulher(es)?\b|\bgestoras\b|\bdiretoras\b/, 'SEXO', 'Feminino'], [/\bhomens\b/, 'SEXO', 'Masculino'],
    [/\bbrancos?\b|\bbrancas?\b/, 'COR OU RAÇA', 'Branca'], [/\bpretos?\b|\bpretas?\b|\bnegr(o|a)s?\b/, 'COR OU RAÇA', 'Preta'],
    [/\bpardos?\b|\bpardas?\b|\bnegr(o|a)s?\b/, 'COR OU RAÇA', 'Parda'], [/\bindigenas?\b/, 'COR OU RAÇA', 'Indígena'], [/\bamarel(o|a)s?\b/, 'COR OU RAÇA', 'Amarela'],
    [/\bjovens?\b|\bate 40\b|\bmenos de 40\b/, 'FAIXA ETÁRIA', 'Até 40 anos'], [/\b41 a 50\b|\bquarenta\b/, 'FAIXA ETÁRIA', 'De 41 a 50 anos'],
    [/\bmais (velhos|velhas)\b|\b(mais|acima) de 50( anos)?\b|\b51 anos\b|\bidosos?\b/, 'FAIXA ETÁRIA', 'De 51 anos ou mais']
  ];
  const NOME_TIPO = { 'REGIÃO': 'Região', 'ÁREA': 'Urbana ou rural', 'LOCALIZAÇÃO': 'Capital ou interior', 'DEPENDÊNCIA ADMINISTRATIVA': 'Pública ou particular',
    'PORTE': 'Tamanho da escola', 'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO': 'Até que série vai', 'SEXO': 'Sexo', 'COR OU RAÇA': 'Cor ou raça', 'FAIXA ETÁRIA': 'Idade' };
  const segCurto = (s) => ({ 'Públicas (Municipal, Estadual e Federal)': 'Públicas', 'Feminino': 'Mulheres', 'Masculino': 'Homens',
    'Até Ensino Médio ou Educação Profissional': 'Até o Médio ou Profissional', 'Até anos finais do Ensino Fundamental': 'Até os anos finais', 'Até anos iniciais do Ensino Fundamental': 'Até os anos iniciais' })[s] || s;
  const ENTRE = { Rural: 'escolas rurais', Urbana: 'escolas urbanas', Capital: 'escolas das capitais', Interior: 'escolas do interior', Particular: 'escolas particulares', Municipal: 'escolas municipais', Estadual: 'escolas estaduais' };
  const NIVEL = { 'Até Ensino Médio ou Educação Profissional': 'escolas que vão até o Ensino Médio ou a Educação Profissional', 'Até anos finais do Ensino Fundamental': 'escolas que vão até os anos finais do Fundamental', 'Até anos iniciais do Ensino Fundamental': 'escolas que vão até os anos iniciais do Fundamental' };
  const nomeGrupo = (cat, seg) => cat === 'REGIÃO' ? 'escolas da região ' + seg : cat === 'PORTE' ? 'escolas ' + (/^Até|^Mais/.test(seg) ? 'com ' + seg.toLowerCase() : seg.replace(/^De /, 'de ')) :
    cat === 'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO' ? NIVEL[seg] : cat === 'SEXO' ? (seg === 'Feminino' ? 'gestoras (mulheres)' : 'gestores homens') :
    cat === 'COR OU RAÇA' ? 'gestores de cor ' + seg.toLowerCase() : cat === 'FAIXA ETÁRIA' ? 'gestores ' + (seg === 'Até 40 anos' ? 'com até 40 anos' : seg === 'De 51 anos ou mais' ? 'com 51 anos ou mais' : 'de 41 a 50 anos') :
    ENTRE[seg] || 'escolas públicas';
  const quem = (t, cat, seg) => !cat ? 'No Brasil' : SO_GESTOR.includes(cat) ? (cat === 'SEXO' && seg === 'Feminino' ? 'Entre as gestoras' : 'Entre os ' + nomeGrupo(cat, seg)) :
    t.ds === 'gestores' ? (cat === 'REGIÃO' ? 'Entre os gestores da região ' + seg : 'Entre os gestores das ' + nomeGrupo(cat, seg)) : 'Entre as ' + nomeGrupo(cat, seg);

  // ---------- temas: palavras → indicador e cartão do painel ----------
  // tema simples: ind/resp (e grupo), "txt" com o sujeito ("escolas têm…"; com um grupo, o sujeito sai)
  // ranking: "itens" = [rótulo, ind, grupo, resp ou lista de respostas somadas]; "um"/"varios" nomeiam o primeiro;
  //          "val" diz o que o número conta; "base" explica de quem se fala, quando não são todas as escolas/gestores
  // "propria": tipo de grupo que é o próprio tema (ex.: em "idade", "jovens" é a resposta, não um grupo)
  const IA = '(\\bia\\b|inteligencia artificial|chat ?gpt|gemini|copilot)';
  const TEMAS = [
    // ----- Escolas · Conexão -----
    { nome: 'Motivos para não ter internet', sec: 'teal', ds: 'escolas', card: 'card-sem-internet', ranking: true,
      kw: /sem internet|nao (tem|tenha|tem acesso|possui)[a-z ]*internet|motivo|por ?que .*internet|falta de internet/,
      itens: [['não há infraestrutura na região', 'A20', 'Falta de infraestrutura de acesso à Internet na região'], ['não há infraestrutura na escola', 'A20', 'Falta de infraestrutura de acesso à Internet na escola'],
        ['custo alto', 'A20', 'Alto custo de conexão à Internet'], ['escola sem energia elétrica', 'A20', 'Ausência de energia elétrica na escola'], ['energia elétrica falha', 'A20', 'O fornecimento de energia elétrica na escola é intermitente'],
        ['a escola diz não precisar', 'A20', 'A escola não necessita de Internet'], ['pouca habilidade da equipe', 'A20', 'Os funcionários da escola possuem pouca habilidade no uso da Internet'],
        ['preocupação com segurança e privacidade', 'A20', 'Os funcionários da escola possuem preocupação com segurança e privacidade'], ['equipamentos quebrados ou roubados', 'A20', 'Os equipamentos da escola para conexão à Internet estão quebrados, em manutenção ou foram roubados']],
      um: 'o motivo mais citado', varios: 'os motivos mais citados', val: 'citam esse motivo', base: 'Entre as escolas sem internet. Como são poucas, as margens de erro são grandes.' },
    { nome: 'Problemas com a internet', sec: 'teal', ds: 'escolas', card: 'card-problemas', ranking: true,
      kw: /problema|\bcai\b|caindo|falha|instavel|sinal|pacote|aguenta|qualidade da internet|internet ruim/,
      itens: [['a internet cai ou para', 'A19', 'A Internet cai ou para de funcionar'], ['a qualidade fica ruim', 'A19', 'A qualidade da Internet fica ruim'], ['o sinal não chega às salas mais distantes', 'A19', 'O sinal de Internet não chega às salas que ficam mais distantes do roteador'],
        ['o pacote de dados acaba', 'A19', 'O pacote de Internet da escola acaba'], ['falta manutenção nos equipamentos', 'A19', 'Falta manutenção para os equipamentos de Internet da escola'],
        ['é difícil pagar o plano', 'A19', 'A escola tem dificuldades para pagar pelo plano de Internet'], ['não aguenta muitos acessos ao mesmo tempo', 'A19', 'A Internet da escola não suporta muitos acessos ao mesmo tempo']].map((x) => [...x, ['Sempre', 'Quase sempre']]),
      um: 'o problema mais frequente', varios: 'os problemas mais frequentes', val: 'dizem que isso acontece sempre ou quase sempre', base: 'Entre as escolas com internet.',
      foco: [[/\bcai\b|caindo|para de funcionar/, 0], [/qualidade|ruim/, 1], [/sinal/, 2], [/pacote/, 3], [/manutencao/, 4], [/pagar|caro|custo/, 5], [/acessos|aguenta/, 6]],
      focoTxt: (l) => 'dizem que ' + l.replace(/^a internet /, 'a internet ') + ' sempre ou quase sempre' },
    { nome: 'Velocidade da internet', sec: 'teal', ds: 'escolas', card: 'card-velocidade', ranking: true, kw: /velocidade|lenta|rapida|mbps|megas?\b|banda/,
      itens: [['até 50 Mbps', 'A3_1', '', ['Até 10 Mbps', 'De 11 Mbps a 50 Mbps']], ['de 51 a 250 Mbps', 'A3_1', '', ['De 51 Mbps a 100 Mbps', 'De 101 Mbps a 250 Mbps']],
        ['mais de 250 Mbps', 'A3_1', '', ['De 251 Mbps a 500 Mbps', 'De 501 Mbps a 1 Gbps', 'Mais de 1 Gbps']], ['velocidade não informada', 'A3_1', '', 'Não sabe']],
      um: 'a situação mais comum', varios: 'as situações mais comuns', val: 'estão nessa situação', base: 'Entre as escolas com internet. Mbps mede a velocidade: quanto maior, mais rápida.' },
    { nome: 'Fibra ótica', sec: 'teal', ds: 'escolas', card: 'card-tipo-conexao', kw: /fibra/, ind: 'A2', resp: 'Conexão via fibra ótica',
      txt: 'das escolas com internet estão conectadas por fibra ótica', txtG: 'das que têm internet estão conectadas por fibra ótica' },
    { nome: 'Tipo de conexão', sec: 'teal', ds: 'escolas', card: 'card-tipo-conexao', ranking: true, kw: /tipo de (conexao|internet)|\bcabo\b|satelite|\bradio\b|[345]g\b|rede de celular|dados moveis|(conexao|internet) (por|via) |como .*conecta/,
      itens: [['fibra ótica', 'A2', '', 'Conexão via fibra ótica'], ['cabo', 'A2', '', 'Conexão via cabo'], ['satélite', 'A2', '', 'Conexão via satélite'], ['rede de celular (3G, 4G ou 5G)', 'A2', '', 'Modem 3G, 4G ou 5G'], ['rádio', 'A2', '', 'Conexão via rádio']],
      um: 'a conexão mais comum', varios: 'as conexões mais comuns', val: 'usam essa conexão como principal', base: 'Entre as escolas com internet.',
      foco: [[/\bcabo\b/, 1], [/satelite/, 2], [/[345]g\b|rede de celular/, 3], [/\bradio\b/, 4]], focoTxt: (l) => 'usam ' + l + ' como conexão principal' },
    // ----- Escolas · Equipamentos -----
    { nome: 'Alunos por computador', sec: 'orange', ds: 'escolas', card: 'card-alunos-pc', ranking: true, kw: /alunos? por computador|quantos alunos (dividem|por)|dividem .*computador/,
      itens: [['até 5 alunos por computador', 'B4C', '', 'Até 5 alunos'], ['de 5 a 10 alunos por computador', 'B4C', '', 'De 5,1 a 10 alunos'], ['de 10 a 15 alunos por computador', 'B4C', '', 'De 10,1 a 15 alunos'], ['de 15 a 20 alunos por computador', 'B4C', '', 'De 15,1 a 20 alunos'],
        ['de 20 a 30 alunos por computador', 'B4C', '', 'De 20,1 a 30 alunos'], ['de 30 a 40 alunos por computador', 'B4C', '', 'De 30,1 a 40 alunos'], ['de 40 a 50 alunos por computador', 'B4C', '', 'De 40,1 a 50 alunos'], ['de 50 a 100 alunos por computador', 'B4C', '', 'De 50,1 a 100 alunos'],
        ['mais de 100 alunos por computador', 'B4C', '', '100,1 alunos ou mais'], ['sem computador para os alunos', 'B4C', '', 'Não possui computador disponível para uso dos alunos']],
      um: 'a situação mais comum', varios: 'as situações mais comuns', val: 'estão nessa situação' },
    { nome: 'Tipos de computador', sec: 'orange', ds: 'escolas', card: 'card-computadores', ranking: true, kw: /tipos? de computador|notebook|tablet|computador de mesa|desktop|portat/,
      itens: [['computador de mesa', 'B2', 'Computador de mesa'], ['computador portátil', 'B2', 'Computador portátil'], ['tablet', 'B2', 'Tablet']],
      um: 'o tipo mais comum', varios: 'os tipos mais comuns', val: 'têm esse tipo de computador', base: 'Entre as escolas que têm computador.',
      foco: [[/mesa|desktop/, 0], [/notebook|portat|laptop/, 1], [/tablet/, 2]], focoTxt: (l) => 'têm ' + l },
    { nome: 'Computador e internet para os alunos', sec: 'teal', ds: 'escolas', card: 'card-camadas', kw: /computador|\bpcs?\b|\bmicros?\b/, ind: 'A8', txt: 'escolas oferecem computador e internet aos alunos' },
    { nome: 'Internet para os alunos', sec: 'teal', ds: 'escolas', card: 'card-camadas', kw: /(internet|conex|wi.?fi).*(aluno|estudante)|(aluno|estudante).*(internet|conex|wi.?fi)/, ind: 'A7', txt: 'escolas oferecem internet para os alunos' },
    { nome: 'Internet na escola', sec: 'teal', ds: 'escolas', card: 'card-camadas', kw: /internet|\bnet\b|conectad|conexao|wi.?fi|online/, ind: 'A1', txt: 'escolas têm acesso à internet' },
    { nome: 'Última compra de equipamentos', sec: 'orange', ds: 'escolas', card: 'card-renovacao', ranking: true, kw: /compra|comprou|doac|renov|equipamentos? novos?|ultima vez/,
      itens: [['há menos de 1 ano', 'K1_1', '', 'Há menos de 1 ano'], ['entre 1 e 5 anos', 'K1_1', '', 'Entre 1 e 5 anos'], ['entre 6 e 10 anos', 'K1_1', '', 'Entre 6 e 10 anos'], ['há mais de 10 anos', 'K1_1', '', 'Há mais de 10 anos'], ['não sabem', 'K1_1', '', 'Não sabe']],
      um: 'o tempo mais comum desde a última compra ou doação', varios: 'os tempos mais comuns', val: 'estão nessa situação', base: 'Entre as escolas com computador.' },
    { nome: 'Robótica', sec: 'orange', ds: 'escolas', card: 'card-recursos', kw: /robotica|\brobo/, ind: 'B15', txt: 'escolas têm material para aulas de robótica' },
    { nome: 'Material maker', sec: 'orange', ds: 'escolas', card: 'card-recursos', kw: /maker|impressora 3d|cultura maker/, ind: 'B18', txt: 'escolas têm material para atividades maker' },
    { nome: 'Equipamentos audiovisuais', sec: 'orange', ds: 'escolas', card: 'card-recursos', kw: /audiovisua|projetor|datashow|caixa de som/, ind: 'B17', txt: 'escolas têm equipamentos audiovisuais' },
    { nome: 'Smart TV', sec: 'orange', ds: 'escolas', card: 'card-recursos', kw: /smart ?tv|televis|\btv\b/, ind: 'B14', txt: 'escolas têm smart TV ou conversor' },
    { nome: 'Celulares da escola', sec: 'orange', ds: 'escolas', card: 'card-recursos', kw: /celulares? (da escola|para (os )?alunos|para (os )?professores)|empresta .*celular/, ind: 'B16', txt: 'escolas têm celulares para alunos e professores' },
    // ----- Escolas · Regras, IA e dados -----
    { nome: 'Guia sobre o uso de IA', sec: 'purple', ds: 'escolas', card: 'card-politicas', kw: new RegExp('(guia|regra|orienta|norma).*' + IA + '|' + IA + '.*(guia|regra|orienta|norma)'), ind: 'E5A', txt: 'escolas têm um guia sobre o uso de inteligência artificial' },
    { nome: 'Regras para o celular', sec: 'purple', ds: 'escolas', card: 'card-politicas', kw: /celular|telefone|smartphone|\bcel\b/, ind: 'C3C', txt: 'escolas têm regras para o uso do celular pelos alunos' },
    { nome: 'Proteção de dados', sec: 'purple', ds: 'escolas', card: 'card-politicas', kw: /protecao de dados|dados pessoais|dados dos alunos|lgpd|privacidade/, ind: 'H1', txt: 'escolas têm política de proteção de dados' },
    { nome: 'Sistemas digitais na gestão', sec: 'purple', ds: 'escolas', card: 'card-politicas', kw: /sistemas? (digita|de gestao)|gestao digital|software de gestao/, ind: 'E1D', txt: 'escolas usam sistemas digitais na gestão escolar' },
    { nome: 'Projetos de educação digital e midiática', sec: 'purple', ds: 'escolas', card: 'card-politicas', kw: /educacao (digital|midiatica)|midiatica|projetos? de educacao/, ind: 'I5', txt: 'escolas têm projetos de educação digital e midiática' },
    { nome: 'Reconhecimento facial', sec: 'purple', ds: 'escolas', card: 'card-vigilancia', kw: /facial|reconhecimento/, ind: 'E4B', txt: 'escolas usam reconhecimento facial dos alunos' },
    { nome: 'Identificação por digital', sec: 'purple', ds: 'escolas', card: 'card-vigilancia', kw: /impressao digital|(pela|por) digital|biometri|palma da mao|digitais dos alunos/, ind: 'E4A', txt: 'escolas identificam os alunos pela digital ou palma da mão' },
    { nome: 'Câmeras de vídeo', sec: 'purple', ds: 'escolas', card: 'card-vigilancia', kw: /camera|vigilancia|monitorament|seguranca da escola|cameras? de seguranca/, ind: 'E3', txt: 'escolas têm câmeras de vídeo' },
    // ----- Gestores · IA (antes de "IA dos alunos", que casa com qualquer menção a IA) -----
    { nome: 'Para que os gestores usam IA', sec: 'purple', ds: 'gestores', card: 'card-ia-usos', ranking: true, pessoa: true, kw: new RegExp('(para (que|qu[eê])|como) .*' + IA + '|usos? d[ae] ' + IA + '|usam (a )?' + IA + ' para'),
      itens: ['Transcrever, resumir, revisar ou traduzir textos', 'Criar conteúdos audiovisuais, como imagens, apresentações de slides, vídeos', 'Produzir relatórios', 'Organizar documentos e certidões da escola',
        'Criar convites, avisos e comunicados automaticamente', 'Gerar mensagens e respostas automáticas', 'Criar cronogramas e fluxos de trabalho escolares', 'Organizar e planejar atividades pedagógicas e de gestão',
        'Analisar dados sobre o desempenho dos alunos, as práticas pedagógicas ou o funcionamento da escola', 'Monitorar os serviços ofertados pela escola, como alimentação escolar, transporte e limpeza', 'Aprimorar os sistemas de segurança da escola']
        .map((g) => [g.charAt(0).toLowerCase() + g.slice(1), 'D9B', g]),
      um: 'o uso mais citado', varios: 'os usos mais citados', val: 'usam a IA para isso', base: 'Entre os gestores que usam IA na gestão.' },
    { nome: 'Onde a IA ajudou', sec: 'purple', ds: 'gestores', card: 'card-ia-contrib', ranking: true, pessoa: true, kw: new RegExp('(ajud|contribu|melhor|benefici).*' + IA + '|' + IA + '.*(ajud|contribu|melhor|benefici)'),
      itens: [['comunicação com as famílias', 'D9C', 'Comunicação com pais e responsáveis'], ['bem-estar dos alunos', 'D9C', 'Promoção do bem-estar dos alunos'], ['melhorar a aprendizagem', 'D9C', 'Melhoria da aprendizagem dos alunos'],
        ['identificar dificuldades de aprendizagem', 'D9C', 'Identificação das dificuldades de aprendizagem dos alunos'], ['incluir alunos com deficiência', 'D9C', 'Inclusão de alunos com deficiência'],
        ['segurança e prevenção à violência', 'D9C', 'Segurança e prevenção à violência na escola'], ['integrar as áreas pedagógica, financeira e administrativa', 'D9C', 'Integração entre as áreas de gestão pedagógica, financeira e administrativa'],
        ['manter as aulas em emergências', 'D9C', 'Acesso às atividades educacionais em períodos de emergência, como durante crises climáticas, de saúde, conflitos armados, entre outros'], ['reduzir evasão, faltas e abandono', 'D9C', 'Redução de evasão, faltas ou abandono escolar dos alunos']],
      um: 'a área em que a IA mais ajudou', varios: 'as áreas em que mais ajudou', val: 'dizem que a IA contribuiu nisso', base: 'Entre os gestores que usam IA na gestão.' },
    { nome: 'Alunos podem usar IA', sec: 'purple', ds: 'escolas', card: 'card-politicas', kw: new RegExp('(alun|estudant|permit|deix|liber|proib|pode).*' + IA + '|' + IA + '.*(alun|estudant|permit|deix|liber|proib)'), ind: 'E5B', txt: 'escolas permitem que os alunos usem inteligência artificial' },
    { nome: 'Gestores que usam IA', sec: 'purple', ds: 'gestores', card: 'card-ia-adocao', pessoa: true, kw: new RegExp(IA), ind: 'D9A',
      nota: [/gestor|diretor|direc/, 'Na pesquisa, o uso de IA é perguntado aos gestores, sobre a gestão da escola. Das escolas, a pesquisa pergunta se permitem que os alunos usem IA e se têm um guia sobre IA (experimente "escolas permitem IA aos alunos?").'], txt: 'gestores já usam inteligência artificial na gestão da escola' },
    // ----- Gestores · Tecnologia na gestão (reuniões antes de "comunicação", que também fala de famílias) -----
    { nome: 'Reuniões com professores sobre tecnologia', sec: 'blue', ds: 'gestores', card: 'card-reunioes', pessoa: true, kw: /reuni.*(professor|funcionari|equipe)|(professor|funcionari|equipe).*reuni/, ind: 'D3_1', txt: 'gestores fizeram reunião com professores e funcionários sobre tecnologia nos últimos 12 meses' },
    { nome: 'Reuniões com as famílias sobre tecnologia', sec: 'blue', ds: 'gestores', card: 'card-reunioes', pessoa: true, kw: /reuni.*(pais|familia|responsav)|(pais|familia|responsav).*reuni/, ind: 'D6', txt: 'gestores fizeram reunião com pais, mães e responsáveis sobre tecnologia nos últimos 12 meses' },
    { nome: 'Temas das reuniões', sec: 'blue', ds: 'gestores', card: 'card-temas', ranking: true, pessoa: true, kw: /temas?\b|assuntos?|discut|pautas?\b|reuni/,
      itens: [['saúde mental dos alunos', 'D7', 'Impactos das tecnologias digitais na saúde mental dos alunos'], ['saúde mental dos professores', 'D7', 'Impactos das tecnologias digitais na saúde mental dos professores'],
        ['impacto na prática pedagógica', 'D7', 'Impactos das tecnologias digitais na prática pedagógica dos professores'], ['regras para o uso de IA', 'D7', 'Regras para uso de ferramentas de Inteligência Artificial pelos alunos ou professores'],
        ['regras para o uso de celular', 'D7', 'Regras para uso de celulares pelos alunos nas dependências da escola'], ['casos de cyberbullying, discriminação e vazamento de imagens', 'D7', 'Ações em relação a casos de cyberbullying, discriminação, vazamento de imagens ou outras situações ocorridas na Internet com os alunos da escola'],
        ['uso seguro e crítico da tecnologia no currículo', 'D7', 'Inclusão de atividades sobre uso seguro, crítico e responsável das tecnologias digitais no currículo da escola'], ['educação midiática no currículo', 'D7', 'Inclusão de atividades sobre educação midiática e uso crítico das mídias no currículo da escola']],
      um: 'o tema mais discutido', varios: 'os temas mais discutidos', val: 'discutiram esse tema', base: 'Temas discutidos em reuniões sobre tecnologia nos últimos 12 meses.' },
    { nome: 'Professores sabem usar tecnologia nas aulas', sec: 'blue', ds: 'gestores', card: 'card-percepcao', pessoa: true, kw: /professor.*(sabem|habilidade|preparad|capacit)|(habilidade|preparad|capacit).*professor/,
      ind: 'D8', grupo: 'Os professores da escola possuem habilidades para integrar tecnologias digitais às atividades educacionais', resp: 'Concorda', txt: 'gestores concordam que os professores têm habilidade para integrar a tecnologia às aulas' },
    { nome: 'A tecnologia está integrada ao ensino?', sec: 'blue', ds: 'gestores', card: 'card-percepcao', ranking: true, pessoa: true, kw: /integrad|curriculo|projeto politico|pedagogic/,
      itens: [['está no Projeto Político Pedagógico', 'D8', 'O uso de tecnologias digitais em atividades educacionais está integrado ao Projeto Político Pedagógico da escola'], ['está integrada ao currículo', 'D8', 'O uso de tecnologias digitais em atividades educacionais está integrado ao currículo da escola'],
        ['os professores têm habilidade para integrá-la', 'D8', 'Os professores da escola possuem habilidades para integrar tecnologias digitais às atividades educacionais'], ['direção e coordenação planejam seu uso', 'D8', 'A direção e a coordenação participam do planejamento do uso de tecnologias digitais em atividades educacionais na escola'],
        ['a escola mede seu impacto na aprendizagem', 'D8', 'A escola monitora o impacto do uso de tecnologias digitais na aprendizagem dos alunos por meio de avaliações e indicadores'], ['a gestão recebeu orientação da rede de ensino', 'D8', 'As equipes de gestão e coordenação da escola receberam orientações da rede de ensino sobre como integrar tecnologias digitais em atividades educacionais']]
        .map((x) => [...x, 'Concorda']),
      um: 'a afirmação com mais concordância', varios: 'as afirmações com mais concordância', val: 'concordam com ela', aspas: true },
    // ----- Escolas · Comunicação -----
    { nome: 'Comunicação', sec: 'pink', ds: 'escolas', card: 'card-canais', ranking: true, kw: /comunica|mensage|aplicativo|whats|zap|telegram|plataforma|familias|\bpais\b/,
      itens: [['WhatsApp', 'F4A', 'WhatsApp'], ['Telegram', 'F4A', 'Telegram'], ['plataforma ou ambiente virtual de aprendizagem', 'G4A', ''], ['aplicativo próprio da escola', 'F5', '']],
      um: 'o meio mais usado', varios: 'os meios mais usados', val: 'usam esse meio',
      foco: [[/whats|zap/, 0], [/telegram/, 1], [/plataforma|ambiente virtual/, 2], [/aplicativo proprio|app proprio|aplicativo da escola/, 3]], focoTxt: (l) => 'usam ' + l },
    { nome: 'Redes sociais', sec: 'pink', ds: 'escolas', card: 'card-redes', ranking: true, kw: /rede social|redes sociais|instagram|facebook|youtube|tiktok|twitter/,
      itens: [['Instagram', 'F3', 'Instagram'], ['Facebook', 'F3', 'Facebook'], ['YouTube', 'F3', 'YouTube'], ['TikTok', 'F3', 'TikTok'], ['X (Twitter)', 'F3', 'Twitter ou X']],
      um: 'a rede social mais usada', varios: 'as redes sociais mais usadas', val: 'têm perfil nela',
      foco: [[/instagram/, 0], [/facebook/, 1], [/youtube/, 2], [/tiktok/, 3], [/twitter|\bx\b/, 4]], focoTxt: (l) => 'têm perfil no ' + l },
    // ----- Gestores · Perfil -----
    { nome: 'Formação dos gestores', sec: 'blue', ds: 'gestores', card: 'card-formacao', ranking: true, pessoa: true, kw: /formacao|pos.?graduacao|especializacao|mestrado|doutorado|estud|escolaridade/,
      itens: [['especialização ou pós-graduação', 'A4', 'Especialização ou pós-graduação'], ['mestrado', 'A4', 'Mestrado'], ['doutorado', 'A4', 'Doutorado']],
      um: 'a formação mais comum além da graduação', varios: 'as formações mais comuns', val: 'têm essa formação',
      foco: [[/especializacao|pos.?grad/, 0], [/mestrado|mestres?\b/, 1], [/doutorado|doutor/, 2]], focoTxt: (l) => 'têm ' + l },
    { nome: 'Tempo na direção', sec: 'blue', ds: 'gestores', card: 'card-tempo', ranking: true, pessoa: true, kw: /tempo (na|de) dire|ha quanto tempo|quanto tempo|experiencia|anos (na|de) dire|veteran/,
      itens: [['há menos de 1 ano', 'D2', '', 'Há menos de um ano'], ['entre 1 e 2 anos', 'D2', '', 'Entre 1 e 2 anos'], ['entre 3 e 5 anos', 'D2', '', 'Entre 3 e 5 anos'], ['entre 6 e 10 anos', 'D2', '', 'Entre 6 e 10 anos'], ['há mais de 10 anos', 'D2', '', 'Há mais de 10 anos']],
      um: 'o tempo mais comum na direção', varios: 'os tempos mais comuns', val: 'estão na direção há esse tempo' },
    { nome: 'Função de quem dirige escolas rurais', sec: 'blue', ds: 'gestores', card: 'card-funcao', ranking: true, pessoa: true, kw: /funca|cargo|quem dirige|vice|coordenador|supervisor/,
      itens: [['diretor ou diretora', 'D1', '', 'Diretor ou diretora'], ['vice-diretor ou vice-diretora', 'D1', '', 'Vice-diretor ou vice-diretora'], ['professor ou professora', 'D1', '', 'Professor ou professora'],
        ['coordenador ou coordenadora', 'D1', '', 'Coordenador ou coordenadora'], ['supervisor ou supervisora', 'D1', '', 'Supervisor ou supervisora'], ['outra função', 'D1', '', 'Outra função']],
      um: 'a função mais comum', varios: 'as funções mais comuns', val: 'têm essa função', base: 'Só nas escolas rurais: a pesquisa pergunta a função de quem responde pela escola.' },
    { nome: 'Idade dos gestores', sec: 'blue', ds: 'gestores', card: 'card-idade', ranking: true, pessoa: true, propria: 'FAIXA ETÁRIA', kw: /idade|quantos anos|jovens?|velhos?|faixa etaria|idosos?/,
      itens: [['até 40 anos', 'A2', '', 'Até 40 anos'], ['de 41 a 50 anos', 'A2', '', 'De 41 a 50 anos'], ['51 anos ou mais', 'A2', '', 'De 51 anos ou mais']],
      um: 'a faixa de idade mais comum', varios: 'as faixas de idade mais comuns', val: 'estão nessa faixa' },
    { nome: 'Cor ou raça dos gestores', sec: 'blue', ds: 'gestores', card: 'card-raca', ranking: true, pessoa: true, propria: 'COR OU RAÇA', kw: /\braca\b|cor ou raca|cor da pele|\bnegr|\bpret[oa]s?\b|\bpard[oa]s?\b|\bbranc[oa]s?\b|\bindigenas?\b|\bamarel[oa]s?\b/,
      itens: [['branca', 'A3', '', 'Branca'], ['preta', 'A3', '', 'Preta'], ['parda', 'A3', '', 'Parda'], ['amarela', 'A3', '', 'Amarela'], ['indígena', 'A3', '', 'Indígena']],
      um: 'a cor ou raça mais comum', varios: 'as mais comuns', val: 'se declaram dessa cor ou raça' },
    { nome: 'Gestoras mulheres', sec: 'blue', ds: 'gestores', card: 'card-sexo', pessoa: true, propria: 'SEXO', kw: /mulher|gestoras|diretoras|\bsexo\b|homens/, ind: 'A1', resp: 'Feminino', txt: 'gestores escolares são mulheres' }
  ];
  const EXEMPLOS = ['Qual o meio de comunicação mais usado no Nordeste?', 'Quantas escolas rurais têm internet?', 'Quantos gestores usam IA no Sul?', 'Para que os gestores usam IA?'];

  // ---------- dados: os mesmos que o painel carrega (dash.data baixa na primeira vez) ----------
  const dados = (ds) => new Promise((ok) => {
    const tenta = () => { const d = window.dash && window.dash.data(ds); if (d && d.status === 'ok') ok(d.data); else if (d && d.status === 'error') ok(null); else setTimeout(tenta, 150); };
    tenta();
  });
  const linha = (rows, ind, grupo, resp, cat, seg) => rows.find((r) => r.ind === ind && (r.grupo || '') === grupo && r.resp === resp && r.cat === (cat || 'TOTAL') && r.seg === (seg || 'Total'));
  // uma resposta ou várias somadas (faixas vizinhas); a margem da soma é aproximada pela raiz da soma dos quadrados, como no painel
  const valor = (rows, ind, grupo, resp, cat, seg) => {
    if (!Array.isArray(resp)) return linha(rows, ind, grupo, resp, cat, seg);
    const rs = resp.map((r) => linha(rows, ind, grupo, r, cat, seg));
    return rs.every(Boolean) ? { pct: rs.reduce((a, r) => a + Number(r.pct), 0), moe: Math.hypot(...rs.map((r) => Number(r.moe) || 0)) } : null;
  };

  // ---------- "qual região tem mais…?": tipo de grupo a comparar ----------
  const DIMS = [
    ['REGIÃO', /\bregi(ao|oes)\b|\bonde\b|\bem que parte do (brasil|pais)\b/],
    ['DEPENDÊNCIA ADMINISTRATIVA', /\brede(s)?\b(?!\s+(socia|de celular|movel|wi))|publicas? ou particular|particular(es)? ou publica|municipais ou estaduais|estaduais ou municipais/],
    ['ÁREA', /\barea\b|rura(l|is) ou urbana|urbanas? ou rura|campo ou (a )?cidade|cidade ou (o )?campo/],
    ['LOCALIZAÇÃO', /capita(l|is) ou (o )?interior|interior ou (as? )?capita/],
    ['PORTE', /\btamanho\b|\bporte\b|pequenas ou grandes|grandes ou pequenas/],
    ['NÍVEL DE ENSINO MAIS ELEVADO OFERTADO', /\bseries?\b|\bnivel de ensino\b|etapas? de ensino/],
    ['SEXO', /\bsexo\b|homens ou mulheres|mulheres ou homens/],
    ['FAIXA ETÁRIA', /\bidade\b|faixa etaria|mais (velhos|novos) ou/],
    ['COR OU RAÇA', /\braca\b|cor ou raca/]
  ];
  const SUPER = /\b(mais|menos|maior|menor|maiores|menores|melhor|pior)\b/;
  // a pesquisa não publica estados: o estado vira a região dele, com um aviso
  const UF = { Norte: 'acre|amapa|amazonas|para|rondonia|roraima|tocantins|manaus|belem', Nordeste: 'alagoas|bahia|ceara|maranhao|paraiba|pernambuco|piaui|rio grande do norte|sergipe|salvador|fortaleza|recife',
    Sudeste: 'espirito santo|minas gerais|minas|rio de janeiro|sao paulo|belo horizonte', Sul: 'parana|rio grande do sul|santa catarina|porto alegre|curitiba|florianopolis', 'Centro-Oeste': 'distrito federal|brasilia|goias|mato grosso do sul|mato grosso|goiania' };
  const estado = (q) => { for (const [reg, nomes] of Object.entries(UF)) { const m = q.match(new RegExp('\\b(' + nomes + ')\\b')); if (m && !(m[1] === 'para' && !/\b(no|do|estado do) para\b/.test(q))) return [reg, m[1]]; } return null; };

  const MENOS = /\bmenos\b(?!\s+de\s+\d)|\bmenor(es)?\b|\bmenos (usad|comum|citad|frequent|popular)|\bpior(es)?\b|\bmais raros?\b|\bmais rara\b/;

  // regras do painel
  const precisaCem = (v) => v >= 90 || v < 10;
  const freq = (v, cem) => { if (v >= 99.5 && v < 100) return 'quase 100 em cada 100'; const n = cem ? Math.round(v) : Math.round(v / 10), s = n + (cem ? ' em cada 100' : ' em cada 10'); return Math.abs(v - (cem ? n : n * 10)) < 0.05 ? s : 'cerca de ' + s; };
  const faixa = (r) => r.moe ? 'pode variar entre ' + n1(Math.max(0, r.pct - r.moe)) + '% e ' + n1(Math.min(100, r.pct + r.moe)) + '%' : 'sem margem de erro estimada';
  const separa = (a, b) => a.pct - (a.moe || 0) > b.pct + (b.moe || 0);
  // "1 em cada 10" pede o verbo no singular
  const SING = { 'têm': 'tem', 'usam': 'usa', 'são': 'é', 'estão': 'está', 'oferecem': 'oferece', 'permitem': 'permite', 'citam': 'cita', 'dizem': 'diz', 'concordam': 'concorda', 'discutiram': 'discutiu', 'fizeram': 'fez', 'identificam': 'identifica', 'declaram': 'declara', 'se': 'se' };
  const verbo1 = (n, txt) => /^(cerca de )?1 em cada/.test(n) ? txt.replace(/^((?:escolas|gestores escolares|gestores) )?(já |se )?(\S+)/, (m, s, j, v) => (s || '') + (j || '') + (SING[v] || v)) : txt;

  // ---------- desenho da resposta ----------
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const iso = (v, pessoa) => '<div class="tg-perg-iso" aria-hidden="true">' + Array.from({ length: 10 }, (_, i) => '<svg viewBox="0 0 24 24"' + (i < Math.round(v / 10) ? ' class="on"' : '') + '>' + (pessoa ? PESSOA : ESCOLA) + '</svg>').join('') + '</div>';
  const entendi = (t, cat, seg) => '<p class="tg-perg-entendi">Entendi: <b>' + t.nome + '</b><b>' + (cat ? NOME_TIPO[cat] + ': ' + segCurto(seg) : 'Brasil') + '</b></p>';
  const irBotao = (t, cat, seg, rotulo) => {
    const b = el('button', 'tg-perg-ir', esc(rotulo) + ' <span aria-hidden="true">→</span>'); b.type = 'button';
    b.addEventListener('click', () => {
      const j = b.closest('dialog'); if (j) j.close();
      if (window.mostraNoPainel) window.mostraNoPainel(t.ds, cat ? cat + '|' + seg : 'TOTAL|Total', t.card);
    });
    return b;
  };
  const cartao = (t) => { const c = el('article', 'tg-perg-res'); c.style.setProperty('--sec', 'var(--v-' + t.sec + ')'); return c; };
  const sujeito = (t) => t.ds === 'gestores' ? 'gestores ' : 'escolas ';
  const semDado = (t, cat, seg, c) => { c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">A pesquisa não tem esse número para esse grupo.</p>' + (t.base ? '<p class="tg-perg-var">' + t.base + '</p>' : ''); return c; };

  const responde = async (t, cat, seg) => {
    const c = cartao(t), rows = await dados(t.ds), q = quem(t, cat, seg);
    if (!rows) { c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">Não foi possível carregar os dados. Verifique a conexão e tente de novo.</p>'; return c; }
    if (t.ranking) {
      const its = t.itens.map(([l, ind, g, resp = 'Sim']) => ({ l, r: valor(rows, ind, g, resp, cat, seg), br: valor(rows, ind, g, resp) })).filter((x) => x.r).sort((a, b) => b.r.pct - a.r.pct);
      if (!its.length) return semDado(t, cat, seg, c);
      const cem = its.some((x) => precisaCem(x.r.pct)), L = (x) => t.aspas ? '“' + x.l + '”' : x.l;
      // a pergunta cita um item (ex.: "mestrado", "Instagram"): a frase fala dele, e a lista mostra o resto
      const f = t.foco && t.foco.find(([re]) => re.test(pergunta.ultima || '')), alvo = f && its.find((x) => x.l === t.itens[f[1]][0]);
      // "o menos usado", "a faixa menos comum": a mesma resposta, olhando a outra ponta da lista
      const menos = MENOS.test(pergunta.ultima || ''), ponta = menos ? its.slice().reverse() : its;
      const um = menos ? t.um.replace(/\bmais\b/, 'menos') : t.um, varios = menos ? t.varios.replace(/\bmais\b/, 'menos') : t.varios;
      const [a, b] = alvo ? [alvo] : ponta, n = freq(a.r.pct, cem);
      const empate = b && (menos ? !separa(b.r, a.r) : !separa(a.r, b.r));
      const frase = alvo ? q + ', <strong>' + n + '</strong> ' + (cat ? '' : sujeito(t)) + verbo1(n, t.focoTxt(a.l)) + '.'
        : empate
          ? q + ', ' + varios + ' são <strong>' + L(a) + '</strong> e <strong>' + L(b) + '</strong>: com a margem de erro, não dá para dizer qual vem ' + (menos ? 'por último' : 'primeiro') + '.'
          : q + ', ' + um + ' é <strong>' + L(a) + '</strong>: <strong>' + n + '</strong> ' + (cat ? '' : sujeito(t)) + verbo1(n, t.val) + '.';
      c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">' + frase + '</p>' + iso(a.r.pct, t.pessoa) +
        '<p class="tg-perg-var">' + (t.base ? t.base + ' ' : '') + esc(a.l.charAt(0).toUpperCase() + a.l.slice(1)) + ': ' + n1(a.r.pct) + '% (' + faixa(a.r) + ')' + (cat && a.br ? '. No Brasil, ' + n1(a.br.pct) + '%.' : '.') + '</p>' +
        '<ul class="tg-perg-lista">' + (alvo ? its : ponta).slice(0, 6).map((x) => '<li><span>' + esc(x.l.charAt(0).toUpperCase() + x.l.slice(1)) + '</span><span class="v">' + n1(x.r.pct) + '%</span><span class="tr" aria-hidden="true"><i style="width:' + Math.min(100, x.r.pct) + '%"></i></span></li>').join('') + '</ul>';
      c.append(irBotao(t, cat, seg, 'Ver no painel, com a margem de cada um'));
      return c;
    }
    const resp = t.resp || 'Sim', r = linha(rows, t.ind, t.grupo || '', resp, cat, seg), br = linha(rows, t.ind, t.grupo || '', resp);
    if (!r) return semDado(t, cat, seg, c);
    const cem = precisaCem(r.pct) || !!(cat && br && precisaCem(br.pct)), n = freq(r.pct, cem);
    const txt = cat ? (t.txtG || t.txt.replace(/^(escolas|gestores escolares|gestores) /, '')) : t.txt;
    let vs = '';
    if (cat && br) { const d = Math.round((r.pct - br.pct) * 10) / 10; vs = ' No Brasil, ' + freq(br.pct, cem) + ' (' + n1(br.pct) + '%)' + (d ? ': são ' + n1(Math.abs(d)) + (Math.abs(d) < 2 ? ' ponto ' : ' pontos ') + (d > 0 ? 'a mais' : 'a menos') + ' no grupo.' : '.'); }
    c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">' + q + ', <strong>' + n + '</strong> ' + verbo1(n, txt) + '.</p>' + iso(r.pct, t.pessoa) +
      '<p class="tg-perg-var">' + n1(r.pct) + '% (' + faixa(r) + ').' + vs + '</p>';
    c.append(irBotao(t, cat, seg, 'Ver no painel'));
    return c;
  };

  // compara todos os grupos de um tipo (ex.: as 5 regiões) para um indicador, com a regra das margens
  const compara = async (t, cat, q, aviso, so) => {
    const c = cartao(t), rows = await dados(t.ds);
    const ent = '<p class="tg-perg-entendi">Entendi: <b>' + t.nome + '</b><b>Comparar: ' + NOME_TIPO[cat] + '</b></p>';
    if (!rows) { c.innerHTML = ent + '<p class="tg-perg-frase">Não foi possível carregar os dados. Verifique a conexão e tente de novo.</p>'; return c; }
    // o que comparar: o indicador do tema, ou o item citado de um ranking ("qual região mais usa WhatsApp")
    let ind = t.ind, grupo = t.grupo || '', resp = t.resp || 'Sim', txt = cat ? (t.txtG || (t.txt || '').replace(/^(escolas|gestores escolares|gestores) /, '')) : t.txt;
    if (t.ranking) {
      const f = t.foco && t.foco.find(([re]) => re.test(q));
      if (!f) {
        c.innerHTML = ent + '<p class="tg-perg-frase">Para comparar os grupos, diga qual item: por exemplo, "' + (t.nome === 'Comunicação' ? 'qual região mais usa WhatsApp?' : 'qual região tem mais \u201c' + t.itens[0][0] + '\u201d?') + '"</p>' +
          '<p class="tg-perg-var">Itens deste tema: ' + t.itens.map((x) => x[0]).join(', ') + '.</p>';
        return c;
      }
      const it = t.itens[f[1]]; [ind, grupo, resp] = [it[1], it[2], it[3] || 'Sim']; txt = t.focoTxt(it[0]);
    }
    const segs = so || [...new Set(rows.filter((r) => r.cat === cat && r.ind === ind).map((r) => r.seg))].filter((x) => x !== 'Não respondeu' && !/^Públicas/.test(x));
    const its = segs.map((seg) => ({ seg, r: valor(rows, ind, grupo, resp, cat, seg) })).filter((x) => x.r).sort((a, b) => b.r.pct - a.r.pct);
    const br = valor(rows, ind, grupo, resp);
    if (its.length < 2) { c.innerHTML = ent + '<p class="tg-perg-frase">A pesquisa não tem esse número para esses grupos.</p>'; return c; }
    const menos = MENOS.test(q), ponta = menos ? its.slice().reverse() : its, [a, b] = ponta;
    const cem = its.some((x) => precisaCem(x.r.pct)) || !!(br && precisaCem(br.pct)), n = freq(a.r.pct, cem);
    const onde = (seg) => { const s2 = quem(t, cat, seg); return s2.charAt(0).toLowerCase() + s2.slice(1); };
    const empate = b && (menos ? !separa(b.r, a.r) : !separa(a.r, b.r));
    const qual = menos ? 'menor' : 'maior';
    const frase = empate
      ? 'A ' + qual + ' parcela que ' + verbo1('1 em cada', txt) + ' fica ' + onde(a.seg) + ' e ' + onde(b.seg) + ', mas as margens de erro se sobrepõem: a ordem entre ' + (t.ds === 'gestores' ? 'eles' : 'elas') + ' pode ser outra.'
      : 'A ' + qual + ' parcela fica ' + onde(a.seg) + ': <strong>' + n + '</strong> ' + verbo1(n, txt) + '.';
    c.innerHTML = (aviso ? '<p class="tg-perg-var tg-perg-aviso">' + aviso + '</p>' : '') + ent + '<p class="tg-perg-frase">' + frase + (br ? ' No Brasil, ' + freq(br.pct, cem) + '.' : '') + '</p>' + iso(a.r.pct, t.pessoa) +
      '<p class="tg-perg-var">' + esc(segCurto(a.seg)) + ': ' + n1(a.r.pct) + '% (' + faixa(a.r) + ')' + (br ? '. Brasil: ' + n1(br.pct) + '%.' : '.') + '</p>' +
      '<ul class="tg-perg-lista">' + ponta.map((x) => '<li><span>' + esc(segCurto(x.seg)) + (x.r.moe ? '' : '*') + '</span><span class="v">' + n1(x.r.pct) + '%</span><span class="tr" aria-hidden="true"><i style="width:' + Math.min(100, x.r.pct) + '%"></i></span></li>').join('') + '</ul>' +
      (its.some((x) => !x.r.moe) ? '<p class="tg-perg-var">* sem margem de erro estimada (o valor vale para a amostra).</p>' : '');
    // para a bateria de testes: qual grupo foi apontado e se houve empate
    c.dataset.ponta = a.seg; c.dataset.empate = empate ? '1' : '0'; c.dataset.cat = cat;
    const bt = el('button', 'tg-perg-ir', 'Ver a comparação no painel, com a margem de cada grupo <span aria-hidden="true">→</span>'); bt.type = 'button';
    bt.addEventListener('click', () => {
      const j = bt.closest('dialog'); if (j) j.close();
      if (!(window.mostraComparacao && window.mostraComparacao(t.ds, ind, grupo, resp, cat)) && window.mostraNoPainel) window.mostraNoPainel(t.ds, cat + '|' + a.seg, t.card);
    });
    c.append(bt);
    return c;
  };

  const pergunta = async (txt, saida) => {
    const q = ' ' + sem(txt) + ' ';
    pergunta.ultima = q;
    const cands = TEMAS.filter((x) => x.kw.test(q));
    let t = cands[0];
    if (t && t.propria && cands.length > 1 && SUPER.test(q) && DIMS.some(([c, re]) => c === t.propria && re.test(q))) t = cands.find((x) => x !== t && !x.propria) || cands[1];
    let gs = GRUPOS.filter(([re]) => re.test(q)).map(([, c, s]) => [c, s]);
    // o tipo de grupo que é o próprio tema não vira grupo ("gestores jovens" em "idade"); Escolas não tem os grupos de Gestores
    // estado: a pesquisa não publica; usa a região dele, com aviso
    const uf = estado(q); let aviso = '';
    if (uf && !gs.some(([c]) => c === 'REGIÃO')) {
      gs.push(['REGIÃO', uf[0]]);
      aviso = 'A pesquisa não publica números por estado ou cidade. A resposta é da região ' + uf[0] + ', onde fica o lugar da pergunta.';
    }
    if (t) gs = gs.filter(([c]) => c !== t.propria && (t.ds === 'gestores' || !SO_GESTOR.includes(c)));
    saida.replaceChildren();
    const nota = t && t.nota && !t.nota[0].test(q) ? t.nota[1] : '';
    // "qual região tem mais…?", "onde…menos…?": compara todos os grupos daquele tipo
    // dois ou mais grupos do mesmo tipo e "mais/menos" ("Norte ou Sul: qual tem mais internet?"): compara só eles
    if (t && SUPER.test(q) && gs.length > 1 && new Set(gs.map(([c]) => c)).size === 1 && (!t.ranking || (t.foco && t.foco.some(([re]) => re.test(q))))) {
      saida.append(await compara(t, gs[0][0], q, [aviso, t.nota && !t.nota[0].test(q) ? t.nota[1] : ''].filter(Boolean).join(' '), gs.map(([, s]) => s)));
      return;
    }
    const dim = t && SUPER.test(q) && DIMS.find(([c, re]) => re.test(q) && c !== t.propria && (t.ds === 'gestores' || !SO_GESTOR.includes(c)));
    if (dim) gs = gs.filter(([c]) => c !== dim[0]);
    if (dim) {
      const nota2 = gs.length ? 'A comparação é entre todas as ' + (t.ds === 'gestores' ? 'pessoas' : 'escolas') + ': a pesquisa não publica ' + NOME_TIPO[dim[0]].toLowerCase() + ' só dentro de ' + gs.map(([c, s]) => nomeGrupo(c, s)).join(' e ') + '.' : '';
      saida.append(await compara(t, dim[0], q, [nota, nota2].filter(Boolean).join(' ')));
      return;
    }
    if (aviso || nota) saida.append(el('p', 'tg-perg-var tg-perg-aviso', [aviso, nota].filter(Boolean).join(' ')));
    if (!t) {
      saida.append(el('article', 'tg-perg-res tg-perg-nao', '<p class="tg-perg-frase">Ainda não sei responder essa.</p><p class="tg-perg-var">Pergunte sobre um destes temas, com ou sem um grupo (uma região, escolas rurais ou particulares, escolas pequenas, gestoras, gestores jovens…):</p><ul>' + TEMAS.map((x) => '<li>' + x.nome + '</li>').join('') + '</ul>'));
      return;
    }
    const tipos = [...new Set(gs.map(([c]) => c))];
    if (tipos.length > 1) {
      // cruzamento de grupos: a pesquisa não publica; cada grupo aparece separado
      saida.append(el('article', 'tg-perg-res tg-perg-nao', '<p class="tg-perg-frase">A pesquisa não publica o número das <strong>' + gs.map(([c, s]) => nomeGrupo(c, s)).join(' e ') + '</strong> ao mesmo tempo: nesse cruzamento a amostra fica pequena demais para um número confiável.</p><p class="tg-perg-var">Veja cada grupo separado:</p>'));
      for (const c of await Promise.all(gs.slice(0, 2).map(([c, s]) => responde(t, c, s)))) saida.append(c);
      return;
    }
    // "negros": a pesquisa conta pretos e pardos separadamente; avisa antes das duas respostas
    if (/\bnegr/.test(q) && gs.filter(([c]) => c === 'COR OU RAÇA').length > 1)
      saida.append(el('p', 'tg-perg-var tg-perg-aviso', 'A pesquisa conta separadamente pessoas pretas e pardas, que juntas formam a população negra. Veja cada grupo:'));
    for (const c of await Promise.all((gs.length ? gs.slice(0, 3) : [[null, null]]).map(([c, s]) => responde(t, c, s)))) saida.append(c);
  };
  // para a bateria de testes (testes/pergunte.html): os temas e os tipos de grupo
  window.__perg = { TEMAS, DIMS, GRUPOS, SO_GESTOR };
  // para testes no console: window.__pergunte('quantas escolas rurais têm internet?')
  window.__perguntaEl = (txt) => { const d = document.createElement('div'); return pergunta(txt, d).then(() => d); };
  window.__pergunte = (txt) => { const d = document.createElement('div'); return pergunta(txt, d).then(() => [...d.querySelectorAll('.tg-perg-entendi, .tg-perg-frase, .tg-perg-var')].map((e) => e.textContent).join(' | ')); };

  // ---------- a caixa (a mesma no Início e na janela) ----------
  let n = 0;
  const caixa = (alvo, titulo) => {
    const id = 'perg-' + (++n);
    const form = el('form', 'tg-perg-caixa'); form.setAttribute('role', 'search');
    form.innerHTML = '<label class="tg-perg-tit" for="' + id + '">' + titulo + '</label>' +
      '<div class="tg-perg-linha"><input id="' + id + '" type="search" autocomplete="off" enterkeyhint="search" placeholder="Ex.: qual o meio de comunicação mais usado no Nordeste?">' +
      '<button type="submit" class="tg-etq">Perguntar</button></div><div class="tg-perg-ex"><span class="tg-perg-ex-lab">Experimente:</span></div>';
    const saida = el('div', 'tg-perg-saida'); saida.setAttribute('aria-live', 'polite');
    const inp = form.querySelector('input'), ex = form.querySelector('.tg-perg-ex');
    form.addEventListener('submit', (e) => { e.preventDefault(); if (inp.value.trim()) pergunta(inp.value, saida); });
    EXEMPLOS.forEach((t) => { const b = el('button', 'tg-perg-chip'); b.type = 'button'; b.textContent = t; b.addEventListener('click', () => { inp.value = t; pergunta(t, saida); }); ex.append(b); });
    alvo.append(form, saida);
    return inp;
  };

  const monta = () => {
    // Início: aberta, logo depois da capa
    const ini = document.getElementById('pergunte');
    if (ini) caixa(ini, 'Faça uma pergunta, a pesquisa responde');
    // Escolas e Gestores: botão "Perguntar" ao lado de "Como ler este painel", abrindo uma janela
    const guiaBtn = document.querySelector('#topo .tg-guide-btn'), guia = document.getElementById('como-ler');
    if (!guiaBtn || !guia) return;
    const j = el('dialog', 'tg-guide tg-perg-janela'); j.id = 'pergunte-janela'; j.setAttribute('aria-labelledby', 'pergunte-janela-tit');
    j.innerHTML = '<div class="tg-guide-top"><h2 class="tg-guide-title" id="pergunte-janela-tit">Pergunte à Bússola</h2><button type="button" class="tg-guide-x" aria-label="Fechar"><svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="tg-guide-body"></div>';
    guia.after(j);
    const inp = caixa(j.querySelector('.tg-guide-body'), 'O que você quer saber?');
    j.querySelector('.tg-guide-x').addEventListener('click', () => j.close());
    j.addEventListener('click', (e) => { if (e.target === j) j.close(); });
    const b = el('button', 'tg-guide-btn tg-perg-btn', '<svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>Perguntar');
    b.type = 'button'; b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-controls', j.id);
    b.addEventListener('click', () => { j.showModal(); inp.focus(); });
    // "Como ler" e "Perguntar" lado a lado (quebram para a linha de baixo se não couberem)
    const par = el('div', 'tg-head-botoes'); guiaBtn.before(par); par.append(guiaBtn, b);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monta); else monta();
})();
