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

function rotateImagesInit() {
  const carouselContainer = document.querySelector(
    ".image-carousel-parent"
  ) as HTMLDivElement;
  const carousel = document.querySelector(
    ".image-carousel-container"
  ) as HTMLDivElement;
  const distance: number = carouselContainer!.clientWidth * -0.2;
  let leftOffset: number = 0;
  const totalShift: number = carousel.clientWidth * -1;

  function shiftRight() {
    if (
      Math.round(carousel!.getBoundingClientRect().left) <
      Math.round(totalShift * 0.9)
    ) {
      leftOffset = 0;
      carousel!.style.transform = `translateX(${leftOffset}px)`;
    }

    //add offset
    leftOffset += distance;
    //shift carousel by offset amount
    carousel!.style.transform = `translateX(${leftOffset}px)`;
  }

  const rotateImages = () => {
    setInterval(shiftRight, 3000);
  };

  rotateImages();
}

document.addEventListener("DOMContentLoaded", rotateImagesInit);
document.addEventListener("DOMContentLoaded", slideNavMenu);
document.addEventListener("DOMContentLoaded", mobileListInit);
