export interface Pet {
  id: string
  nome: string
  especie: "cao" | "gato" | "outro"
  raca: string
  dataNascimento: string
  peso: number
  tutor: string
  telefoneTutor: string
  foto?: string
  arquivado?: boolean
}

export interface Consulta {
  id: string
  petId: string
  petNome: string
  tutor: string
  data: string
  horario: string
  veterinario: string
  motivo: string
  status: "agendada" | "realizada" | "cancelada"
}

export interface Vacina {
  id: string
  petId: string
  petNome: string
  vacina: string
  dataAplicacao: string
  proximaDose: string
}

export interface HistoricoItem {
  id: string
  petId: string
  data: string
  tipo: "consulta" | "vacina" | "exame"
  descricao: string
  veterinario: string
}

export interface Lancamento {
  id: string
  descricao: string
  tipo: "entrada" | "saida"
  valor: number
  data: string
  categoria: string
}

export interface Agendamento {
  id: string
  petId: string
  petNome: string
  tutor: string
  data: string
  horarioInicio: string
  horarioFim: string
  veterinario: string
  tipo: string
}

export const veterinarios = [
  "Dr. Carlos Silva",
  "Dra. Maria Santos",
  "Dr. Pedro Costa",
  "Dra. Ana Oliveira",
]

export const pets: Pet[] = [
  {
    id: "1",
    nome: "Thor",
    especie: "cao",
    raca: "Golden Retriever",
    dataNascimento: "2020-03-15",
    peso: 32,
    tutor: "João Silva",
    telefoneTutor: "(11) 98765-4321",
  },
  {
    id: "2",
    nome: "Luna",
    especie: "gato",
    raca: "Siamês",
    dataNascimento: "2021-06-20",
    peso: 4.5,
    tutor: "Maria Santos",
    telefoneTutor: "(11) 91234-5678",
  },
  {
    id: "3",
    nome: "Max",
    especie: "cao",
    raca: "Bulldog Francês",
    dataNascimento: "2019-11-08",
    peso: 12,
    tutor: "Pedro Costa",
    telefoneTutor: "(11) 99876-5432",
  },
  {
    id: "4",
    nome: "Mia",
    especie: "gato",
    raca: "Persa",
    dataNascimento: "2022-01-10",
    peso: 3.8,
    tutor: "Ana Oliveira",
    telefoneTutor: "(11) 94567-8901",
  },
  {
    id: "5",
    nome: "Bob",
    especie: "cao",
    raca: "Poodle",
    dataNascimento: "2018-07-25",
    peso: 8,
    tutor: "Carlos Ferreira",
    telefoneTutor: "(11) 92345-6789",
  },
  {
    id: "6",
    nome: "Pipoca",
    especie: "outro",
    raca: "Coelho",
    dataNascimento: "2023-02-14",
    peso: 2.1,
    tutor: "Lucia Mendes",
    telefoneTutor: "(11) 93456-7890",
  },
]

export const consultas: Consulta[] = [
  {
    id: "1",
    petId: "1",
    petNome: "Thor",
    tutor: "João Silva",
    data: "2026-06-01",
    horario: "09:00",
    veterinario: "Dr. Carlos Silva",
    motivo: "Consulta de rotina",
    status: "agendada",
  },
  {
    id: "2",
    petId: "2",
    petNome: "Luna",
    tutor: "Maria Santos",
    data: "2026-06-01",
    horario: "10:30",
    veterinario: "Dra. Maria Santos",
    motivo: "Vacinação anual",
    status: "agendada",
  },
  {
    id: "3",
    petId: "3",
    petNome: "Max",
    tutor: "Pedro Costa",
    data: "2026-05-28",
    horario: "14:00",
    veterinario: "Dr. Pedro Costa",
    motivo: "Dor na pata",
    status: "realizada",
  },
  {
    id: "4",
    petId: "4",
    petNome: "Mia",
    tutor: "Ana Oliveira",
    data: "2026-05-25",
    horario: "11:00",
    veterinario: "Dra. Ana Oliveira",
    motivo: "Check-up geral",
    status: "realizada",
  },
  {
    id: "5",
    petId: "5",
    petNome: "Bob",
    tutor: "Carlos Ferreira",
    data: "2026-05-20",
    horario: "15:30",
    veterinario: "Dr. Carlos Silva",
    motivo: "Problemas digestivos",
    status: "cancelada",
  },
  {
    id: "6",
    petId: "1",
    petNome: "Thor",
    tutor: "João Silva",
    data: "2026-06-02",
    horario: "11:00",
    veterinario: "Dr. Carlos Silva",
    motivo: "Retorno",
    status: "agendada",
  },
]

