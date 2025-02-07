export interface DrogalApiProductInterface {
  productId: string;
  productName: string;
  brand: string;
  brandId: number;
  brandImageUrl: any;
  linkText: string;
  productReference: string;
  productReferenceCode: string;
  categoryId: string;
  productTitle: string;
  metaTagDescription: string;
  releaseDate: string;
  clusterHighlights: ClusterHighlights;
  productClusters: ProductClusters;
  searchableClusters: SearchableClusters;
  categories: string[];
  categoriesIds: string[];
  link: string;
  'Descrição Marketplace': string[];
  Indicação: string[];
  BloqueioVenda: string[];
  Contraindicação: string[];
  'Reações Adversas': string[];
  'Como Usar': string[];
  SimilarFoto: string[];
  Bula: string[];
  'Parte do Corpo': string[];
  'Especificacoes Gerais': string[];
  allSpecifications: string[];
  allSpecificationsGroups: string[];
  description: string;
  items: Item[];
}

export interface ClusterHighlights {}

export interface ProductClusters {
  '153': string;
  '155': string;
  '160': string;
  '165': string;
  '183': string;
  '187': string;
  '197': string;
  '209': string;
  '238': string;
  '240': string;
  '241': string;
  '247': string;
  '249': string;
}

export interface SearchableClusters {
  '153': string;
  '155': string;
  '238': string;
}

export interface Item {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId: ReferenceId[];
  measurementUnit: string;
  unitMultiplier: number;
  modalType: string;
  isKit: boolean;
  images: Image[];
  sellers: Seller[];
  Videos: any[];
  estimatedDateArrival: any;
}

export interface ReferenceId {
  Key: string;
  Value: string;
}

export interface Image {
  imageId: string;
  imageLabel: string;
  imageTag: string;
  imageUrl: string;
  imageText: string;
  imageLastModified: string;
}

export interface Seller {
  sellerId: string;
  sellerName: string;
  addToCartLink: string;
  sellerDefault: boolean;
  commertialOffer: CommertialOffer;
}

export interface CommertialOffer {
  DeliverySlaSamplesPerRegion: DeliverySlaSamplesPerRegion;
  Installments: any[];
  DiscountHighLight: any[];
  GiftSkuIds: any[];
  Teasers: Teaser[];
  PromotionTeasers: PromotionTeaser[];
  BuyTogether: any[];
  ItemMetadataAttachment: any[];
  Price: number;
  ListPrice: number;
  PriceWithoutDiscount: number;
  FullSellingPrice: number;
  RewardValue: number;
  PriceValidUntil: string;
  AvailableQuantity: number;
  IsAvailable: boolean;
  Tax: number;
  DeliverySlaSamples: DeliverySlaSample[];
  GetInfoErrorMessage: any;
  CacheVersionUsedToCallCheckout: string;
  PaymentOptions: PaymentOptions;
}

export interface DeliverySlaSamplesPerRegion {}

export interface Teaser {
  '<Name>k__BackingField': string;
  '<GeneralValues>k__BackingField': GeneralValuesKBackingField;
  '<Conditions>k__BackingField': ConditionsKBackingField;
  '<Effects>k__BackingField': EffectsKBackingField;
}

export interface GeneralValuesKBackingField {
  CampanhaDrogal: string;
  CestaDrogal: string;
}

export interface ConditionsKBackingField {
  '<MinimumQuantity>k__BackingField': number;
  '<Parameters>k__BackingField': any[];
}

export interface EffectsKBackingField {
  '<Parameters>k__BackingField': any[];
}

export interface PromotionTeaser {
  Name: string;
  GeneralValues: GeneralValues;
  Conditions: Conditions;
  Effects: Effects;
}

export interface GeneralValues {
  CampanhaDrogal: string;
  CestaDrogal: string;
}

export interface Conditions {
  MinimumQuantity: number;
  Parameters: any[];
}

export interface Effects {
  Parameters: any[];
}

export interface DeliverySlaSample {
  DeliverySlaPerTypes: any[];
  Region: any;
}

export interface PaymentOptions {
  installmentOptions: InstallmentOption[];
  paymentSystems: PaymentSystem[];
  payments: any[];
  giftCards: any[];
  giftCardMessages: any[];
  availableAccounts: any[];
  availableTokens: any[];
}

export interface InstallmentOption {
  paymentSystem: string;
  bin: any;
  paymentName: string;
  paymentGroupName: string;
  value: number;
  installments: Installment[];
}

export interface Installment {
  count: number;
  hasInterestRate: boolean;
  interestRate: number;
  value: number;
  total: number;
  sellerMerchantInstallments: SellerMerchantInstallment[];
}

export interface SellerMerchantInstallment {
  id: string;
  count: number;
  hasInterestRate: boolean;
  interestRate: number;
  value: number;
  total: number;
}

export interface PaymentSystem {
  id: number;
  name: string;
  groupName: string;
  validator: any;
  stringId: string;
  template: string;
  requiresDocument: boolean;
  isCustom: boolean;
  description?: string;
  requiresAuthentication: boolean;
  dueDate: string;
  availablePayments: any;
}
