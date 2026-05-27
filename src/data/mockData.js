export const empresas = [
  { id: 1, nome: 'Neoenergia Coelba', sigla: 'COELBA', cc: 'CC-230L-COE', pep: 'PEP-230L-COE', ordem: 'ORD-1001' },
  { id: 2, nome: 'Neoenergia Pernambuco', sigla: 'PERNAMBUCO', cc: 'CC-230L-PER', pep: 'PEP-230L-PER', ordem: 'ORD-1002' },
  { id: 3, nome: 'Neoenergia Cosern', sigla: 'COSERN', cc: 'CC-230L-COS', pep: 'PEP-230L-COS', ordem: 'ORD-1003' },
  { id: 4, nome: 'Neoenergia Brasília', sigla: 'BRASÍLIA', cc: 'CC-230L-BSB', pep: 'PEP-230L-BSB', ordem: 'ORD-1004' },
  { id: 5, nome: 'Neoenergia Elektro', sigla: 'ELEKTRO', cc: 'CC-230L-ELK', pep: 'PEP-230L-ELK', ordem: 'ORD-1005' },
  { id: 6, nome: 'Transmissora Norte', sigla: 'TRANS-N', cc: 'CC-230L-TRN', pep: 'PEP-230L-TRN', ordem: 'ORD-1006' },
  { id: 7, nome: 'Transmissora Sul', sigla: 'TRANS-S', cc: 'CC-230L-TRS', pep: 'PEP-230L-TRS', ordem: 'ORD-1007' },
  { id: 8, nome: 'Renovável Nordeste', sigla: 'REN-NE', cc: 'CC-230L-RNE', pep: 'PEP-230L-RNE', ordem: 'ORD-1008' },
];

export const fornecedores = [
  { id: 1, nome: 'JR Teletrica', codigo: 'FORN-001', cnpj: '12.345.678/0001-01' },
  { id: 2, nome: 'Telespazio', codigo: 'FORN-002', cnpj: '23.456.789/0001-02' },
  { id: 3, nome: 'Mgitech', codigo: 'FORN-003', cnpj: '34.567.890/0001-03' },
  { id: 4, nome: 'Telefônica', codigo: 'FORN-004', cnpj: '45.678.901/0001-04' },
  { id: 5, nome: 'Ericsson', codigo: 'FORN-005', cnpj: '56.789.012/0001-05' },
  { id: 6, nome: 'Huawei', codigo: 'FORN-006', cnpj: '67.890.123/0001-06' },
  { id: 7, nome: 'Nokia', codigo: 'FORN-007', cnpj: '78.901.234/0001-07' },
  { id: 8, nome: 'Digitech', codigo: 'FORN-008', cnpj: '89.012.345/0001-08' },
];

export const contasContabeis = [
  { codigo: '230L', descricao: 'Manutenção Redes Telecom' },
  { codigo: '220M', descricao: 'Investimentos Telecom' },
  { codigo: '230D', descricao: 'Operação Telecom' },
  { codigo: '2311', descricao: 'Serviços Terceirizados' },
  { codigo: '2288', descricao: 'Materiais Telecom' },
  { codigo: '2393', descricao: 'CAPEX Infraestrutura' },
];

export const tiposPedido = [
  { value: 'servico-com-contrato', label: 'Pedido de Serviço - Com Contrato' },
  { value: 'servico-sem-contrato', label: 'Pedido de Serviço - Sem Contrato' },
  { value: 'material-com-contrato', label: 'Pedido de Material - Com Contrato' },
  { value: 'material-sem-contrato', label: 'Pedido de Material - Sem Contrato' },
];

