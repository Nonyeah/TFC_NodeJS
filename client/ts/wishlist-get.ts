import {
  navblocks,
  showNavBlock,
  topNavLinks,
  hideNavBlock,
  slideNavMenu,
} from "./header";

import { mobileListInit } from "./mobile";

for (let elem of topNavLinks) {
  elem.addEventListener("click", showNavBlock);
}

for (let elem of navblocks) {
  elem.addEventListener("mouseleave", hideNavBlock);
}

function createWishItemsForGetRequest() {
  const wishlistcontainer = document.querySelector(".wishlist-container");
  const productDataArray = [];
  for (const key in localStorage) {
    if (key.includes("ROC")) {
      const parsedObject = JSON.parse(localStorage[key]);
      productDataArray.push(parsedObject);
    }
  }

  console.log(productDataArray);

  productDataArray.forEach((product) => {
    const productContainer = document.createElement("div") as HTMLDivElement;
    productContainer.className = "wish-item";
    const form = document.createElement("form") as HTMLFormElement;
    form.classList.add("remove-wish-item");
    form.name = product.rocFormName;
    const close = document.createElement("p") as HTMLParagraphElement;
    close.classList.add("close-wish");
    close.innerHTML = "&times;";
    form.appendChild(close);
    const anchor = document.createElement("a") as HTMLAnchorElement;
    if (product.type.toLowerCase() === "bag") {
      anchor.href = `/bags/products/${product.url}`;
    } else if (product.type.toLowerCase() === "jewellery") {
      anchor.href = `/jewellery/products/${product.url}`;
    } else if (product.type.toLowerCase() === "clothing") {
      anchor.href = `/clothing/${product.url}`;
    }
    const img = document.createElement("img") as HTMLImageElement;
    img.src = `${product.image}`;
    img.alt = `${product.type}`;
    anchor.appendChild(img);

    const brand = document.createElement("p") as HTMLParagraphElement;
    const name = document.createElement("p") as HTMLParagraphElement;
    const price = document.createElement("p") as HTMLParagraphElement;
    brand.classList.add("product-brand");
    name.classList.add("product-name");
    price.classList.add("product-price");
    brand.textContent = product.brand;
    name.textContent = product.name;
    price.textContent = product.price ? product.price : product.salePrice;

    const form2 = document.createElement("form") as HTMLFormElement;
    form2.action = "https://www.romancart.com/cart.asp";
    form2.method = "post";
    form2.name = `${product.rocFormName}`;
    form2.target = "ROC_dCTarget";
    form2.onsubmit = (e: Event) => "ROC_fnDropCart();";

    const input1 = document.createElement("input") as HTMLInputElement;
    input1.type = "hidden";
    input1.name = "minicart";
    input1.value = "yes";
    const input2 = document.createElement("input") as HTMLInputElement;
    input2.type = "hidden";
    input2.name = "storeid";
    input2.value = "60667";
    const input3 = document.createElement("input") as HTMLInputElement;
    input3.type = "hidden";
    input3.name = "itemcode";
    input3.value = `${product.ItemCode}`;
    const button = document.createElement("button") as HTMLButtonElement;
    button.type = "submit";
    button.classList.add("move-to-cart");
    button.textContent = "move to cart";
    form2.append(input1, input2, input3, button);
    productContainer.append(form, anchor, brand, name, price, form2);
    if (wishlistcontainer) wishlistcontainer.append(productContainer);
  });
}

export function showModelPicInit() {
  const wishItemArray: NodeListOf<HTMLDivElement> =
    document.querySelectorAll(".wish-item");

  const showModelPic = (e: Event) => {
    const target = e.target as HTMLElement;

    if (target) {
      let image = target.closest("img");
      if (!image) return;
      let str = image.src;
      str = str.slice(0, str.lastIndexOf("_"));
      str = `${str}_model_big.jpg`;
      image.src = str;
    }
  };

  const hideModelPic = (e: Event) => {
    const target = e.target as HTMLElement;

    if (target) {
      let image = target.closest("img");
      if (!image) return;
      let str = image.src;
      str = str.slice(0, str.lastIndexOf("model"));
      str = `${str}big.jpg`;
      image.src = str;
    }
  };

  for (let elem of wishItemArray)
    elem.addEventListener("mouseover", showModelPic);
  for (let elem of wishItemArray) {
    elem.addEventListener("mouseout", hideModelPic);
  }
}

export function removeWishItemInit() {
  const closeX: NodeListOf<HTMLParagraphElement> =
    document.querySelectorAll(".close-wish");
  const wishlistContainer = document.querySelector(".wishlist-container")!;

  const removeWishItem = (e: Event) => {
    const target = e.target as HTMLParagraphElement;
    const form = target.parentElement as HTMLFormElement;
    const attr: string = form.getAttribute("name")!;
    if (attr) localStorage.removeItem(attr);
    if (target) {
      const div = target.closest("div")?.remove();
    }
    const remainingWishes: NodeListOf<HTMLDivElement> =
      document.querySelectorAll(".wish-item")!;
    if (!remainingWishes.length) {
      window.location.href = "/wishlist-empty";
    }
  };

  for (let elem of closeX) {
    elem.addEventListener("click", removeWishItem);
  }
}


slideNavMenu();
mobileListInit();
createWishItemsForGetRequest();
removeWishItemInit();
showModelPicInit();
