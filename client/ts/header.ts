export const navblocks =
  document.querySelectorAll<HTMLDivElement>(".navigation-block");
export const topNavLinks = document
  .querySelector(".topnav")!
  .querySelectorAll("a");

export function showNavBlock(e: Event) {
  const target = e.target as HTMLAnchorElement;
  const li = target.closest("li");

  for (let div of navblocks) {
    const arr: string[] = [...div.classList];
    if (arr.includes(li!.classList[0])) {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
  }
}


//initialisation not really required here since showNavBlock is exported
for (let elem of topNavLinks) {
  elem.addEventListener("click", showNavBlock);
}

export function hideNavBlock(this: HTMLElement) {
  if (this.style.display == "block") this.style.display = "";
}

//initialisation not really required here since hideNavBlock is exported
for (let elem of navblocks) {
  elem.addEventListener("mouseleave", hideNavBlock);
}

export const slideNavMenu = () => {
  const burger = document.querySelector("a.burger-icon")! as HTMLAnchorElement;
  const linksContainer = document.querySelector(
    ".mobile-links-container"
  )! as HTMLDivElement;
  const close = document.querySelector(
    "p.close-slide-menu"
  )! as HTMLParagraphElement;

  const openSlideNav = () => (linksContainer.style.width = "80%");

  const closeSlideNav = () => (linksContainer.style.width = "");
  

  const mobileNavAdjustment = () => {
    if (window.innerWidth >= 992) {
      linksContainer.style.width = 0 + "px";
    }
  };

  window.addEventListener("resize", mobileNavAdjustment);
  burger.addEventListener("click", openSlideNav);
  close.addEventListener("click", closeSlideNav);
};
