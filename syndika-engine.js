// ══════════════════════════════════════════════════
//  SYNDIKA — Motor de IA Jurídica (standalone)
//  Teste no VS Code: node syndika-engine.js
// ══════════════════════════════════════════════════

// ── BASE DE CONHECIMENTO ──────────────────────────

var TIPOS = {
  manutencao: {
    label: 'Manutenção / Serviço',
    risco: 'alto',
    confianca: 94,
    fontes: [
      'Art. 1.348 CC — poderes do síndico',
      'Lei 4.591/64 art. 22 — deveres condominiais',
      'STJ REsp 1.644.107/SP — responsabilidade civil'
    ],
    titulo: 'Ação requer deliberação e documentação prévia',
    descricao: 'Serviços de manutenção em área condominial exigem deliberação do conselho, laudo técnico da empresa e comunicado prévio. Sem esses documentos, o síndico responde pessoalmente por danos materiais ou pessoais.',
    docs: ['ata', 'laudo', 'comunicado', 'seguro']
  },
  obra: {
    label: 'Obra / Reforma',
    risco: 'critico',
    confianca: 97,
    fontes: [
      'Art. 1.341 CC — obras em condomínio',
      'ABNT NBR 16.280:2015 — reforma em condomínio',
      'Lei 6.496/77 — ART obrigatória',
      'NR-18 — segurança em obras'
    ],
    titulo: 'Risco crítico — ART/RRT e aprovação em assembleia obrigatórios',
    descricao: 'Obras exigem aprovação em assembleia (quórum 2/3 para obras voluptuárias), ART ou RRT do responsável técnico, comunicado com prazo mínimo de 10 dias e, dependendo do porte, alvará municipal.',
    docs: ['ata', 'laudo', 'comunicado', 'seguro']
  },
  rh: {
    label: 'RH / Funcionário',
    risco: 'alto',
    confianca: 91,
    fontes: [
      'CLT art. 477 — rescisão contratual',
      'Súmula 331 TST — terceirização',
      'Lei 8.036/90 — FGTS',
      'CF art. 7º — direitos trabalhistas'
    ],
    titulo: 'Rescisão exige rito correto para evitar passivo trabalhista',
    descricao: 'Demissões sem justa causa seguem a CLT rigorosamente. O síndico responde pessoalmente se o rito não for cumprido: aviso prévio, FGTS + multa 40%, TRCT e, se >1 ano, homologação no sindicato.',
    docs: ['ata', 'laudo', 'comunicado', 'seguro']
  },
  advertencia: {
    label: 'Advertência a Morador',
    risco: 'medio',
    confianca: 89,
    fontes: [
      'Art. 1.337 CC — multa condominial',
      'Lei 4.591/64 art. 19 — infrações',
      'CF art. 5º LV — contraditório e ampla defesa',
      'Convenção condominial'
    ],
    titulo: 'Advertência sem AR e fundamentação pode ser anulada judicialmente',
    descricao: 'Advertências sem base expressa na convenção ou sem comprovação de recebimento (AR) são frequentemente anuladas. O morador tem direito de defesa antes de qualquer multa.',
    docs: ['ata', 'comunicado', 'laudo', 'seguro']
  },
  financeiro: {
    label: 'Decisão Financeira',
    risco: 'medio',
    confianca: 88,
    fontes: [
      'Art. 1.348 CC — prestação de contas',
      'Lei 4.591/64 art. 22 — obrigações do síndico',
      'NBC TG 1000 — demonstrações financeiras'
    ],
    titulo: 'Gastos extraordinários requerem previsão orçamentária ou ratificação',
    descricao: 'Despesas não previstas no orçamento aprovado em assembleia podem gerar questionamentos e ação de prestação de contas. O síndico deve documentar a urgência ou submeter à aprovação.',
    docs: ['ata', 'comunicado', 'laudo', 'seguro']
  },
  outro: {
    label: 'Outra Ação Administrativa',
    risco: 'medio',
    confianca: 82,
    fontes: [
      'Art. 1.348 CC — poderes gerais do síndico',
      'Lei 4.591/64 — gestão condominial'
    ],
    titulo: 'Documentação preventiva recomendada para qualquer ação relevante',
    descricao: 'Para qualquer ato administrativo relevante, recomenda-se registrar a deliberação em ata, comunicar os moradores e arquivar evidências. Isso protege o síndico em eventual questionamento.',
    docs: ['ata', 'comunicado', 'laudo', 'seguro']
  }
};

