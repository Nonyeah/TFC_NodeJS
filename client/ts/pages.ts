import { mobileListInit } from "./mobile";
import {
  navblocks,
  showNavBlock,
  topNavLinks,
  hideNavBlock,
  slideNavMenu,
} from "./header";
//import { toggleBottomTabInit, showTextInit } from "./footer";
import { productFilter } from "./filterMenu";
import {
  openMobileFilter,
  closeMobileFilter,
  showCategories,
  shiftRight,
  mobileProductFilter,
  closeMobilePriceFilter,
} from "./mobile-filter-menu";

for (let elem of topNavLinks) {
  elem.addEventListener("click", showNavBlock);
}

for (let elem of navblocks) {
  elem.addEventListener("mouseleave", hideNavBlock);
}

const showModelPic = () => {
  const galleryContainer = document.querySelector(
    ".image-gallery-container"
  ) as HTMLDivElement;

  const showMouseImage = (e: Event) => {
    const target = e.target as HTMLElement;
    const img = target.closest("img");
    if (img) {
      const tempUrl: string = img.src;
      const bigIndex: number = tempUrl.lastIndexOf("_");
      let newUrl: string = tempUrl.slice(0, bigIndex + 1);
      newUrl = newUrl + "model_big.jpg";
      img.src = newUrl;
    }
  };

  const hideMouseImage = (e: Event) => {
    const target = e.target as HTMLElement;
    const img = target.closest("img");
    if (img) {
      const tempUrl: string = img.src;
      const modelIndex: number = tempUrl.lastIndexOf("model");
      let newUrl: string = tempUrl.slice(0, modelIndex);
      newUrl = newUrl + "big.jpg";
      img.src = newUrl;
    }
  };

  galleryContainer.addEventListener("mouseover", showMouseImage);
  galleryContainer.addEventListener("mouseout", hideMouseImage);
};

const sortMenu = () => {
  const parentTab = document.querySelector(".sort-menu-desktop-container");
  let prevUl: undefined | HTMLUListElement;
  let prevPara: undefined | HTMLParagraphElement;

  const toggleSame = () => {
    if (prevPara) prevPara.classList.toggle("open");
    prevUl!.style.display == "block"
      ? (prevUl!.style.display = "none")
      : (prevUl!.style.display = "block");
  };

  const toggleDifferent = (
    currentList: HTMLUListElement,
    currentTarget: HTMLParagraphElement
  ) => {
    if (prevUl) prevUl.style.display = "none";
    if (prevPara && prevPara.classList.contains("open")) {
      prevPara.classList.remove("open");
    }
    currentTarget.classList.toggle("open");
    currentList.style.display = "block";
    prevUl = currentList;
    prevPara = currentTarget;
  };

  const showSortMenu = (e: Event) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLLabelElement ||
      e.target instanceof HTMLUListElement ||
      e.target instanceof HTMLLIElement ||
      e.target instanceof HTMLDivElement
    )
      return;
    let target = e.target as HTMLParagraphElement;
    if (target) target = target.closest("p")!;
    const hiddenList = target.nextElementSibling as HTMLUListElement;
    if (prevUl === hiddenList) {
      toggleSame();
    } else if (prevUl !== hiddenList) {
      toggleDifferent(hiddenList, target);
    }
  };

  parentTab?.addEventListener("click", showSortMenu);
};

function sortMenuScrollInit() {
  const topNav = document.querySelector(".topnav") as HTMLElement;
  const sortNav = document.querySelector(
    ".sort-menu-desktop-container"
  ) as HTMLElement;
  const mobileSortNav = document.querySelector(
    ".sort-menu-mobile-container"
  ) as HTMLDivElement;

  const mobilenav = document.querySelector(".mobile-nav-menu") as HTMLElement;
  const scrollDiff: number = sortNav.getBoundingClientRect().top
    ? sortNav.getBoundingClientRect().top - topNav.offsetHeight
    : 0;
  const mobileScrollDiff: number = mobileSortNav.getBoundingClientRect().top
    ? mobileSortNav.getBoundingClientRect().top - mobilenav.offsetHeight
    : 0;

  const sortMenuScroll = () => {
    let filterpos: number = Math.round(sortNav.getBoundingClientRect().top);
    const desktopDistance: number | undefined = Math.round(
      topNav.getBoundingClientRect().bottom
    );
    const mobileDistance: number | undefined = Math.round(
      mobilenav.getBoundingClientRect().bottom
    );

    let filterposMobile: number = Math.round(
      mobileSortNav.getBoundingClientRect().top
    );

    if (desktopDistance && window.pageYOffset < scrollDiff) {
      sortNav.classList.remove("sticky-nav");
      sortNav.classList.add("non-sticky-nav");
      sortNav.style.top = "";
    }
    if (mobileDistance && window.pageYOffset < mobileScrollDiff) {
      mobileSortNav.classList.remove("sticky-nav");
      mobileSortNav.classList.add("non-sticky-nav");
      mobileSortNav.style.top = "";
    }

    if (desktopDistance) {
      if (filterpos <= desktopDistance && window.pageYOffset > scrollDiff) {
        sortNav.classList.add("sticky-nav");
        sortNav.classList.remove("non-sticky-nav");
        sortNav.style.top = desktopDistance - 20 + "px";
        sortNav.style.width = topNav.offsetWidth + "px";
      }
    } else if (mobileDistance) {
      if (
        filterposMobile <= mobileDistance &&
        window.pageYOffset > mobileScrollDiff
      ) {
        mobileSortNav.classList.add("sticky-nav");
        mobileSortNav.classList.remove("non-sticky-nav");
        mobileSortNav.style.top = mobileDistance - 30 + "px";
        mobileSortNav.style.width = mobilenav.offsetWidth + "px";
      }
    }
  };

  window.addEventListener("scroll", throttle(sortMenuScroll, 50));
}

