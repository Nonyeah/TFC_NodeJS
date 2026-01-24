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

