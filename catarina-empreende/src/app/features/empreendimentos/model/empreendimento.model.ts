export type SegmentoAtuacao =
    | 'Tecnologia'
    | 'Comércio'
    | 'Indústria'
    | 'Serviços'
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
    nomeEmpreendimento: string;
    nomeEmpreendedor: string;
    municipio: string;
    segmentoAtuacao: SegmentoAtuacao;
    contato: string; // E-mail ou meio de contato
    status: StatusEmpreendimento;
    imagens: string[]; // Lista de URLs ou caminhos das imagens
    endereco: Endereco;
    geolocalizacao: Geolocalizacao;
}
