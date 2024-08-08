//リスト内商品の値段の合計を算出する
export const handleTotalPriceCalculation = (list) => {
  const calculationPrice = list.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  return calculationPrice;
};
