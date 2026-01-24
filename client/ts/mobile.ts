export const mobileListInit = () => {
  let prevOpenUl: HTMLUListElement | undefined;
  let currentOpenUl: HTMLUListElement;
  let currentLiTarget: HTMLLIElement;
  let previousLiTarget: HTMLLIElement | undefined;
  const parentUl = document.querySelector(".parent-ul")!;

  const differentListOpen = () => {
    prevOpenUl!.style.display = "none";
    previousLiTarget!.classList.remove("open");
    currentOpenUl.style.display = "block";
    currentLiTarget.classList.add("open");
    prevOpenUl = currentOpenUl;
    previousLiTarget = currentLiTarget;
  };

  const sameListOpen = () => {
    prevOpenUl!.style.display == "block"
      ? (prevOpenUl!.style.display = "none")
      : (prevOpenUl!.style.display = "block");
    currentLiTarget.classList.toggle("open");
    previousLiTarget = currentLiTarget;
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
    if (prevOpenUl && prevOpenUl != currentOpenUl) {
      differentListOpen();
    } else if (prevOpenUl && prevOpenUl == currentOpenUl) {
      sameListOpen();
    } else {
      defaultListOpen();
    }
  };

  parentUl.addEventListener("click", openMobileNav);
};


