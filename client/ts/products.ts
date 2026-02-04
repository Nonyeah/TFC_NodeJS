import {
  navblocks,
  showNavBlock,
  topNavLinks,
  hideNavBlock,
  slideNavMenu,
} from "./header";

import { mobileListInit } from "./mobile";
import {
  wishlist,
  createWishControls,
  showModelPicInit,
  removeWishItemInit,

} from "./wishlist";
import { format } from "path";

for (let elem of topNavLinks) {
  elem.addEventListener("click", showNavBlock);
}

for (let elem of navblocks) {
  elem.addEventListener("mouseleave", hideNavBlock);
}

function displayFirstTab() {
  const hiddenContent =
    document.querySelectorAll<HTMLDivElement>(".hidden-content");
  if (!hiddenContent.length) return;
  hiddenContent[0].style.height = hiddenContent[0].scrollHeight + "px";
}

const swapImageInit = () => {
  const mainImage = document.querySelector<HTMLDivElement>(".main-image")!;
  const productContainer: HTMLDivElement | undefined =
    document.querySelector<HTMLDivElement>(".product-container")!;

  function swapThumb(e: Event) {
    const target = e.target as HTMLElement;
    if (target instanceof HTMLImageElement) {
      const image = target.closest("img")!;
      const largeImage = mainImage.firstElementChild!
        .nextElementSibling! as HTMLImageElement;
      largeImage.src = image.src;
    }
  }
  if (productContainer) productContainer.addEventListener("click", swapThumb);
};

const swapImageArrowInit = () => {
  const leftArrow = document.querySelector<HTMLSpanElement>(".left-arrow")!;
  const rightArrow = document.querySelector<HTMLSpanElement>(".right-arrow")!;
  const bigImage = document.querySelector<HTMLImageElement>("#big-image")!;
  const thumbImages: NodeListOf<HTMLImageElement> = document
    .querySelector(".thumb-images")!
    .querySelectorAll("img")!;
  const leftModalArrow =
    document.querySelector<HTMLSpanElement>(".left-modal-arrow");
  const rightModalArrow =
    document.querySelector<HTMLSpanElement>(".right-modal-arrow");
  const closeButton = document.querySelector<HTMLButtonElement>("#modal-close");
  const modalContainer = document.querySelector(
    "#modal-cover"
  ) as HTMLDivElement;
  const modalImage = document.querySelector(
    "#lrg-modal-image"
  ) as HTMLImageElement;

  const len: number = Math.round(bigImage.clientWidth * 0.3);
  let start: number;
  let end: number;
  let i = 0;
  const max: number = thumbImages.length - 1;
  const modalLen = Math.round(modalImage.clientWidth * 0.3);

  function showModal(this: HTMLImageElement) {
    modalImage.src = this.src;
    modalContainer.style.display = "block";
  }
  const closeModal = () => {
    modalContainer.style.display = "";
  };

  bigImage.addEventListener("click", showModal);
  closeButton!.addEventListener("click", closeModal);

  function arrowImageChangeLeft() {
    i >= max ? (i = 0) : (i = i);
    modalImage.src = thumbImages[i++].src;
  }

  function arrowImageChangeRight() {
    i >= max ? (i = 0) : (i = i);
    modalImage.src = thumbImages[i++].src;
  }

  leftModalArrow!.addEventListener("click", arrowImageChangeLeft);
  rightModalArrow!.addEventListener("click", arrowImageChangeRight);

  function clickLeft(e: Event) {
    e.stopPropagation();
    i >= max ? (i = 0) : (i = i);
    bigImage.src = thumbImages[i++].src;
  }

  function clickRight(e: Event) {
    e.stopPropagation();
    i >= max ? (i = 0) : (i = i);
    bigImage.src = thumbImages[i++].src;
  }

  function startSwipe(e: TouchEvent) {
    start = Math.round(e.touches[0].clientX);
  }

  function endSwipe(e: TouchEvent) {
    i > max ? (i = 0) : (i = i);
    end = Math.round(e.changedTouches[0].clientX);
    if (start - end >= len || end - start >= len) {
      bigImage.src = thumbImages[i++].src;
    }
  }

  function endSwipeModal(e: TouchEvent) {
    i > max ? (i = 0) : (i = i);
    end = Math.round(e.changedTouches[0].clientX);
    if (start - end >= modalLen || end - start >= modalLen) {
      modalImage.src = thumbImages[i++].src;
    }
  }

  bigImage.addEventListener("touchstart", startSwipe);
  bigImage.addEventListener("touchend", endSwipe);
  leftArrow.addEventListener("click", clickLeft);
  rightArrow.addEventListener("click", clickRight);
  modalImage.addEventListener("touchstart", startSwipe);
  modalImage.addEventListener("touchend", endSwipeModal);
};

