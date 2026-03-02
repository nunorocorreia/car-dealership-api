export interface Sale {
  id: string;
  carId: string;
  leadId?: string | null;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  salePrice: number;
  soldAt: string;
}

export interface CreateSaleInput {
  carId: string;
  leadId?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  salePrice: number;
}
