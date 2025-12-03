export enum Role {
  Admin = 'Administrador',
  Padrao = 'Padrão',
}

export interface User {
  // FIX: Changed id to be required to ensure it exists for existing users,
  // which is necessary for components like DataTable that rely on a stable ID.
  id: number;
  name: string;
  email?: string;
  role: Role;
  passwordHash?: string;
  permissions?: View[];
}

export type View =
  | 'Dashboard'
  | 'ActionMenu'
  | 'Consulta'
  | 'Criminalidade'
  | 'Sinistralidade Rodoviária'
  | 'Resultados Operacionais'
  | 'Transportes'
  | 'Logística'
  | 'Autos de Expediente'
  | 'Processos'
  | 'Gerir Usuários'
  | 'Relatórios'
  | 'Database Setup';

export interface NavItem {
  name: View;
  roles: Role[];
}

export type FamíliaCriminal = 'Crimes Contra Pessoa' | 'Crimes Contra o Património' | 'Crimes Contra Ambiente' | 'Crimes Contra Autoridade' | 'Crimes Contra Ordem e Tranquilidade Pública' | 'Crimes Contra Mercado e Economia' | 'Outros';

export type CrimeData = {
    [key in FamíliaCriminal]: string[];
};

export type DashboardCategory = 'Criminalidade' | 'Sinistralidade Rodoviária' | 'Resultados Operacionais' | 'Transportes' | 'Logística' | 'Autos de Expediente' | 'Processos';

export type ApiKey = 'criminalidade' | 'sinistralidade' | 'resultados' | 'transportes' | 'logistica' | 'autosExpediente' | 'processos';

export interface DataRecord {
  id: number;
  createdAt: string;
  [key: string]: any;
}

// Specific Record Types
export interface CriminalidadeRecord extends DataRecord {
  // Ocorrência
  data?: string;
  periodo?: string;
  municipio?: string;
  unidadeEsquadra?: string;
  comuna?: string;
  bairro?: string;
  rua?: string;
  local?: string;
  pontoReferencia?: string;
  vitimaNome?: string;
  vitimaNacionalidade?: string;
  vitimaIdade?: number;
  vitimaEstadoCivil?: string;
  acusadoNome?: string;
  acusadoNacionalidade?: string;
  acusadoTCP?: string;
  acusadoIdade?: number;
  acusadoEstadoCivil?: string;
  acusadoSituacaoPrisional?: string;
  // Crimes
  familiaCriminal?: FamíliaCriminal;
  crime?: string;
  tipoCrime?: string;
  todosCrimes?: string;
  modusOperandi?: string;
  mobilDoCrime?: string;
  objetoUsado?: string;
  descricaoDoObjeto?: string;
  relacaoVitima?: string;
  estado?: string;
  bensSubtraidos?: string;
  situacaoDosBens?: string;
  // Outros
  descricaoOcorrencia?: string;
}

export interface SinistralidadeRecord extends DataRecord {
    data?: string;
    periodo?: string;
    municipio?: string;
    unidadeEsquadra?: string;
    comuna?: string;
    bairro?: string;
    rua?: string;
    local?: string;
    pontoReferencia?: string;
    tipoAcidente?: string;
    vitimaNome?: string;
    vitimaIdade?: number;
    vitimaEstado?: 'Fatal' | 'Grave' | 'Ligeiro' | 'Ileso';
    vitimaVeiculo?: string;
    observacoes?: string;
}

export interface ResultadosRecord extends DataRecord {
    // Operações
    data?: string;
    periodo?: string;
    tipoOperacao?: string;
    unidadeEsquadra?: string;
    municipio?: string;
    local?: string;
    objetivo?: string;
    resultadosObtidos?: string;
    // Patrulhamentos
    tipoPatrulhamento?: 'Apeado' | 'Auto' | 'Misto';
    areaPatrulhada?: string;
    ocorrenciasRegistadas?: string;
    // Detidos
    detidoNome?: string;
    detidoIdade?: number;
    motivoDetencao?: string;
    // Outros
    observacoesGerais?: string;
}

export interface TransportesRecord extends DataRecord {
    // Municípios (Combustível)
    combustivel?: 'Gasolina' | 'Gasóleo';
    quantidade?: number;
    municipio?: string;
    quantidadeRecebida?: number;
    existencia?: number;
    // Membros (Pessoal)
    nome?: string;
    patente?: string;
    area?: string;
    quantidadeRecebidaPessoal?: number;
    // Manutenções
    viaturaMatricula?: string;
    tipoManutencao?: 'Preventiva' | 'Corretiva';
    custoManutencao?: number;
    descManutencao?: string;
    // Outros
    obsGerais?: string;
}

