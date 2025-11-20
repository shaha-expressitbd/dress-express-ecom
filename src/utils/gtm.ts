// gtm.ts
import { TCartItem } from "@/lib/features/cart/cartSlice";
import type { Product, Variant } from "@/types/product";

interface GtmEcommerceItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  price: number;
  currency: string;
  quantity?: number;
  item_variant?: string;
  item_list_name?: string;
  item_list_id?: string;
  index?: number;
}

export function buildGtmItem(
  product: Product,
  variant?: Variant | null,
  quantity: number = 1,
  listName?: string,
  listId?: string,
  index?: number
): GtmEcommerceItem {
  const price =
    variant?.selling_price ?? product.variantsId?.[0]?.selling_price;
  const itemName = variant ? `${product.name} - ${variant.name}` : product.name;

  // Get additional context
  const userContext = getUserContext();
  const utmParams = getUtmParams();

  return {
    item_id: variant?._id ?? product._id,
    item_name: itemName,
    item_brand: product.brand?.name,
    item_category: product.sub_category?.[0]?.name,
    price: Number(price) || 0,
    currency: product.currency,
    quantity,
    item_variant: variant?.name,
    ...(listName && { item_list_name: listName }),
    ...(listId && { item_list_id: listId }),
    ...(typeof index === "number" && { index }),
    // Add contextual data
    ...userContext,
    ...(Object.keys(utmParams).length > 0 && { utm_params: utmParams }),
  };
}

// Enhanced event tracking functions
// export const trackEvent = (
//   eventName: string,
//   eventData: Record<string, any> = {},
//   requireConsent: boolean = true
// ) => {
//   if (typeof window === "undefined" || !window.dataLayer) return;

//   // Skip if consent is required but not given
//   if (requireConsent && !hasTrackingConsent()) return;

//   // Clear previous ecommerce object for GA4 compatibility
//   if (eventData.ecommerce) {
//     window.dataLayer.push({ ecommerce: null });
//   }

//   window.dataLayer.push({
//     event: eventName,
//     ...eventData,
//   });
// };

// Enhanced event tracking with context
export const trackEvent = (
  eventName: string,
  eventData: Record<string, any> = {},
  requireConsent: boolean = false
) => {
  if (typeof window === "undefined" || !window.dataLayer) return;

  if (requireConsent && !hasTrackingConsent()) return;

  // Clear previous ecommerce object
  if (eventData.ecommerce) {
    window.dataLayer.push({ ecommerce: null });
  }

  // Add contextual data
  const context = {
    ...getUserContext(),
    page_data: {
      url: window.location.href,
      path: window.location.pathname,
      search: window.location.search,
      title: document.title,
      referrer: document.referrer,
    },
    timestamp: new Date().toISOString(),
  };

  window.dataLayer.push({
    event: eventName,
    ...context,
    ...eventData,
  });
};

