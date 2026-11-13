/* Painel TIC Educação 2025 — desenho dos gráficos. Depende de d3 (global) e de dash-shim.js. */
(() => {
  const DS = 'gestores', META = 'indicadores', TOT = 'total_recorte', TOTAL = 'TOTAL|Total';
  const nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const nfc = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });
  const pct = (v) => nf1.format(v) + '%';
  // margem de erro dita como faixa: "entre 93,6% e 96,6%" (limitada a 0% e 100%)
  const faixa = (r) => 'entre ' + pct(Math.max(0, r.pct - r.moe)) + ' e ' + pct(Math.min(100, r.pct + r.moe));
  const enc = (s) => String(s).replace(/%/g, '%25').replace(/&/g, '%26').replace(/=/g, '%3D');
  const em10 = (v) => Math.round(v / 10);
  // frase arredondada: "Cerca de 7 em cada 10"; sem "cerca de" só quando o número é exato (ex.: 100%). ini = false no meio da frase
  const freqTxt = (v, ini = true) => {
    if (v >= 99.5 && v < 100) return (ini ? 'Quase' : 'quase') + ' 100 em cada 100';
    const cem = v >= 90 || v < 10, n = cem ? Math.round(v) : em10(v), s = n + (cem ? ' em cada 100' : ' em cada 10');
    return Math.abs(v - (cem ? n : n * 10)) < 0.05 ? s : (ini ? 'Cerca de ' : 'cerca de ') + s;
  };
  const root = document.getElementById('painel');

  const CAT = {
    'TOTAL': 'Brasil', 'SEXO': 'Sexo do gestor', 'COR OU RAÇA': 'Cor ou raça do gestor', 'FAIXA ETÁRIA': 'Idade do gestor',
    'REGIÃO': 'Região', 'ÁREA': 'Área da escola', 'LOCALIZAÇÃO': 'Localização', 'DEPENDÊNCIA ADMINISTRATIVA': 'Rede de ensino',
    'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO': 'Nível de ensino mais alto da escola', 'PORTE': 'Porte da escola',
    'ESCOLA COM INTERNET E COMPUTADOR PARA USO DOS ALUNOS': 'Internet e computador para os alunos'
  };
  const SEGL = {
    'ESCOLA COM INTERNET E COMPUTADOR PARA USO DOS ALUNOS|Sim': 'Escola com internet e computador para alunos',
    'ESCOLA COM INTERNET E COMPUTADOR PARA USO DOS ALUNOS|Não': 'Escola sem internet e computador para alunos',
    'DEPENDÊNCIA ADMINISTRATIVA|Públicas (Municipal, Estadual e Federal)': 'Públicas (todas as redes)'
  };
  const segName = (rec) => rec === TOTAL ? 'Brasil' : (SEGL[rec] || rec.split('|')[1]);
  const recName = (rec) => rec === TOTAL ? 'Brasil' : (SEGL[rec] || (CAT[rec.split('|')[0]] + ': ' + rec.split('|')[1]));

  const P = '<circle cx="12" cy="5.6" r="3.4"/><path d="M5.5 22v-6.5a6.5 6.5 0 0 1 13 0V22z"/>';
  const ICON = {
    coracao: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    quadro: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20l4-4 4 4M7 8h6M7 11h9"/>',
    ia: '<path d="M12 2.5l2.1 6.4 6.4 2.1-6.4 2.1L12 19.5l-2.1-6.4-6.4-2.1 6.4-2.1z"/>',
    celular: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
    escudo: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V6z"/>',
    livro: '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>',
    midia: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9.5v5l4.5-2.5z"/>',
    texto: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 14h7M9 17h4"/>',
    grafico: '<path d="M4 20h16"/><path d="M7 16v-5M12 16V7M17 16v-8"/>',
    pasta: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    sino: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5h4"/>',
    balao: '<path d="M4 5h16v10H10l-5 4v-4H4z"/>',
    calendario: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    lupa: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    camera: '<rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 11l5-3v8l-5-3z"/>',
    porta: '<path d="M5 21V4h10v17M15 6h4v15M3 21h18"/><path d="M12 13h.01"/>',
    alvo: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".5"/>',
    acesso: '<circle cx="12" cy="4.5" r="2"/><path d="M5 9l7 1.5L19 9M12 10.5V15l-3 6M12 15l3 6"/>',
    raio: '<path d="M13 2L5 13h6l-1 9 8-11h-6z"/>',
    engrenagem: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    pessoa: P, cadeira: '<path d="M7 3h10v8H7zM5 11h14M8 11l-2 10M16 11l2 10"/>'
  };
  const ic = (k) => k ? '<svg class="tg-ic' + (k === 'pessoa' ? ' tg-solid' : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + '</svg>' : '';

  const D7 = {
    'Impactos das tecnologias digitais na saúde mental dos alunos': ['Saúde mental dos alunos', 'coracao'],
    'Impactos das tecnologias digitais na saúde mental dos professores': ['Saúde mental dos professores', 'coracao'],
    'Impactos das tecnologias digitais na prática pedagógica dos professores': ['Impacto na prática pedagógica', 'quadro'],
    'Regras para uso de ferramentas de Inteligência Artificial pelos alunos ou professores': ['Regras para o uso de IA', 'ia'],
    'Regras para uso de celulares pelos alunos nas dependências da escola': ['Regras para o uso de celular', 'celular'],
    'Ações em relação a casos de cyberbullying, discriminação, vazamento de imagens ou outras situações ocorridas na Internet com os alunos da escola': ['Casos de cyberbullying, discriminação e vazamento de imagens', 'escudo'],
    'Inclusão de atividades sobre uso seguro, crítico e responsável das tecnologias digitais no currículo da escola': ['Uso seguro e crítico da tecnologia no currículo', 'livro'],
    'Inclusão de atividades sobre educação midiática e uso crítico das mídias no currículo da escola': ['Educação midiática no currículo', 'midia']
  };
  const D8 = {
    'O uso de tecnologias digitais em atividades educacionais está integrado ao Projeto Político Pedagógico da escola': 'Está no Projeto Político Pedagógico',
    'O uso de tecnologias digitais em atividades educacionais está integrado ao currículo da escola': 'Está integrada ao currículo',
    'Os professores da escola possuem habilidades para integrar tecnologias digitais às atividades educacionais': 'Os professores têm habilidade para integrá-la',
    'A direção e a coordenação participam do planejamento do uso de tecnologias digitais em atividades educacionais na escola': 'Direção e coordenação planejam seu uso',
    'A escola monitora o impacto do uso de tecnologias digitais na aprendizagem dos alunos por meio de avaliações e indicadores': 'A escola mede seu impacto na aprendizagem',
    'As equipes de gestão e coordenação da escola receberam orientações da rede de ensino sobre como integrar tecnologias digitais em atividades educacionais': 'A gestão recebeu orientação da rede de ensino'
  };
  const D9B = {
    'Transcrever, resumir, revisar ou traduzir textos': 'texto', 'Criar conteúdos audiovisuais, como imagens, apresentações de slides, vídeos': 'midia',
    'Produzir relatórios': 'grafico', 'Organizar documentos e certidões da escola': 'pasta', 'Criar convites, avisos e comunicados automaticamente': 'sino',
    'Gerar mensagens e respostas automáticas': 'balao', 'Criar cronogramas e fluxos de trabalho escolares': 'calendario',
    'Organizar e planejar atividades pedagógicas e de gestão': 'quadro', 'Analisar dados sobre o desempenho dos alunos, as práticas pedagógicas ou o funcionamento da escola': 'lupa',
    'Monitorar os serviços ofertados pela escola, como alimentação escolar, transporte e limpeza': 'engrenagem', 'Aprimorar os sistemas de segurança da escola': 'camera'
  };
  const D9C = {
    'Redução de evasão, faltas ou abandono escolar dos alunos': ['Reduzir evasão, faltas e abandono', 'porta'],
    'Identificação das dificuldades de aprendizagem dos alunos': ['Identificar dificuldades de aprendizagem', 'lupa'],
    'Segurança e prevenção à violência na escola': ['Segurança e prevenção à violência', 'escudo'],
    'Promoção do bem-estar dos alunos': ['Bem-estar dos alunos', 'coracao'],
    'Melhoria da aprendizagem dos alunos': ['Melhorar a aprendizagem', 'alvo'],
    'Inclusão de alunos com deficiência': ['Incluir alunos com deficiência', 'acesso'],
    'Comunicação com pais e responsáveis': ['Comunicação com as famílias', 'balao'],
    'Acesso às atividades educacionais em períodos de emergência, como durante crises climáticas, de saúde, conflitos armados, entre outros': ['Manter as aulas em emergências (clima, saúde, conflitos)', 'raio'],
    'Integração entre as áreas de gestão pedagógica, financeira e administrativa': ['Integrar as áreas pedagógica, financeira e administrativa', 'engrenagem']
  };

  // ---------- extra icons and labels for schools ----------
  Object.assign(ICON, {
    escola: '<path d="M12 2.5L2.5 8.5h19z"/><path d="M4.5 9.5h15V21h-5.5v-5h-4v5H4.5z"/>',
    fibra: '<path d="M3 12c3-6 6 6 9 0s6 6 9 0"/>',
    cabo: '<path d="M4 20V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v11"/><path d="M9 3v3M15 3v3"/>',
    radio: '<path d="M12 21V11"/><path d="M7.5 6.5a6.4 6.4 0 0 0 0 9M16.5 6.5a6.4 6.4 0 0 1 0 9"/><circle cx="12" cy="11" r="1.5"/>',
    satelite: '<path d="M5 13a6 6 0 0 0 6 6"/><path d="M8 13l3 3M13 4l7 7-3 3-7-7z"/>',
    desktop: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
    notebook: '<rect x="5" y="5" width="14" height="10" rx="1.2"/><path d="M2.5 19h19"/>',
    tablet: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M11 18.5h2"/>',
    tv: '<rect x="2.5" y="5" width="19" height="12" rx="1.5"/><path d="M8 21h8"/>',
    robo: '<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 4v4M9 13h.01M15 13h.01M3 13v3M21 13v3"/>',
    ferramenta: '<path d="M14.5 5.5a4 4 0 0 0 5 5L11 19a2 2 0 0 1-3-3z"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path style="fill:currentColor;stroke:none" transform="translate(7.3 6.9) scale(.39)" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
    telegram: '<path d="M20.5 4.5L3.2 11.2l5.5 2.1 2 6.2 3.1-3.6 4.6 3.4z"/><path d="M8.7 13.3l11.8-8.8"/>',
    app: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    rede: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
    // logos das redes sociais redesenhados no mesmo traço dos demais ícones
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><path d="M16.8 7.2h.01"/>',
    facebook: '<circle cx="12" cy="12" r="8.5"/><path d="M15.2 7.6h-1.4a2.6 2.6 0 0 0-2.6 2.6v10.2M8.8 13h5.6"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.2 9.4v5.2l4.4-2.6z"/>',
    tiktok: '<path d="M13 3.5V15a3.5 3.5 0 1 1-3.5-3.5"/><path d="M13 3.5a4.5 4.5 0 0 0 4.5 4.5"/>',
    x: '<path d="M4.5 4h4l11 16h-4z"/><path d="M19.5 4l-6.3 7.1M4.5 20l6.3-7.1"/>',
    digital: '<path d="M8 20c-1.5-2-2-4.5-2-8a6 6 0 0 1 12 0M12 12v4c0 2 .7 3.5 2 5M9 12a3 3 0 0 1 6 0c0 4 1 6 2.5 7.5"/>',
    rosto: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0"/>',
    cadeado: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
  });
  const SCHOOL = ICON.escola;

  const A2L = { 'Conexão via fibra ótica': ['Fibra ótica', 'fibra'], 'Conexão via cabo': ['Cabo', 'cabo'], 'Conexão via satélite': ['Satélite', 'satelite'], 'Modem 3G, 4G ou 5G': ['Rede de celular (3G, 4G ou 5G)', 'celular'], 'Conexão via rádio': ['Rádio', 'radio'] };
  const A19L = {
    'A Internet cai ou para de funcionar': 'A internet cai ou para', 'A qualidade da Internet fica ruim': 'A qualidade fica ruim',
    'O sinal de Internet não chega às salas que ficam mais distantes do roteador': 'O sinal não chega às salas mais distantes',
    'O pacote de Internet da escola acaba': 'O pacote de dados acaba', 'Falta manutenção para os equipamentos de Internet da escola': 'Falta manutenção nos equipamentos',
    'A escola tem dificuldades para pagar pelo plano de Internet': 'É difícil pagar o plano', 'A Internet da escola não suporta muitos acessos ao mesmo tempo': 'Não aguenta muitos acessos ao mesmo tempo'
  };
  const A20L = {
    'A escola não necessita de Internet': ['A escola diz não precisar', 'escola'], 'Alto custo de conexão à Internet': ['Custo alto', 'grafico'],
    'Falta de infraestrutura de acesso à Internet na região': ['Não há infraestrutura na região', 'radio'], 'Falta de infraestrutura de acesso à Internet na escola': ['Não há infraestrutura na escola', 'cabo'],
    'Ausência de energia elétrica na escola': ['Escola sem energia elétrica', 'raio'], 'O fornecimento de energia elétrica na escola é intermitente': ['Energia elétrica falha', 'raio'],
    'Os funcionários da escola possuem pouca habilidade no uso da Internet': ['Pouca habilidade da equipe', 'pessoa'], 'Os funcionários da escola possuem preocupação com segurança e privacidade': ['Preocupação com segurança e privacidade', 'cadeado'],
    'Os equipamentos da escola para conexão à Internet estão quebrados, em manutenção ou foram roubados': ['Equipamentos quebrados ou roubados', 'ferramenta'], 'Outros motivos': ['Outros motivos', null]
  };
  const FREQ = ['Sempre', 'Quase sempre', 'Às vezes', 'Quase nunca', 'Nunca'];

  const MEAS = [
    { id: 'ia', ds: 'gestores', label: 'Gestores que usam IA na gestão', ind: 'D9A', grupo: '', resp: 'Sim' },
    { id: 'mulheres', ds: 'gestores', label: 'Gestoras mulheres', ind: 'A1', grupo: '', resp: 'Feminino' },
    { id: 'jovens', ds: 'gestores', label: 'Gestores com até 40 anos', ind: 'A2', grupo: '', resp: 'Até 40 anos' },
    { id: 'pos', ds: 'gestores', label: 'Gestores com especialização ou pós', ind: 'A4', grupo: 'Especialização ou pós-graduação', resp: 'Sim' },
    { id: 'mestrado', ds: 'gestores', label: 'Gestores com mestrado', ind: 'A4', grupo: 'Mestrado', resp: 'Sim' },
    { id: 'veteranos', ds: 'gestores', label: 'Gestores há mais de 10 anos no cargo', ind: 'D2', grupo: '', resp: 'Há mais de 10 anos' },
    { id: 'reun_prof', ds: 'gestores', label: 'Gestores que reuniram professores sobre tecnologia', ind: 'D3_1', grupo: '', resp: 'Sim' },
    { id: 'reun_pais', ds: 'gestores', label: 'Gestores que reuniram famílias sobre tecnologia', ind: 'D6', grupo: '', resp: 'Sim' },
    { id: 'habil', ds: 'gestores', label: 'Gestores que acham que os professores sabem integrar tecnologia', ind: 'D8', grupo: 'Os professores da escola possuem habilidades para integrar tecnologias digitais às atividades educacionais', resp: 'Concorda' },
    { id: 'e_internet', ds: 'escolas', label: 'Escolas com internet', ind: 'A1', grupo: '', resp: 'Sim' },
    { id: 'e_int_alunos', ds: 'escolas', label: 'Escolas com internet para os alunos', ind: 'A7', grupo: '', resp: 'Sim' },
    { id: 'e_pc_int_alunos', ds: 'escolas', label: 'Escolas com computador e internet para os alunos', ind: 'A8', grupo: '', resp: 'Sim' },
    { id: 'e_fibra', ds: 'escolas', label: 'Escolas conectadas por fibra ótica (entre as com internet)', ind: 'A2', grupo: '', resp: 'Conexão via fibra ótica' },
    { id: 'e_robotica', ds: 'escolas', label: 'Escolas com material de robótica', ind: 'B15', grupo: '', resp: 'Sim' },
    { id: 'e_celular', ds: 'escolas', label: 'Escolas com regras para o celular dos alunos', ind: 'C3C', grupo: '', resp: 'Sim' },
    { id: 'e_guia_ia', ds: 'escolas', label: 'Escolas com guia sobre uso de IA', ind: 'E5A', grupo: '', resp: 'Sim' },
    { id: 'e_ia_alunos', ds: 'escolas', label: 'Escolas que permitem IA aos alunos', ind: 'E5B', grupo: '', resp: 'Sim' },
    { id: 'e_dados', ds: 'escolas', label: 'Escolas com política de proteção de dados', ind: 'H1', grupo: '', resp: 'Sim' },
    { id: 'e_facial', ds: 'escolas', label: 'Escolas com reconhecimento facial dos alunos', ind: 'E4B', grupo: '', resp: 'Sim' }
  ];

  // ---------- "Você sabia?" da tela inicial: frase = "<N em cada 10> <txt>." (txt1: forma no singular) ----------
  const FACTS = [
    { ds: 'gestores', ind: 'A1', grupo: '', resp: 'Feminino', icon: 'pessoa', txt: 'gestores escolares são mulheres', card: 'card-sexo' },
    { ds: 'gestores', ind: 'D9A', grupo: '', resp: 'Sim', icon: 'ia', txt: 'gestores já usam inteligência artificial na gestão da escola', card: 'card-ia-adocao' },
    { ds: 'gestores', ind: 'A4', grupo: 'Especialização ou pós-graduação', resp: 'Sim', icon: 'livro', txt: 'gestores têm especialização ou pós-graduação', card: 'card-formacao' },
    { ds: 'gestores', ind: 'A4', grupo: 'Mestrado', resp: 'Sim', icon: 'livro', txt: 'gestores têm mestrado', txt1: 'gestores tem mestrado', card: 'card-formacao' },
    { ds: 'gestores', ind: 'A2', grupo: '', resp: 'Até 40 anos', icon: 'calendario', txt: 'gestores têm até 40 anos', card: 'card-idade' },
    { ds: 'gestores', ind: 'D2', grupo: '', resp: 'Há mais de 10 anos', icon: 'calendario', txt: 'gestores estão há mais de 10 anos na direção da escola', card: 'card-tempo' },
    { ds: 'gestores', ind: 'D3_1', grupo: '', resp: 'Sim', icon: 'balao', txt: 'gestores reuniram professores para falar de tecnologia no último ano', card: 'card-reunioes' },
    { ds: 'gestores', ind: 'D6', grupo: '', resp: 'Sim', icon: 'balao', txt: 'gestores reuniram as famílias para falar de tecnologia no último ano', card: 'card-reunioes' },
    { ds: 'escolas', ind: 'A1', grupo: '', resp: 'Sim', icon: 'radio', txt: 'escolas têm acesso à internet', card: 'card-camadas' },
    { ds: 'escolas', ind: 'A7', grupo: '', resp: 'Sim', icon: 'pessoa', txt: 'escolas oferecem internet para os alunos', card: 'card-camadas' },
    { ds: 'escolas', ind: 'A8', grupo: '', resp: 'Sim', icon: 'notebook', txt: 'escolas oferecem computador e internet para os alunos', card: 'card-camadas' },
    { ds: 'escolas', ind: 'A2', grupo: '', resp: 'Conexão via fibra ótica', icon: 'fibra', txt: 'escolas com internet estão conectadas por fibra ótica', card: 'card-tipo-conexao' },
    { ds: 'escolas', ind: 'B15', grupo: '', resp: 'Sim', icon: 'robo', txt: 'escolas têm material para aulas de robótica', card: 'card-recursos' },
    { ds: 'escolas', ind: 'C3C', grupo: '', resp: 'Sim', icon: 'celular', txt: 'escolas têm regras para o uso do celular pelos alunos', card: 'card-politicas' },
    { ds: 'escolas', ind: 'E5A', grupo: '', resp: 'Sim', icon: 'ia', txt: 'escolas têm um guia sobre o uso de inteligência artificial', card: 'card-politicas' },
    { ds: 'escolas', ind: 'E5B', grupo: '', resp: 'Sim', icon: 'ia', txt: 'escolas permitem que os alunos usem inteligência artificial', card: 'card-politicas' },
    { ds: 'escolas', ind: 'H1', grupo: '', resp: 'Sim', icon: 'cadeado', txt: 'escolas têm política de proteção de dados', card: 'card-politicas' },
    { ds: 'escolas', ind: 'E4B', grupo: '', resp: 'Sim', icon: 'rosto', txt: 'escolas usam reconhecimento facial dos alunos', card: 'card-vigilancia' },
    { ds: 'escolas', ind: 'F3', grupo: 'Instagram', resp: 'Sim', icon: 'instagram', txt: 'escolas têm perfil no Instagram', card: 'card-redes' },
    { ds: 'escolas', ind: 'F4A', grupo: 'WhatsApp', resp: 'Sim', icon: 'whatsapp', txt: 'escolas usam o WhatsApp para se comunicar', card: 'card-canais' }
  ];

  dash.calc('total_recorte', {
    inputs: ['gestores'], title: 'Gestores por recorte',
    description: 'Soma das estimativas de gestoras e gestores (tabela A1 de gestores, totais) em cada recorte.',
    fn: (gestores) => {
      const m = new Map();
      for (const r of gestores) if (r.ind === 'A1') { const k = r.cat + '|' + r.seg; m.set(k, (m.get(k) || 0) + Number(r.n || 0)); }
      return [...m].map(([recorte, total]) => ({ recorte, total }));
    }
  });
  dash.calc('total_escolas', {
    inputs: ['escolas'], title: 'Escolas por recorte',
    description: 'Soma das estimativas de escolas com e sem internet (tabela A1 de escolas, totais) em cada recorte.',
    fn: (escolas) => {
      const m = new Map();
      for (const r of escolas) if (r.ind === 'A1') { const k = r.cat + '|' + r.seg; m.set(k, (m.get(k) || 0) + Number(r.n || 0)); }
      return [...m].map(([recorte, total]) => ({ recorte, total }));
    }
  });

  // ---------- data index ----------
  const IDX = {}, SEGS = {}, CATS = {}, LAST = {};
  let CUR = 'gestores';
  const build = (ds, rows) => {
    if (LAST[ds] === rows) return;
    LAST[ds] = rows; const idx = new Map(), segs = [], cats = [], seen = new Set();
    for (const r of rows) {
      r.pct = Number(r.pct); r.moe = r.moe == null ? null : Number(r.moe); r._ds = ds;
      idx.set(r.key, r);
      const s = r.cat + '|' + r.seg;
      if (r.ind === 'A1' && !seen.has(s)) { seen.add(s); if (r.seg !== 'Não respondeu') segs.push(s); if (!cats.includes(r.cat)) cats.push(r.cat); }
    }
    IDX[ds] = idx; SEGS[ds] = segs; CATS[ds] = cats;
  };
  const get = (ind, grupo, resp, rec, ds = CUR) => IDX[ds] && IDX[ds].get([ind, ...rec.split('|'), grupo, resp].join('|'));
  const markRow = (el, row, field = 'pct') => {
    el.setAttribute('data-source', row._ds); el.setAttribute('data-field', field); el.setAttribute('data-where', 'key=' + enc(row.key));
  };
  const unmark = (el) => { el.removeAttribute('data-field'); el.removeAttribute('data-where'); };

  // ---------- 0% ou 100% sem margem de erro ----------
  // Quando ninguém da amostra de um grupo respondeu de outro jeito, a tabela traz 0% ou 100% com margem 0:
  // a margem não pôde ser estimada e o valor real pode ser um pouco diferente. Não marcamos os casos em que
  // o próprio recorte define a resposta (ex.: no recorte "Sexo: Feminino", 100% são mulheres por definição).
  const DEFINE_G = { A1: 'SEXO', A2: 'FAIXA ETÁRIA', A3: 'COR OU RAÇA' };
  const definitional = (r) => (r._ds === 'gestores' && DEFINE_G[r.ind] === r.cat) ||
    (r._ds === 'escolas' && r.cat === 'ESCOLA COM INTERNET E COMPUTADOR PARA USO DOS ALUNOS' && ['A1', 'A6', 'A7', 'A8'].includes(r.ind));
  const noMoe = (r) => !!r && r.moe === 0 && (r.pct === 0 || r.pct === 100) && !definitional(r);
  const noMoeTxt = (ds, short) => short
    ? '* Margem de erro não estimada: ninguém da amostra deste grupo respondeu de outro jeito.'
    : '* ' + (ds === 'escolas' ? 'Nenhuma escola' : 'Nenhum gestor') + ' da amostra deste grupo respondeu de outro jeito, por isso a margem de erro não pôde ser estimada. O valor real pode ser um pouco diferente de 0% ou 100%.';
  // marca com asterisco os números afetados e põe a nota no cartão (roda depois de cada desenho)
  const flagNoMoe = () => {
    root.querySelectorAll('.tg-nomoe-note').forEach((n) => n.remove());
    root.querySelectorAll('.tg-nomoe').forEach((n) => { n.classList.remove('tg-nomoe'); n.removeAttribute('title'); });
    const boxes = new Map();
    root.querySelectorAll('[data-field="pct"][data-where^="key="]').forEach((el) => {
      if (el.closest('[hidden]')) return;
      const idx = IDX[el.getAttribute('data-source')];
      const row = idx && idx.get(decodeURIComponent(el.getAttribute('data-where').slice(4)));
      if (!noMoe(row)) return;
      el.classList.add('tg-nomoe'); el.title = noMoeTxt(row._ds, true).slice(2);
      const box = el.closest('.tg-card, .tg-kpi');
      if (box) boxes.set(box, row._ds);
    });
    boxes.forEach((ds, box) => {
      const p = document.createElement('p'); p.className = 'tg-nomoe-note';
      p.textContent = noMoeTxt(ds, box.classList.contains('tg-kpi'));
      const base = box.querySelector(':scope > .tg-base');
      if (base) box.insertBefore(p, base); else box.append(p);
    });
  };
  const unit = () => CUR === 'escolas' ? 'escolas' : 'gestores';

  // ---------- tooltip ----------
  const tip = document.getElementById('tg-tip');
  const tips = new Map(); let tipN = 0;
  const setTip = (el, lines) => { const id = 't' + (tipN++); tips.set(id, lines); el.dataset.tip = id; };
  const showTip = (e) => {
    const el = e.target.closest && e.target.closest('[data-tip]');
    if (!el || !root.contains(el)) { tip.hidden = true; return; }
    const lines = tips.get(el.dataset.tip); if (!lines) return;
    tip.replaceChildren(...lines.filter(Boolean).map((l) => { const d = document.createElement('div'); d.textContent = l; return d; }));
    tip.hidden = false;
    const r = root.getBoundingClientRect();
    let x = e.clientX - r.left + 14, y = e.clientY - r.top + 16;
    if (x + tip.offsetWidth > r.width - 4) x = Math.max(4, e.clientX - r.left - tip.offsetWidth - 14);
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  };
  root.addEventListener('pointermove', showTip);
  root.addEventListener('pointerdown', showTip);
  root.addEventListener('pointerleave', () => { tip.hidden = true; });
  const rowTip = (label, row, br, rec) => [
    label,
    recName(rec) + ': ' + pct(row.pct) + (row.moe ? ' (pode variar ' + faixa(row) + ')' : noMoe(row) ? '*' : ''),
    br && rec !== TOTAL ? 'Brasil: ' + pct(br.pct) : '',
    row.n ? 'Cerca de ' + nfc.format(row.n) + ' ' + (row._ds === 'escolas' ? 'escolas' : 'gestores') : '',
    noMoe(row) ? noMoeTxt(row._ds, true) : ''
  ];

  const fail = (el, st) => {
    el.classList.remove('dash-skeleton');
    if (st === 'error' || st === 'connect' || st === 'declined' || st === 'missing') {
      const f = document.createElement('div'); f.className = 'tg-fail'; f.textContent = 'Não foi possível carregar os dados'; el.replaceChildren(f);
    } else { el.replaceChildren(); el.classList.add('dash-skeleton'); }
  };
  const emptyMsg = (el, text) => { const p = document.createElement('p'); p.className = 'tg-empty'; p.textContent = text; el.replaceChildren(p); };
  const NODATA = 'Sem dados para este recorte.';

  // ---------- pictograms ----------
  const iso10 = (svg, v, color, uid, shape = P) => {
    const filled = v / 10; let s = '<defs>';
    for (let i = 0; i < 10; i++) {
      const f = Math.max(0, Math.min(1, filled - i));
      if (f > 0 && f < 1) s += '<clipPath id="' + uid + '-c"><rect x="' + (i * 24) + '" y="0" width="' + (24 * f) + '" height="26"/></clipPath>';
    }
    s += '</defs>';
    for (let i = 0; i < 10; i++) {
      const f = Math.max(0, Math.min(1, filled - i));
      // --i numera as figuras coloridas para a animação acendê-las em sequência
      const g = (fill, extra) => '<g transform="translate(' + (i * 24) + ',1)" ' + extra + ' style="--i:' + i + ';fill:' + fill + '">' + shape + '</g>';
      s += g('var(--cds-chart-muted)', 'opacity=".45"');
      if (f >= 1) s += g(color, 'class="tg-c"');
      else if (f > 0) s += '<g clip-path="url(#' + uid + '-c)">' + g(color, 'class="tg-c"') + '</g>';
    }
    svg.innerHTML = s;
    svg.setAttribute('aria-label', freqTxt(v));
  };
  // 10 figuras (cada uma = 10%) com várias partes em sequência, ex.: mulheres e homens; a figura da divisa fica cortada
  let isoN = 0;
  const isoParts = (parts) => {
    const uid = 'ip' + (isoN++); let defs = '', body = '', a = 0;
    for (let i = 0; i < 10; i++) body += '<g transform="translate(' + (i * 24) + ',1)" opacity=".45" style="fill:var(--cds-chart-muted)">' + P + '</g>';
    parts.forEach((p, k) => {
      const b = Math.min(100, a + p.v);
      for (let i = 0; i < 10; i++) {
        const x0 = Math.max(a, i * 10), x1 = Math.min(b, i * 10 + 10);
        if (x1 <= x0) continue;
        const g = '<g class="tg-c" transform="translate(' + (i * 24) + ',1)" style="--i:' + i + ';fill:' + p.color + '">' + P + '</g>';
        if (x0 === i * 10 && x1 === i * 10 + 10) { body += g; continue; }
        const id = uid + '-' + k + '-' + i;
        defs += '<clipPath id="' + id + '"><rect x="' + (x0 * 2.4) + '" y="0" width="' + ((x1 - x0) * 2.4) + '" height="26"/></clipPath>';
        body += '<g clip-path="url(#' + id + ')">' + g + '</g>';
      }
      a = b;
    });
    return '<svg class="tg-iso10 tg-iso-big" viewBox="0 0 240 26" width="100%" role="img"><defs>' + defs + '</defs>' + body + '</svg>';
  };
  // rows of 10 pictograms: [{label, icon, row, br, ind}]
  let uidN = 0;
  const isoRows = (el, items, rec, verb, shape, cls) => {
    if (!items.length) return emptyMsg(el, NODATA);
    const w = document.createElement('div'); w.className = cls || (items.length > 2 ? 'tg-cols2' : 'tg-isorows');
    for (const it of items) {
      const box = document.createElement('div'); box.className = 'tg-isorow';
      const t = document.createElement('div'); t.className = 'tg-bar-label'; t.innerHTML = ic(it.icon); const sp = document.createElement('span'); sp.textContent = it.label; t.append(sp);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 240 26'); svg.setAttribute('width', '100%'); svg.setAttribute('class', 'tg-iso10');
      iso10(svg, it.row.pct, dash.colors[0], 'r' + (uidN++), shape);
      const say = document.createElement('div'); say.className = 'tg-say';
      const bb = document.createElement('b'); bb.textContent = freqTxt(it.row.pct);
      const v = document.createElement('span'); v.textContent = pct(it.row.pct); markRow(v, it.row);
      say.append(bb, document.createTextNode(verb ? ' ' + verb + ' (' : ' ('), v, document.createTextNode(')'));
      if (rec !== TOTAL && it.br) { const c = document.createElement('span'); c.className = 'tg-stack-cap'; c.textContent = ' · Brasil: ' + pct(it.br.pct); say.append(c); }
      box.append(t, svg, say); setTip(box, rowTip(it.full || it.label, it.row, it.br, rec)); w.append(box);
    }
    el.replaceChildren(w);
  };

  // ---------- bars ----------
  const bars = (el, items, rec, anim) => {
    if (!items.length) return emptyMsg(el, NODATA);
    const wrap = document.createElement('div'); wrap.className = 'tg-bars' + (anim ? ' tg-anim-bars' : '');
    for (const it of items) {
      const row = document.createElement('div'); row.className = 'tg-bar-row';
      const lab = document.createElement('div'); lab.className = 'tg-bar-label';
      lab.innerHTML = ic(it.icon); const t = document.createElement('span'); t.textContent = it.label; lab.append(t);
      const line = document.createElement('div'); line.className = 'tg-bar-line';
      const tr = document.createElement('div'); tr.className = 'tg-track';
      const fill = document.createElement('div'); fill.className = 'tg-fill'; fill.style.width = it.row.pct + '%'; fill.style.background = it.color || dash.colors[0];
      tr.append(fill);
      if (it.row.moe) { const m = document.createElement('div'); m.className = 'tg-moe'; const lo = Math.max(0, it.row.pct - it.row.moe), hi = Math.min(100, it.row.pct + it.row.moe); m.style.left = lo + '%'; m.style.width = (hi - lo) + '%'; tr.append(m); }
      if (it.br && rec !== TOTAL) { const r = document.createElement('div'); r.className = 'tg-ref'; r.style.left = it.br.pct + '%'; tr.append(r); }
      const v = document.createElement('span'); v.className = 'tg-val'; v.textContent = pct(it.row.pct);
      line.append(tr, v); row.append(lab, line);
      setTip(row, rowTip(it.full || it.label, it.row, it.br, rec));
      wrap.append(row);
    }
    if (rec !== TOTAL) { const lg = document.createElement('div'); lg.className = 'tg-legend'; lg.innerHTML = '<span><span class="tg-refkey"></span>Brasil</span><span><span class="tg-sw" style="background:var(--color-fg);opacity:.16"></span>Margem de erro</span>'; wrap.append(lg); }
    el.replaceChildren(wrap);
  };
  // items from one table: groups (multi-item) or responses (single-item)
  const listFrom = (ind, groups, resp, rec, map, sort) => {
    const items = groups.map((g) => {
      const row = get(ind, g, resp, rec), br = get(ind, g, resp, TOTAL);
      const m = map ? map[g] : null;
      const label = Array.isArray(m) ? m[0] : (typeof m === 'string' && !ICON[m] ? m : g);
      const icon = Array.isArray(m) ? m[1] : (typeof m === 'string' && ICON[m] ? m : null);
      return row ? { label, full: g, icon, row, br } : null;
    }).filter(Boolean);
    if (sort) items.sort((a, b) => b.row.pct - a.row.pct);
    return items;
  };
  const respList = (ind, resps, rec, map, sort) => {
    const items = resps.map((r) => {
      const row = get(ind, '', r, rec), m = map ? map[r] : null;
      return row ? { label: Array.isArray(m) ? m[0] : r, full: r, icon: Array.isArray(m) ? m[1] : null, row, br: get(ind, '', r, TOTAL) } : null;
    }).filter(Boolean);
    if (sort) items.sort((a, b) => b.row.pct - a.row.pct);
    return items;
  };

  // tom de uma escala ordenada: t = 0 é o azul mais claro, t = 1 o mais escuro, nos dois temas.
  // (Opacidade não serve: no tema escuro, mais transparente fica mais escuro, e a legenda se inverte.)
  const tone = (t) => 'color-mix(in oklab, var(--seq-escuro) ' + Math.round(t * 100) + '%, var(--seq-claro))';

  // ---------- ordered stacked bar ----------
  const stack = (el, ind, resps, rec, opts = {}) => {
    const extra = opts.extra || [], all = resps.concat(extra), rev = !!opts.reverse;
    const cur = all.map((r) => get(ind, '', r, rec)), br = all.map((r) => get(ind, '', r, TOTAL));
    if (cur.slice(0, resps.length).some((x) => !x)) return emptyMsg(el, NODATA);
    const k = resps.length;
    const op = () => '1';
    const col = (i) => i >= k ? 'var(--cds-chart-grid)' : tone((rev ? k - 1 - i : i) / Math.max(1, k - 1));
    const w = document.createElement('div'); w.className = 'tg-stack-wrap';
    const mk = (rowsArr, thin, cap, recX) => {
      const c = document.createElement('div'); c.className = 'tg-stack-cap'; c.textContent = cap;
      const s = document.createElement('div'); s.className = 'tg-stack' + (thin ? ' tg-thin' : '');
      rowsArr.forEach((r, i) => { if (!r) return; const d = document.createElement('div'); d.style.width = r.pct + '%'; d.style.background = col(i); d.style.opacity = op(i); setTip(d, rowTip(all[i], r, br[i], recX)); s.append(d); });
      w.append(c, s);
    };
    mk(cur, false, recName(rec), rec);
    if (rec !== TOTAL) mk(br, true, 'Brasil', TOTAL);
    const lg = document.createElement('div'); lg.className = 'tg-stack-legend';
    all.forEach((r, i) => {
      if (!cur[i]) return;
      const d = document.createElement('div');
      const lk = document.createElement('span'); lk.className = 'tg-lk'; lk.innerHTML = '<span class="tg-sw" style="background:' + col(i) + ';opacity:' + op(i) + '"></span>';
      lk.append(document.createTextNode(opts.labels && opts.labels[r] ? opts.labels[r] : r));
      const b = document.createElement('b'); b.textContent = pct(cur[i].pct); markRow(b, cur[i]);
      d.append(lk, b);
      if (rec !== TOTAL && br[i]) { const s = document.createElement('span'); s.textContent = 'Brasil: ' + pct(br[i].pct); d.append(s); }
      lg.append(d);
    });
    w.append(lg); el.replaceChildren(w);
  };

  // ---------- acessibilidade: versão em texto (e em voz) de cada gráfico ----------
  // os números vêm das mesmas linhas do tooltip, que só aparecem com o mouse
  const fala = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let falando = null;
  const tituloDe = (card) => {
    if (card.dataset.titulo) return card.dataset.titulo; // ex.: o mapa da página inicial, cujo título muda com o indicador
    const t = card.querySelector('.tg-card-title'); if (t) return t.textContent;
    const ind = document.getElementById('tg-cmp-ind').selectedOptions[0], cat = document.getElementById('tg-cmp-cat').selectedOptions[0];
    return 'Compare grupos' + (ind && cat ? ': ' + ind.textContent + ', por ' + cat.textContent : '');
  };
  const pararFala = () => { if (!fala) return; fala.cancel(); if (falando) falando.textContent = 'Ouvir'; falando = null; };
  const ouvir = (btn, card) => {
    if (falando === btn) return pararFala();
    pararFala();
    const parts = [tituloDe(card)];
    card.querySelectorAll('.tg-alt > ul > li').forEach((li) => {
      const sub = li.querySelector('ul');
      if (sub) parts.push(li.querySelector('b').textContent, ...[...sub.children].map((s) => s.textContent));
      else parts.push(li.textContent);
    });
    const base = card.querySelector('.tg-base'); if (base) parts.push(base.textContent);
    const u = new SpeechSynthesisUtterance(parts.map((p) => p.trim().replace(/[:.]$/, '')).filter(Boolean).join('. ').replace(/±/g, 'mais ou menos ').replace(/p\.p\./g, 'pontos percentuais'));
    u.lang = 'pt-BR';
    u.onend = u.onerror = () => { if (falando === btn) pararFala(); };
    falando = btn; btn.textContent = 'Parar'; fala.speak(u);
  };
  const textAlt = (card) => {
    const chart = card && card.querySelector('.tg-chart'); if (!chart) return;
    // barras, figuras e eixos são só desenho: o leitor de tela lê os mesmos números no texto abaixo
    chart.querySelectorAll('.tg-track,.tg-stack,.tg-dot-track,.tg-iso10,.tg-sw,.tg-refkey').forEach((el) => el.setAttribute('aria-hidden', 'true'));
    const groups = new Map();
    chart.querySelectorAll('[data-tip]').forEach((el) => {
      if (el.closest('.tg-thin')) return; // barra fina do Brasil: o valor já está na linha do recorte
      const [head, ...rest] = (tips.get(el.dataset.tip) || []).filter(Boolean);
      if (!head) return;
      if (!groups.has(head)) groups.set(head, []);
      groups.get(head).push(rest);
    });
    const ul = document.createElement('ul');
    if (groups.size) {
      for (const [head, items] of groups) {
        const li = document.createElement('li'), b = document.createElement('b');
        if (items.length === 1) { b.textContent = head + ': '; li.append(b, items[0].join('; ')); }
        else {
          b.textContent = head + ':'; const sub = document.createElement('ul');
          items.forEach((it) => { const s = document.createElement('li'); s.textContent = it.join('; '); sub.append(s); });
          li.append(b, sub);
        }
        ul.append(li);
      }
    } else chart.innerText.split('\n').map((t) => t.trim()).filter(Boolean).forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.append(li); });
    let det = card.querySelector('.tg-alt');
    if (!det) {
      det = document.createElement('details'); det.className = 'tg-alt';
      const s = document.createElement('summary'); s.textContent = fala ? 'Ver em texto ou ouvir' : 'Ver os dados em texto';
      det.append(s);
      if (fala) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'tg-ouvir'; b.textContent = 'Ouvir';        b.addEventListener('click', () => ouvir(b, card));
        det.append(b);
      }
      det.addEventListener('toggle', () => { if (!det.open && falando && det.contains(falando)) pararFala(); });
      chart.after(det);
    }
    const old = det.querySelector(':scope > ul'); if (old) old.replaceWith(ul); else det.append(ul);
  };
  window.addEventListener('hashchange', pararFala);

  // ---------- view (navbar) ----------
  const VIEWS = ['inicio', 'escolas', 'gestores', 'sobre'];
  const DASH = ['escolas', 'gestores'];
  // a hash can name a view or any section inside one (e.g. #ia, #conexao, #comparar)
  const viewFromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h || VIEWS.includes(h)) return h || 'inicio';
    const el = document.getElementById(h);
    if (!el) return 'inicio';
    return VIEWS.find((v) => v !== 'escolas' && document.getElementById(v).contains(el)) || 'escolas';
  };
  let view = viewFromHash();
  const firstDraw = { gestores: true, escolas: true };
  const navLinks = [...document.querySelectorAll('.nav-link[data-view]')];
  const showView = (v) => {
    navLinks.forEach((a) => { if (a.dataset.view === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    VIEWS.forEach((id) => { document.getElementById(id).hidden = v !== id; });
    document.querySelectorAll('.tg-dash-only').forEach((el) => { el.hidden = !DASH.includes(v); });
  };
  const setView = (v) => {
    view = v;
    const cur = dash.params().recorte || TOTAL;
    showView(v);
    if (SEGS[v] && !SEGS[v].includes(cur)) {
      resetNote = 'O recorte "' + recName(cur) + '" só existe para gestores. Voltamos para Brasil; escolha um recorte de escolas.';
      dash.setParams({ recorte: TOTAL });
    } else draw();
  };
  // botões "Copiar" da tela Sobre
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const txt = document.getElementById(b.dataset.copy).textContent.trim();
    try { await navigator.clipboard.writeText(txt); b.textContent = 'Copiado'; }
    catch (e) { getSelection().selectAllChildren(document.getElementById(b.dataset.copy)); b.textContent = 'Selecionado'; }
    setTimeout(() => { b.textContent = 'Copiar'; }, 2000);
  }));

  // guia "Como ler este painel": abre em janela (dialog) pelo botão do cabeçalho
  // ou por links para #como-ler (ou para algo dentro dele)
  const guia = document.getElementById('como-ler');
  const fecharGuia = () => { if (guia.open) guia.close(); };
  const openGuide = (el) => {
    if (!guia.contains(el)) return false;
    if (!guia.open) guia.showModal();
    if (el !== guia) el.scrollIntoView({ block: 'start' }); else guia.scrollTop = 0;
    return true;
  };
  document.querySelectorAll('.tg-guide-btn').forEach((b) => b.addEventListener('click', () => openGuide(guia)));
  guia.querySelector('.tg-guide-x').addEventListener('click', fecharGuia);
  // clique fora da caixa (no fundo escurecido) ou em um link interno fecha a janela
  guia.addEventListener('click', (e) => { if (e.target === guia || e.target.closest('a[href^="#"]')) fecharGuia(); });
  // ao fechar, tira #como-ler do endereço para o mesmo link poder abrir de novo
  guia.addEventListener('close', () => { if (guia.contains(document.getElementById(location.hash.slice(1)))) history.replaceState(null, '', '#' + view); });

  window.addEventListener('hashchange', () => {
    const h = location.hash.slice(1);
    setView(viewFromHash());
    const el = !VIEWS.includes(h) && document.getElementById(h);
    if (el) { if (!openGuide(el)) el.scrollIntoView(); } else window.scrollTo(0, 0);
  });

  // ---------- controls ----------
  const ci = document.getElementById('tg-cmp-ind'), cc = document.getElementById('tg-cmp-cat');
  let built = false;

  // ---------- seletor de recorte (Escolas e Gestores): etapa 1 = dimensão, etapa 2 = grupo; um recorte por vez ----------
  // todas as dimensões das tabelas continuam disponíveis; a lista muda com a aba (perfil do gestor só existe em Gestores)
  const DIM = {
    'TOTAL': 'Brasil', 'REGIÃO': 'Região', 'ÁREA': 'Área', 'LOCALIZAÇÃO': 'Localização', 'DEPENDÊNCIA ADMINISTRATIVA': 'Rede',
    'PORTE': 'Porte', 'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO': 'Nível de ensino', 'ESCOLA COM INTERNET E COMPUTADOR PARA USO DOS ALUNOS': 'Internet e computador',
    'SEXO': 'Sexo', 'COR OU RAÇA': 'Cor ou raça', 'FAIXA ETÁRIA': 'Idade'
  };
  // rótulo curto do botão (etapa 2)
  const OPC = {
    'DEPENDÊNCIA ADMINISTRATIVA|Públicas (Municipal, Estadual e Federal)': 'Públicas (todas as redes)',
    'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO|Até anos iniciais do Ensino Fundamental': 'Até anos iniciais do Fundamental',
    'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO|Até anos finais do Ensino Fundamental': 'Até anos finais do Fundamental',
    'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO|Até Ensino Médio ou Educação Profissional': 'Até Médio ou Profissional',
    'ESCOLA COM INTERNET E COMPUTADOR PARA USO DOS ALUNOS|Sim': 'Têm', 'ESCOLA COM INTERNET E COMPUTADOR PARA USO DOS ALUNOS|Não': 'Não têm',
    'SEXO|Feminino': 'Mulheres', 'SEXO|Masculino': 'Homens'
  };
  // título "Você está vendo": o grupo de escolas descrito por extenso
  const ESC = {
    'ÁREA|Urbana': 'escolas urbanas', 'ÁREA|Rural': 'escolas rurais', 'LOCALIZAÇÃO|Capital': 'escolas das capitais', 'LOCALIZAÇÃO|Interior': 'escolas do interior',
    'DEPENDÊNCIA ADMINISTRATIVA|Municipal': 'escolas municipais', 'DEPENDÊNCIA ADMINISTRATIVA|Estadual': 'escolas estaduais', 'DEPENDÊNCIA ADMINISTRATIVA|Particular': 'escolas particulares',
    'DEPENDÊNCIA ADMINISTRATIVA|Públicas (Municipal, Estadual e Federal)': 'escolas públicas (todas as redes)',
    'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO|Até anos iniciais do Ensino Fundamental': 'escolas que vão até os anos iniciais do Ensino Fundamental',
    'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO|Até anos finais do Ensino Fundamental': 'escolas que vão até os anos finais do Ensino Fundamental',
    'NÍVEL DE ENSINO MAIS ELEVADO OFERTADO|Até Ensino Médio ou Educação Profissional': 'escolas que vão até o Ensino Médio ou a Educação Profissional',
    'ESCOLA COM INTERNET E COMPUTADOR PARA USO DOS ALUNOS|Sim': 'escolas com internet e computador para os alunos',
    'ESCOLA COM INTERNET E COMPUTADOR PARA USO DOS ALUNOS|Não': 'escolas sem internet e computador para os alunos'
  };
  const GEST = {
    'SEXO|Feminino': 'Gestoras (mulheres)', 'SEXO|Masculino': 'Gestores (homens)', 'COR OU RAÇA|Branca': 'Gestores de cor branca', 'COR OU RAÇA|Preta': 'Gestores de cor preta',
    'COR OU RAÇA|Parda': 'Gestores de cor parda', 'COR OU RAÇA|Amarela': 'Gestores de cor amarela', 'COR OU RAÇA|Indígena': 'Gestores indígenas',
    'FAIXA ETÁRIA|Até 40 anos': 'Gestores com até 40 anos', 'FAIXA ETÁRIA|De 41 a 50 anos': 'Gestores de 41 a 50 anos', 'FAIXA ETÁRIA|De 51 anos ou mais': 'Gestores com 51 anos ou mais'
  };
  const escDe = (rec) => {
    const [c, s] = rec.split('|');
    if (c === 'REGIÃO') return 'escolas da região ' + s;
    if (c === 'PORTE') return 'escolas ' + (/^Até|^Mais/.test(s) ? 'com ' + s.toLowerCase() : s.replace(/^De /, 'de '));
    return ESC[rec] || segName(rec).toLowerCase();
  };
  const recTitulo = (rec, v) => {
    if (rec === TOTAL) return v === 'escolas' ? 'Brasil (todas as escolas)' : 'Brasil (todos os gestores)';
    if (v === 'gestores') return GEST[rec] || 'Gestores de ' + escDe(rec);
    const t = escDe(rec); return t.charAt(0).toUpperCase() + t.slice(1);
  };
  // grupo de botões de rádio acessível: setas, Home e End mudam a escolha; só o item marcado entra no Tab
  const radios = (box, itens, atual, escolher) => {
    const tinhaFoco = box.contains(document.activeElement);
    box.replaceChildren(...itens.map(([v, rotulo]) => {
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.v = v; b.textContent = rotulo;
      const on = v === atual; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1;
      b.addEventListener('click', () => escolher(v));
      return b;
    }));
    if (tinhaFoco) { const on = box.querySelector('[aria-checked=true]'); if (on) on.focus(); }
    if (!box.dataset.teclas) {
      box.dataset.teclas = '1';
      box.addEventListener('keydown', (e) => {
        const bs = [...box.querySelectorAll('[role=radio]')], i = bs.indexOf(document.activeElement); if (i < 0) return;
        const j = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: bs.length - 1 }[e.key];
        if (j == null) return; e.preventDefault();
        const alvo = bs[(j + bs.length) % bs.length]; alvo.click();
        const novo = box.querySelector('[data-v="' + CSS.escape(alvo.dataset.v) + '"]'); if (novo) novo.focus();
      });
    }
  };
  const drawRecorte = (v, rec) => {
    const dim = rec === TOTAL ? 'TOTAL' : rec.split('|')[0], segs = SEGS[v] || [];
    const dims = CATS[v].filter((c) => segs.some((s) => s.split('|')[0] === c));
    // trocar de dimensão substitui o recorte: entra o primeiro grupo da nova dimensão
    radios(document.getElementById('rec-dims'), dims.map((c) => [c, DIM[c] || CAT[c] || c]), dim,
      (c) => { if (c !== dim) dash.setParams({ recorte: c === 'TOTAL' ? TOTAL : segs.find((s) => s.split('|')[0] === c) }); });
    // a aba ativa fica sempre à vista quando as abas rolam de lado (celular)
    const dimsBox = document.getElementById('rec-dims'), ativa = dimsBox.querySelector('[aria-checked=true]');
    if (ativa && dimsBox.scrollWidth > dimsBox.clientWidth) {
      const a = ativa.offsetLeft - dimsBox.offsetLeft, b = a + ativa.offsetWidth;
      if (a < dimsBox.scrollLeft) dimsBox.scrollLeft = a - 8; else if (b > dimsBox.scrollLeft + dimsBox.clientWidth - 24) dimsBox.scrollLeft = b - dimsBox.clientWidth + 32;
    }
    marcaRola();
    const opts = document.getElementById('rec-opts');
    opts.hidden = dim === 'TOTAL'; opts.setAttribute('aria-label', DIM[dim] || '');
    if (opts.dataset.dim !== v + dim) { opts.dataset.dim = v + dim; opts.classList.remove('tg-troca'); void opts.offsetWidth; opts.classList.add('tg-troca'); }
    radios(opts, dim === 'TOTAL' ? [] : segs.filter((s) => s.split('|')[0] === dim).map((s) => [s, OPC[s] || segName(s)]), rec,
      (s) => { if (s !== rec) dash.setParams({ recorte: s }); });
    const tit = document.getElementById('rec-titulo'), novo = recTitulo(rec, v);
    document.getElementById('filtro').dataset.recorte = rec === TOTAL ? 'Brasil' : novo;
    if (tit.textContent !== novo) { tit.textContent = novo; tit.classList.remove('tg-troca'); void tit.offsetWidth; tit.classList.add('tg-troca'); }
  };
  // abas que não cabem: esmaece a borda direita até chegar ao fim da rolagem
  const recDims = document.getElementById('rec-dims');
  const marcaRola = () => { const r = recDims.scrollWidth > recDims.clientWidth + 1; recDims.classList.toggle('tg-rola', r); recDims.classList.toggle('tg-fim', r && recDims.scrollLeft + recDims.clientWidth >= recDims.scrollWidth - 2); };
  recDims.addEventListener('scroll', marcaRola, { passive: true }); window.addEventListener('resize', marcaRola);
  const recInfo = document.getElementById('rec-info'), recInfoTxt = document.getElementById('rec-info-txt');
  recInfo.addEventListener('click', () => { const ab = recInfo.getAttribute('aria-expanded') !== 'true'; recInfo.setAttribute('aria-expanded', ab ? 'true' : 'false'); recInfoTxt.hidden = !ab; });

  let resetNote = '';
  const buildControls = () => {
    if (built) return; built = true;
    ci.addEventListener('change', () => dash.setParams({ cmp_ind: ci.value }));
    cc.addEventListener('change', () => dash.setParams({ cmp_cat: cc.value }));
  };

  const chartsIn = (id) => [...document.querySelectorAll('#' + id + ' .tg-chart')];

  // ---------- page: gestores ----------
  const drawGestores = (rec, anim) => {
    CUR = 'gestores';
    (() => {
      const el = document.getElementById('ch-sexo');
      const f = get('A1', '', 'Feminino', rec), m = get('A1', '', 'Masculino', rec);
      if (!f || !m) return emptyMsg(el, NODATA);
      const w = document.createElement('div'); w.className = 'tg-isowrap';
      w.innerHTML = isoParts([{ v: f.pct, color: 'var(--color-mulheres)' }, { v: m.pct, color: 'var(--color-homens)' }]);
      const say = document.createElement('div'); say.className = 'tg-say';
      const b = document.createElement('b'); b.textContent = freqTxt(f.pct);
      const sf = document.createElement('span'); sf.textContent = pct(f.pct); markRow(sf, f);
      const sm = document.createElement('span'); sm.textContent = pct(m.pct); markRow(sm, m);
      say.append(b, document.createTextNode(' gestores são mulheres.'));
      const lg = document.createElement('div'); lg.className = 'tg-legend'; lg.style.marginTop = 'var(--cds-gap-sm)';
      const l1 = document.createElement('span'); l1.innerHTML = '<span class="tg-sw" style="background:var(--color-mulheres)"></span>Mulheres '; l1.append(sf);
      const l2 = document.createElement('span'); l2.innerHTML = '<span class="tg-sw" style="background:var(--color-homens)"></span>Homens '; l2.append(sm);
      lg.append(l1, l2); say.append(lg);
      const brf = get('A1', '', 'Feminino', TOTAL);
      setTip(l1, rowTip('Mulheres', f, brf, rec)); setTip(l2, rowTip('Homens', m, get('A1', '', 'Masculino', TOTAL), rec));
      if (rec !== TOTAL && brf) { const p = document.createElement('div'); p.className = 'tg-stack-cap'; p.style.marginTop = 'var(--cds-gap-xs)'; p.textContent = 'Brasil: ' + pct(brf.pct) + ' mulheres'; say.append(p); }
      if (f.moe) { const p = document.createElement('div'); p.className = 'tg-stack-cap'; p.textContent = 'Com a margem de erro, a parcela de mulheres fica ' + faixa(f) + '.'; say.append(p); }
      w.append(say); el.replaceChildren(w);
    })();

    stack(document.getElementById('ch-idade'), 'A2', ['Até 40 anos', 'De 41 a 50 anos', 'De 51 anos ou mais'], rec);
    stack(document.getElementById('ch-tempo'), 'D2', ['Há menos de um ano', 'Entre 1 e 2 anos', 'Entre 3 e 5 anos', 'Entre 6 e 10 anos', 'Há mais de 10 anos'], rec);

    (() => {
      const el = document.getElementById('ch-raca');
      const its = respList('A3', ['Branca', 'Preta', 'Parda', 'Amarela', 'Indígena'], rec);
      bars(el, its, rec, anim);
      const pr = its.filter((x) => x.label === 'Preta' || x.label === 'Parda');
      if (pr.length === 2) { const n = document.createElement('p'); n.className = 'tg-say'; n.style.fontSize = 'var(--cds-font-size-body)'; n.textContent = 'Somados, gestores pretos e pardos são ' + freqTxt(pr[0].row.pct + pr[1].row.pct, false) + '.'; el.prepend(n); }
    })();

    bars(document.getElementById('ch-formacao'), listFrom('A4', ['Especialização ou pós-graduação', 'Mestrado', 'Doutorado'], 'Sim', rec).map((x) => ({ ...x, icon: 'livro' })), rec, anim);

    (() => {
      const el = document.getElementById('ch-funcao');
      const groups = ['Diretor ou diretora', 'Vice-diretor ou vice-diretora', 'Professor ou professora', 'Coordenador ou coordenadora', 'Supervisor ou supervisora', 'Gerente regional de ensino', 'Diretor ou diretora regional de ensino', 'Secretário ou secretarária de educação', 'Outra função'];
      const list = respList('D1', groups, rec, null, true).filter((x) => x.row.pct > 0).map((x) => ({ ...x, label: x.label.replace('secretarária', 'secretária'), icon: 'pessoa' }));
      if (!list.length || rec === 'ÁREA|Urbana') return emptyMsg(el, 'Este indicador só existe para escolas rurais. Escolha Brasil ou outro recorte.');
      bars(el, list, rec, anim);
    })();

    (() => {
      const el = document.getElementById('ch-reunioes');
      const items = [['D3_1', 'Com professores e funcionários'], ['D6', 'Com pais, mães e responsáveis']].map(([ind, label]) => { const row = get(ind, '', 'Sim', rec); return row ? { label, icon: 'balao', row, br: get(ind, '', 'Sim', TOTAL) } : null; }).filter(Boolean);
      isoRows(el, items, rec, 'fizeram');
    })();

    bars(document.getElementById('ch-temas'), listFrom('D7', Object.keys(D7), 'Sim', rec, D7, true), rec, anim);

    (() => {
      const el = document.getElementById('ch-percepcao');
      const C = dash.colors[0], N = 'var(--cds-chart-muted)', X = dash.colors[1], O = 'var(--cds-chart-grid)';
      const its = Object.keys(D8).map((g) => {
        const c = get('D8', g, 'Concorda', rec), n = get('D8', g, 'Não concorda nem discorda', rec), x = get('D8', g, 'Discorda', rec);
        return c && n && x ? { g, c, n, x, o: Math.max(0, 100 - c.pct - n.pct - x.pct) } : null;
      }).filter(Boolean).sort((a, b) => b.c.pct - a.c.pct);
      if (!its.length) return emptyMsg(el, NODATA);
      const w = document.createElement('div'); w.className = 'tg-lik';
      const lg = document.createElement('div'); lg.className = 'tg-legend';
      lg.innerHTML = '<span><span class="tg-sw" style="background:' + C + '"></span>Concorda</span><span><span class="tg-sw" style="background:' + N + '"></span>Nem concorda nem discorda</span><span><span class="tg-sw" style="background:' + X + '"></span>Discorda</span><span><span class="tg-sw" style="background:' + O + '"></span>Não se aplica, não sabe ou não respondeu</span>';
      w.append(lg);
      for (const it of its) {
        const r = document.createElement('div'); r.className = 'tg-lik-row';
        const l = document.createElement('div'); l.className = 'tg-bar-label'; l.textContent = D8[it.g];
        const s = document.createElement('div'); s.className = 'tg-stack';
        [[it.c, C, 'Concorda'], [it.n, N, 'Nem concorda nem discorda'], [it.x, X, 'Discorda']].forEach(([row, col, name]) => {
          const p = document.createElement('div'); p.style.width = row.pct + '%'; p.style.background = col;
          const brr = get('D8', it.g, name === 'Nem concorda nem discorda' ? 'Não concorda nem discorda' : name, TOTAL);
          setTip(p, [it.g, name + ': ' + pct(row.pct) + (row.moe ? ' (pode variar ' + faixa(row) + ')' : ''), rec !== TOTAL && brr ? 'Brasil: ' + pct(brr.pct) : '']); s.append(p);
        });
        if (it.o > 0.05) { const p = document.createElement('div'); p.style.width = it.o + '%'; p.style.background = O; s.append(p); }
        const cap = document.createElement('div'); cap.className = 'tg-lik-cap';
        const a = document.createElement('span'); a.textContent = pct(it.c.pct); markRow(a, it.c);
        const b = document.createElement('span'); b.textContent = pct(it.x.pct); markRow(b, it.x);
        cap.append(a, document.createTextNode(' concordam · '), b, document.createTextNode(' discordam'));
        const brc = get('D8', it.g, 'Concorda', TOTAL);
        if (rec !== TOTAL && brc) cap.append(document.createTextNode(' · Brasil: ' + pct(brc.pct) + ' concordam'));
        r.append(l, s, cap); w.append(r);
      }
      el.replaceChildren(w);
    })();

    (() => {
      const el = document.getElementById('ch-ia');
      const s = get('D9A', '', 'Sim', rec), n = get('D9A', '', 'Não', rec);
      if (!s) return emptyMsg(el, NODATA);
      const w = document.createElement('div'); w.className = 'tg-isowrap';
      w.innerHTML = isoParts([{ v: s.pct, color: dash.colors[0] }]);
      const say = document.createElement('div'); say.className = 'tg-say';
      const b = document.createElement('b'); b.textContent = (em10(s.pct) === 5 ? 'Cerca de metade' : freqTxt(s.pct));
      const v = document.createElement('span'); v.textContent = pct(s.pct); markRow(v, s);
      say.append(b, document.createTextNode(' dos gestores já usam IA na gestão ('), v, document.createTextNode(').'));
      if (n) { const p = document.createElement('div'); p.className = 'tg-stack-cap'; p.style.marginTop = 'var(--cds-gap-xs)'; const nv = document.createElement('span'); nv.textContent = pct(n.pct); markRow(nv, n); p.append(document.createTextNode('Não usam: '), nv); say.append(p); }
      const br = get('D9A', '', 'Sim', TOTAL);
      setTip(v, rowTip('Usam IA na gestão', s, br, rec));
      if (n) setTip(say.querySelector('.tg-stack-cap span'), rowTip('Não usam', n, get('D9A', '', 'Não', TOTAL), rec));
      if (rec !== TOTAL && br) { const p = document.createElement('div'); p.className = 'tg-stack-cap'; p.textContent = 'Brasil: ' + pct(br.pct); say.append(p); }
      if (s.moe) { const p = document.createElement('div'); p.className = 'tg-stack-cap'; p.textContent = 'Com a margem de erro, a parcela que usa IA fica ' + faixa(s) + '.'; say.append(p); }
      w.append(say); el.replaceChildren(w);
    })();

    bars(document.getElementById('ch-ia-usos'), listFrom('D9B', Object.keys(D9B), 'Sim', rec, D9B, true), rec, anim);
    bars(document.getElementById('ch-ia-contrib'), listFrom('D9C', Object.keys(D9C), 'Sim', rec, D9C, true), rec, anim);
  };

  // ---------- page: escolas ----------
  const drawEscolas = (rec, anim) => {
    CUR = 'escolas';
    const yes = (ind, label, icon) => { const row = get(ind, '', 'Sim', rec); return row ? { label, icon, row, br: get(ind, '', 'Sim', TOTAL), ind } : null; };

    isoRows(document.getElementById('ch-camadas'), [
      yes('A1', 'Têm acesso à internet', 'escola'),
      yes('A6', 'Têm computador e internet', 'desktop'),
      yes('A7', 'Oferecem internet para os alunos', 'pessoa'),
      yes('A8', 'Oferecem computador e internet para os alunos', 'notebook')
    ].filter(Boolean), rec, '', SCHOOL, 'tg-cols4');

    bars(document.getElementById('ch-tipo-conexao'), respList('A2', Object.keys(A2L), rec, A2L, true), rec, anim);

    stack(document.getElementById('ch-velocidade'), 'A3_1',
      ['Até 10 Mbps', 'De 11 Mbps a 50 Mbps', 'De 51 Mbps a 100 Mbps', 'De 101 Mbps a 250 Mbps', 'De 251 Mbps a 500 Mbps', 'De 501 Mbps a 1 Gbps', 'Mais de 1 Gbps'], rec,
      { extra: ['Não sabe'], labels: { 'Não sabe': 'Não sabe a velocidade' } });

    (() => {
      const el = document.getElementById('ch-problemas');
      const its = Object.keys(A19L).map((g) => {
        const rows = FREQ.map((f) => get('A19', g, f, rec));
        return rows.every(Boolean) ? { g, rows, hi: rows[0].pct + rows[1].pct } : null;
      }).filter(Boolean).sort((a, b) => b.hi - a.hi);
      if (!its.length) return emptyMsg(el, NODATA);
      const fc = (i) => tone(1 - i / (FREQ.length - 1)); // "Sempre" é o mais escuro, "Nunca" o mais claro
      const w = document.createElement('div'); w.className = 'tg-lik';
      const lg = document.createElement('div'); lg.className = 'tg-legend';
      lg.innerHTML = FREQ.map((f, i) => '<span><span class="tg-sw" style="background:' + fc(i) + '"></span>' + f + '</span>').join('');
      w.append(lg);
      for (const it of its) {
        const r = document.createElement('div'); r.className = 'tg-lik-row';
        const l = document.createElement('div'); l.className = 'tg-bar-label'; l.textContent = A19L[it.g];
        const s = document.createElement('div'); s.className = 'tg-stack';
        it.rows.forEach((row, i) => {
          const p = document.createElement('div'); p.style.width = row.pct + '%'; p.style.background = fc(i);
          const brr = get('A19', it.g, FREQ[i], TOTAL);
          setTip(p, [it.g, FREQ[i] + ': ' + pct(row.pct) + (row.moe ? ' (pode variar ' + faixa(row) + ')' : ''), rec !== TOTAL && brr ? 'Brasil: ' + pct(brr.pct) : '']);
          s.append(p);
        });
        const cap = document.createElement('div'); cap.className = 'tg-lik-cap';
        const a = document.createElement('span'); a.textContent = pct(it.rows[0].pct); markRow(a, it.rows[0]);
        const b = document.createElement('span'); b.textContent = pct(it.rows[1].pct); markRow(b, it.rows[1]);
        cap.append(document.createTextNode('Sempre '), a, document.createTextNode(' · quase sempre '), b);
        r.append(l, s, cap); w.append(r);
      }
      el.replaceChildren(w);
    })();

    bars(document.getElementById('ch-sem-internet'), listFrom('A20', Object.keys(A20L), 'Sim', rec, A20L, true), rec, anim);

    bars(document.getElementById('ch-computadores'), listFrom('B2', ['Computador de mesa', 'Computador portátil', 'Tablet'], 'Sim', rec, { 'Computador de mesa': 'desktop', 'Computador portátil': 'notebook', 'Tablet': 'tablet' }), rec, anim);

    bars(document.getElementById('ch-recursos'), [
      yes('B17', 'Equipamentos audiovisuais', 'midia'), yes('B14', 'Smart TV ou conversor', 'tv'),
      yes('B15', 'Material para aulas de robótica', 'robo'), yes('B18', 'Material para atividades maker', 'ferramenta'),
      yes('B16', 'Celulares para alunos e professores', 'celular')
    ].filter(Boolean).sort((a, b) => b.row.pct - a.row.pct), rec, anim);

    (() => {
      const el = document.getElementById('ch-alunos-pc');
      const bands = ['Até 5 alunos', 'De 5,1 a 10 alunos', 'De 10,1 a 15 alunos', 'De 15,1 a 20 alunos', 'De 20,1 a 30 alunos', 'De 30,1 a 40 alunos', 'De 40,1 a 50 alunos', 'De 50,1 a 100 alunos', '100,1 alunos ou mais'];
      const its = respList('B4C', bands, rec).map((x, i) => ({ ...x, label: x.label.replace(',1', '').replace('100 alunos ou mais', 'Mais de 100 alunos'), color: dash.colors[0] }));
      const none = get('B4C', '', 'Não possui computador disponível para uso dos alunos', rec);
      if (none) its.push({ label: 'Não têm computador para os alunos', row: none, br: get('B4C', '', 'Não possui computador disponível para uso dos alunos', TOTAL), color: 'var(--cds-chart-muted)' });
      bars(el, its, rec, anim);
    })();

    stack(document.getElementById('ch-renovacao'), 'K1_1', ['Há menos de 1 ano', 'Entre 1 e 5 anos', 'Entre 6 e 10 anos', 'Há mais de 10 anos'], rec, { reverse: true, extra: ['Não sabe'] });

    isoRows(document.getElementById('ch-politicas'), [
      yes('C3C', 'Regras para o celular dos alunos', 'celular'),
      yes('E1D', 'Sistemas digitais na gestão escolar', 'grafico'),
      yes('I5', 'Projetos de educação digital e midiática', 'midia'),
      yes('H1', 'Política de proteção de dados', 'cadeado'),
      yes('E5B', 'Permissão para alunos usarem IA', 'ia'),
      yes('E5A', 'Guia sobre o uso de IA', 'livro')
    ].filter(Boolean), rec, '', SCHOOL);

    bars(document.getElementById('ch-vigilancia'), [
      yes('E3', 'Câmeras de vídeo', 'camera'), yes('E4A', 'Identificação pela digital ou palma da mão', 'digital'), yes('E4B', 'Reconhecimento facial', 'rosto')
    ].filter(Boolean), rec, anim);

    (() => {
      const el = document.getElementById('ch-redes');
      const f2 = yes('F2', 'Têm perfil em alguma rede social', 'rede');
      const its = listFrom('F3', ['Instagram', 'Facebook', 'YouTube', 'TikTok', 'Twitter ou X'], 'Sim', rec,
        { Instagram: 'instagram', Facebook: 'facebook', YouTube: 'youtube', TikTok: 'tiktok', 'Twitter ou X': 'x' }, true);
      const top = document.createElement('div'), bot = document.createElement('div');
      if (f2) isoRows(top, [f2], rec, '', SCHOOL);
      bars(bot, its, rec, anim);
      const w = document.createElement('div'); w.className = 'tg-stack-wrap'; w.style.gap = 'var(--cds-gap-lg)'; w.append(top, bot);
      el.replaceChildren(w);
    })();

    bars(document.getElementById('ch-canais'), [
      ...listFrom('F4A', ['WhatsApp', 'Telegram'], 'Sim', rec).map((x) => ({ ...x, icon: x.full === 'WhatsApp' ? 'whatsapp' : 'telegram' })),
      yes('G4A', 'Plataforma ou ambiente virtual de aprendizagem', 'quadro'),
      yes('F5', 'Aplicativo próprio da escola', 'app')
    ].filter(Boolean).sort((a, b) => b.row.pct - a.row.pct), rec, anim);
  };

  // ---------- compare (shared) ----------
  const drawCompare = (params) => {
    const el = document.getElementById('ch-comparar');
    // só os indicadores do público da aba aberta (escolas ou gestores)
    const ds = view === 'escolas' ? 'escolas' : 'gestores', lista = MEAS.filter((x) => x.ds === ds);
    if (ci.dataset.ds !== ds) { ci.replaceChildren(...lista.map((x) => new Option(x.label, x.id))); ci.dataset.ds = ds; }
    const m = lista.find((x) => x.id === params.cmp_ind) || lista[0];
    if (!IDX[m.ds]) return fail(el, 'loading');
    el.classList.remove('dash-skeleton');
    const cats = CATS[m.ds].filter((c) => c !== 'TOTAL');
    if (cc.dataset.ds !== m.ds) { cc.replaceChildren(...cats.map((c) => new Option(CAT[c] || c, c))); cc.dataset.ds = m.ds; }
    const cat = cats.includes(params.cmp_cat) ? params.cmp_cat : 'REGIÃO';
    ci.value = m.id; cc.value = cat;
    const br = get(m.ind, m.grupo, m.resp, TOTAL, m.ds);
    const rows = SEGS[m.ds].filter((s) => s.split('|')[0] === cat).map((s) => ({ s, row: get(m.ind, m.grupo, m.resp, s, m.ds) })).filter((x) => x.row);
    if (!rows.length || !br) return emptyMsg(el, 'Sem dados para esta combinação.');
    const ext = rows.flatMap((x) => [x.row.pct - (x.row.moe || 0), x.row.pct + (x.row.moe || 0)]).concat(br.pct);
    const lo = Math.max(0, d3.min(ext) - 3), hi = Math.min(100, d3.max(ext) + 3);
    const sc = d3.scaleLinear([lo, hi], [0, 100]).nice();
    const ticks = sc.ticks(Math.max(3, Math.min(6, Math.floor(el.clientWidth / 110))));
    const pos = (v) => sc(v) + '%';
    const w = document.createElement('div'); w.className = 'tg-dots';
    const ax = document.createElement('div'); ax.className = 'tg-dot-row tg-axis';
    const axl = document.createElement('div'); axl.className = 'tg-dot-lab';
    const axt = document.createElement('div'); axt.className = 'tg-dot-track';
    ticks.forEach((t) => { const s = document.createElement('span'); s.className = 'tg-tick'; s.style.left = pos(t); s.textContent = t + '%'; axt.append(s); });
    const axv = document.createElement('div'); axv.className = 'tg-dot-val';
    const bl = document.createElement('span'); bl.className = 'tg-verdict'; bl.append(document.createTextNode('Nacional ')); const bv = document.createElement('span'); bv.textContent = pct(br.pct); markRow(bv, br); bl.append(bv); axv.append(bl);
    ax.append(axl, axt, axv); w.append(ax);
    for (const { s, row } of rows) {
      // todos os grupos são descritos do mesmo jeito: acima ou abaixo da estimativa nacional, com a diferença em p.p.
      // uma cor só (a do tema): a direção vem das setas e do sinal, sem verde/vermelho de julgamento
      const dd = Math.round((row.pct - br.pct) * 10) / 10, dir = dd > 0 ? 1 : dd < 0 ? -1 : 0, col = 'var(--sec)';
      const r = document.createElement('div'); r.className = 'tg-dot-row';
      const l = document.createElement('div'); l.className = 'tg-dot-lab'; l.textContent = segName(s);
      const t = document.createElement('div'); t.className = 'tg-dot-track';
      ticks.forEach((tk) => { const g = document.createElement('div'); g.className = 'tg-gl'; g.style.left = pos(tk); t.append(g); });
      const ref = document.createElement('div'); ref.className = 'tg-ref'; ref.style.left = pos(br.pct); ref.style.top = '0'; ref.style.bottom = '0'; t.append(ref);
      if (row.moe) { const c = document.createElement('div'); c.className = 'tg-ci'; c.style.background = col; c.style.left = pos(Math.max(0, row.pct - row.moe)); c.style.width = (sc(Math.min(100, row.pct + row.moe)) - sc(Math.max(0, row.pct - row.moe))) + '%'; t.append(c); }
      const dot = document.createElement('div'); dot.className = 'tg-dot'; dot.style.left = pos(row.pct); dot.style.background = col; t.append(dot);
      const v = document.createElement('div'); v.className = 'tg-dot-val';
      const vl = document.createElement('span'); vl.className = 'tg-dot-num';
      const b = document.createElement('b'); b.textContent = pct(row.pct); markRow(b, row);
      const ppN = Math.abs(dd).toFixed(1).replace('.', ',');
      const pp = document.createElement('span'); pp.className = 'tg-pp';
      pp.textContent = (dir > 0 ? '+' : dir < 0 ? '−' : '') + ppN + ' p.p.';
      vl.append(b, pp);
      const lado = dir > 0 ? 'acima da estimativa nacional' : dir < 0 ? 'abaixo da estimativa nacional' : 'igual à estimativa nacional';
      const vd = document.createElement('span'); vd.className = 'tg-verdict';
      if (dir) { const ar = document.createElement('span'); ar.className = 'tg-arrow'; ar.setAttribute('aria-hidden', 'true'); ar.textContent = dir > 0 ? '▲' : '▼'; vd.append(ar); }
      vd.append(lado);
      v.append(vl, vd);
      // versão por extenso, usada no texto alternativo, no áudio e na dica ao passar o mouse
      const quem = cat === 'REGIÃO' ? 'o ' + segName(s) : 'o grupo “' + segName(s) + '”';
      const frase = 'A estimativa para ' + quem + ' é de ' + pct(row.pct) +
        (row.moe ? ' (pode variar ' + faixa(row) + ')' : noMoe(row) ? ' (margem de erro não estimada)' : '') + ', ' +
        (dir ? ppN + (Math.abs(dd) < 2 ? ' ponto percentual ' : ' pontos percentuais ') + lado : lado) + ', de ' + pct(br.pct) + '.';
      r.append(l, t, v); setTip(r, [m.label, frase]); w.append(r);
    }
    const lg = document.createElement('div'); lg.className = 'tg-legend'; lg.style.marginTop = 'var(--cds-gap-sm)';
    lg.innerHTML = '<span><span class="tg-sw" style="background:var(--sec);border-radius:50%"></span>ponto = estimativa</span><span><span class="tg-sw" style="background:var(--sec);opacity:.45;width:1.1rem;height:4px;border-radius:2px"></span>faixa = margem de erro</span><span><span class="tg-refkey"></span>linha = estimativa nacional</span>';
    if (rows.some((x) => noMoe(x.row))) { const s = document.createElement('span'); s.textContent = '* sem margem de erro estimada'; lg.append(s); }
    w.append(lg); el.replaceChildren(w);
  };

  // ---------- page: início ----------
  let factIdx = Math.floor(Math.random() * FACTS.length);
  const drawFact = () => {
    const f = FACTS[factIdx], txt = document.getElementById('fato-txt');
    if (dash.data(f.ds).status !== 'ok') return;
    const row = get(f.ind, f.grupo, f.resp, TOTAL, f.ds);
    if (!row) { factIdx = (factIdx + 1) % FACTS.length; return drawFact(); }
    // o cartão ganha a cor da seção onde o dado aparece no painel (a mesma de --sec no CSS)
    const card = document.getElementById(f.card), sec = card && card.closest('.tg-sec');
    const cor = { conexao: 'teal', equipamentos: 'orange', tecnologia: 'orange', regras: 'purple', ia: 'purple', comunicacao: 'pink', comparar: 'slate', perfil: 'blue' }[sec && sec.id] || 'blue';
    const factEl = txt.closest('.tg-fact');
    factEl.style.setProperty('--sec', 'var(--v-' + cor + ')');
    factEl.style.setProperty('--cds-chart-categorical-1', 'var(--sec)');
    const icEl = document.getElementById('fato-ic');
    icEl.innerHTML = ic(f.icon);
    // reinicia a animação de entrada da frase a cada novo dado
    [txt, icEl].forEach((el) => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });
    txt.classList.remove('dash-skeleton'); txt.replaceChildren();
    const b = document.createElement('b'); b.textContent = freqTxt(row.pct);
    // com "1 em cada 10" o verbo vai para o singular
    txt.append(b, document.createTextNode(' ' + (f.txt1 && /^(cerca de )?1 em/i.test(b.textContent) ? f.txt1 : f.txt) + '.'));
    iso10(document.getElementById('fato-iso'), row.pct, dash.colors[0], 'fato', f.ds === 'escolas' ? SCHOOL : P);
    const meta = dash.data(META), m = meta.status === 'ok' && meta.data.find((x) => x.ind === f.ind && x.publico === f.ds);
    document.getElementById('fato-meta').textContent = pct(row.pct) + (row.moe ? ' (pode variar ' + faixa(row) + ')' : '') +
      (m ? ' · Base: ' + m.universo.toLowerCase().replace(/^total de /, '') : '');
    document.getElementById('fato-link').href = '#' + f.card;
  };
  document.getElementById('fato-outro').addEventListener('click', () => {
    factIdx = (factIdx + 1 + Math.floor(Math.random() * (FACTS.length - 1))) % FACTS.length;
    drawFact();
  });

  // ---------- início: mapa das cinco regiões ----------
  // cada indicador traz a cor do tema da seção onde aparece no painel
  const MAPA = [
    { ds: 'escolas', ind: 'A1', resp: 'Sim', label: 'Escolas com internet', txt: 'escolas têm acesso à internet', cor: 'teal', icon: 'radio' },
    { ds: 'escolas', ind: 'A8', resp: 'Sim', label: 'Computador e internet para alunos', txt: 'escolas oferecem computador e internet para os alunos', cor: 'teal', icon: 'notebook' },
    { ds: 'escolas', ind: 'C3C', resp: 'Sim', label: 'Regras para o celular', txt: 'escolas têm regras para o uso do celular pelos alunos', cor: 'purple', icon: 'celular' },
    { ds: 'escolas', ind: 'E5A', resp: 'Sim', label: 'Guia sobre uso de IA', txt: 'escolas têm um guia sobre o uso de inteligência artificial', cor: 'purple', icon: 'ia' },
    { ds: 'gestores', ind: 'A1', resp: 'Feminino', label: 'Gestoras mulheres', txt: 'gestores escolares são mulheres', cor: 'blue', icon: 'pessoa' },
    { ds: 'gestores', ind: 'D9A', resp: 'Sim', label: 'Gestores que usam IA', txt: 'gestores já usam inteligência artificial na gestão da escola', cor: 'purple', icon: 'ia' }
  ];
  const REGIOES = Object.keys(window.MAPA_REGIOES || {});
  const regRec = (r) => 'REGIÃO|' + r;
  let mapaInd = 0, mapaReg = null;
  const mapaSvg = document.getElementById('mapa-svg'), mapaInds = document.getElementById('mapa-inds');
  const mapaRow = (m, reg) => get(m.ind, '', m.resp, reg ? regRec(reg) : TOTAL, m.ds);
  const mapaPick = (reg) => { pararFala(); mapaReg = reg === mapaReg ? null : reg; drawMapa(); };

  // desenha o mapa e a lista de indicadores uma vez; depois só atualiza valores
  const buildMapa = () => {
    if (mapaSvg.childElementCount || !REGIOES.length) return;
    const NS = 'http://www.w3.org/2000/svg';
    for (const r of REGIOES) {
      const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'tg-mapa-reg'); g.setAttribute('role', 'button'); g.setAttribute('tabindex', '0'); g.dataset.reg = r;
      const p = document.createElementNS(NS, 'path'); p.setAttribute('d', window.MAPA_REGIOES[r].d);
      const [x, y] = window.MAPA_REGIOES[r].c;
      const t = document.createElementNS(NS, 'text'); t.setAttribute('x', x); t.setAttribute('y', y); t.setAttribute('text-anchor', 'middle');
      const t1 = document.createElementNS(NS, 'tspan'); t1.setAttribute('class', 'tg-mapa-nome'); t1.setAttribute('x', x); t1.textContent = r;
      const t2 = document.createElementNS(NS, 'tspan'); t2.setAttribute('class', 'tg-mapa-val'); t2.setAttribute('x', x); t2.setAttribute('dy', '1.15em');
      t.append(t1, t2); g.append(p, t);
      g.addEventListener('click', () => mapaPick(r));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mapaPick(r); } });
      mapaSvg.append(g);
    }
    // camada da região escolhida, desenhada por cima das demais
    const selG = document.createElementNS(NS, 'g'); selG.setAttribute('class', 'tg-mapa-sel'); selG.setAttribute('aria-hidden', 'true'); mapaSvg.append(selG);
    MAPA.forEach((m, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tg-mapa-ind'; b.style.setProperty('--sec', 'var(--v-' + m.cor + ')');
      b.innerHTML = ic(m.icon) + '<span class="tg-mapa-ind-l"></span><b class="tg-mapa-ind-v"></b><span class="tg-mapa-ind-bar"><i></i></span>';
      b.querySelector('.tg-mapa-ind-l').textContent = m.label;
      b.addEventListener('click', () => { pararFala(); mapaInd = i; drawMapa(); });
      mapaInds.append(b);
    });
    document.getElementById('mapa-reset').addEventListener('click', () => { pararFala(); mapaReg = null; drawMapa(); mapaSvg.querySelector('.tg-mapa-reg').focus(); });
    // versão em texto que também pode ser ouvida, como nos demais gráficos
    const alt = document.getElementById('mapa-alt'), card = mapaSvg.closest('.tg-card');
    alt.querySelector('summary').textContent = fala ? 'Ver em texto ou ouvir' : 'Ver o mapa em texto';
    if (fala) {
      const ob = document.createElement('button'); ob.type = 'button'; ob.className = 'tg-ouvir'; ob.textContent = 'Ouvir';
      ob.addEventListener('click', () => ouvir(ob, card));
      alt.querySelector('summary').after(ob);
    }
    alt.addEventListener('toggle', () => { if (!alt.open && falando && alt.contains(falando)) pararFala(); });
    // abre o painel de escolas ou de gestores já com a região escolhida no filtro
    document.getElementById('mapa-ir').addEventListener('click', () => {
      const m = MAPA[mapaInd];
      dash.setParams({ recorte: mapaReg ? regRec(mapaReg) : TOTAL });
      location.hash = '#' + m.ds;
    });
  };

  function drawMapa() {
    const m = MAPA[mapaInd];
    if (dash.data('escolas').status !== 'ok' || dash.data('gestores').status !== 'ok') return;
    buildMapa();
    const sec = document.getElementById('mapa'); sec.style.setProperty('--sec', 'var(--v-' + m.cor + ')');
    mapaSvg.closest('.tg-card').dataset.titulo = 'O Brasil em 5 regiões: ' + m.label + ', por região';
    const br = mapaRow(m, null), rows = REGIOES.map((r) => ({ r, row: mapaRow(m, r) })).filter((x) => x.row);
    const vals = rows.map((x) => x.row.pct), lo = Math.min(...vals), hi = Math.max(...vals);
    // regiões: do tom claro (menor valor) ao escuro (maior valor)
    for (const g of mapaSvg.querySelectorAll('.tg-mapa-reg')) {
      const x = rows.find((k) => k.r === g.dataset.reg), on = g.dataset.reg === mapaReg;
      const t = x ? (hi > lo ? 0.12 + 0.88 * (x.row.pct - lo) / (hi - lo) : 0.6) : 0;
      g.classList.toggle('tg-on', on); g.classList.toggle('tg-off', !!mapaReg && !on); g.setAttribute('aria-pressed', on ? 'true' : 'false');
      g.classList.toggle('tg-claro', t < 0.5); // fundo claro pede texto escuro; fundo escuro, texto branco
      g.querySelector('path').style.fill = x ? tone(t) : 'var(--cds-chart-grid)';
      g.querySelector('.tg-mapa-val').textContent = x ? pct(x.row.pct) + (noMoe(x.row) ? '*' : '') : '—';
      g.setAttribute('aria-label', 'Região ' + g.dataset.reg + ': ' + (x ? pct(x.row.pct) + ' — ' + m.label.toLowerCase() : 'sem dado'));
    }
    // cópia da região escolhida por cima das demais: a original fica no lugar, então o foco do teclado não se perde
    const selG = mapaSvg.querySelector('.tg-mapa-sel'), gOn = mapaReg && mapaSvg.querySelector('.tg-mapa-reg.tg-on');
    let pk = selG.firstElementChild;
    if (!gOn) selG.replaceChildren();
    else {
      if (!pk || pk.dataset.reg !== mapaReg) { // região nova: cria de novo para a animação recomeçar
        pk = document.createElementNS('http://www.w3.org/2000/svg', 'g'); pk.setAttribute('class', 'tg-mapa-pick'); pk.dataset.reg = mapaReg; selG.replaceChildren(pk);
      }
      pk.replaceChildren(gOn.querySelector('path').cloneNode(), gOn.querySelector('text').cloneNode(true));
      pk.classList.toggle('tg-claro', gOn.classList.contains('tg-claro'));
    }
    const top = rows.slice().sort((a, b) => b.row.pct - a.row.pct);
    const nota = document.getElementById('mapa-nota'); nota.replaceChildren();
    if (top.length > 1) {
      const ext = (rotulo, x) => { const s = document.createElement('span'); const k = document.createElement('small'); k.textContent = rotulo; const b = document.createElement('b'); b.textContent = x.r; s.append(k, b, ' ' + pct(x.row.pct)); return s; };
      nota.append(ext('Maior', top[0]), ext('Menor', top[top.length - 1]));
    }
    document.getElementById('mapa-alt-lista').replaceChildren(...[{ r: 'Brasil', row: br }, ...top].filter((x) => x.row).map((x) => {
      const li = document.createElement('li'); li.textContent = x.r + ': ' + pct(x.row.pct) + (x.row.moe ? ' (pode variar ' + faixa(x.row) + ')' : ''); return li;
    }));

    // painel: frase, pictograma, margem de erro e comparação com o Brasil
    const row = mapaRow(m, mapaReg) || br, txt = document.getElementById('mapa-txt');
    document.getElementById('mapa-eyebrow').textContent = mapaReg ? 'Região' : 'Você está vendo';
    document.getElementById('mapa-regiao').textContent = mapaReg || 'Brasil';
    document.getElementById('mapa-reset').hidden = !mapaReg;
    txt.classList.remove('dash-skeleton'); txt.replaceChildren();
    if (row) {
      const b = document.createElement('b'); b.textContent = freqTxt(row.pct);
      txt.append(b, document.createTextNode(' ' + m.txt + '.'));
      iso10(document.getElementById('mapa-iso'), row.pct, dash.colors[0], 'mapa', m.ds === 'escolas' ? SCHOOL : P);
      const meta = document.getElementById('mapa-meta'), exato = document.createElement('b'); exato.textContent = pct(row.pct) + (noMoe(row) ? '*' : '');
      meta.replaceChildren(exato, row.moe ? ' · pode variar ' + faixa(row) : noMoe(row) ? ' · margem de erro não estimada' : '');
      const vs = document.getElementById('mapa-vs'); vs.replaceChildren(); vs.className = 'tg-mapa-vs';
      if (mapaReg && br) {
        const diff = row.pct - br.pct, out = !noMoe(row) && row.moe != null && Math.abs(diff) > row.moe;
        if (out) { vs.classList.add(diff > 0 ? 'tg-up' : 'tg-down'); const a = document.createElement('span'); a.className = 'tg-arrow'; a.textContent = diff > 0 ? '▲' : '▼'; vs.append(a); }
        vs.append((out ? (diff > 0 ? 'Acima' : 'Abaixo') + ' do Brasil' : noMoe(row) ? 'Sem margem estimada para comparar' : 'Empate com o Brasil, dentro da margem de erro') + ' · Brasil: ' + pct(br.pct));
      } else vs.append('Média de todo o país');
    }
    // lista de indicadores: mostra o valor de cada um no lugar escolhido e serve de seletor
    [...mapaInds.children].forEach((b, i) => {
      const r = mapaRow(MAPA[i], mapaReg) || mapaRow(MAPA[i], null);
      b.setAttribute('aria-pressed', i === mapaInd ? 'true' : 'false');
      b.querySelector('.tg-mapa-ind-v').textContent = r ? pct(r.pct) : '—';
      b.querySelector('.tg-mapa-ind-bar i').style.width = (r ? r.pct : 0) + '%';
    });
    const ir = document.getElementById('mapa-ir');
    ir.firstChild.textContent = 'Ver o painel de ' + m.ds + (mapaReg ? ' do ' + mapaReg : ' do Brasil') + ' ';
  }

  const drawHome = () => {
    drawFact();
    drawMapa();
  };

  // ---------- main draw ----------
  const TITLES = { gestores: 'Quem dirige as escolas brasileiras e como usa a tecnologia', escolas: 'Como as escolas brasileiras estão conectadas e equipadas' };
  function draw() {
    const params = dash.params();
    const meta = dash.data(META);
    const take = document.getElementById('tg-take');
    if (TITLES[view]) document.getElementById('tg-h1').textContent = TITLES[view];

    document.querySelectorAll('.tg-base[data-ind]').forEach((p) => {
      p.setAttribute('data-source', META);
      if (meta.status !== 'ok') { p.textContent = ''; return; }
      const pub = p.dataset.pub, ind = p.dataset.ind;
      const m = meta.data.find((x) => x.ind === ind && x.publico === pub);
      p.setAttribute('data-field', 'universo'); p.setAttribute('data-where', 'publico=' + enc(pub) + '&ind=' + enc(ind));
      if (!m) { p.textContent = ''; return; }
      // "Tabela X" leva à tabela original no site do Cetic.br
      const a = document.createElement('a'); a.className = 'tg-base-link'; a.target = '_blank'; a.rel = 'noopener';
      a.href = 'https://cetic.br/pt/tics/educacao/2025/' + (pub === 'gestores' ? 'gestoresescolares' : 'escolas') + '/' + ind + '/';
      a.textContent = 'Tabela ' + ind; a.setAttribute('aria-label', 'Tabela ' + ind + ' no site do Cetic.br (abre em nova aba)');
      p.replaceChildren('Fonte: pesquisa TIC Educação 2025 (NIC.br/Cetic.br) · Base: ' + m.universo.toLowerCase().replace(/^total de /, '') + ' · ', a);
    });

    const g = dash.data('gestores'), e = dash.data('escolas');
    if (g.status === 'ok') build('gestores', g.data);
    if (e.status === 'ok') build('escolas', e.data);
    const d = view === 'escolas' ? e : g;
    const pageCharts = chartsIn(view);
    const kpis = [...document.querySelectorAll('#' + view + ' .tg-kpi[data-ind]')];

    if (g.status === 'ok' && e.status === 'ok') buildControls();
    if (view === 'inicio') { drawHome(); return; }
    if (!DASH.includes(view)) return;
    let rec = params.recorte || TOTAL;
    if (SEGS[view] && !SEGS[view].includes(rec)) rec = TOTAL;
    if (SEGS[view]) drawRecorte(view, rec);

    if (g.status === 'ok' || e.status === 'ok') drawCompare(params); else fail(document.getElementById('ch-comparar'), g.status);

    if (d.status !== 'ok') {
      pageCharts.forEach((c) => fail(c, d.status));
      [take, ...kpis.map((k) => k.querySelector('.tg-kpi-num'))].forEach((x) => { x.classList.toggle('dash-skeleton', d.status === 'loading'); if (d.status !== 'loading') x.textContent = '—'; });
      return;
    }
    pageCharts.forEach((c) => c.classList.remove('dash-skeleton'));

    // effective slice for this page
    const recEff = rec;
    const note = document.getElementById('tg-filter-note');
    if (resetNote && rec === TOTAL) { note.textContent = resetNote; resetNote = ''; }
    else note.textContent = rec === TOTAL
      ? 'Escolha como recortar os dados e depois o grupo. Todos os gráficos da aba mudam juntos.'
      : 'Todos os gráficos da aba mudam juntos. O traço escuro nas barras marca o valor do Brasil.';
    const anim = firstDraw[view]; firstDraw[view] = false;
    CUR = view;

    // total
    const totEl = document.querySelector('#' + view + ' .tg-total');
    const tot = dash.data(totEl.dataset.calc);
    totEl.setAttribute('data-source', totEl.dataset.calc);
    totEl.classList.toggle('dash-skeleton', tot.status === 'loading');
    if (tot.status === 'ok') {
      const t = tot.data.find((x) => x.recorte === recEff);
      totEl.textContent = t ? nfc.format(t.total) : '—';
      totEl.setAttribute('data-field', 'total'); totEl.setAttribute('data-where', 'recorte=' + enc(recEff));
      totEl.parentElement.querySelector('.tg-total-cmp').textContent = recEff === TOTAL ? (view === 'escolas' ? 'Estimativa de escolas de Ensino Fundamental e Médio' : 'Estimativa para escolas de Ensino Fundamental e Médio') : recName(recEff);
    }

    // takeaway
    take.classList.remove('dash-skeleton'); take.replaceChildren();
    const add = (txt, row) => { if (!row) return false; const b = document.createElement('b'); b.textContent = freqTxt(row.pct, false); const s = document.createElement('span'); s.textContent = pct(row.pct); markRow(s, row); take.append(b, document.createTextNode(txt + ' ('), s, document.createTextNode(')')); return true; };
    take.append(document.createTextNode(recEff === TOTAL ? 'No Brasil, ' : 'No recorte “' + recTitulo(recEff, view) + '”, '));
    if (view === 'gestores') {
      const fem = get('A1', '', 'Feminino', recEff), ia = get('D9A', '', 'Sim', recEff), pos = get('A4', 'Especialização ou pós-graduação', 'Sim', recEff);
      if (!recEff.startsWith('SEXO|')) { add(' gestores escolares são mulheres', fem); take.append(document.createTextNode(', ')); }
      add(' têm especialização ou pós-graduação', pos); take.append(document.createTextNode(' e '));
      add(' já usam inteligência artificial na gestão da escola', ia);
    } else {
      const a1 = get('A1', '', 'Sim', recEff), a8 = get('A8', '', 'Sim', recEff), e5 = get('E5A', '', 'Sim', recEff);
      add(' escolas têm internet', a1); take.append(document.createTextNode(', mas '));
      add(' oferecem computador e internet aos alunos', a8); take.append(document.createTextNode('. Só '));
      add(' têm um guia sobre o uso de inteligência artificial', e5);
    }
    take.append(document.createTextNode('.'));

    // KPI tiles
    kpis.forEach((k, i) => {
      const row = get(k.dataset.ind, k.dataset.grupo, k.dataset.resp, recEff), br = get(k.dataset.ind, k.dataset.grupo, k.dataset.resp, TOTAL);
      const num = k.querySelector('.tg-kpi-num'), svg = k.querySelector('svg'), cmp = k.querySelector('.tg-kpi-cmp');
      num.classList.remove('dash-skeleton');
      if (!row) { num.textContent = '—'; unmark(num); svg.innerHTML = ''; cmp.textContent = 'Sem dados para este recorte'; return; }
      num.textContent = pct(row.pct); markRow(num, row);
      iso10(svg, row.pct, k.dataset.color || dash.colors[0], view + 'k' + i, view === 'escolas' ? SCHOOL : P);
      cmp.textContent = freqTxt(row.pct) + (recEff !== TOTAL && br ? ' · Brasil: ' + pct(br.pct) : '') + (row.moe ? ' · pode variar ' + faixa(row) : '');
    });

    if (view === 'gestores') drawGestores(recEff, anim); else drawEscolas(recEff, anim);
    flagNoMoe();
    pararFala();
    document.querySelectorAll('#' + view + ' .tg-card, #card-comparar').forEach(textAlt);
  }

  showView(view);
  dash.onData(draw);

  const named = document.getElementById(location.hash.slice(1));
  if (named && !VIEWS.includes(named.id)) setTimeout(() => { if (!openGuide(named)) named.scrollIntoView(); }, 400);
})();
