// lib/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import { baseApi } from "./api/baseApi";
import { publicApi } from "./api/publicApi";

import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";
import preorderCartReducer from "./features/preOrderCartSlice/preOrderCartSlice";
import sidebarReducer from "./features/sidebar/sidebarSlice";
import themeReducer from "./features/theme/themeSlice";
import { wishlistReducer } from "./features/wishlist/wishlistSlice";
/* 1️⃣  কম্বাইন্ড রিডিউসার */

const combinedReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [publicApi.reducerPath]: publicApi.reducer,

  auth: authReducer,
  cart: cartReducer,
  preorderCart: preorderCartReducer,
  sidebar: sidebarReducer,
  theme: themeReducer,
  wishlist: wishlistReducer,
});

/* Next.js hydration guard */
const rootReducer = (state: any, action: any) => {
  // Get the initial state structure to know valid keys
  const initialState = combinedReducer(undefined, { type: "@@INIT" });
  const knownKeys = Object.keys(initialState);

  let newState;
  if (action.type === HYDRATE || action.type === REHYDRATE) {
    // Filter action.payload to only include known keys (only if payload exists)
    const filteredPayload = action.payload
      ? Object.fromEntries(
          Object.entries(action.payload).filter(([key]) =>
            knownKeys.includes(key)
          )
        )
      : {};
    newState = { ...state, ...filteredPayload };
  } else {
    newState = combinedReducer(state, action);
  }

  // Always filter the resulting state to remove any unexpected keys
  if (!newState) return combinedReducer(undefined, { type: "@@INIT" });

  return Object.fromEntries(
    Object.entries(newState).filter(([key]) => knownKeys.includes(key))
  ) as ReturnType<typeof combinedReducer>;
};

/* 2️⃣  redux‑persist শুধু ব্রাউজারে অ্যাক্টিভ */

const isBrowser = typeof window !== "undefined";

let finalReducer = rootReducer;
let persistStoreFn: ((store: AppStore) => void) | null = null;

if (isBrowser) {
  // require‑কে client‑side এ রাখলে SSR‑এ bundle clean থাকে
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { persistReducer, persistStore } = require("redux-persist");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const storage = require("redux-persist/lib/storage").default;

  const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "theme", "cart", "preorderCart", "wishlist"],
  };

  finalReducer = persistReducer(persistConfig, rootReducer);
  persistStoreFn = persistStore;
}

/* 3️⃣  স্টোর ফ্যাক্টরি */

export const makeStore = () => {
  const store = configureStore({
    reducer: finalReducer,
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            HYDRATE,
          ],
        },
      }).concat(baseApi.middleware, publicApi.middleware),
  });

  // ব্রাউজারে persist চালু করি
  if (isBrowser && persistStoreFn) {
    // @ts-expect-error – PersistGate এর জন্য হাইড করে রাখছি
    store.__persistor = persistStoreFn(store);
  }

  return store;
};

/* ⭐️ এই লাইনটাই আসল — makeStore একবারই কল করে ১টা store বানালাম */
export const store = makeStore();

/* টাইপস + wrapper */
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;

/* wrapper‑এ নতুন store বানানোর দরকার নেই, সেই singleton রিটার্ন করুন */
export const wrapper = createWrapper<AppStore>(() => store, { debug: false });