export const vacinas: Vacina[] = [
  {
    id: "1",
    petId: "1",
    petNome: "Thor",
    vacina: "V10",
    dataAplicacao: "2025-06-01",
    proximaDose: "2026-06-01",
  },
  {
    id: "2",
    petId: "1",
    petNome: "Thor",
    vacina: "Antirrábica",
    dataAplicacao: "2025-06-15",
    proximaDose: "2026-06-15",
  },
  {
    id: "3",
    petId: "2",
    petNome: "Luna",
    vacina: "Tríplice Felina",
    dataAplicacao: "2025-08-10",
    proximaDose: "2026-08-10",
  },
  {
    id: "4",
    petId: "3",
    petNome: "Max",
    vacina: "V10",
    dataAplicacao: "2025-04-20",
    proximaDose: "2026-04-20",
  },
  {
    id: "5",
    petId: "4",
    petNome: "Mia",
    vacina: "Antirrábica",
    dataAplicacao: "2025-12-05",
    proximaDose: "2026-05-28",
  },
  {
    id: "6",
    petId: "5",
    petNome: "Bob",
    vacina: "Gripe Canina",
    dataAplicacao: "2026-01-10",
    proximaDose: "2026-07-10",
  },
]

export const historico: HistoricoItem[] = [
  {
    id: "1",
    petId: "1",
    data: "2026-05-15",
    tipo: "consulta",
    descricao: "Consulta de rotina - animal saudável",
    veterinario: "Dr. Carlos Silva",
  },
  {
    id: "2",
    petId: "1",
    data: "2025-06-01",
    tipo: "vacina",
    descricao: "Aplicação da vacina V10",
    veterinario: "Dra. Maria Santos",
  },
  {
    id: "3",
    petId: "1",
    data: "2025-03-20",
    tipo: "exame",
    descricao: "Exame de sangue completo - resultados normais",
    veterinario: "Dr. Pedro Costa",
  },
  {
    id: "4",
    petId: "2",
    data: "2026-04-10",
    tipo: "consulta",
    descricao: "Tratamento de infecção urinária",
    veterinario: "Dra. Ana Oliveira",
  },
  {
    id: "5",
    petId: "2",
    data: "2025-08-10",
    tipo: "vacina",
    descricao: "Aplicação da vacina Tríplice Felina",
    veterinario: "Dr. Carlos Silva",
  },
  {
    id: "6",
    petId: "3",
    data: "2026-05-28",
    tipo: "consulta",
    descricao: "Tratamento de lesão na pata dianteira esquerda",
    veterinario: "Dr. Pedro Costa",
  },
]

export const lancamentos: Lancamento[] = []

export const agendamentos: Agendamento[] = [
  {
    id: "1",
    petId: "1",
    petNome: "Thor",
    tutor: "João Silva",
    data: "2026-06-01",
    horarioInicio: "09:00",
    horarioFim: "09:30",
    veterinario: "Dr. Carlos Silva",
    tipo: "Consulta",
  },
  {
    id: "2",
    petId: "2",
    petNome: "Luna",
    tutor: "Maria Santos",
    data: "2026-06-01",
    horarioInicio: "10:30",
    horarioFim: "11:00",
    veterinario: "Dra. Maria Santos",
    tipo: "Vacinação",
  },
  {
    id: "3",
    petId: "3",
    petNome: "Max",
    tutor: "Pedro Costa",
    data: "2026-06-02",
    horarioInicio: "14:00",
    horarioFim: "15:00",
    veterinario: "Dr. Pedro Costa",
    tipo: "Cirurgia",
  },
  {
    id: "4",
    petId: "4",
    petNome: "Mia",
    tutor: "Ana Oliveira",
    data: "2026-06-02",
    horarioInicio: "09:00",
    horarioFim: "09:30",
    veterinario: "Dra. Ana Oliveira",
    tipo: "Retorno",
  },
  {
    id: "5",
    petId: "5",
    petNome: "Bob",
    tutor: "Carlos Ferreira",
    data: "2026-06-03",
    horarioInicio: "11:00",
    horarioFim: "11:30",
    veterinario: "Dr. Carlos Silva",
    tipo: "Exame",
  },
  {
    id: "6",
    petId: "6",
    petNome: "Pipoca",
    tutor: "Lucia Mendes",
    data: "2026-06-03",
    horarioInicio: "15:00",
    horarioFim: "15:30",
    veterinario: "Dra. Maria Santos",
    tipo: "Consulta",
  },
  {
    id: "7",
    petId: "1",
    petNome: "Thor",
    tutor: "João Silva",
    data: "2026-06-04",
    horarioInicio: "10:00",
    horarioFim: "10:30",
    veterinario: "Dr. Carlos Silva",
    tipo: "Retorno",
  },
]