var CHECKLISTS = {
  manutencao: [
    { titulo: 'Ata de deliberação do conselho',         legal: 'Art. 1.348 CC — base legal obrigatória',         req: true },
    { titulo: 'Laudo técnico da empresa contratada',    legal: 'Art. 927 CC — responsabilidade civil',           req: true },
    { titulo: 'Comunicado aos moradores (mín. 5 dias)', legal: 'Art. 1.336 CC — transparência condominial',      req: false },
    { titulo: 'Comprovante de seguro RC da empresa',    legal: 'Cobre danos a terceiros durante a execução',     req: false }
  ],
  obra: [
    { titulo: 'Aprovação em assembleia (quórum 2/3)',   legal: 'Art. 1.341 CC — obras voluptuárias',             req: true },
    { titulo: 'ART ou RRT do responsável técnico',      legal: 'Lei 6.496/77 — obrigatório para obras',          req: true },
    { titulo: 'Comunicado prévio (mín. 10 dias)',       legal: 'Art. 1.336 CC + convenção condominial',          req: false },
    { titulo: 'Alvará municipal (se necessário)',       legal: 'Legislação municipal de uso e ocupação do solo', req: false }
  ],
  rh: [
    { titulo: 'Carta de aviso prévio (mín. 30 dias)',   legal: 'CLT art. 487 — rescisão sem justa causa',        req: true },
    { titulo: 'TRCT — Termo de Rescisão Contratual',    legal: 'CLT art. 477 — obrigatório em toda rescisão',    req: true },
    { titulo: 'Homologação no sindicato (se >1 ano)',   legal: 'CLT art. 477 §1º — trabalhadores com vínculo',   req: true },
    { titulo: 'Saque FGTS + multa 40% comprovado',      legal: 'CF art. 7º, III + Lei 8.036/90',                req: false }
  ],
  advertencia: [
    { titulo: 'Notificação por escrito com AR',         legal: 'Art. 1.337 CC — devido processo condominial',    req: true },
    { titulo: 'Fundamentação no artigo da convenção',  legal: 'Lei 4.591/64 art. 19 — base convencional',       req: true },
    { titulo: 'Prazo de defesa ao morador (mín. 5 dias)', legal: 'CF art. 5º LV — contraditório e ampla defesa', req: false },
    { titulo: 'Ata de deliberação para multa',         legal: 'Art. 1.337 CC — multa até 5x a cota mensal',     req: false }
  ],
  financeiro: [
    { titulo: 'Verificar previsão no orçamento aprovado', legal: 'Art. 1.348 CC — prestação de contas ao conselho', req: true },
    { titulo: 'Três orçamentos de fornecedores distintos', legal: 'Boa prática — transparência e economicidade',  req: true },
    { titulo: 'Comunicado de gasto extraordinário',    legal: 'Art. 1.348 CC — dever de informar moradores',    req: false },
    { titulo: 'Nota fiscal e contrato arquivados',     legal: 'Lei 4.591/64 art. 22 — documentação obrigatória', req: false }
  ],
  outro: [
    { titulo: 'Registrar deliberação em ata',          legal: 'Art. 1.348 CC — poder de gestão condominial',    req: true },
    { titulo: 'Comunicado formal aos moradores',       legal: 'Art. 1.336 CC — transparência condominial',      req: false },
    { titulo: 'Documentação de suporte arquivada',     legal: 'Lei 4.591/64 — guarda obrigatória de documentos', req: false },
    { titulo: 'Verificar previsão na convenção',       legal: 'Convenção condominial — limites do síndico',     req: false }
  ]
};

// ── PALAVRAS-CHAVE PARA DETECÇÃO ──────────────────

var KEYWORDS = {
  rh:          ['porteiro','zelador','faxineiro','funcionario','demitir','demissão','demissao','justa causa','rescisão','rescisao','trabalhista','empregado','fgts','clt','aviso previo','aviso prévio','contratacao','contratação','salario','salário','holerite','folha de pagamento','sindicato','terceirizado'],
  obra:        ['obra','reform','construção','construcao','construir','art ','rrt ','fachada','estrutural','alvenaria','reboco','hidraulic','eletric','andaime','nbr','prefeitura','alvara','alvará'],
  manutencao:  ['poda','manutencao','manutenção','reparo','consertar','pintura','jardim','jardineiro','elevador','bomba','infiltracao','infiltração','telhado','goteira','calcada','calçada','dedetiz','limpeza','piscina','playground'],
  advertencia: ['advertencia','advertência','multar','multa','morador','barulho','infração','infracao','convencao','convenção','notificar','reclamacao','reclamação','vizinho','ruido','ruído','festa','perturbacao','perturbação'],
  financeiro:  ['orcamento','orçamento','cota','taxa condominial','financeiro','comprar','custo','despesa','fundo de reserva','prestacao de contas','prestação de contas','inadimplente','inadimplencia','boleto','cobrança']
};

// ── FUNÇÕES DO MOTOR ──────────────────────────────