export interface LogisticaRecord extends DataRecord {
    // Armamento (Ficha de Agente)
    numFicha?: string;
    orgaoUnidade?: string;
    nip?: string;
    patente?: string;
    nomeCompleto?: string;
    funcao?: string;
    dataIncorporacao?: string;
    localIngresso?: string;
    dataAbertura?: string;
    // Vestuário
    numRegisto?: string;
    efectivoId?: string; 
    tipoFardamento?: string;
    tamanhoBone?: string;
    tamanhoBoina?: string;
    calcadoNum?: string;
    camisaNum?: string;
    calcaNum?: string;
    casacoNum?: string;
    atendente?: string;
    dataEntrega?: string;
}


export interface AutosExpedienteRecord extends DataRecord {
    tipoAuto: string;

    // DADOS DA ESQUADRA
    numeroAuto?: string;
    dataAuto?: string;
    horaAuto?: string;
    servicoDe?: string;
    nomeFuncionario?: string;
    postoPatente?: string;
    esquadra?: string;

    // DADOS DO NOTICIANTE (Auto de Queixa)
    noticianteNomeCompleto?: string;
    noticianteFilhoDe?: string;
    noticianteEDe?: string;
    noticianteNdoBilhete?: string;
    noticianteGenero?: string;
    noticianteNacionalidade?: string;
    noticianteResidente?: string;
    noticianteBairro?: string;
    noticianteProximo?: string;
    noticianteContacto?: string;
    noticianteEstadoCivil?: string;
    noticianteIdade?: string;
    noticianteNatural?: string;
    noticianteRua?: string;
    noticianteProfissao?: string;
    noticianteLocalTrabalho?: string;

    // DADOS DO QUEIXADO (Auto de Queixa)
    queixadoNomeCompleto?: string;
    queixadoNomePai?: string;
    queixadoEDe?: string;
    queixadoNdoBilhete?: string;
    queixadoGenero?: string;
    queixadoNacionalidade?: string;
    queixadoResidente?: string;
    queixadoBairro?: string;
    queixadoProximo?: string;
    queixadoContacto?: string;
    queixadoEstadoCivil?: string;
    queixadoIdade?: string;
    queixadoNacional?: string;
    queixadoRua?: string;
    queixadoProfissao?: string;
    queixadoLocalTrabalho?: string;

    // DADOS DO AUTUADO (Auto de Apreensão / Auto de Notícia)
    autuadoNomeCompleto?: string;
    autuadoFilhoDe?: string;
    autuadoEDe?: string;
    autuadoNdoBilhete?: string;
    autuadoGenero?: string;
    autuadoNacionalidade?: string;
    autuadoResidente?: string;
    autuadoBairro?: string;
    autuadoProximo?: string;
    autuadoContacto?: string;
    autuadoEstadoCivil?: string;
    autuadoIdade?: string;
    autuadoNatural?: string;
    autuadoRua?: string;
    autuadoProfissao?: string;
    autuadoLocalTrabalho?: string;

    // DADOS DO ACUSADO (Auto de Notícia)
    acusadoNomeCompleto?: string;
    acusadoFilhoDe?: string;
    acusadoEDe?: string;
    acusadoNdoBilhete?: string;
    acusadoGenero?: string;
    acusadoNacionalidade?: string;
    acusadoResidente?: string;
    acusadoBairro?: string;
    acusadoProximo?: string;
    acusadoContacto?: string;
    acusadoEstadoCivil?: string;
    acusadoIdade?: string;
    acusadoNatural?: string;
    acusadoRua?: string;
    acusadoProfissao?: string;
    acusadoLocalTrabalho?: string;
    
    // DESCRIÇÃO DOS FACTOS (Comum)
    descricaoFactos?: string;

    // DESCRIÇÃO DOS FACTOS (Auto de Apreensão)
    diaDaSemana?: string;
    horaFactos?: string;
    bairroFactos?: string;
    ruaFactos?: string;
    proximoFactos?: string;

    // DESCRIÇÃO OCORRÊNCIA E MEIO APREENDIDO (Auto de Apreensão)
    descricaoOcorrenciaMeioApreendido?: string;

    // TESTEMUNHAS (Auto de Apreensão / Auto de Notícia)
    testemunha1Nome?: string;
    testemunha1Idade?: string;
    testemunha1Telefone?: string;
    testemunha2Nome?: string;
    testemunha2Idade?: string;
    testemunha2Telefone?: string;

    // AVISO DE NOTIFICAÇÃO
    avisoNotificanteNome?: string;
    avisoCidade?: string;
    avisoBairro?: string;
    avisoTelefone?: string;
    avisoData?: string;
    avisoHora?: string;
}


export interface ProcessosRecord extends DataRecord {
    numeroProcesso?: string;
    dataAbertura?: string;
    tipoProcesso?: string;
    arguido?: string;
    vitima?: string;
    estado?: 'Em instrução' | 'Julgado' | 'Arquivado';
    observacoes?: string;
}