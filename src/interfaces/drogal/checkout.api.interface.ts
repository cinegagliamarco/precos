export interface DrogalCheckoutApiResponse {
  status: number;
  body: {
    status: string;
    pickupPointItems: PickupPointItem[];
  };
}

interface PickupPointItem {
  CodigoFilial: number;
  Filial: string;
  AtendeCarrinho: string;
  Endereco: string;
  Numero: string;
  Bairro: string;
  Cidade: string;
  Uf: string;
  Latitude: number;
  Longitude: number;
  Cep: string;
  PontoReferencia: string;
  PrevisaoEntrega: string;
  TempoEntregaHoras: number;
  Frete: number;
  Tipo: null;
  CartDetail: CartDetailItem[];
}

interface CartDetailItem {
  productRefId: number;
  quantityRequest: number;
  quantityAvaliable: number;
  avaliable: boolean;
}