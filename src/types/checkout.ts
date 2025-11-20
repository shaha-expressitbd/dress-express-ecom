// Checkout form data type
export interface CheckoutFormData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_area: string;
  note: string;
}

// Checkout form errors type
export interface CheckoutFormErrors {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
}

// Order payload type
export interface OrderPayload extends CheckoutFormData {
  products: {
    productId: string;
    quantity: number;
  }[];
  due: string;
  delivery_area: string;
}