export const contratos = [
  {
    id: 'CONT-001',
    fornecedor: 'JR Teletrica',
    empresa: 'Neoenergia Coelba',
    objeto: 'Suporte ADM Telecom',
    status: 'Ativo',
    estrategia: 'Manutenção',
    responsavel: 'Carlos Silva',
    valorFixo: 492980,
    valorVariavel: 120000,
    saldo: 280000,
    percentualUtilizado: 43,
    vencimento: '2026-12-31',
    itens: [
      { codigo: 'IT-001', descricao: 'Suporte Nível 1', unidade: 'Hora', valorUnitario: 85 },
      { codigo: 'IT-002', descricao: 'Suporte Nível 2', unidade: 'Hora', valorUnitario: 140 },
    ],
  },
  {
    id: 'CONT-002',
    fornecedor: 'Telespazio',
    empresa: 'Neoenergia Elektro',
    objeto: 'Infraestrutura de Fibra',
    status: 'Ativo',
    estrategia: 'CAPEX',
    responsavel: 'Ana Souza',
    valorFixo: 1200000,
    valorVariavel: 340000,
    saldo: 850000,
    percentualUtilizado: 29,
    vencimento: '2027-06-30',
    itens: [
      { codigo: 'IT-003', descricao: 'Implantação Fibra/km', unidade: 'km', valorUnitario: 12000 },
    ],
  },
  {
    id: 'CONT-003',
    fornecedor: 'Mgitech',
    empresa: 'Neoenergia Pernambuco',
    objeto: 'Gestão de Chips IoT',
    status: 'Em Alerta',
    estrategia: 'OPEX',
    responsavel: 'João Ferreira',
    valorFixo: 180000,
    valorVariavel: 45000,
    saldo: 32000,
    percentualUtilizado: 82,
    vencimento: '2026-08-15',
    itens: [
      { codigo: 'IT-004', descricao: 'Chip M2M/mês', unidade: 'Chip/mês', valorUnitario: 18 },
    ],
  },
  {
    id: 'CONT-004',
    fornecedor: 'Telefônica',
    empresa: 'Neoenergia Brasília',
    objeto: 'Links MPLS',
    status: 'A Vencer',
    estrategia: 'OPEX',
    responsavel: 'Marina Costa',
    valorFixo: 960000,
    valorVariavel: 0,
    saldo: 80000,
    percentualUtilizado: 92,
    vencimento: '2026-09-01',
    itens: [
      { codigo: 'IT-005', descricao: 'Link MPLS 100Mbps/mês', unidade: 'mês', valorUnitario: 8000 },
    ],
  },
  {
    id: 'CONT-005',
    fornecedor: 'Ericsson',
    empresa: 'Neoenergia Coelba',
    objeto: 'Equipamentos Radio',
    status: 'Ativo',
    estrategia: 'CAPEX',
    responsavel: 'Pedro Alves',
    valorFixo: 3200000,
    valorVariavel: 0,
    saldo: 2100000,
    percentualUtilizado: 34,
    vencimento: '2027-12-31',
    itens: [
      { codigo: 'IT-006', descricao: 'Rádio 1+1', unidade: 'UN', valorUnitario: 45000 },
    ],
  },
  {
    id: 'CONT-006',
    fornecedor: 'Nokia',
    empresa: 'Neoenergia Pernambuco',
    objeto: 'Licenças Software NMS',
    status: 'Ativo',
    estrategia: 'OPEX',
    responsavel: 'Luciana Ramos',
    valorFixo: 420000,
    valorVariavel: 60000,
    saldo: 310000,
    percentualUtilizado: 26,
    vencimento: '2026-11-30',
    itens: [
      { codigo: 'IT-007', descricao: 'Licença NMS/ano', unidade: 'Licença', valorUnitario: 35000 },
    ],
  },
];