sortMenuScrollInit();

function throttle(callback: () => void, delay: number) {
  let start = 0;
  return function () {
    let timenow = Date.now();
    if (timenow - start >= delay) {
      start = timenow;
      callback();
    }
  };
}

function hideModalOnResize() {
  const modal = document.querySelector(
    ".mobile-filter-modal-container"
  )! as HTMLElement;
  modal.style.display = "none";
}

function productCount() {
  const originalDom: HTMLDivElement = document.querySelector(
    ".image-gallery-container"
  )! as HTMLDivElement;

  /*const productArray: HTMLDivElement[] = [
    ...originalDom.querySelectorAll("div"),
  ]; */
  const productArray: NodeListOf<HTMLDivElement> =
    originalDom.querySelectorAll(".product-container");
  const countContainer = document.querySelector(
    ".product-count"
  )! as HTMLDivElement;
  let count = productArray.length;
  countContainer.firstElementChild!.innerHTML = `${count.toString()} products`;
}

//add products to wishlist from category pages
function categoryAddWishlistInit() {
  const productCollection = document.querySelectorAll(
    "span[data-rocFormName]"
  ) as NodeListOf<HTMLElement>;
  const wishHeartPages = document.getElementById(
    "wishheart-pages"
  ) as HTMLSpanElement;
  const mobileWishHeartPages = document.getElementById(
    "mobile-wishheart-pages"
  ) as HTMLSpanElement;
  const topNav = document.querySelector(".topnav")! as HTMLDivElement;
  const mobileNavMenu = document.querySelector(
    ".mobile-nav-menu"
  )! as HTMLDivElement;

  function categoryAddWishlist(this: HTMLSpanElement, e: Event) {
    const target = (e.target as HTMLSpanElement).closest("span");
    if (target) {
      const rocAttribute = target.getAttribute("data-rocFormName");
      const itemCodeAttribute = target.getAttribute("data-itemCode");
      if (!rocAttribute) return;
      if (rocAttribute) {
        const parentPara = this.parentElement as HTMLParagraphElement;
        const parentDiv = parentPara.parentElement as HTMLDivElement;
        const brand = parentDiv.querySelector(
          ".product-brand"
        ) as HTMLParagraphElement;
        const name = parentDiv.querySelector(
          ".product-name"
        ) as HTMLParagraphElement;
        const price = parentDiv.querySelector(
          ".product-price"
        ) as HTMLParagraphElement | null;
        const salePrice = parentDiv.querySelector(
          ".sale-price"
        ) as HTMLParagraphElement | null;
        const type = (parentDiv.querySelector("img") as HTMLImageElement).alt;
        const url = (parentDiv.querySelector("span") as HTMLSpanElement).getAttribute("data-urlName");
        const image = (parentDiv.querySelector("img") as HTMLImageElement).src;
        const rocFormName = rocAttribute;
        const itemCode = itemCodeAttribute;

        const productDataObject = {
          brand: brand.textContent,
          name: name.textContent,
          price: price ? price.textContent : "",
          salePrice: salePrice ? salePrice.textContent : "",
          type,
          url,
          image,
          rocFormName,
          itemCode,
        };

        localStorage.setItem(rocAttribute, JSON.stringify(productDataObject));
      }

      const itemAddedTab = document.createElement("span");
      itemAddedTab.textContent = "Item added to wishlist";
      itemAddedTab.classList.add("item-added-tab");
      this.style.color = "red";

      if (!wishHeartPages.style.color) {
        wishHeartPages.style.color = "red";
      }

      if (!mobileWishHeartPages.style.color) {
        mobileWishHeartPages.style.color = "red";
      }

      //append item added tab for desktop site
      if (topNav.getBoundingClientRect().bottom) {
        (async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          topNav.after(itemAddedTab);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          itemAddedTab.remove();
        })();
      } else if (mobileNavMenu.getBoundingClientRect().bottom) {
        //append item added tab for mobile site
        (async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          mobileNavMenu.after(itemAddedTab);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          itemAddedTab.remove();
        })();
      }
    }
  }

  for (let elem of productCollection) {
    elem.addEventListener("click", categoryAddWishlist);
  }
}

const createWishControlsPages = () => {
  console.log("how many times am I being called")
  const form: HTMLFormElement | undefined = document.getElementById(
    "form-wishlist-pages"
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

const mobileCreateWishControlsPages = () => {
  const form: HTMLFormElement | undefined = document.getElementById(
    "mobile-form-wishlist-pages"
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

function categoryShowWishlistInit() {
  const yourWishlistPages = document.getElementById(
    "form-wishlist-pages"
  ) as HTMLFormElement;
  const yourMobileWishlistPages = document.getElementById(
    "mobile-form-wishlist-pages"
  ) as HTMLFormElement;

  if (yourWishlistPages)
    yourWishlistPages.addEventListener("submit", createWishControlsPages);
  if (yourMobileWishlistPages)
    yourMobileWishlistPages.addEventListener(
      "submit",
      mobileCreateWishControlsPages
    );
}

document.addEventListener("DOMContentLoaded", productCount);
window.addEventListener("resize", hideModalOnResize);

slideNavMenu();
mobileListInit();
showModelPic();
sortMenu();
productFilter();
openMobileFilter();
closeMobileFilter();
showCategories();
shiftRight();
mobileProductFilter();
closeMobilePriceFilter();
categoryAddWishlistInit();
categoryShowWishlistInit();

