import { Product } from "./product";

// export interface TCartItem {
//   productId: Product["variantsId"][number]["_id"];
//   quantity: number;
// }

export interface TCartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
  currency?: string;
  variantValues?: string[];
  variantLabel?: string;
  isPreOrder?: boolean;
}
