export const mobileListInit = () => {
  const parentUl = document.querySelector(".parent-ul")! as HTMLUListElement;
  let prevOpenUl: HTMLUListElement | undefined;
  let currentOpenUl: HTMLUListElement;
  let currentLiTarget: HTMLLIElement;
  let previousLiTarget: HTMLLIElement | undefined;
  
  if (!parentUl || parentUl.dataset.initialized === "true") return;

  // Mark it so it won't attach a second time
  parentUl.dataset.initialized = "true";

  const differentListOpen = () => {
    prevOpenUl!.style.display = "none";
    previousLiTarget!.classList.remove("open");
    currentOpenUl.style.display = "block";
    currentLiTarget.classList.add("open");
    prevOpenUl = currentOpenUl;
    previousLiTarget = currentLiTarget;
  };

  const sameListOpen = () => {
    prevOpenUl!.style.display === "block"
      ? (prevOpenUl!.style.display = "none")
      : (prevOpenUl!.style.display = "block");
    currentLiTarget.classList.toggle("open");
  };

  const defaultListOpen = () => {
    currentOpenUl.style.display = "block";
    prevOpenUl = currentOpenUl;
    currentLiTarget.classList.add("open");
    previousLiTarget = currentLiTarget;
  };

  const openMobileNav = (e: Event) => {
    const target = e.target as HTMLElement;
    currentLiTarget = target.closest("li")!;
    currentOpenUl = currentLiTarget.firstElementChild as HTMLUListElement;
    if(currentOpenUl instanceof HTMLUListElement){
    if (prevOpenUl && prevOpenUl != currentOpenUl) {
      differentListOpen();
    } else if (prevOpenUl && prevOpenUl === currentOpenUl) {
      sameListOpen();
    } else {
      defaultListOpen();
    }
  }
  };

  parentUl.addEventListener("click", openMobileNav);
};


