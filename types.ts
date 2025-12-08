

export enum Role {
  Admin = 'Administrador',
  Padrao = 'Padrão',
  Supervisor = 'Supervisor',
}

export interface User {
  id: number;
  name: string;
  email?: string;
  role: Role;
  passwordHash?: string;
  permissions?: Subsystem[];
  patente?: string;
  orgaoUnidade?: string;
  funcao?: string;
}

export type Subsystem = 'Ocorrências Policiais' | 'Transportes' | 'Logística' | 'Autos de Expedientes' | 'Administração do Sistema';

export type View =
  | 'Dashboard'
  | 'ActionMenu'
  | 'Consulta'
  | 'Criminalidade'
  | 'Sinistralidade Rodoviária'
  | 'Enfrentamento Policial'
  | 'Transportes'
  | 'Logística'
  | 'Gerir Usuários'
  | 'Relatórios'
  | 'Database Setup'
  | 'Registar Ocorrência'
  | 'Consultar Ocorrências'
  // Novas Views para Autos de Expediente
  | 'Auto de Queixa'
  | 'Auto de Apreensão'
  | 'Auto de Notícia'
  | 'Aviso de Notificação'
  | 'Informação'
  | 'Participação'
  | 'Apresentação'
  | 'Processos';


export interface NavItem {
  name: View;
  roles: Role[];
}

export type FamíliaCriminal = 'Crimes Contra Pessoa' | 'Crimes Contra o Património' | 'Crimes Contra Ambiente' | 'Crimes Contra Autoridade' | 'Crimes Contra Ordem e Tranquilidade Pública' | 'Crimes Contra Mercado e Economia' | 'Outros';

export type CrimeData = {
    [key in FamíliaCriminal]: string[];
};

export type DashboardCategory = 'Criminalidade' | 'Sinistralidade Rodoviária' | 'Enfrentamento Policial' | 'Transportes' | 'Logística' | 'Autos de Expediente';

// FIX: Added 'processos' to ApiKey to support the new form.
export type ApiKey = 'criminalidade' | 'sinistralidade' | 'enfrentamento' | 'transportes' | 'logistica' | 'autosExpediente' | 'processos';

export interface DataRecord {
  id: number;
  createdAt: string;
  [key: string]: any;
}

// Ocorrências Policiais
export interface CriminalidadeRecord extends DataRecord {
  // Dados da Ocorrência
  dataOcorrencia: string;
  periodo: string;
  municipio: string;
  unidadeEsquadra: string;
  numeroProcesso?: string; // Ligação a Processos
  
  // Tipificação do Crime
  familiaCriminal: FamíliaCriminal;
  crime: string;
  modusOperandi?: string;
  objetosUsados?: string;

  // Envolvidos
  nomeVitima?: string;
  idadeVitima?: number;
  nomeAcusado?: string;
  idadeAcusado?: number;
  situacaoAcusado?: 'Detido' | 'Foragido' | 'Desconhecido';

  // Desfecho
  estadoProcesso: 'Em Investigação' | 'Remetido a Tribunal' | 'Concluído';
  bensRecuperados?: string;
  observacoes?: string;
}

export interface SinistralidadeRecord extends DataRecord {
  // Dados do Acidente
  dataAcidente: string;
  periodo: string;
  municipio: string;
  local: string;
  tipoAcidente: string;
  causaPresumivel: string;
  
  // Veículos e Vítimas
  numeroVeiculos: number;
  numeroVitimas: number;
  numeroMortos: number;
  numeroFeridosGraves: number;
  numeroFeridosLigeiros: number;

  // Detalhes
  descricao?: string;
  danosMateriais?: string;
}

export interface EnfrentamentoRecord extends DataRecord {
  tipoRegisto: 'Operação' | 'Patrulhamento' | 'Detenção';
  data: string;
  unidadeResponsavel: string;
  municipio: string;

  // Operação
  nomeOperacao?: string;
  objetivoOperacao?: string;
  resultadosOperacao?: string; // e.g., apreensões

  // Patrulhamento
  tipoPatrulhamento?: 'Apeado' | 'Auto' | 'Misto';
  areaPatrulhada?: string;

  // Detenção
  nomeDetido?: string;
  idadeDetido?: number;
  motivoDetencao?: string;
  
  observacoes?: string;
}

// Transportes
export interface TransportesRecord extends DataRecord {
    tipoRegisto: 'Cadastro de Meio' | 'Manutenção' | 'Abastecimento';
    data: string;

    // Cadastro de Meio
    matricula?: string;
    marca?: string;
    modelo?: string;
    tipoViatura?: string;
    estadoViatura?: 'Operacional' | 'Inoperacional' | 'Em Manutenção';

    // Abastecimento & Manutenção
    viaturaMatricula?: string; // Ligação a um Meio

    // Abastecimento
    combustivel?: 'Gasolina' | 'Gasóleo';
    quantidadeLitros?: number;
    bombaCombustivel?: string;

    // Manutenção
    tipoManutencao?: 'Preventiva' | 'Corretiva';
    descricaoServico?: string;
    custoManutencao?: number;
}

// Logística
export interface EfetivoRecord extends DataRecord {
  nip: string;
  nomeCompleto: string;
  patente: string;
  orgaoUnidade: string;
  funcao: string;
  dataNascimento: string;
  genero: 'Masculino' | 'Feminino';
  contacto: string;
  estado: 'Ativo' | 'Inativo' | 'Reforma';
}

export interface MaterialRecord extends DataRecord {
  tipoMaterial: 'Armamento' | 'Fardamento' | 'Comunicações' | 'Material de Escritório';
  descricaoItem: string;
  quantidade: number;
  estado: 'Bom' | 'Razoável' | 'Danificado';
  nipEfetivoResponsavel?: string; // Ligação a Efetivo
  observacoes?: string;
}

// FIX: Exporting LogisticaRecord to be available in other files.
export type LogisticaRecord = EfetivoRecord | MaterialRecord;

// Autos e Processos
export interface AutosExpedienteRecord extends DataRecord {
    tipoAuto: string;
    numeroAuto: string;
    dataAuto: string;
    esquadra: string;
    agenteResponsavel: string;
    noticianteNome?: string;
    queixadoNome?: string;
    descricaoFactos: string;
}

// FIX: Added ProcessosRecord type for the new form.
export interface ProcessosRecord extends DataRecord {
    numeroProcesso: string;
    dataAbertura: string;
    tipoProcesso: string;
    faseProcesso: string;
    autoOrigemNumero?: string;
    arguido: string;
    vitima?: string;
    observacoes?: string;
}