// Specific event helpers
export const trackPageView = (path: string) => {
  trackEvent("page_view", {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
};

export const trackProductView = (
  product: Product,
  variant?: Variant | null
) => {
  const item = buildGtmItem(product, variant);

  // Only track if we have a valid product
  if (!product) return;

  trackEvent("view_item", {
    ecommerce: {
      currency: product.currency,
      value: item.price * (item.quantity || 1), // Calculate total value
      items: [item],
    },
  });
};

export const trackAddToCart = (item: TCartItem) => {
  trackEvent("add_to_cart", {
    ecommerce: {
      currency: item.currency,
      value: item.price * item.quantity,
      items: [
        {
          item_id: item._id,
          item_name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          item_variant: item.variantLabel,
          currency: item.currency,
        },
      ],
    },
  });
};

export const trackRemoveFromCart = (item: TCartItem) => {
  trackEvent("remove_from_cart", {
    ecommerce: {
      currency: item.currency,
      value: item.price * item.quantity,
      items: [
        {
          item_id: item._id,
          item_name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          item_variant: item.variantLabel,
          currency: item.currency,
        },
      ],
    },
  });
};

export const trackBeginCheckout = (items: TCartItem[], totalValue: number) => {
  trackEvent("begin_checkout", {
    ecommerce: {
      currency: items[0]?.currency,
      value: totalValue,
      items: items.map((item) => ({
        item_id: item._id,
        item_name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        item_variant: item.variantLabel,
        currency: item.currency,
      })),
    },
  });
};

export const trackPurchase = (
  transactionId: string,
  items: TCartItem[],
  totalValue: number,
  shippingValue: number = 0,
  customerName: string,
  customerPhone?: string,
  deliveryArea?: string,
  deliveryAddress?: string,
  paymentMethod?: string,
  coupon?: string
) => {
  if (!items.length) {
    console.error("No items provided for purchase tracking");
    return;
  }
  const utms = getUtmParams();
  trackEvent("purchase", {
    ...(Object.keys(utms).length ? { utm: utms } : {}),
    ecommerce: {
      transaction_id: transactionId,
      value: totalValue,
      tax: 0, // Add if available
      shipping: shippingValue,
      currency: items[0]?.currency,
      coupon: coupon,
      payment_method: paymentMethod,
      customer_details: {
        name: customerName,
        phone: customerPhone,
        delivery_area: deliveryArea,
        delivery_address: deliveryAddress,
      },
      items: items.map((item) => ({
        item_id: item._id,
        item_name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        item_variant: item.variantLabel,
        currency: item.currency || "BDT",
      })),
    },
  });
};

export const trackUpdateItemQuantity = (
  item: TCartItem,
  newQuantity: number
) => {
  trackEvent("update_item_quantity", {
    ecommerce: {
      currency: item.currency,
      value: item.price * newQuantity,
      items: [
        {
          item_id: item._id,
          item_name: item.name,
          price: Number(item.price),
          quantity: newQuantity,
          item_variant: item.variantLabel,
          currency: item.currency,
        },
      ],
    },
  });
};

export const trackViewRelatedItemList = (
  items: GtmEcommerceItem[],
  listId: string,
  listName: string = "Related Products"
) => {
  trackEvent("view_related_item_list", {
    ecommerce: {
      item_list_id: listId,
      item_list_name: listName,
      items: items,
    },
  });
};
// Consent management utilities
export const hasTrackingConsent = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("tracking_consent") === "granted";
  } catch {
    return false;
  }
};

export const setTrackingConsent = (
  granted: boolean,
  settings = {
    analytics: true,
    advertising: true,
    functional: true,
  }
) => {
  try {
    localStorage.setItem("tracking_consent", granted ? "granted" : "denied");

    // Update GTM consent settings
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "consent_update",
        analytics_storage: settings.analytics && granted ? "granted" : "denied",
        ad_storage: settings.advertising && granted ? "granted" : "denied",
        functionality_storage:
          settings.functional && granted ? "granted" : "denied",
      });

      // Also update via gtag if available
      if (window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage:
            settings.analytics && granted ? "granted" : "denied",
          ad_storage: settings.advertising && granted ? "granted" : "denied",
          functionality_storage:
            settings.functional && granted ? "granted" : "denied",
        });
      }
    }

    // Track the consent event
    trackEvent(
      granted ? "consent_granted" : "consent_denied",
      {
        consent_settings: settings,
      },
      false
    ); // Don't require consent to track consent events

    return true;
  } catch (e) {
    console.error("Failed to set tracking consent:", e);
    return false;
  }
};

// UTM Parameter Storage
export function storeUtmParams() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ].forEach((key) => {
    const val = params.get(key);
    if (val) localStorage.setItem(key, val);
  });
}

export function getUtmParams() {
  if (typeof window === "undefined") return {};
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  const utms: Record<string, string> = {};
  keys.forEach((key) => {
    const val = localStorage.getItem(key);
    if (val) utms[key] = val;
  });
  return utms;
}

// Enhanced user context collection
export function getUserContext(): Record<string, any> {
  if (typeof window === "undefined") return {};

  const screen = window.screen;
  const navigator = window.navigator;
  const connection = (window as any).connection;

  return {
    device_data: {
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      color_depth: screen.colorDepth,
      device_pixel_ratio: window.devicePixelRatio || 1,
      browser_language: navigator.language,
      languages: navigator.languages,
      user_agent: navigator.userAgent,
      device_memory: (navigator as any).deviceMemory,
      hardware_concurrency: (navigator as any).hardwareConcurrency,
      connection_type: connection?.effectiveType,
      save_data: connection?.saveData,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      do_not_track: navigator.doNotTrack === "1",
    },
    timing_data: {
      time_since_page_load: performance.now(),
      navigation_type: (() => {
        const navEntry = performance.getEntriesByType("navigation")[0];
        // The type property is only available on PerformanceNavigationTiming, not generic PerformanceEntry
        // Defensive check for type safety
        if (navEntry && "type" in navEntry) {
          return (navEntry as PerformanceNavigationTiming).type;
        }
        return undefined;
      })(),
    },
  };
}
