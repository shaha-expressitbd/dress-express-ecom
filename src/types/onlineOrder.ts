export interface OnlineOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_area: string;
  customer_note?: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  additional_discount_type?: string;
  additional_discount_amount?: string;
  due: string;
  payment_method: string;
}

export interface OnlineOrderResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    message: string;
    orderId: string;
    _id: string;
    selectedGatewayUrl?: string;
    allGatewayUrl?: string;
  };
}