export const provisoesRecentes = [
  { id: 'PROV-001', empresa: 'Neoenergia Coelba', fornecedor: 'JR Teletrica', conta: '230L', valor: 1100, status: 'Aprovada', data: '2026-05-10' },
  { id: 'PROV-002', empresa: 'Neoenergia Elektro', fornecedor: 'Mgitech', conta: '220M', valor: 45000, status: 'Pendente', data: '2026-05-15' },
  { id: 'PROV-003', empresa: 'Neoenergia Pernambuco', fornecedor: 'Telespazio', conta: '230D', valor: 8500, status: 'Aprovada', data: '2026-05-18' },
  { id: 'PROV-004', empresa: 'Neoenergia Brasília', fornecedor: 'Telefônica', conta: '2311', valor: 22000, status: 'Rejeitada', data: '2026-05-20' },
  { id: 'PROV-005', empresa: 'Neoenergia Coelba', fornecedor: 'Ericsson', conta: '2393', valor: 380000, status: 'Pendente', data: '2026-05-22' },
];

export const opexData = [
  { mes: 'Jan', plano: 1500, rev1: 1400, real: 1100 },
  { mes: 'Fev', plano: 1600, rev1: 1550, real: 1480 },
  { mes: 'Mar', plano: 1450, rev1: 1430, real: 1400 },
  { mes: 'Abr', plano: 1700, rev1: 1650, real: 1520 },
  { mes: 'Mai', plano: 1800, rev1: 1700, real: 1600 },
  { mes: 'Jun', plano: 1600, rev1: 1580, real: 0 },
  { mes: 'Jul', plano: 1750, rev1: 0, real: 0 },
  { mes: 'Ago', plano: 1900, rev1: 0, real: 0 },
];

export const capexData = [
  { mes: 'Jan', planejado: 4200, realizado: 3800 },
  { mes: 'Fev', planejado: 5100, realizado: 4900 },
  { mes: 'Mar', planejado: 6300, realizado: 6100 },
  { mes: 'Abr', planejado: 5800, realizado: 5400 },
  { mes: 'Mai', planejado: 7200, realizado: 6900 },
  { mes: 'Jun', planejado: 8100, realizado: 0 },
];

export const contratosPorStatus = [
  { status: 'Ativo', quantidade: 170 },
  { status: 'Em Alerta', quantidade: 58 },
  { status: 'A Vencer', quantidade: 43 },
  { status: 'Encerrado', quantidade: 0 },
];

export const vencimentosPorMes = [
  { mes: 'Jun/26', quantidade: 12 },
  { mes: 'Jul/26', quantidade: 8 },
  { mes: 'Ago/26', quantidade: 23 },
  { mes: 'Set/26', quantidade: 15 },
  { mes: 'Out/26', quantidade: 7 },
  { mes: 'Nov/26', quantidade: 19 },
  { mes: 'Dez/26', quantidade: 11 },
];

export const kpiDashboard = {
  opexTotal: 7100000,
  capexTotal: 27100000,
  contratosAtivos: 271,
  provisoesPendentes: 14,
  desvioOpex: -8.2,
  desvioCapex: 4.5,
};

export const importacaoPreview = {
  OPEX: [
    { fornecedor: 'JR Teletrica', servico: 'Suporte ADM', ppto26: 1500, rev1: 1400, real: 1100, desvio: -300, justificativa: 'Desvio a menor' },
    { fornecedor: 'Telespazio', servico: 'Links Satélite', ppto26: 8200, rev1: 8000, real: 7800, desvio: -200, justificativa: '' },
    { fornecedor: 'Mgitech', servico: 'Gestão Chips', ppto26: 3400, rev1: 3400, real: 3400, desvio: 0, justificativa: '' },
  ],
  CAPEX: [
    { fornecedor: 'Ericsson', servico: 'Rádios 1+1', ppto26: 450000, rev1: 430000, real: 380000, desvio: -50000, justificativa: '' },
    { fornecedor: 'Nokia', servico: 'Switches Core', ppto26: 1200000, rev1: 1150000, real: 1100000, desvio: -50000, justificativa: '' },
  ],
  IFRS16: [
    { fornecedor: 'Telefônica', servico: 'Aluguel Torres', ppto26: 48000, rev1: 48000, real: 48000, desvio: 0, justificativa: '' },
  ],
};
