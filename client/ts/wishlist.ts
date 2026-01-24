//product page add to wishlist most of the functions in this module are exported into products.ts
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


export function wishlist() {
  const button: HTMLButtonElement | null = document.getElementById(
    "add-to-wishlist"
  ) as HTMLButtonElement | null;

  const yourWishlist = document.getElementById(
    "send-wish-list"
  ) as HTMLButtonElement;

  const topNav = document.querySelector(".topnav")! as HTMLDivElement;
  const mobileNavMenu = document.querySelector(
    ".mobile-nav-menu"
  )! as HTMLDivElement;

  const productObjectName = document.querySelector(
    ".product-name"
  ) as HTMLParagraphElement;
  const productObjectBrand = document.querySelector(
    ".product-brand"
  ) as HTMLParagraphElement;
  const productObjectPrice = document.querySelector(".product-price") as
    | HTMLParagraphElement
    | undefined;
  const productWasObjectPrice = document.querySelector(
    ".product-price-sale"
  ) as HTMLParagraphElement | undefined;
  const productObjectSalePrice = document.querySelector(".sale-price") as
    | HTMLSpanElement
    | undefined;
  const productObjectType = document.querySelector(
    ".hidden-attribute1"
  ) as HTMLSpanElement;
  const productObjectURL = document.querySelector(
    ".hidden-attribute2"
  ) as HTMLSpanElement;
  const productObjectImage = document.getElementById(
    "big-image"
  ) as HTMLImageElement;

  function addToWishlist(this: HTMLButtonElement, e: Event) {
    e.stopPropagation();
    const form = this.parentElement! as HTMLFormElement;
    const rocFormName = form.getAttribute("name")!;
    const ItemCode = (form.elements[2] as HTMLInputElement).value;

    const productObject = {
      brand: productObjectBrand.textContent,
      name: productObjectName.textContent,
      price: productObjectPrice ? productObjectPrice.textContent : "",
      preSalePrice: productWasObjectPrice
        ? productWasObjectPrice.textContent
        : "",
      salePrice: productObjectSalePrice
        ? productObjectSalePrice.textContent
        : "",
      type: productObjectType.getAttribute("data-productType"),
      url: productObjectURL.getAttribute("data-urlName"),
      image: productObjectImage.src,
      rocFormName,
      ItemCode,
    };

    localStorage.setItem(rocFormName, JSON.stringify(productObject));
    const itemAddedTab = document.createElement("span");
    itemAddedTab.textContent = "Item Added To Your Wishlist";
    itemAddedTab.classList.add("item-added-tab");
    if (!(yourWishlist.firstElementChild as HTMLElement).style.color) {
      (yourWishlist.firstElementChild as HTMLElement).style.color = "#ff0000";
    }

    //append item added tab for desktop site
    if (topNav.getBoundingClientRect().bottom) {
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        topNav.after(itemAddedTab);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        itemAddedTab.remove();
      })();
    } else if (mobileNavMenu.getBoundingClientRect().bottom) {
      //append item added tab for mobile site
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        mobileNavMenu.after(itemAddedTab);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        itemAddedTab.remove();
      })();
    }
  }

  if (button) button.addEventListener("click", addToWishlist);
}

export const createWishControls = () => {
  const form: HTMLFormElement | undefined = document.getElementById(
    "form-wishlist"
  ) as HTMLFormElement;
  const extractKeys = Object.keys(localStorage);
  const ROCWishlistArray = extractKeys.filter((key) => key.includes("ROC"));
  if (!ROCWishlistArray.length) return false;

  ROCWishlistArray.forEach((wish) => {
    const input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "mywish");
    input.setAttribute("value", wish);
    if (form) form.prepend(input);
  });

  return true;
};

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

//single function for empty wishlist ejs template only all other functions contained
//within this module are exported to products.ts
function continueShoppingInit() {
  const back = document.querySelector(
    "#continue-shopping"
  ) as HTMLButtonElement;

  const continueShopping = () => {
    window.location.href = "/";
  };

  if (back) back.addEventListener("click", continueShopping);
}

mobileListInit();
slideNavMenu();

document.addEventListener("DOMContentLoaded", continueShoppingInit);
