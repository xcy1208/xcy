addBtn.addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedSizeRadio = document.querySelector('input[name="size"]:checked');
  const selectedSize = selectedSizeRadio.value;
  const basePrice = Number(selectedSizeRadio.dataset.price);

  // 計算加購金額
  let optionPrice = 0;
  const selectedOptions = Array.from(optionChecks)
    .filter(c => c.checked)
    .map(c => {
      optionPrice += Number(c.dataset.price);
      return c.value;
    });

  const qty = Number(qtyEl.value);
  const totalPrice = (basePrice + optionPrice) * qty;

  cart.push({
    id: product.id,
    name: product.name,
    size: selectedSize,
    basePrice: basePrice,
    options: selectedOptions,
    optionPrice: optionPrice,   
    qty: qty,
    totalPrice: totalPrice      
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("已加入購物車");
});
