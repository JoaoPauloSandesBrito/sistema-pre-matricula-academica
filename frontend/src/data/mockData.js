export const mockUsuario = {
  id: 1,
  firebase_uid: 'demo-firebase-uid',
  nome: 'João Paulo Sandes Brito',
  email: '202110811@uesb.edu.br',
  matricula: '202110811',
  curso: 'Ciência da Computação',
  perfil: 'aluno',
  status: true,
  foto_url: '',
};

export const mockSecretaria = {
  id: 2,
  firebase_uid: 'demo-secretaria-uid',
  nome: 'Secretaria Acadêmica',
  email: 'secretaria@uesb.edu.br',
  matricula: null,
  curso: 'Administração Acadêmica',
  perfil: 'secretaria',
  status: true,
  foto_url: '',
};


export const mockAlunos = [
  mockUsuario,
  {
    id: 3,
    firebase_uid: 'demo-aluno-2',
    nome: 'Ivana Souza Santos',
    email: '202110812@uesb.edu.br',
    matricula: '202110812',
    curso: 'Ciência da Computação',
    perfil: 'aluno',
    status: true,
    foto_url: '',
  },
  {
    id: 4,
    firebase_uid: 'demo-aluno-3',
    nome: 'João Vitor Oliveira',
    email: '202110813@uesb.edu.br',
    matricula: '202110813',
    curso: 'Ciência da Computação',
    perfil: 'aluno',
    status: true,
    foto_url: '',
  },
];

export const mockDisciplinas = [
  {
    id: 1,
    codigo: 'BD001',
    nome: 'Banco de Dados 01',
    carga_horaria: 60,
    vagas: 45,
    professor: 'Stênio Longo Araújo',
    curso: 'Ciência da Computação',
    periodo: '4º semestre',
    departamento: 'DCET',
    status: 'ativa',
    descricao:
      'Introdução aos fundamentos de bancos de dados relacionais, modelagem conceitual, projeto lógico, normalização e SQL.',
    ementa:
      'Modelo Entidade-Relacionamento, mapeamento relacional, álgebra relacional, SQL, normalização e transações ACID.',
  },
  {
    id: 2,
    codigo: 'BD002',
    nome: 'Banco de Dados 02',
    carga_horaria: 60,
    vagas: 23,
    professor: 'Stênio Longo Araújo',
    curso: 'Ciência da Computação',
    periodo: '5º semestre',
    departamento: 'DCET',
    status: 'ativa',
    descricao:
      'Disciplina voltada para consultas avançadas, otimização e tópicos complementares em bancos de dados.',
    ementa:
      'Consultas avançadas, índices, visões, procedures, triggers, controle de concorrência e recuperação.',
  },
  {
    id: 3,
    codigo: 'RD001',
    nome: 'Redes 01',
    carga_horaria: 90,
    vagas: 30,
    professor: 'Docente do DCET',
    curso: 'Ciência da Computação',
    periodo: '5º semestre',
    departamento: 'DCET',
    status: 'ativa',
    descricao:
      'Fundamentos de redes de computadores, arquitetura em camadas, protocolos e serviços de comunicação.',
    ementa:
      'Modelo OSI/TCP-IP, camada de aplicação, transporte, rede, enlace, roteamento e endereçamento.',
  },
];

export const mockInteresses = [
  {
    id: 1,
    usuario_id: 1,
    disciplina_id: 1,
    data_interesse: '2026-07-02 10:30:00',
    status: 'pendente',
    disciplina: mockDisciplinas[0],
    usuario: mockAlunos[0],
  },
  {
    id: 2,
    usuario_id: 3,
    disciplina_id: 1,
    data_interesse: '2026-07-02 11:20:00',
    status: 'matriculado',
    disciplina: mockDisciplinas[0],
    usuario: mockAlunos[1],
  },
  {
    id: 3,
    usuario_id: 4,
    disciplina_id: 1,
    data_interesse: '2026-07-03 09:45:00',
    status: 'pendente',
    disciplina: mockDisciplinas[0],
    usuario: mockAlunos[2],
  },
  {
    id: 4,
    usuario_id: 1,
    disciplina_id: 3,
    data_interesse: '2026-07-03 15:10:00',
    status: 'pendente',
    disciplina: mockDisciplinas[2],
    usuario: mockAlunos[0],
  },
];

export const mockMatriculas = [
  {
    id: 1,
    usuario_id: 3,
    disciplina_id: 1,
    interesse_id: 2,
    data_matricula: '2026-07-02 14:00:00',
    semestre: '2026.2',
    status: 'ativa',
    disciplina: mockDisciplinas[0],
    usuario: mockAlunos[1],
  },
];

export const mockDashboard = {
  total_alunos: 3,
  total_disciplinas: 10,
  total_interesses: 4,
  total_matriculas: 1,
  total_vagas: 600,
  disciplinas: mockDisciplinas,
};
