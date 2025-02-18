export interface DrogasilApiProductInterface {
  success: boolean;
  data: {
    productBySku: {
      id: number;
      sku: string;
      name: string;
      price_aux: {
        value_to: number;
        lmpm_value_to: number;
        lmpm_qty: number;
      };
      media_gallery_entries: {
        file: string;
      }[];
      liveComposition: {
        liveStock: {
          qty: number;
        };
      };
    };
  };
}
