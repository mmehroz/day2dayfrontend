import { useMemo } from "react";

export function formatPrice({
  amount,
  currencyCode,
  locale,
}: {
  amount: number;
  currencyCode: string;
  locale: string;
}) {
  const formatCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  });

  return formatCurrency.format(amount);
}

export function formatVariantPrice({
  amount,
  baseAmount,
  currencyCode,
  locale,
}: {
  baseAmount: number;
  amount: number;
  currencyCode: string;
  locale: string;
}) {
  const hasDiscount = baseAmount > amount;
  const formatDiscount = new Intl.NumberFormat(locale, { style: "percent" });
  const discount_price = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null;

    // trying for coupns
  // const hasCoupon = baseAmount > amount;
  // const formatCoupon = new Intl.NumberFormat(locale, {style:"percent"});
  // const coupon = hasCoupon
  // ? formatCoupon.format((baseAmount -amount) /baseAmount)

  const selling_price = formatPrice({ amount, currencyCode, locale });
  const purchase_price = hasDiscount
    ? formatPrice({ amount: baseAmount, currencyCode, locale })
    : null;

  return { selling_price, purchase_price, discount_price };
}

export default function usePrice(
  data?: {
    amount: number;
    baseAmount?: number;
    currencyCode: string;
  } | null
) {
  const { amount, baseAmount, currencyCode } = data ?? {};
  const locale = "en";
  const value = useMemo(() => {
    if (typeof amount !== "number" || !currencyCode) return "";

    return baseAmount
      ? formatVariantPrice({ amount, baseAmount, currencyCode, locale })
      : formatPrice({ amount, currencyCode, locale });
  }, [amount, baseAmount, currencyCode]);

  return typeof value === "string"
    ? { selling_price: value, purchase_price: null, discount_price: value }
    : value;
}
