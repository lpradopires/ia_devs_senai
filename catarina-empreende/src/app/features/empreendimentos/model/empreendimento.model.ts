export type SegmentoAtuacao =
    | 'Tecnologia'
    | 'Comércio'
    | 'Indústria'
    | 'Serviços'
    | 'Serviço Público'
    | 'Agronegócio';

export type StatusEmpreendimento = 'ativo' | 'inativo';

export interface Endereco {
    cep?: string;
    logradouro: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
}

export interface Geolocalizacao {
    latitude: number;
    longitude: number;
}

export interface Empreendimento {
    id?: string;
    dataCriacao?: number; // Timestamp Unix em ms (Date.now()) — usado para ordenação
    nomeEmpreendimento: string;
    descricao: string; // Descrição curta das atividades ou propósito
    nomeEmpreendedor: string;
    municipio: string;
    segmentoAtuacao: SegmentoAtuacao;
    contato: string; // E-mail ou meio de contato
    whatsapp: string; // Número de WhatsApp
    status: StatusEmpreendimento;
    imagens: string[]; // Lista de URLs ou caminhos das imagens
    endereco: Endereco;
    geolocalizacao: Geolocalizacao;
}