function openTabs() {
  const parentTarget = document.querySelector<HTMLDivElement>(".tab-container");

  let lastButtonClicked: undefined | HTMLButtonElement;
  let prevOpenDiv: HTMLDivElement;
  let currentButtonClicked: HTMLButtonElement;
  let currentOpenDiv: HTMLDivElement;

  const currentButtonNotPrev = () => {
    prevOpenDiv.style.height = "";
    lastButtonClicked!.classList.remove("open");
    currentOpenDiv = currentButtonClicked.nextElementSibling! as HTMLDivElement;
    currentOpenDiv.style.height = currentOpenDiv.scrollHeight + "px";
    currentButtonClicked.classList.add("open");
    lastButtonClicked = currentButtonClicked;
    prevOpenDiv = currentOpenDiv;
  };

  const toggleButton = () => {
    currentOpenDiv = currentButtonClicked.nextElementSibling as HTMLDivElement;
    currentOpenDiv.style.height
      ? (currentOpenDiv.style.height = "")
      : (currentOpenDiv.style.height = currentOpenDiv.scrollHeight + "px");
    lastButtonClicked = currentButtonClicked;
    prevOpenDiv = currentOpenDiv;
    currentButtonClicked.classList.toggle("open");
  };

  const initialClick = () => {
    currentOpenDiv = currentButtonClicked.nextElementSibling! as HTMLDivElement;
    currentOpenDiv.style.height = currentOpenDiv.scrollHeight + "px";
    currentButtonClicked.classList.add("open");
    lastButtonClicked = currentButtonClicked;
    prevOpenDiv = currentOpenDiv;
  };

  const showHiddenContent = (e: Event) => {
    const target = e.target as HTMLElement;
    currentButtonClicked = target.closest("button") as HTMLButtonElement;
    if (currentButtonClicked && !lastButtonClicked) {
      initialClick();
    } else if (
      currentButtonClicked &&
      currentButtonClicked !== lastButtonClicked
    ) {
      currentButtonNotPrev();
    } else {
      toggleButton();
    }
  };

  parentTarget?.addEventListener("click", showHiddenContent);
}

const youMayLike = () => {
  const leftArrow = document.querySelector<HTMLSpanElement>(".l-s-arrow")!;
  const rightArrow = document.querySelector<HTMLSpanElement>(".r-s-arrow")!;
  //long container housing all suggestion products
  const suggestionsContainer = document.querySelector<HTMLDivElement>(
    ".suggestions-outer-container"
  )!;

  //product cover - same width as viewport
  const suggestionsCover =
    document.querySelector<HTMLDivElement>(".suggestions-cover")!;
  const coverWidth: number = Math.round(suggestionsCover.clientWidth);
  let offset = 0;

  function shiftLeft() {
    if (offset <= coverWidth * 3 * -1) {
      offset = 0;
      suggestionsContainer.style.translate = offset + "px";
    } else {
      //offset -= Math.round(coverWidth * 0.3);
      offset -= Math.round(suggestionsContainer.clientWidth);
      suggestionsContainer.style.translate = offset + "px";
    }
  }
  function shiftRight() {
    if (offset >= 0) {
      offset = 0;
      return;
    }
    //offset += Math.round(coverWidth * 0.3);
     offset += Math.round(suggestionsContainer.clientWidth);
    suggestionsContainer.style.translate = offset + "px";
  }

  leftArrow.addEventListener("click", shiftRight);
  rightArrow.addEventListener("click", shiftLeft);
};

