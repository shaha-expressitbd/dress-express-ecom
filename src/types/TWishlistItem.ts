export interface TWishlistItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  currency?: string;
  image: string;
  variantValues: string[];
}
