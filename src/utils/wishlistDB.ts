/* src/utils/wishlistDB.ts ------------------------------------------------- */
/* All reads / writes are no‑ops when window is undefined (SSR) */

export interface WishlistEntry {
  id: string; // 👉 keep the simple `id` like your first code
  name: string;
  image: string;
}

const KEY = "wishlist";

const safe = () => typeof window !== "undefined";

const read = (): WishlistEntry[] =>
  safe() ? JSON.parse(localStorage.getItem(KEY) || "[]") : [];

const write = (items: WishlistEntry[]) => {
  if (safe()) localStorage.setItem(KEY, JSON.stringify(items));
};

export const getWishlist = async () => read();

export const addWishlistItem = async (item: WishlistEntry) => {
  const list = read();
  if (!list.some((i) => i.id === item.id)) {
    write([...list, item]);
  }
};

export const removeWishlistItem = async (id: string) => {
  write(read().filter((i) => i.id !== id));
};
