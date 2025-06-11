const EXCHANGE_RATE = 6.5;

export const convertPrice = (price: number): number => {
  return price / EXCHANGE_RATE;
};

export const formatPrice = (price: number): string => {
  return `$${convertPrice(price).toFixed(2)}`;
}; 