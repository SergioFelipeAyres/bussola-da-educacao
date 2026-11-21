/*
 * "Pergunte à Bússola": o leitor toca numa das perguntas prontas (geradas dos dados por prontas(), sorteadas na caixa) e recebe o número da pesquisa.
 * Não há texto livre. Cada pergunta passa pelo reconhecimento de TEMA e GRUPO por palavras-chave e é respondida com os dados do próprio site,
 * pelas mesmas regras do painel ("N em cada 10" ou "em cada 100", margem de erro como faixa, "o mais citado"
 * só quando as margens não se tocam). Cruzamentos que a pesquisa não publica (ex.: particulares do Nordeste)
 * são avisados, sem explicar o motivo, e cada grupo aparece separado.
 *
 * Fica aberta no Início (#pergunte) e numa janela em Escolas e Gestores (botão "Perguntar", ao lado de
 * "Como ler este painel"). "Ver no painel" leva ao cartão certo, já no grupo da pergunta (window.mostraNoPainel,
 * definido no painel.js).
 *
 * Para ensinar uma palavra nova, acrescente-a à expressão "kw" do tema ou à lista GRUPOS.
 * A ordem dos TEMAS importa: o primeiro que casar com a pergunta vence, então os mais específicos vêm antes.
 *
 * Ajuda da IA (IA_URL abaixo): sem texto livre, a caixa não a usa mais (as perguntas prontas sempre casam com um tema);
 * fica para a bateria de testes. Era assim: quando as palavras-chave não reconheciam a pergunta, ela ia para o
 * Worker em workers/pergunte-ia, que só a REESCREVE em português
 * correto ("conequissao no nordesti" → "conexão no Nordeste"). A frase reescrita passa pelas mesmas palavras-chave
 * e é respondida com os dados; a IA nunca produz números. O leitor vê "Entendi sua pergunta como: …".
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
      um: 'a situação mais comum', varios: 'as situações mais comuns', val: 'estão nessa situação', base: 'Entre as escolas com internet.',
      focoTxt: (l) => /informada/.test(l) ? null : 'têm internet de ' + l },
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
      um: 'a situação mais comum', varios: 'as situações mais comuns', val: 'estão nessa situação', focoTxt: (l) => /^sem/.test(l) ? 'não têm computador para os alunos' : 'têm ' + l },
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
      um: 'o uso mais citado', varios: 'os usos mais citados', val: 'usam a IA para isso', base: 'Entre os gestores que usam IA na gestão.',
      focoTxt: (l) => 'usam a IA para ' + l, focoQ: (l) => 'Gestores que usam IA: quantos a usam para ' + l + '?', focoQuem: 'Entre os gestores que usam IA na gestão' },
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
      um: 'o tema mais discutido', varios: 'os temas mais discutidos', val: 'discutiram esse tema', focoTxt: (l) => 'discutiram ' + l, base: 'Temas discutidos em reuniões sobre tecnologia nos últimos 12 meses.' },
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
      um: 'o tempo mais comum na direção', varios: 'os tempos mais comuns', val: 'estão na direção há esse tempo', focoTxt: (l) => 'estão na direção ' + (/^há/.test(l) ? l : 'há ' + l) },
    { nome: 'Função de quem dirige escolas rurais', sec: 'blue', ds: 'gestores', card: 'card-funcao', ranking: true, pessoa: true, kw: /funca|cargo|quem dirige|vice|coordenador|supervisor/,
      itens: [['diretor ou diretora', 'D1', '', 'Diretor ou diretora'], ['vice-diretor ou vice-diretora', 'D1', '', 'Vice-diretor ou vice-diretora'], ['professor ou professora', 'D1', '', 'Professor ou professora'],
        ['coordenador ou coordenadora', 'D1', '', 'Coordenador ou coordenadora'], ['supervisor ou supervisora', 'D1', '', 'Supervisor ou supervisora'], ['outra função', 'D1', '', 'Outra função']],
      um: 'a função mais comum', varios: 'as funções mais comuns', val: 'têm essa função', base: 'Só nas escolas rurais: a pesquisa pergunta a função de quem responde pela escola.' },
    { nome: 'Idade dos gestores', sec: 'blue', ds: 'gestores', card: 'card-idade', ranking: true, pessoa: true, propria: 'FAIXA ETÁRIA', kw: /idade|quantos anos|jovens?|velhos?|faixa etaria|idosos?/,
      itens: [['até 40 anos', 'A2', '', 'Até 40 anos'], ['de 41 a 50 anos', 'A2', '', 'De 41 a 50 anos'], ['51 anos ou mais', 'A2', '', 'De 51 anos ou mais']],
      um: 'a faixa de idade mais comum', varios: 'as faixas de idade mais comuns', val: 'estão nessa faixa', focoTxt: (l) => 'têm ' + l },
    { nome: 'Cor ou raça dos gestores', sec: 'blue', ds: 'gestores', card: 'card-raca', ranking: true, pessoa: true, propria: 'COR OU RAÇA', kw: /\braca\b|cor ou raca|cor da pele|\bnegr|\bpret[oa]s?\b|\bpard[oa]s?\b|\bbranc[oa]s?\b|\bindigenas?\b|\bamarel[oa]s?\b/,
      itens: [['branca', 'A3', '', 'Branca'], ['preta', 'A3', '', 'Preta'], ['parda', 'A3', '', 'Parda'], ['amarela', 'A3', '', 'Amarela'], ['indígena', 'A3', '', 'Indígena']],
      um: 'a cor ou raça mais comum', varios: 'as mais comuns', val: 'se declaram dessa cor ou raça', focoTxt: (l) => 'se declaram de cor ' + l },
    { nome: 'Gestoras mulheres', sec: 'blue', ds: 'gestores', card: 'card-sexo', pessoa: true, propria: 'SEXO', kw: /mulher|gestoras|diretoras|\bsexo\b|homens/, ind: 'A1', resp: 'Feminino', txt: 'gestores escolares são mulheres' }
  ];
  // ---------- perguntas prontas: geradas dos dados, para cobrir tudo o que o painel deixa escolher ----------
  // 1) cada tema no Brasil; 2) cada tema em cada grupo que as tabelas publicam (o mesmo filtro do painel);
  // 3) cada comparação do "Compare grupos" (indicadores de window.__MEAS, do painel.js) por cada tipo de grupo.
  // Só entra a pergunta que tem resposta nas tabelas. A caixa sorteia MOSTRA delas a cada visita e mostra as que cabem em LINHAS linhas.
  const MOSTRA = 24, LINHAS = 3; // sorteia de sobra: as curtas preenchem o fim das linhas
  const POR_TEMA = 2, MIN_TEMAS = 4; // no máximo 2 perguntas do mesmo tema; o que aparece cobre pelo menos 4 temas (ou, se couberem menos de 4 perguntas, como no celular, todas de temas diferentes)
  const COTA = { brasil: 2, compara: 2, grupo: 4 }; // a amostra mistura os três tipos
  // temas em ranking: o que a pergunta quer saber (sem o grupo)
  const CAUDA = {
    'Motivos para não ter internet': 'qual o motivo mais citado para não ter internet', 'Problemas com a internet': 'qual o problema mais frequente com a internet',
    'Velocidade da internet': 'qual a velocidade de internet mais comum', 'Tipo de conexão': 'qual o tipo de conexão mais usado',
    'Alunos por computador': 'quantos alunos costumam dividir cada computador', 'Tipos de computador': 'qual o tipo de computador mais comum',
    'Última compra de equipamentos': 'há quanto tempo foi a última compra ou doação de computadores', 'Para que os gestores usam IA': 'para que a IA é mais usada na gestão',
    'Onde a IA ajudou': 'em que a IA mais ajudou', 'Temas das reuniões': 'qual tema mais apareceu nas reuniões',
    'A tecnologia está integrada ao ensino?': 'a tecnologia está integrada ao ensino', 'Comunicação': 'qual o meio de comunicação mais usado',
    'Redes sociais': 'qual a rede social mais usada', 'Formação dos gestores': 'qual a formação mais comum além da graduação',
    'Tempo na direção': 'há quanto tempo estão na direção', 'Função de quem dirige escolas rurais': 'qual a função de quem dirige as escolas rurais',
    'Idade dos gestores': 'qual a faixa de idade mais comum', 'Cor ou raça dos gestores': 'qual a cor ou raça mais comum'
  };
  // frases mais curtas para o botão (a resposta continua a do tema): temas cujo texto completo deixaria a pergunta longa demais
  const PRED = { 'Reuniões com professores sobre tecnologia': 'reuniram professores sobre tecnologia', 'Reuniões com as famílias sobre tecnologia': 'reuniram as famílias sobre tecnologia',
    'Professores sabem usar tecnologia nas aulas': 'acham que os professores sabem usar tecnologia', 'Gestores que usam IA': 'usam IA na gestão',
    'Computador e internet para os alunos': 'dão computador e internet aos alunos', 'Internet para os alunos': 'dão internet aos alunos' };
  // de quem a pergunta fala: "escolas rurais", "gestoras", "gestores da região Sul", "gestores das escolas particulares"
  const sujeitoDe = (t, cat, seg) => {
    if (t.ds === 'escolas') return cat ? nomeGrupo(cat, seg) : 'escolas';
    if (!cat) return 'gestores';
    if (cat === 'SEXO') return seg === 'Feminino' ? 'gestoras' : 'gestores homens';
    if (SO_GESTOR.includes(cat)) return nomeGrupo(cat, seg);
    return cat === 'REGIÃO' ? 'gestores da região ' + seg : 'gestores das ' + nomeGrupo(cat, seg);
  };
  const maiuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const textoDe = (t, cat, seg) => {
    const S = sujeitoDe(t, cat, seg), fem = /^(escolas|gestoras)/.test(S), art = fem ? 'as' : 'os';
    if (t.ranking) return maiuscula('entre ' + art + ' ' + S + ', ' + (CAUDA[t.nome] || 'qual é ' + t.um) + '?');
    if (t.nome === 'Fibra ótica') return 'Entre ' + art + ' ' + S + ' com internet, quantas estão conectadas por fibra ótica?';
    // tema que é ele mesmo uma característica do gestor (ex.: ser mulher), dentro de outro grupo de gestores: a pergunta diz
    // primeiro de quem fala ("Entre os gestores de cor branca, quantos são mulheres?"), para não soar como um cruzamento
    if (t.propria && cat && SO_GESTOR.includes(cat)) return 'Entre ' + art + ' ' + S + ', ' + (fem ? 'quantas ' : 'quantos ') + (PRED[t.nome] || t.txt.replace(/^(escolas|gestores escolares|gestores) /, '')) + '?';
    return (fem ? 'Quantas ' : 'Quantos ') + S + ' ' + (PRED[t.nome] || t.txt.replace(/^(escolas|gestores escolares|gestores) /, '')) + '?';
  };
  // comparações: "Escolas com internet: qual região tem a maior parcela?"
  // comparações, curtas: "Escolas com internet: qual região tem mais?"
  const DIMQ = { 'REGIÃO': 'qual região tem mais?', 'ÁREA': 'urbanas ou rurais?', 'LOCALIZAÇÃO': 'capitais ou interior?', 'DEPENDÊNCIA ADMINISTRATIVA': 'qual rede tem mais?',
    'PORTE': 'qual tamanho de escola tem mais?', 'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO': 'qual nível de ensino tem mais?', 'SEXO': 'homens ou mulheres?', 'FAIXA ETÁRIA': 'qual idade tem mais?', 'COR OU RAÇA': 'qual cor ou raça tem mais?' };
  const textoCompara = (rot, cat) => maiuscula(rot) + ': ' + DIMQ[cat];
  // tamanho: até MAX_CARS caracteres entram; acima de LONGA a pergunta é longa, e no máximo MAX_LONGAS aparecem juntas.
  // Numa caixa de LARGA px ou mais (computador), no máximo 1 linha pode ter menos de 3 perguntas.
  const MAX_CARS = 70, LONGA = 48, MAX_LONGAS = 2, LARGA = 700;
  // indicador do Compare que é um item de ranking (ex.: mestrado): vira um tema de um número só, com a frase dele
  const TXT_ITEM = { pos: 'gestores têm especialização ou pós-graduação', mestrado: 'gestores têm mestrado', veteranos: 'gestores estão há mais de 10 anos na direção da escola', jovens: 'gestores têm até 40 anos' };
  const temaDaMedida = (m) => {
    const t = TEMAS.find((x) => !x.ranking && x.ds === m.ds && x.ind === m.ind && (x.resp || 'Sim') === m.resp && (x.grupo || '') === (m.grupo || ''));
    if (t) return t;
    const base = TEMAS.find((x) => x.ranking && x.ds === m.ds && x.itens.some((it) => it[1] === m.ind));
    return base && TXT_ITEM[m.id] ? Object.assign({}, base, { ranking: false, nome: m.label, ind: m.ind, grupo: m.grupo || '', resp: m.resp, txt: TXT_ITEM[m.id], txtG: undefined }) : null;
  };
  // capítulos do painel (as cores): toda amostra tem pelo menos uma pergunta de cada
  const CAPS = ['Escolas · Conexão', 'Escolas · Equipamentos', 'Escolas · Regras, IA e proteção de dados', 'Escolas · Comunicação',
    'Gestores · Quem são os gestores', 'Gestores · Tecnologia na gestão', 'Gestores · Inteligência artificial'];
  const capDe = (t) => t.ds === 'escolas' ? 'Escolas · ' + { teal: 'Conexão', orange: 'Equipamentos', purple: 'Regras, IA e proteção de dados', pink: 'Comunicação' }[t.sec]
    : t.sec === 'purple' ? 'Gestores · Inteligência artificial' : /card-(reunioes|temas|percepcao)/.test(t.card) ? 'Gestores · Tecnologia na gestão' : 'Gestores · Quem são os gestores';
  let prontasP = null;
  const prontas = () => prontasP || (prontasP = (async () => {
    const R = { escolas: await dados('escolas'), gestores: await dados('gestores') }, lista = [];
    const segsDe = (rows, cat) => [...new Set(rows.filter((r) => r.cat === cat).map((r) => r.seg))].filter((s) => s !== 'Total' && s !== 'Não respondeu');
    const tipos = (t) => Object.keys(NOME_TIPO).filter((c) => c !== t.propria && (t.ds === 'gestores' || !SO_GESTOR.includes(c)));
    for (const t of TEMAS) {
      const rows = R[t.ds]; if (!rows) continue;
      const tem = (cat, seg) => t.ranking ? t.itens.some(([, ind, g, resp = 'Sim']) => valor(rows, ind, g, resp, cat, seg)) : !!linha(rows, t.ind, t.grupo || '', t.resp || 'Sim', cat, seg);
      if (tem()) lista.push({ txt: textoDe(t), sec: t.sec, tema: t.nome, cap: capDe(t), tipo: 'brasil', faz: () => responde(t, null, null) });
      for (const cat of tipos(t)) for (const seg of segsDe(rows, cat))
        if (tem(cat, seg)) lista.push({ txt: textoDe(t, cat, seg), sec: t.sec, tema: t.nome, cap: capDe(t), tipo: 'grupo', cat, seg, faz: () => responde(t, cat, seg) });
      // 4) cada item de um ranking que tem frase própria (focoTxt): "Quantas escolas usam WhatsApp?", nos grupos e comparado
      if (t.ranking && t.focoTxt) t.itens.forEach(([l, ind, g, resp = 'Sim'], i) => {
        const ft = t.focoTxt(l); if (!ft || /não sabem|outra função/.test(l)) return;
        // item que já é um indicador do Compare (ex.: mestrado): a comparação já vem de lá
        const jaNoCompare = (window.__MEAS || []).some((m) => m.ds === t.ds && m.ind === ind && (m.grupo || '') === g && (m.resp || 'Sim') === resp);
        const temI = (cat, seg) => !!valor(rows, ind, g, resp, cat, seg), base = { sec: t.sec, tema: t.nome, cap: capDe(t) };
        const txtI = (cat, seg) => { const S = sujeitoDe(t, cat, seg); return (/^(escolas|gestoras)/.test(S) ? 'Quantas ' : 'Quantos ') + S + ' ' + ft + '?'; };
        if (temI()) lista.push(Object.assign({ txt: t.focoQ ? t.focoQ(l) : txtI(), tipo: 'brasil', faz: () => responde(t, null, null, i) }, base));
        if (t.focoQ) return; // a base é outra (ex.: só quem usa IA): fica só a pergunta do Brasil
        for (const cat of tipos(t)) {
          const segs = segsDe(rows, cat).filter((seg) => temI(cat, seg));
          segs.forEach((seg) => lista.push(Object.assign({ txt: txtI(cat, seg), tipo: 'grupo', cat, seg, faz: () => responde(t, cat, seg, i) }, base)));
          if (!jaNoCompare && segs.filter((seg) => !/^Públicas/.test(seg)).length >= 2)
            lista.push(Object.assign({ txt: textoCompara((t.ds === 'escolas' ? 'escolas que ' : 'gestores que ') + ft, cat), tipo: 'compara', cat, faz: () => compara(t, cat, '', '', null, i) }, base));
        }
      });
    }
    for (const m of window.__MEAS || []) {
      const t = temaDaMedida(m), rows = t && R[t.ds]; if (!rows) continue;
      for (const cat of tipos(t)) {
        const n = segsDe(rows, cat).filter((s) => !/^Públicas/.test(s) && valor(rows, t.ind, t.grupo || '', t.resp || 'Sim', cat, s)).length;
        if (n >= 2) lista.push({ txt: textoCompara(m.label, cat), sec: t.sec, tema: t.nome, cap: capDe(t), tipo: 'compara', cat, faz: () => compara(t, cat, '', '') });
      }
    }
    const vistos = new Set(); return lista.filter((q) => !vistos.has(q.txt) && vistos.add(q.txt));
  })());

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
  // cabeça do cartão: sobre o que o leitor perguntou (como o "Você está vendo" do filtro) e o tema como título do cartão;
  // quando a pergunta cita um item de uma lista ("WhatsApp", "mestrado"), o título diz o item: "Comunicação: WhatsApp"
  const cabeca = (t, grupoTxt, item) => '<p class="tg-perg-entendi"><span class="tg-perg-lab">Você perguntou sobre:</span> <span class="tg-perg-grupo">' + esc(grupoTxt) + '</span></p><h3 class="tg-perg-tema">' + esc(t.nome + (item ? ': ' + item : '')) + '</h3>';
  const entendi = (t, cat, seg, item) => cabeca(t, cat ? NOME_TIPO[cat] + ': ' + segCurto(seg) : 'Brasil', item);
  const maiusc = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  // o número da frase vem grifado de marca-texto, como os números da capa
  const grifo = (n) => '<strong class="tg-perg-grifo">' + n + '</strong>';
  // a barra do painel: traço de marca-texto, margem de erro (barra de erro) e traço do Brasil
  const barra = (rot, r, br) => {
    const m = Number(r.moe) || 0, lo = Math.max(0, r.pct - m), hi = Math.min(100, r.pct + m);
    return '<li><span>' + esc(rot) + (m ? '' : '*') + '</span><span class="v">' + n1(r.pct) + '%</span><span class="tr" aria-hidden="true"><i class="f" style="width:' + Math.min(100, r.pct) + '%"></i>' +
      (m ? '<i class="moe" style="left:' + lo + '%;width:' + (hi - lo) + '%"></i>' : '') + (br ? '<i class="ref" style="left:' + Math.min(100, br.pct) + '%"></i>' : '') + '</span></li>';
  };
  const legenda = (comBr) => '<p class="tg-perg-leg" aria-hidden="true"><span><i class="lm"></i>margem de erro</span>' + (comBr ? '<span><i class="lr"></i>Brasil</span>' : '') + '</p>';
  const rodape = (t) => el('p', 'tg-perg-base', (t.base ? t.base + ' ' : '') + 'Fonte: TIC Educação 2025, NIC.br/Cetic.br.');
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
  const semDado = (t, cat, seg, c) => { c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">A pesquisa não tem esse número para esse grupo.</p>'; c.append(rodape(t)); return c; };

  const responde = async (t, cat, seg, fi) => {
    const c = cartao(t), rows = await dados(t.ds), q = quem(t, cat, seg);
    if (!rows) { c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">Não foi possível carregar os dados. Verifique a conexão e tente de novo.</p>'; return c; }
    if (t.ranking) {
      const its = t.itens.map(([l, ind, g, resp = 'Sim']) => ({ l, r: valor(rows, ind, g, resp, cat, seg), br: valor(rows, ind, g, resp) })).filter((x) => x.r).sort((a, b) => b.r.pct - a.r.pct);
      if (!its.length) return semDado(t, cat, seg, c);
      const cem = its.some((x) => precisaCem(x.r.pct)), L = (x) => t.aspas ? '“' + x.l + '”' : x.l;
      // a pergunta cita um item (ex.: "mestrado", "Instagram"): a frase fala dele, e a lista mostra o resto
      const f = fi != null ? [null, fi] : t.foco && t.foco.find(([re]) => re.test(pergunta.ultima || '')), alvo = f && its.find((x) => x.l === t.itens[f[1]][0]);
      // "o menos usado", "a faixa menos comum": a mesma resposta, olhando a outra ponta da lista
      const menos = MENOS.test(pergunta.ultima || ''), ponta = menos ? its.slice().reverse() : its;
      const um = menos ? t.um.replace(/\bmais\b/, 'menos') : t.um, varios = menos ? t.varios.replace(/\bmais\b/, 'menos') : t.varios;
      const [a, b] = alvo ? [alvo] : ponta, n = freq(a.r.pct, cem);
      const empate = b && (menos ? !separa(b.r, a.r) : !separa(a.r, b.r));
      const fq = fi != null && t.focoQuem; // a pergunta pronta já diz de quem se fala (ex.: só quem usa IA)
      const frase = alvo ? (fq || q) + ', ' + grifo(n) + ' ' + (cat || fq ? '' : sujeito(t)) + verbo1(n, t.focoTxt(a.l)) + '.'
        : empate
          ? q + ', ' + varios + ' são <strong>' + L(a) + '</strong> e <strong>' + L(b) + '</strong>: com a margem de erro, não dá para dizer qual vem ' + (menos ? 'por último' : 'primeiro') + '.'
          : q + ', ' + um + ' é <strong>' + L(a) + '</strong>: ' + grifo(n) + ' ' + (cat ? '' : sujeito(t)) + verbo1(n, t.val) + '.';
      const lis = (alvo ? its : ponta).slice(0, 6);
      c.innerHTML = entendi(t, cat, seg, alvo && maiusc(alvo.l)) + '<p class="tg-perg-frase">' + frase + '</p>' + iso(a.r.pct, t.pessoa) +
        '<ul class="tg-perg-lista">' + lis.map((x) => barra(x.l.charAt(0).toUpperCase() + x.l.slice(1), x.r, cat ? x.br : null)).join('') + '</ul>' + legenda(!!cat && lis.some((x) => x.br)) +
        '<p class="tg-perg-var">' + esc(a.l.charAt(0).toUpperCase() + a.l.slice(1)) + ': ' + n1(a.r.pct) + '% (' + faixa(a.r) + ')' + (cat && a.br ? '. No Brasil, ' + n1(a.br.pct) + '%.' : '.') + '</p>' +
        (lis.some((x) => !Number(x.r.moe)) ? '<p class="tg-perg-var">* sem margem de erro estimada (o valor vale para a amostra).</p>' : '');
      c.append(irBotao(t, cat, seg, 'Ver no painel'), rodape(t));
      return c;
    }
    const resp = t.resp || 'Sim', r = linha(rows, t.ind, t.grupo || '', resp, cat, seg), br = linha(rows, t.ind, t.grupo || '', resp);
    if (!r) return semDado(t, cat, seg, c);
    const cem = precisaCem(r.pct) || !!(cat && br && precisaCem(br.pct)), n = freq(r.pct, cem);
    const txt = cat ? (t.txtG || t.txt.replace(/^(escolas|gestores escolares|gestores) /, '')) : t.txt;
    let vs = '';
    if (cat && br) { const d = Math.round((r.pct - br.pct) * 10) / 10; vs = ' No Brasil, ' + freq(br.pct, cem) + ' (' + n1(br.pct) + '%)' + (!d ? '.' : separa(r, br) ? ', menos do que no grupo.' : separa(br, r) ? ', mais do que no grupo.' : ', parecido com o grupo.'); }
    c.innerHTML = entendi(t, cat, seg) + '<p class="tg-perg-frase">' + q + ', ' + grifo(n) + ' ' + verbo1(n, txt) + '.</p>' + iso(r.pct, t.pessoa) +
      '<ul class="tg-perg-lista">' + barra(cat ? segCurto(seg) : 'Brasil', r, cat ? br : null) + '</ul>' + legenda(!!(cat && br)) +
      '<p class="tg-perg-var">' + n1(r.pct) + '% (' + faixa(r) + ').' + vs + '</p>';
    c.append(irBotao(t, cat, seg, 'Ver no painel'), rodape(t));
    return c;
  };

  // compara todos os grupos de um tipo (ex.: as 5 regiões) para um indicador, com a regra das margens
  const compara = async (t, cat, q, aviso, so, fi) => {
    const c = cartao(t), rows = await dados(t.ds);
    let ent = cabeca(t, 'Comparar: ' + NOME_TIPO[cat]);
    if (!rows) { c.innerHTML = ent + '<p class="tg-perg-frase">Não foi possível carregar os dados. Verifique a conexão e tente de novo.</p>'; return c; }
    // o que comparar: o indicador do tema, ou o item citado de um ranking ("qual região mais usa WhatsApp")
    let ind = t.ind, grupo = t.grupo || '', resp = t.resp || 'Sim', txt = cat ? (t.txtG || (t.txt || '').replace(/^(escolas|gestores escolares|gestores) /, '')) : t.txt;
    if (t.ranking) {
      const f = fi != null ? [null, fi] : t.foco && t.foco.find(([re]) => re.test(q));
      if (!f) {
        c.innerHTML = ent + '<p class="tg-perg-frase">Para comparar os grupos, diga qual item: por exemplo, "' + (t.nome === 'Comunicação' ? 'qual região mais usa WhatsApp?' : 'qual região tem mais \u201c' + t.itens[0][0] + '\u201d?') + '"</p>' +
          '<p class="tg-perg-var">Itens deste tema: ' + t.itens.map((x) => x[0]).join(', ') + '.</p>';
        return c;
      }
      const it = t.itens[f[1]]; [ind, grupo, resp] = [it[1], it[2], it[3] || 'Sim']; txt = t.focoTxt(it[0]); ent = cabeca(t, 'Comparar: ' + NOME_TIPO[cat], maiusc(it[0]));
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
      ? 'A ' + qual + ' parcela que ' + verbo1('1 em cada', txt) + ' fica ' + onde(a.seg) + ' e ' + onde(b.seg) + ', mas a diferença entre ' + (t.ds === 'gestores' ? 'eles' : 'elas') + ' é pequena demais para dizer qual tem ' + (menos ? 'menos' : 'mais') + ' (ela cabe na margem de erro).'
      : 'A ' + qual + ' parcela fica ' + onde(a.seg) + ': ' + grifo(n) + ' ' + verbo1(n, txt) + '.';
    c.innerHTML = (aviso ? '<p class="tg-perg-var tg-perg-aviso">' + aviso + '</p>' : '') + ent + '<p class="tg-perg-frase">' + frase + (br ? ' No Brasil, ' + freq(br.pct, cem) + '.' : '') + '</p>' + // sem os bonecos: eles não diziam de qual grupo eram, e as barras já mostram cada um
      '<ul class="tg-perg-lista">' + ponta.map((x) => barra(segCurto(x.seg), x.r, br)).join('') + '</ul>' + legenda(!!br) +
      '<p class="tg-perg-var">' + esc(segCurto(a.seg)) + ': ' + n1(a.r.pct) + '% (' + faixa(a.r) + ')' + (br ? '. Brasil: ' + n1(br.pct) + '%.' : '.') + '</p>' +
      (its.some((x) => !x.r.moe) ? '<p class="tg-perg-var">* sem margem de erro estimada (o valor vale para a amostra).</p>' : '');
    // para a bateria de testes: qual grupo foi apontado e se houve empate
    c.dataset.ponta = a.seg; c.dataset.empate = empate ? '1' : '0'; c.dataset.cat = cat;
    const bt = el('button', 'tg-perg-ir', 'Ver a comparação no painel, com a margem de cada grupo <span aria-hidden="true">→</span>'); bt.type = 'button';
    bt.addEventListener('click', () => {
      const j = bt.closest('dialog'); if (j) j.close();
      if (!(window.mostraComparacao && window.mostraComparacao(t.ds, ind, grupo, resp, cat)) && window.mostraNoPainel) window.mostraNoPainel(t.ds, cat + '|' + a.seg, t.card);
    });
    c.append(bt, rodape(t));
    return c;
  };

  // ---------- ajuda da IA: só reescreve a pergunta; os números continuam vindo dos dados ----------
  // Vazio = desligada (o site funciona só com as palavras-chave). Depois de publicar o Worker, cole o endereço dele aqui.
  const IA_URL = 'https://bussola-pergunte-ia.sergiofelipeayresbr.workers.dev';
  const iaLigada = () => !!(IA_URL || window.__iaStub);
  const reescreve = async (txt) => {
    if (window.__iaStub) return window.__iaStub(txt); // testes/pergunte.html
    if (!IA_URL) return '';
    const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 8000);
    try {
      const r = await fetch(IA_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: txt.slice(0, 300) }), signal: ctl.signal });
      return r.ok ? String((await r.json()).q || '').slice(0, 300) : '';
    } catch { return ''; } finally { clearTimeout(tm); }
  };
  const mudou = (a, b) => !!b && sem(a).replace(/\W+/g, ' ').trim() !== sem(b).replace(/\W+/g, ' ').trim();
  let vezes = 0;
  // termos que o leitor pode não conhecer: quando aparecem na resposta, uma nota curta explica (a mesma do "Saiba mais" do cartão)
  const TERMOS = [[/Projeto Político Pedagógico/, 'O Projeto Político Pedagógico (PPP) é o documento em que cada escola escreve seus objetivos e como pretende ensinar, feito com os professores e a comunidade escolar.'],
    [/Mbps/, 'Mbps (megabits por segundo) mede quantos dados a internet entrega a cada segundo: quanto maior, mais rápida. A velocidade é dividida entre todos que estão conectados.'],
    [/\bmaker\b/i, 'Material maker é o material para atividades “mão na massa”, em que os alunos constroem, consertam ou inventam objetos com ferramentas, peças eletrônicas, impressora 3D ou sucata.'],
    [/Smart TV/, 'Smart TV é uma televisão que se conecta à internet. O conversor é um aparelho que faz o mesmo numa TV comum. Com eles, a turma pode ver vídeos e páginas da internet na tela da sala.'],
    [/sistemas digitais/i, 'Sistemas digitais na gestão são programas que a escola usa para cuidar de matrículas, frequência, notas e documentos, no lugar do papel.'],
    [/midiática/i, 'Educação midiática é ensinar a ler com olhar crítico notícias, vídeos e redes sociais: checar se uma informação é verdadeira, perceber o que é propaganda e publicar com responsabilidade.'],
    [/ambiente virtual/i, 'Plataforma ou ambiente virtual de aprendizagem é um site ou aplicativo em que a escola publica aulas, materiais e tarefas, e onde os alunos entregam trabalhos e acompanham as notas.'],
    [/anos (iniciais|finais)|Educação Profissional/i, 'Anos iniciais do Fundamental vão do 1º ao 5º ano; anos finais, do 6º ao 9º ano. Educação Profissional são os cursos técnicos.']];
  const explicaTermos = (saida) => { if (saida.querySelector('.tg-perg-nao ul')) return; // a lista de temas de "Ainda não sei" não pede explicação
    TERMOS.forEach(([re, txt], i) => { if (re.test(saida.textContent) && !saida.querySelector('.tg-perg-termo[data-termo="' + i + '"]')) { const p = el('p', 'tg-perg-var tg-perg-termo', txt); p.dataset.termo = i; saida.append(p); } }); };

  // "de": o texto original do leitor, quando "txt" é a versão reescrita pela IA
  const pergunta = async (txt, saida, de) => {
    const vez = saida.dataset.vez = String(++vezes);
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
    if (de) saida.append(el('p', 'tg-perg-var tg-perg-ia', 'Entendi sua pergunta como: <b>“' + esc(txt) + '”</b>'));
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
      // palavras-chave não reconheceram: pede à IA para reescrever (erros de grafia, gíria) e tenta de novo
      if (!de && iaLigada()) {
        const espera = el('p', 'tg-perg-var', 'Não reconheci de primeira. Tentando entender de outro jeito…');
        saida.append(espera);
        const nova = await reescreve(txt);
        if (saida.dataset.vez !== vez) return; // o leitor já fez outra pergunta
        espera.remove();
        if (mudou(txt, nova)) return pergunta(nova, saida, txt);
      }
      saida.append(el('article', 'tg-perg-res tg-perg-nao', '<p class="tg-perg-frase">Ainda não sei responder essa.</p><p class="tg-perg-var">Pergunte sobre um destes temas, com ou sem um grupo (uma região, escolas rurais ou particulares, escolas pequenas, gestoras, gestores jovens…):</p><ul>' + TEMAS.map((x) => '<li>' + x.nome + '</li>').join('') + '</ul>'));
      return;
    }
    const tipos = [...new Set(gs.map(([c]) => c))];
    if (tipos.length > 1) {
      // cruzamento de grupos: a pesquisa não publica; avisa (sem explicar o motivo) e mostra cada grupo separado
      const ns = gs.map(([c, s]) => '<strong>' + nomeGrupo(c, s) + '</strong>');
      saida.append(el('article', 'tg-perg-res tg-perg-nao', '<p class="tg-perg-frase">A pesquisa não publica um número que junte ' + (ns.length > 1 ? ns.slice(0, -1).join(', ') + ' e ' + ns[ns.length - 1] : ns[0]) + '.</p><p class="tg-perg-var">Veja cada grupo separado:</p>'));
      for (const c of await Promise.all(gs.map(([c, s]) => responde(t, c, s)))) saida.append(c);
      return;
    }
    // "negros": a pesquisa conta pretos e pardos separadamente; avisa antes das duas respostas
    if (/\bnegr/.test(q) && gs.filter(([c]) => c === 'COR OU RAÇA').length > 1)
      saida.append(el('p', 'tg-perg-var tg-perg-aviso', 'A pesquisa conta separadamente pessoas pretas e pardas, que juntas formam a população negra. Veja cada grupo:'));
    for (const c of await Promise.all((gs.length ? gs.slice(0, 3) : [[null, null]]).map(([c, s]) => responde(t, c, s)))) saida.append(c);
  };
  // para a bateria de testes (testes/pergunte.html): os temas e os tipos de grupo
  window.__perg = { TEMAS, DIMS, GRUPOS, SO_GESTOR, prontas };
  // para testes no console: window.__pergunte('quantas escolas rurais têm internet?')
  window.__perguntaEl = (txt) => { const d = document.createElement('div'); return pergunta(txt, d).then(() => (explicaTermos(d), d)); };
  window.__pergunte = (txt) => { const d = document.createElement('div'); return pergunta(txt, d).then(() => explicaTermos(d)).then(() => [...d.querySelectorAll('.tg-perg-entendi, .tg-perg-tema, .tg-perg-frase, .tg-perg-var, .tg-perg-base')].map((e) => e.textContent).join(' | ')); };

  // ---------- a caixa (a mesma no Início e na janela): só perguntas prontas, sem texto livre ----------
  let n = 0;
  // contexto (só na janela de Escolas e Gestores): a aba e o grupo escolhidos no painel, para as perguntas começarem por eles
  const caixa = (alvo, titulo, contexto) => {
    const id = 'perg-' + (++n);
    const box = el('div', 'tg-perg-caixa'); box.setAttribute('role', 'group'); box.setAttribute('aria-labelledby', id + '-tit');
    box.innerHTML = '<p class="tg-perg-tit" id="' + id + '-tit">' + titulo + '</p>' +
      '<p class="tg-perg-dica">Toque em uma pergunta para ver a resposta da pesquisa.</p><ul class="tg-perg-ex"></ul>' +
      '<button type="button" class="tg-perg-outras" hidden><svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4.5h-4.5"/></svg>Outras perguntas</button>';
    const saida = el('div', 'tg-perg-saida'); saida.setAttribute('aria-live', 'polite');
    const ex = box.querySelector('.tg-perg-ex'), outras = box.querySelector('.tg-perg-outras');
    const faz = async (q) => {
      const vez = saida.dataset.vez = String(++vezes); pergunta.ultima = ''; // nada da última pergunta escrita interfere
      const res = await q.faz();
      if (saida.dataset.vez !== vez) return; // o leitor já tocou outra pergunta
      saida.replaceChildren(res); explicaTermos(saida);
    };
    // perguntas como marcadores de página (os do "Ir para"), na cor do capítulo do tema que cada uma pergunta
    let listaAtual = null, ordemAtual = [], melhor = null, tentativas = 0;
    // depois que o leitor toca uma pergunta, a lista não muda mais sozinha (uma nova medida da largura ou a chegada
    // da fonte sorteava outra lista, e a pergunta tocada sumia)
    let tocada = false, capsAlvo = CAPS, chave = '', listaCompleta = null;
    const doGrupoSel = new Set(); // perguntas sobre o grupo escolhido no painel (marcadas na lista)
    const ctx = () => { const c = contexto ? contexto() : null; if (!c || !c.aba) return null; const [cat, seg] = (c.rec || '').split('|'); return { aba: c.aba, cat: cat && cat !== 'TOTAL' ? cat : null, seg }; };
    const chaveDe = (c) => c ? c.aba + '|' + (c.cat || '') + '|' + (c.seg || '') : '';
    const mostra = (lista) => {
      listaAtual = lista; tocada = false;
      // na janela de Escolas, só perguntas de escolas (e de Gestores, só de gestores); as do grupo escolhido entram primeiro
      const c = ctx(); chave = chaveDe(c); doGrupoSel.clear();
      if (c) { const pre = c.aba === 'escolas' ? 'Escolas ·' : 'Gestores ·', so = lista.filter((x) => x.cap.startsWith(pre)); if (so.length) lista = so; }
      capsAlvo = CAPS.filter((cp) => lista.some((x) => x.cap === cp));
      // sorteia MOSTRA perguntas, misturando os tipos (COTA), no máximo 2 por cor de capítulo
      // e no máximo POR_TEMA do mesmo tema, e evita duas cores iguais lado a lado
      // e no máximo MAX_LONGAS perguntas longas (mais de LONGA caracteres), para os tamanhos variarem sem encher a caixa
      const porT = {}; embaralha(lista).forEach((x) => (porT[x.tema] = porT[x.tema] || []).push(x));
      const filas = embaralha(Object.values(porT)), todas = [];
      while (filas.some((q) => q.length)) filas.forEach((q) => { if (q.length) todas.push(q.shift()); });
      const cota = Object.assign({}, COTA), conta = {}, porTema = {}, sorte = [];
      let longas = 0;
      const cabeTema = (x) => (porTema[x.tema] || 0) < POR_TEMA && (x.txt.length <= LONGA || longas < MAX_LONGAS);
      const pega = (x) => { sorte.push(x); conta[x.sec] = (conta[x.sec] || 0) + 1; porTema[x.tema] = (porTema[x.tema] || 0) + 1; if (x.txt.length > LONGA) longas++; if (cota[x.tipo] > 0) cota[x.tipo]--; };
      // 1) uma pergunta de cada capítulo. Os capítulos com menos perguntas curtas escolhem primeiro,
      //    para as poucas longas permitidas irem para quem não tem opção curta (ex.: Tecnologia na gestão)
      const curtasDe = (c) => todas.filter((x) => x.cap === c && x.txt.length <= LONGA).length;
      // 0) com um grupo escolhido no painel: até 2 perguntas sobre ele (ou comparando esse tipo de grupo)
      if (c && c.cat) {
        const doGrupo = todas.filter((x) => x.cat === c.cat && (x.seg === c.seg || x.tipo === 'compara') && cabeTema(x));
        for (const x of doGrupo.filter((y) => y.seg === c.seg).concat(doGrupo.filter((y) => y.tipo === 'compara'))) if (sorte.length < 2 && !sorte.includes(x) && cabeTema(x)) { pega(x); doGrupoSel.add(x); }
      }
      const caps = embaralha(capsAlvo).sort((a, b) => curtasDe(a) - curtasDe(b));
      for (const cp of caps) { if (sorte.some((y) => y.cap === cp)) continue; const x = todas.find((y) => y.cap === cp && cabeTema(y)); if (x) pega(x); }
      const doCap = sorte.slice();
      // 2) o resto, misturando os tipos (COTA) e no máximo 2 por cor
      for (const x of todas) if (sorte.length < MOSTRA && !sorte.includes(x) && cota[x.tipo] > 0 && (conta[x.sec] || 0) < 2 && cabeTema(x)) pega(x);
      for (const x of todas) if (sorte.length < MOSTRA && !sorte.includes(x) && cabeTema(x)) pega(x);
      // ordem: primeiro as de cada capítulo (o corte das 3 linhas tira do fim), depois o resto;
      // dentro de cada parte, sempre da cor que mais sobra, sem repetir a anterior
      const ordem = [];
      const ordena = (parte) => {
        for (let k = 0; k < 80; k++) { // primeiro tenta uma ordem ao acaso que não repita cor
          const p = embaralha(parte), ult = ordem.length && ordem[ordem.length - 1].sec;
          if (p[0].sec !== ult && p.every((x, j) => !j || x.sec !== p[j - 1].sec)) { ordem.push(...p); return; }
        }
        parte = embaralha(parte); // não deu: a regra antiga (a cor que mais sobra), com empates ao acaso
        while (parte.length) {
          const ult = ordem.length && ordem[ordem.length - 1].sec, n = (s) => parte.filter((x) => x.sec === s).length;
          const cands = parte.filter((x) => x.sec !== ult), pool = cands.length ? cands : parte;
          const prox = pool.reduce((a, x) => (n(x.sec) > n(a.sec) ? x : a), pool[0]);
          ordem.push(parte.splice(parte.indexOf(prox), 1)[0]);
        }
      };
      ordena(doCap); ordena(sorte.filter((x) => !ordem.includes(x)));
      desenha(ordem);
    };
    const desenha = (ordem, final) => {
      ordemAtual = ordem;
      ex.replaceChildren(...ordem.map((q) => {
        const li = el('li'), b = el('button', 'tg-perg-chip'); b.type = 'button'; b.textContent = q.txt; b.setAttribute('aria-pressed', 'false'); li.dataset.tema = q.tema; li.dataset.cap = q.cap; if (q.txt.length > LONGA) li.dataset.longa = ''; if (doGrupoSel.has(q)) li.dataset.grupo = '';
        if (q.sec) b.style.setProperty('--sec', 'var(--v-' + q.sec + ')');
        b.addEventListener('click', () => {
          tocada = true;
          ex.querySelectorAll('.tg-perg-chip').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
          faz(q);
        });
        li.append(b); return li;
      }));
      corta(final);
    };
    // no máximo LINHAS linhas de perguntas: as que passariam disso ficam escondidas. Medido na tela,
    // então vale em qualquer largura; refeito quando a largura muda (e quando a janela de Escolas/Gestores abre)
    // uma a uma, na ordem: a pergunta que cairia na 4ª linha sai, e uma mais curta depois dela ainda pode caber
    const corta = (final) => {
      // depois do toque, o que está à vista fica como está (a resposta abre a barra de rolagem da janela,
      // a largura muda e a lista se refazia, trocando perguntas debaixo do dedo)
      if (tocada) return;
      const lis = [...ex.children]; lis.forEach((li) => { li.hidden = false; });
      if (!ex.offsetWidth) return; // escondida (janela fechada): mede quando aparecer
      const linhasAte = (k) => new Set(lis.slice(0, k + 1).filter((li) => !li.hidden).map((li) => Math.round(li.getBoundingClientRect().bottom))).size; // a lista alinha pela base (align-items:flex-end)
      // caixa estreita (celular): as longas ficam de fora, porque quebrariam em várias linhas
      // (uma pergunta do grupo escolhido no painel fica, mesmo longa: as do grupo costumam ser as mais longas)
      if (ex.offsetWidth < LARGA) { let umDoGrupo = true; lis.forEach((li) => { if (!('longa' in li.dataset)) return; if (umDoGrupo && 'grupo' in li.dataset) { umDoGrupo = false; return; } li.hidden = true; }); }
      lis.forEach((li, k) => { if (!li.hidden && !li.querySelector('[aria-pressed="true"]') && linhasAte(k) > LINHAS) li.hidden = true; }); // a tocada nunca some
      // o que ficou visível precisa ter pelo menos MIN_TEMAS temas diferentes (ou todas diferentes, se couberem menos)
      // e, numa caixa larga (computador), no máximo 1 linha com menos de 3 perguntas; se não, sorteia de novo (com limite de tentativas)
      // e todos os capítulos à vista (no celular, onde cabem menos, todas de capítulos diferentes)
      const vis = lis.filter((li) => !li.hidden), temas = new Set(vis.map((li) => li.dataset.tema)), caps = new Set(vis.map((li) => li.dataset.cap));
      const porLinha = {}; vis.forEach((li) => { const b = Math.round(li.getBoundingClientRect().bottom); porLinha[b] = (porLinha[b] || 0) + 1; });
      const ralas = ex.offsetWidth >= LARGA ? Object.values(porLinha).filter((n) => n < 3).length : 0;
      const precisaCaps = Math.min(capsAlvo.length, vis.length), precisaTemas = Math.min(MIN_TEMAS, vis.length);
      const ok = caps.size >= precisaCaps && temas.size >= precisaTemas && ralas <= 1;
      if (ok || final || tocada || !listaAtual) { tentativas = 0; melhor = null; return; }
      // nem sempre dá para cumprir tudo (caixa mais estreita): guarda o melhor sorteio, nesta ordem de prioridade:
      // todos os capítulos, depois os temas, depois as linhas cheias, depois mais perguntas
      const nota = Math.min(caps.size, precisaCaps) * 1000 + Math.min(temas.size, precisaTemas) * 100 - Math.min(ralas, 3) * 10 + vis.length;
      if (!melhor || nota > melhor.nota) melhor = { nota, ordem: ordemAtual };
      if (tentativas++ < 60) mostra(listaAtual);
      else { const m = melhor; tentativas = 0; melhor = null; desenha(m.ordem, true); }
    };
    // as fontes do site podem chegar depois da primeira medida e alargar as perguntas: mede de novo
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(() => corta()); document.fonts.addEventListener('loadingdone', () => corta()); }
    if (window.ResizeObserver) { let w = -1; new ResizeObserver(([e]) => { const nw = Math.round(e.contentRect.width); if (nw !== w) { w = nw; corta(); } }).observe(ex); }
    // as perguntas saem dos dados: enquanto eles carregam, a lista avisa
    ex.append(el('li', 'tg-perg-var', 'Carregando perguntas…'));
    prontas().then((lista) => {
      const curtas = lista.filter((q) => q.txt.length <= MAX_CARS);
      if (!curtas.length) { ex.replaceChildren(el('li', 'tg-perg-var', 'Não foi possível carregar as perguntas. Verifique a conexão e recarregue a página.')); return; }
      listaCompleta = curtas; mostra(curtas);
      outras.hidden = false;
    });
    // "Outras perguntas": sorteia uma lista nova com as mesmas regras, sem repetir as que estavam à vista.
    // A resposta já aberta continua na tela; o foco fica no botão, para tocar de novo
    outras.addEventListener('click', () => {
      if (!listaCompleta) return;
      const vistas = new Set([...ex.children].filter((li) => !li.hidden).map((li) => li.firstChild && li.firstChild.textContent));
      const novas = listaCompleta.filter((q) => !vistas.has(q.txt));
      tentativas = 0; melhor = null;
      mostra(novas.length > 40 ? novas : listaCompleta);
    });
    alvo.append(box, saida);
    return {
      focus: () => (ex.querySelector('.tg-perg-chip') || ex).focus(),
      // ao abrir a janela: se o leitor mudou de aba ou de grupo desde o último sorteio, sorteia de novo (e limpa a resposta antiga)
      atualiza: () => { if (listaAtual && chaveDe(ctx()) !== chave) { saida.replaceChildren(); mostra(listaCompleta); } }
    };
  };
  const embaralha = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  const monta = () => {
    // Início: aberta, logo depois da capa
    const ini = document.getElementById('pergunte');
    if (ini) caixa(ini, 'Escolha uma pergunta, a pesquisa responde');
    // Escolas e Gestores: botão "Perguntar" ao lado de "Como ler este painel", abrindo uma janela
    const guiaBtn = document.querySelector('#topo .tg-guide-btn'), guia = document.getElementById('como-ler');
    if (!guiaBtn || !guia) return;
    const j = el('dialog', 'tg-guide tg-perg-janela'); j.id = 'pergunte-janela'; j.setAttribute('aria-labelledby', 'pergunte-janela-tit');
    j.innerHTML = '<div class="tg-guide-top"><h2 class="tg-guide-title" id="pergunte-janela-tit">Pergunte à Bússola</h2><button type="button" class="tg-guide-x" aria-label="Fechar"><svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="tg-guide-body"></div>';
    guia.after(j);
    const inp = caixa(j.querySelector('.tg-guide-body'), 'O que você quer saber?', () => ({ aba: document.querySelector('.nav-link[aria-current=page]')?.dataset.view, rec: window.dash && window.dash.params().recorte }));
    j.querySelector('.tg-guide-x').addEventListener('click', () => j.close());
    j.addEventListener('click', (e) => { if (e.target === j) j.close(); });
    const b = el('button', 'tg-guide-btn tg-perg-btn', '<svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>Perguntar');
    b.type = 'button'; b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-controls', j.id);
    b.addEventListener('click', () => { inp.atualiza(); j.showModal(); inp.focus(); });
    // "Como ler" e "Perguntar" lado a lado (quebram para a linha de baixo se não couberem)
    const par = el('div', 'tg-head-botoes'); guiaBtn.before(par); par.append(guiaBtn, b);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monta); else monta();
})();
