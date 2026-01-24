export const toggleBottomTabInit = () => {
  const mobileTabMenu = document.querySelector(
    ".mobile-tab-bottom-menu"
  )! as HTMLDivElement;
  let previousButtonClicked: HTMLButtonElement | undefined;
  let currentButtonClicked: HTMLButtonElement;
  let prevHiddenDivText: HTMLDivElement;
  let currentHiddenDivText: HTMLDivElement;

  function toggleBottomTab(e: Event) {
    currentButtonClicked = (e.target as HTMLButtonElement).closest("button")!;
    if (
      previousButtonClicked &&
      previousButtonClicked === currentButtonClicked
    ) {
      toggleButtonClick();
      currentButtonClicked.classList.toggle("open");
    } else if (
      previousButtonClicked &&
      previousButtonClicked !== currentButtonClicked
    ) {
      newButtonClick();
    } else {
      defaultButtonClick();
    }
  }

  const toggleButtonClick = () => {
    currentHiddenDivText.style.height
      ? (currentHiddenDivText.style.height = "")
      : (currentHiddenDivText.style.height =
          currentHiddenDivText.scrollHeight + "px");
    previousButtonClicked = currentButtonClicked;
  };
  const newButtonClick = () => {
    prevHiddenDivText.style.height = "";
    previousButtonClicked!.classList.remove("open");
    currentHiddenDivText =
      currentButtonClicked.nextElementSibling as HTMLDivElement;
    currentHiddenDivText.style.height =
      currentHiddenDivText.scrollHeight + "px";
    previousButtonClicked = currentButtonClicked;
    currentButtonClicked.classList.add("open");
    prevHiddenDivText = currentHiddenDivText;
  };

  const defaultButtonClick = () => {
    currentHiddenDivText =
      currentButtonClicked.nextElementSibling as HTMLDivElement;
    currentHiddenDivText.style.height =
      currentHiddenDivText.scrollHeight + "px";
    previousButtonClicked = currentButtonClicked;
    currentButtonClicked.classList.add("open");
    prevHiddenDivText = currentHiddenDivText;
  };

  mobileTabMenu.addEventListener("click", toggleBottomTab);
};

export const showTextInit = () => {
  const text = document.querySelector(
    ".hidden-subscribe-text"
  ) as HTMLParagraphElement;
  const input = document.getElementById("input") as HTMLInputElement;
  const mobileInput = document.getElementById(
    "mobile-input"
  ) as HTMLInputElement;
  const mobileText = document.querySelector(
    ".hidden-subscribe-mobile-text"
  ) as HTMLParagraphElement;

  const showText = () => {
  if (!text || !input) {
      console.error("Missing nodes");
      return;
  };
    if (text && text.style.height) {
      text.style.height = "";
    } else {
      text.style.height = `${text.scrollHeight}px`;
    }
  };

  const showTextMobile = () => {
  if (!mobileText || !mobileInput) {
       console.error("Missing nodes");
       return;
  };
    if (mobileText && mobileText.style.height) {
      mobileText.style.height = "";
    } else {
      mobileText.style.height = `${mobileText.scrollHeight}px`;
    }
  };

  input.addEventListener("click", showText);
  mobileInput.addEventListener("click", showTextMobile);
};

showTextInit();
toggleBottomTabInit();
