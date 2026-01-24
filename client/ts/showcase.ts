import {
  showNavBlock,
  slideNavMenu,
  topNavLinks,
  navblocks,
} from "./header.ts";
import { mobileListInit } from "./mobile";
//import { toggleBottomTabInit, showTextInit } from "./footer.ts";

for (let elem of topNavLinks) {
  elem.addEventListener("click", showNavBlock);
}

export function hideNavBlock(this: HTMLElement) {
  if (this.style.display == "block") this.style.display = "";
}

for (let elem of navblocks) {
  elem.addEventListener("mouseleave", hideNavBlock);
}

function displayThumbInit() {
  const parentDiv = document.querySelector(
    ".thumb-images-container"
  ) as HTMLDivElement;

  const showThumb = (e: Event) => {
    e.preventDefault();
    const largeImage = document.querySelector(
      ".large-image"
    ) as HTMLImageElement;
    const target = (e.target as HTMLElement).closest("img");
    if (target) {
      largeImage.src = target.src;
    }
  };

  if (parentDiv) parentDiv.addEventListener("click", showThumb);
}

function showShowcaseModalInit() {
  const modalContainer = document.querySelector(
    ".showcase-modal"
  ) as HTMLDivElement;
  const largeImage = document.querySelector(".large-image") as HTMLImageElement;
  const modalImage = document.querySelector(".modal-image") as HTMLImageElement;
  const close = document.querySelector(".close-modal") as HTMLParagraphElement;
  const leftArrow = document.querySelector(
    ".left-arrow"
  ) as HTMLParagraphElement;
  const rightArrow = document.querySelector(
    ".right-arrow"
  ) as HTMLParagraphElement;
  let i: number = 0;
  let len: number;
  let collection: NodeListOf<HTMLImageElement>;
  const thumbContainer = document.querySelector(
    ".thumb-images-container"
  ) as HTMLDivElement;
  if (thumbContainer) {
    collection = thumbContainer.querySelectorAll("img");
    len = collection.length;
  }

  function showShowcaseModal() {
    modalImage.src = largeImage.src;
    modalContainer.classList.add("showcase-modal-visible");
  }

  function closeModal() {
    modalContainer.classList.remove("showcase-modal-visible");
    i = 0;
  }

  function navigateRight() {
    if (i >= len - 1) return;
    modalImage.src = collection[++i].src;
  }

  function navigateLeft() {
    if (i < 0) {
      i = 0;
      return;
    }
    modalImage.src = collection[i--].src;
  }

  let touchStart: number;
  let touchEnd: number;

  const swipeStart = (e: TouchEvent) => {
    touchStart = e.touches[0].clientX;
  };

  const swipeEnd = (e: TouchEvent) => {
    touchEnd = e.changedTouches[0].clientX;
    if (i >= len) i = 0;
    if (
      (touchStart - touchEnd > Math.round(modalImage.clientWidth) * 0.3 &&
        i < len) ||
      (touchEnd - touchStart > Math.round(modalImage.clientWidth) * 0.3 &&
        i < len)
    ) {
      modalImage.src = collection[i++].src;
    }
  };

  leftArrow.addEventListener("click", navigateLeft);
  rightArrow.addEventListener("click", navigateRight);
  close.addEventListener("click", closeModal);
  largeImage.addEventListener("click", showShowcaseModal);
  modalImage.addEventListener("touchstart", swipeStart);
  modalImage.addEventListener("touchend", swipeEnd);
}

const showcaseHomePage = document.querySelector(
  ".showcase-top-image-banner"
) as HTMLDivElement | undefined;

if (!showcaseHomePage) {
  showShowcaseModalInit();
  displayThumbInit();
}
slideNavMenu();
mobileListInit();
//toggleBottomTabInit();
//showTextInit();