function roundButtonShift() {
  const thumbImagesContainer = document.querySelector(
    ".thumb-images"
  )! as HTMLDivElement;
  const roundButtonContainer = document.querySelector(
    ".round-button-container"
  )! as HTMLDivElement;
  const thumbImagesInnerContainer = document.querySelector(
    ".thumb-images-inner-container"
  )! as HTMLDivElement;

  let currentTarget: HTMLSpanElement;
  let prevTarget: HTMLSpanElement;
  let shiftDiff: number = 0;
  let start: number;
  let end: number;
  const collection = roundButtonContainer.querySelectorAll("span");
  const highlighted =
    roundButtonContainer.firstElementChild?.classList.add("highlight");

  const thumbShift = (e: Event) => {
    e.stopPropagation();
    currentTarget = e.target as HTMLSpanElement;
    currentTarget = currentTarget.closest("span")!;
    if (prevTarget === currentTarget) {
      currentTarget.classList.toggle("highlight");
    } else if (prevTarget && prevTarget !== currentTarget) {
      prevTarget.classList.remove("highlight");
      currentTarget.classList.add("highlight");
      prevTarget = currentTarget;
    } else {
      currentTarget.classList.add("highlight");
      roundButtonContainer.firstElementChild?.classList.remove('highlight');
      prevTarget = currentTarget;
    }

    if (shiftDiff < 0) {
      shiftDiff += Math.round(thumbImagesContainer.offsetWidth * 0.67);
      thumbImagesInnerContainer.style.transform = `translate(${shiftDiff}px)`;
      //offset = 0;
    } else {
      shiftDiff -= Math.round(thumbImagesContainer.offsetWidth * 0.67);
      thumbImagesInnerContainer.style.transform = `translate(${shiftDiff}px)`;
      //offset = -1;
    }
  };
  roundButtonContainer.addEventListener("click", thumbShift);

  const swipeStart = (e: TouchEvent) => {
    start = Math.round(e.touches[0].clientX);
  };

  const swipeEnd = (e: TouchEvent) => {
    end = Math.round(e.changedTouches[0].clientX);
    const swipeDistance: number = Math.abs(start - end);
    const swipeLimit: number = Math.round(
      thumbImagesContainer.offsetWidth * 0.3
    );
    if (shiftDiff < 0 && swipeDistance >= swipeLimit) {
      shiftDiff += Math.round(thumbImagesContainer.offsetWidth * 0.67);
      thumbImagesInnerContainer.style.transform = `translate(${shiftDiff}px)`;
      for (let span of collection) {
        span.classList.toggle("highlight");
      }
      //offset = 0;
    } else if (shiftDiff >= 0 && swipeDistance >= swipeLimit) {
      shiftDiff -= Math.round(thumbImagesContainer.offsetWidth * 0.67);
      thumbImagesInnerContainer.style.transform = `translate(${shiftDiff}px)`;
      for (let span of collection) {
        span.classList.toggle("highlight");
      }
      //offset = -1;
    }
  };

  thumbImagesContainer.addEventListener("touchstart", swipeStart);
  thumbImagesContainer.addEventListener("touchend", swipeEnd);
}

const form = document.getElementById("form-wishlist");
form?.addEventListener("submit", createWishControls);

const isWishlist: HTMLDivElement | undefined = document.querySelector(
  ".wishlist-container"
) as HTMLDivElement | undefined;



//for product pages only
if (!isWishlist) {
  displayFirstTab();
  youMayLike();
  openTabs();
  slideNavMenu();
  mobileListInit();
  swapImageArrowInit();
  swapImageInit();
  roundButtonShift();
  wishlist();
  
} else {
  //for wishlist page only
  slideNavMenu();
  mobileListInit();
  wishlist();
  showModelPicInit();
  removeWishItemInit();
 
}
