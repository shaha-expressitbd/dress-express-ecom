"use client";


import { Button } from "@/components/ui/atoms/button";
import { useBusiness } from "@/hooks/useBusiness";
import { useCart } from "@/hooks/useCart";
import { usePreorderCart } from "@/hooks/usePreorderCart";
import { useCreateOnlineOrderWithSSLMutation } from "@/lib/api/publicApi";
import { formatCurrency } from "@/utils/formatCurrency";
import { normalizePhone } from "@/utils/normalizePhone";
import { trackBeginCheckout, trackPurchase } from "@/utils/gtm";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CartSummary } from "./_components/CartSummary";
import DeliveryInfoForm from "./_components/DeliveryInfoForm";


interface FormData {
  name: string;
  phone: string;
  address: string;
  delivery_area: string;
  note: string;
  paymentMethod: string;
}

interface FormErrors {
  name: string;
  phone: string;
  address: string;
  delivery_area: string;
  note: string;
}

interface PaymentMethod {
  name: string;
  logo: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { businessData } = useBusiness();
  const { items, clearCart, removeItem, updateItemQuantity } = useCart();
  const { item: preorderItem, clearCart: clearPreorderCart, updateItemQuantity: updatePreorderQuantity } = usePreorderCart();
  const [createOnlineOrderWithSSL, { isLoading: isOrderLoading }] = useCreateOnlineOrderWithSSLMutation();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    delivery_area: "",
    note: "",
    paymentMethod: "cashOnDelivery", // Default to COD
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    phone: "",
    address: "",
    delivery_area: "",
    note: "",
  });

  const [additional_discount_amount, setAdditionalDiscountAmount] = useState(0);

  // Determine available payment methods
  const availablePaymentMethods = useMemo<PaymentMethod[]>(() => {
    if (businessData?.ssl_commerz?.account_id && businessData?.ssl_commerz?.isActive_SSLCommerz) {
      if (businessData.ssl_commerz.payment_methods.length > 0) {
        return businessData.ssl_commerz.payment_methods;
      }
      // If payment_methods is empty but account_id and isActive_SSLCommerz are true, add generic ssl option
      return [{ name: "Pay Now", logo: "/assets/payOnline.jpg" }]; // Adjust logo path as needed
    }
    return [];
  }, [businessData]);

  useEffect(() => {
    if (formData.paymentMethod === "bKash") {
      setAdditionalDiscountAmount(100);
    } else {
      setAdditionalDiscountAmount(0);
    }
  }, [formData.paymentMethod]);

  const currency = businessData?.currency?.[0] ?? "BDT";

  const deliveryCharge = useMemo(() => {
    if (!businessData) return 0;
    switch (formData.delivery_area) {
      case "inside_dhaka":
        return businessData.insideDhaka;
      case "sub_dhaka":
        return businessData.subDhaka;
      case "outside_dhaka":
        return businessData.outsideDhaka;
      default:
        return 0;
    }
  }, [formData.delivery_area, businessData]);

  const cartItems = preorderItem ? [preorderItem] : items;
  const isPreorder = !!preorderItem;

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const total = useMemo(
    () => subtotal + deliveryCharge - additional_discount_amount,
    [subtotal, deliveryCharge, additional_discount_amount]
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/");
    }
    trackBeginCheckout(items, total);
  }, [cartItems, total, router]);

  const validateForm = () => {
    const errors: FormErrors = {
      name: "",
      phone: "",
      address: "",
      delivery_area: "",
      note: "",
    };
    let hasError = false;

    if (!formData.name.trim()) {
      errors.name = "সর্বনিম্ন ৩ অক্ষরের নাম দিন";
      hasError = true;
    } else if (formData.name.trim().length < 3) {
      errors.name = "সর্বনিম্ন ৩ অক্ষরের নাম দিন";
      hasError = true;
    }
    if (!formData.phone.trim()) {
      errors.phone = "আপনার ফোন নাম্বার দিন";
      hasError = true;
    } else if (!/^01\d{9}$/.test(formData.phone)) {
      errors.phone = "সঠিক ফোন নাম্বার দিন (01xxxxxxxxx, বাংলা ডিজিট গ্রহণযোগ্য না)";
      hasError = true;
    }
    if (!formData.address) {
      errors.address = "আপনার ঠিকানা দিন";
      hasError = true;
    } else if (formData.address.trim().length < 10) {
      errors.address = "ডেলিভারি ঠিকানা কমপক্ষে ১০ অক্ষরের হতে হবে";
      hasError = true;
    }
    if (!formData.delivery_area) {
      errors.delivery_area = "ডেলিভারি এলাকা নির্বাচন করুন";
      hasError = true;
    }
    if (formData.note && formData.note.length < 5) {
      errors.note = "নোট কমপক্ষে ৫ অক্ষরের হতে হবে";
      hasError = true;
    }

    setFormErrors(errors);
    return hasError;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let normalizedValue = value;
    if (name === "phone") {
      normalizedValue = normalizePhone(value);
    }
    setFormData((prev) => ({ ...prev, [name]: normalizedValue }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const getBackendPaymentMethod = (frontendMethod: string) => {
    switch (frontendMethod) {
      case "cashOnDelivery":
        return "cod";
      case "Pay Now":
        return "ssl";
      // case "bKash":
      // case "Nagad":
      // case "VISA":
      // case "MASTER":
      // case "AMEX":
      // case "AMEX-City Bank":
      // case "VISA-City Bank":
      // case "MASTER-City bank":
      // case "VISA-Eastern Bank Limited":
      // case "MASTER-Eastern Bank Limited":
      // case "QCash":
      // case "Fast Cash":
      // case "DBBL Mobile Banking":
      // case "AB Direct":
      // case "IBBL":
      // case "Citytouch":
      // case "MTBL":
      // case "Bank Asia":
      // case "TAP":
      // case "upay":
      // case "okaywallet":
      // case "cellfine":
      // case "mcash":
      // case "tapnpay":
      // case "eblsky":
      // case "instapay":
      // case "pmoney":
      // case "woori":
      // case "modhumoti":
      // case "fsibl":
      //   return frontendMethod;
      default:
        return frontendMethod;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) return;

    const backendPaymentMethod = getBackendPaymentMethod(formData.paymentMethod);

    if (!backendPaymentMethod) {
      toast.error("অবৈধ পেমেন্ট পদ্ধতি");
      return;
    }

    const orderPayload = {
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_address: formData.address,
      delivery_area: formData.delivery_area,
      customer_note: formData.note || undefined,
      products: cartItems.map((item: any) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      additional_discount_type: additional_discount_amount > 0 ? "fixed" : undefined,
      additional_discount_amount:
        additional_discount_amount > 0
          ? additional_discount_amount.toString()
          : undefined,
      due: total.toString(),
      payment_method: backendPaymentMethod,
    };

    try {
      const response = await createOnlineOrderWithSSL(orderPayload).unwrap();
      if (response.success) {
        const orderId = response.data?.orderId;
        sessionStorage.setItem(`orderId-${orderId}`, JSON.stringify(cartItems) || "");
        isPreorder ? clearPreorderCart() : clearCart();
        trackPurchase(
          response.data._id,
          items,
          total,
          deliveryCharge,
          formData.name,
          formData.phone,
          formData.address,
          formData.delivery_area,
          formData.paymentMethod,
          formData.note
        );

        if (formData.paymentMethod === "cashOnDelivery") {
          const backendOrderId = response.data?._id;
          const successUrl = new URL("/orderstatus", window.location.origin);
          successUrl.searchParams.set("status", "success");
          successUrl.searchParams.set("orderId", orderId);
          successUrl.searchParams.set("_id", backendOrderId);
          successUrl.searchParams.set(
            "customerName",
            encodeURIComponent(formData.name)
          );
          successUrl.searchParams.set(
            "customerPhone",
            encodeURIComponent(formData.phone)
          );
          successUrl.searchParams.set(
            "customerAddress",
            encodeURIComponent(formData.address)
          );
          successUrl.searchParams.set("total", total.toString());
          successUrl.searchParams.set("deliveryCharge", deliveryCharge.toString());
          successUrl.searchParams.set("itemCount", cartItems.length.toString());
          successUrl.searchParams.set("paymentMethod", "cashOnDelivery");
          successUrl.searchParams.set(
            "additionalDiscount",
            additional_discount_amount.toString()
          );
          cartItems.forEach((item: any, index: number) => {
            successUrl.searchParams.set(
              `itemName${index}`,
              encodeURIComponent(item.name)
            );
            successUrl.searchParams.set(`itemPrice${index}`, item.price.toString());
            successUrl.searchParams.set(`itemQty${index}`, item.quantity.toString());
          });
          // console.log(successUrl.toString());
          // router.push(successUrl.toString());
          window.location.href = successUrl.toString();
          toast.success("অর্ডার সফলভাবে স্থাপন করা হয়েছে!");
        } else {
          const gatewayUrl =
            response?.data?.selectedGatewayUrl || response?.data?.allGatewayUrl;
          if (gatewayUrl) {
            window.location.href = gatewayUrl;
          } else {
            toast.error("পেমেন্ট গেটওয়ে অনুপলব্ধ");
          }
        }
      } else {
        toast.error(response.message || "অর্ডার তৈরি ব্যর্থ হয়েছে");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "একটি ত্রুটি ঘটেছে");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 relative">
      {isOrderLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="animate-spin h-16 w-16 border-4 border-white border-t-transparent rounded-full" />
        </div>
      )}

      <div className="bg-primary dark:bg-primary shadow-sm border-b hidden lg:block ">
        <div className="container lg:mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-white dark:text-white text-center">
            চেকআউট
          </h1>
          <p className="text-white dark:text-white text-center mt-2">
            আপনার অর্ডার সম্পূর্ণ করুন
          </p>
        </div>
      </div>


      <div className="w-full container lg:mx-auto max-w-7xl lg:px-4 lg:py-10">
        <div className="flex flex-col lg:flex-row lg:gap-8 gap-4">
          <DeliveryInfoForm
            formData={formData}
            formErrors={formErrors}
            insideFee={businessData?.insideDhaka || 0}
            subDhakaFee={businessData?.subDhaka || 0}
            outsideFee={businessData?.outsideDhaka || 0}
            isLoading={isOrderLoading}
            handleChange={handleChange}
            handlePaymentMethodChange={handlePaymentMethodChange}
            handleSubmit={handleSubmit}
            onBack={() => router.back()}
            availablePaymentMethods={availablePaymentMethods}
          />
          <CartSummary
            items={cartItems}
            deliveryCharge={deliveryCharge}
            total={total}
            currency={currency}
            additional_discount_amount={additional_discount_amount}
            setDiscount={setAdditionalDiscountAmount}
            removeItem={removeItem}
            updateItemQuantity={updateItemQuantity}
            isLoading={isOrderLoading}
            handleSubmit={handleSubmit}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white dark:bg-gray-900 shadow-2xl border-t-2 border-gray-100 px-4 py-4 z-[9999] safe-area-inset-bottom">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-white mb-1">
                <span>সাবটোটাল:</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-white mb-1">
                <span>ডেলিভারি চার্জ:</span>
                <span>{formatCurrency(deliveryCharge, currency)}</span>
              </div>
              {additional_discount_amount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400 mb-1">
                  <span>ডিসকাউন্ট:</span>
                  <span>[&minus;] {formatCurrency(additional_discount_amount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white pt-2 border-t">
                <span>মোট:</span>
                <span className="text-indigo-600">{formatCurrency(total, currency)}</span>
              </div>
            </div>
            <Button
              title="order"
              type="submit"
              disabled={isOrderLoading}
              variant="gradient"
              className="w-full"
            >
              {isOrderLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  প্রসেস হচ্ছে...
                </div>
              ) : (
                <>
                  <span className="mr-2">🛒</span> অর্ডারটি নিশ্চিত করুন
                </>
              )}
            </Button>
          </div>
        </form>
      </div>


    </div>
  );
}