function normalizarTexto(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function detectarTipo(descricao) {
  var texto = normalizarTexto(descricao);
  var pontos = { manutencao: 0, obra: 0, rh: 0, advertencia: 0, financeiro: 0 };

  for (var tipo in KEYWORDS) {
    KEYWORDS[tipo].forEach(function(kw) {
      var kwNorm = normalizarTexto(kw);
      if (texto.includes(kwNorm)) pontos[tipo] += 2;
    });
  }

  var melhor = null, maxPts = 0;
  for (var t in pontos) {
    if (pontos[t] > maxPts) { maxPts = pontos[t]; melhor = t; }
  }

  return maxPts >= 2 ? melhor : 'outro';
}

function formalizarTexto(texto, tipo) {
  var prefixos = {
    manutencao:  'Execução de serviço de manutenção condominial, referente a: ',
    obra:        'Realização de obra ou reforma em área condominial, referente a: ',
    rh:          'Rescisão ou alteração de contrato de trabalho de funcionário condominial, referente a: ',
    advertencia: 'Aplicação de advertência ou penalidade a condômino, em razão de: ',
    financeiro:  'Aprovação de despesa ou decisão financeira condominial, referente a: ',
    outro:       'Execução de ato administrativo condominial, referente a: '
  };
  var sufixos = {
    manutencao:  ' A ser executado por empresa habilitada com laudo técnico e seguro de responsabilidade civil.',
    obra:        ' A ser conduzida em conformidade com a ABNT NBR 16.280:2015 e demais normas aplicáveis.',
    rh:          ' A ser conduzida em estrita observância às disposições da Consolidação das Leis do Trabalho.',
    advertencia: ' Em conformidade com a Convenção Condominial e o art. 1.337 do Código Civil.',
    financeiro:  ' Mediante comprovação orçamentária e prestação de contas ao corpo de condôminos.',
    outro:       ' Registrada em ata de deliberação, nos termos do art. 1.348 do Código Civil.'
  };
  return (prefixos[tipo] || prefixos.outro) + texto.trim() + (sufixos[tipo] || sufixos.outro);
}

// ── FUNÇÃO PRINCIPAL ──────────────────────────────

function analisar(descricao) {
  var tipo   = detectarTipo(descricao);
  var dados  = TIPOS[tipo];
  var checks = CHECKLISTS[tipo];

  var resultado = {
    tipo:          tipo,
    tipoLabel:     dados.label,
    risco:         dados.risco.toUpperCase(),
    confianca:     dados.confianca + '%',
    titulo:        dados.titulo,
    descricao:     dados.descricao,
    textoFormal:   formalizarTexto(descricao, tipo),
    fontes:        dados.fontes,
    documentos:    dados.docs,
    checklist:     checks.map(function(c) {
      return {
        item:        c.titulo,
        lei:         c.legal,
        obrigatorio: c.req ? 'SIM' : 'Recomendado'
      };
    })
  };

  return resultado;
}

// ── EXIBIÇÃO NO TERMINAL ──────────────────────────

function imprimir(resultado) {
  var linha = '═'.repeat(60);
  console.log('\n' + linha);
  console.log('  SYNDIKA — Análise Jurídica');
  console.log(linha);
  console.log('  Tipo detectado : ' + resultado.tipoLabel);
  console.log('  Nível de risco : ' + resultado.risco);
  console.log('  Confiança IA   : ' + resultado.confianca);
  console.log(linha);

  console.log('\n📋 TÍTULO\n' + resultado.titulo);
  console.log('\n📝 ANÁLISE\n' + resultado.descricao);
  console.log('\n✦ TEXTO FORMALIZADO PARA DOCUMENTOS\n' + resultado.textoFormal);

  console.log('\n📚 FONTES JURÍDICAS');
  resultado.fontes.forEach(function(f, i) {
    console.log('  ' + (i + 1) + '. ' + f);
  });

  console.log('\n✅ CHECKLIST DE DOCUMENTAÇÃO');
  resultado.checklist.forEach(function(c) {
    var marca = c.obrigatorio === 'SIM' ? '🔴' : '🟡';
    console.log('  ' + marca + ' ' + c.item);
    console.log('     Lei: ' + c.lei);
    console.log('     ' + c.obrigatorio);
  });

  console.log('\n📄 DOCUMENTOS A GERAR: ' + resultado.documentos.join(', '));
  console.log('\n' + linha + '\n');
}

// ══════════════════════════════════════════════════
//  TESTES — edite os casos abaixo para testar
// ══════════════════════════════════════════════════

var casos = [
  'quero demitir o porteiro que faltou 3 dias seguidos',
  'precisamos reformar a fachada do prédio',
  'morador do 3B está fazendo barulho toda madrugada',
  'contratar empresa para limpeza da piscina e jardim',
  'comprar equipamentos novos para a academia do condomínio'
];

casos.forEach(function(caso) {
  console.log('\n🔎 Entrada: "' + caso + '"');
  var resultado = analisar(caso);
  imprimir(resultado);
});

// ── Para usar em código próprio: ──────────────────
// var r = analisar("texto da ação aqui");
// console.log(r);
