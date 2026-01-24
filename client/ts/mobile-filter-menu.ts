export function openMobileFilter() {
  //define category modal container
  const modalContainer: HTMLDivElement = document.querySelector(
    ".mobile-filter-modal-container"
  )!;

  //define mobile sort menu
  const mobileMenuContainer: HTMLDivElement = document.querySelector(
    ".sort-menu-mobile-container"
  )!;

  //define  price modal container
  const modalContainerPrice: HTMLDivElement = document.querySelector(
    ".mobile-filter-modal-price-container"
  )!;

  const openModal = (e: Event) => {
    /*const target = e.target as HTMLElement;
    let elem: HTMLParagraphElement | undefined;
    if (target) elem = target.closest("p")!; */
    const elem = (e.target as HTMLParagraphElement).closest("p");
    let selection: string | undefined;
    if (elem) {
      const div = elem.parentElement as HTMLDivElement;
      selection = [...div.classList].includes("filter") ? "filter" : "sort";
    }

    if (selection === "filter") {
      modalContainer.style.display = "flex";
      modalContainer.classList.add("open");
    } else {
      modalContainerPrice.style.display = "flex";
      modalContainerPrice.classList.add("open");
    }
  };

  mobileMenuContainer.addEventListener("click", openModal);
};

export function closeMobileFilter() {
  const closeButton: NodeListOf<HTMLParagraphElement> = document
    .querySelector(".mobile-filter-modal-container")!
    .querySelectorAll(".close")!;
  const modalContainer: HTMLDivElement = document.querySelector(
    ".mobile-filter-modal-container"
  )!;
  const categories: HTMLDivElement | null = document.querySelector(
    ".mobile-filter-categories"
  );
  const colour: HTMLDivElement | null = document.querySelector(
    ".mobile-filter-colour"
  );
  const brand: HTMLDivElement | null = document.querySelector(
    ".mobile-filter-brand"
  );

  const closeModal = () => {
    modalContainer.style.display = "none";
    //const scrollOffset = modalContainer.offsetWidth;
    if (categories) categories.style.transform = "";
    if (colour) colour.style.transform = "";
    if (brand) brand.style.transform = "";
  };

  for (let elem of closeButton) {
    elem.addEventListener("click", closeModal);
  }
}

export function closeMobilePriceFilter() {
  const modalPriceContainer: HTMLDivElement = document.querySelector(
    ".mobile-filter-modal-price-container"
  )!;
  const close: HTMLParagraphElement =
    modalPriceContainer.querySelector(".close")!;

  const closePriceModal = () => {
    modalPriceContainer.style.display = "none";
  };
  close.addEventListener("click", closePriceModal);
}

export function showCategories() {
  //define currentTarget node
  const page1: HTMLDivElement = document.querySelector(".mobile-filter-page1")!;
  //define menu categories
  const categories: HTMLDivElement | null = document.querySelector(
    ".mobile-filter-categories"
  );
  const colour: HTMLDivElement | null = document.querySelector(
    ".mobile-filter-colour"
  );
  const brand: HTMLDivElement | null = document.querySelector(
    ".mobile-filter-brand"
  );

  const shiftLeft = (e: Event) => {
    let liTarget: HTMLLIElement;
    const target = e.target as HTMLElement;
    if (target) liTarget = target.closest("li")!;
    const text = liTarget!.textContent;
    let scrollOffset: number = page1.offsetWidth;
    switch (text) {
      case "categories":
        {
          if (categories)
            categories.style.transform = `translate(-${scrollOffset}px)`;
        }
        break;
      case "colour":
        {
          if (colour && !categories){
            colour.style.transform = `translate(-${scrollOffset}px)`;
          } else if (colour && categories){
            colour.style.transform = `translate(-${scrollOffset * 2}px)`
          }
        }
        break;
      case "brand":
        {
          if (brand && !categories){
            brand.style.transform = `translate(-${scrollOffset * 2}px)`;
          } else if (brand && categories){
             brand.style.transform = `translate(-${scrollOffset * 3}px)`;
          }
        }
        break;
    }
  };

  page1.addEventListener("click", shiftLeft);
}

export function shiftRight() {
  const modalContainer: HTMLDivElement = document.querySelector(
    ".mobile-filter-modal-container"
  )!;
  const headings: NodeListOf<HTMLParagraphElement> =
    modalContainer.querySelectorAll(".heading");

  function resetShift(this: HTMLParagraphElement) {
    const parentDiv: HTMLDivElement = this.parentElement as HTMLDivElement;
    parentDiv.style.transform = "";
  }

  for (let elem of headings) {
    elem.addEventListener("click", resetShift);
  }
}

export function mobileProductFilter() {
  const imageGalleryContainer = document.querySelector(
    ".image-gallery-container"
  )! as HTMLElement;

  const topImageBorder = document.querySelector(
    ".top-image-border"
  ) as HTMLDivElement;

  const originalDom: NodeListOf<HTMLElement> =
    imageGalleryContainer.querySelectorAll<HTMLDivElement>(
      ".product-container"
    );

  const filterButtonContainer = document.querySelector(
    ".filter-button-container"
  ) as HTMLDivElement;

    const productCount: HTMLDivElement = document.querySelector('.product-count')!;

     //define scrollIntoViewfunction
  const scrollToTop = () => {
    topImageBorder.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  const createClearFilterButton = () => {
    let clearFilters: HTMLAnchorElement = document.createElement("a");
    clearFilters.href = "#";
    clearFilters.innerHTML = "Clear all filters";
    clearFilters.classList.add("clear-filters");
    clearFilters.onclick = function (e: Event) {
      e.preventDefault();
      imageGalleryContainer.append(...originalDom);
      productCount.firstElementChild!.textContent = `${String(originalDom.length)} products`;
      filterButtonContainer.innerHTML = "";
    };

    const filterDuplicate =
      filterButtonContainer.querySelector(".clear-filters");
    if (filterDuplicate) {
      filterDuplicate.remove();
    }
    filterButtonContainer.append(clearFilters);
  };

  function applyFilter(e: Event) {
    e.stopPropagation();
    //find button that was clicked - event target
    let button = e.target as HTMLButtonElement;
    //traverse the DOM tree backwards to find the apply button's parent div element
    const parentDiv: HTMLDivElement = button.closest("div")!;
    const parentUl: HTMLUListElement = parentDiv.querySelector("ul")!;
    const label: HTMLParagraphElement =
      parentUl.previousElementSibling! as HTMLParagraphElement;
    //caputre all checked inputs and return them into an array
    const inputs: NodeListOf<HTMLInputElement> =
      parentDiv.querySelectorAll("input");
    const inputsArray: HTMLInputElement[] = Array.from(inputs);
    const checkedInputs: HTMLInputElement[] = inputsArray.filter(
      (input) => input.checked
    );
    if (!checkedInputs.length) {
      //close modal
      resetCategoryTabs();
      scrollToTop();
      return;
    }

    //filter the input values (user selection) and return them into an array
    const userSelection: Array<string> = checkedInputs.map(
      (input) => input.value
    );

    const filteredGallery: HTMLDivElement[] = [];
    //obtain nodelist/array of products on display in image gallery container

    const currentGalleryArray = [
      ...imageGalleryContainer.querySelectorAll<HTMLDivElement>(
        ".product-container"
      ),
    ];

    //iterate through current image gallery container
    for (let divElem of currentGalleryArray) {
      //for each product div element in image gallery create an array of classlist value
      const classListArray: string[] = [...divElem.classList.values()];
      //if the any class list value matches an item in the user selection array push the div element into the filtered array
      classListArray.forEach((classItem) => {
        if (userSelection.includes(classItem.toLowerCase())) {
          filteredGallery.push(divElem);
        }
      });
    }

    if (!filteredGallery.length) {
      //close modal filter
      resetCategoryTabs();
      scrollToTop();
      return;
    }

    imageGalleryContainer.innerHTML = "";
    imageGalleryContainer.append(...filteredGallery);
   (productCount.firstElementChild as HTMLParagraphElement).textContent = `${filteredGallery.length.toString()} products`;

    function resetCategoryTabs() {
      const close = parentDiv.firstElementChild! as HTMLParagraphElement;
      for (let inputTag of inputs) {
        inputTag.checked = false;
      }
      close.click();
    }

    resetCategoryTabs();

    const createFilterButtons = () => {
      userSelection.forEach((string) => {
        const filterButton: HTMLButtonElement =
          document.createElement("button");
        filterButton.innerHTML = string;
        filterButton.classList.add("filter-buttons");
        const fButtonCollection: NodeListOf<HTMLButtonElement> =
          //remove duplicate filter buttons from DOM caused by duplicate user selections
          filterButtonContainer.querySelectorAll("button");
        for (let button of fButtonCollection) {
          if (button.textContent.toLowerCase() === string) {
            button.remove();
          }
        }

        filterButtonContainer.append(filterButton);
      });
    };

    createFilterButtons();
    createClearFilterButton();
    scrollToTop();
  }

  for (const button of document.querySelectorAll(".mapply-category")) {
    button.addEventListener("click", applyFilter);
  }

  //define helper function type
  type HelperFunction = (
    elem1: HTMLDivElement,
    elem2: HTMLDivElement
  ) => number;

  //define helper functions
  const lowHighFirstItemOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    let price1 = Number(
      item1.querySelector(".sale-price")!.innerHTML.trim().slice(1)
    );
    let price2 = Number(
      item2.querySelector(".product-price")!.innerHTML.trim().slice(1)
    );
    return price1 - price2;
  };

  const lowHighSecondItemOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    let price1 = item1
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    let price2 = item2.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    return +price1 - +price2;
  };

  const lowHighBothItemsOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    let price1 = item1.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    let price2 = item2.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    return +price1 - +price2;
  };

  const lowHighDefault: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    let price1 = item1
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    let price2 = item2
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    return +price1 - +price2;
  };

  const highLowFirstItemOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    let price1 = item1.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    let price2 = item2
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    return +price2 - +price1;
  };

  const highLowSecondItemOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    let price1 = item1
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    let price2 = item2.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    return +price2 - +price1;
  };

  const highLowBothItemsOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    let price1 = item1.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    let price2 = item2.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    return +price2 - +price1;
  };

  const highLowDefault: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    let price1 = item1
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    let price2 = item2
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    return +price2 - +price1;
  };

  function applyPriceFilter(e: Event) {
    e.stopPropagation();
    let button = e.target as HTMLButtonElement;
    const parentDiv = button.closest("div")!;
    const parentUl = parentDiv.querySelector("ul") as HTMLUListElement;
    const label = parentUl.previousElementSibling as HTMLParagraphElement;

    //caputre all checked inputs and return them into an array
    const inputs: NodeListOf<HTMLInputElement> =
      parentDiv.querySelectorAll("input");
    const currentGallery: NodeListOf<HTMLDivElement> =
      imageGalleryContainer.querySelectorAll<HTMLDivElement>(
        ".product-container"
      );

    let highLow: string;
    const currentGalleryArray: Array<HTMLDivElement> =
      Array.from(currentGallery);

    const checkedInput = [...parentUl.querySelectorAll("input")].filter(
      (input) => input.checked
    );

    if (checkedInput.length > 1) return;
    if (!checkedInput.length) return;

    highLow = checkedInput[0].value;

    const createPriceButton = () => {
      const priceButton = document.createElement("button");
      highLow === "high"
        ? (priceButton.textContent = "high to low")
        : (priceButton.textContent = "low to high");
      priceButton.classList.add("price-button");
      const duplicatePrice =
        filterButtonContainer.querySelector(".price-button");
      if (duplicatePrice) duplicatePrice.remove();
      filterButtonContainer.append(priceButton);
    };

    createPriceButton();
    createClearFilterButton();

    function resetCategoryTabs() {
      const close = parentDiv.firstElementChild! as HTMLParagraphElement;
      for (let inputTag of inputs) {
        inputTag.checked = false;
      }
      close.click();
    }

    if (highLow === "low") {
      //sort DOM items low to high
      const sortedElemLow = currentGalleryArray.sort((product1, product2) => {
        let sale1: HTMLSpanElement | undefined;
        let sale2: HTMLSpanElement | undefined;
        sale1 = product1.querySelector(".sale-price") as
          | HTMLSpanElement
          | undefined;
        sale2 = product2.querySelector(".sale-price") as
          | HTMLSpanElement
          | undefined;

        if (sale1 && sale2) {
          return lowHighBothItemsOnSale(product1, product2);
        } else if (sale1 && !sale2) {
          return lowHighFirstItemOnSale(product1, product2);
        } else if (!sale1 && sale2) {
          return lowHighSecondItemOnSale(product1, product2);
        } else {
          return lowHighDefault(product1, product2);
        }
      });
      imageGalleryContainer.append(...sortedElemLow);
      resetCategoryTabs();
      scrollToTop();
    } else if (highLow === "high") {
      //sort DOM items high to low

      const sortedElemHigh = currentGalleryArray.sort((product1, product2) => {
        let sale1: HTMLSpanElement | undefined;
        let sale2: HTMLSpanElement | undefined;
        sale1 = product1.querySelector(".sale-price") as
          | HTMLSpanElement
          | undefined;
        sale2 = product2.querySelector(".sale-price") as
          | HTMLSpanElement
          | undefined;

        if (sale1 && sale2) {
          return highLowBothItemsOnSale(product1, product2);
        } else if (!sale1 && sale2) {
          return highLowSecondItemOnSale(product1, product2);
        } else if (sale1 && !sale2) {
          return highLowFirstItemOnSale(product1, product2);
        } else {
          return highLowDefault(product1, product2);
        }
      });
      imageGalleryContainer.append(...sortedElemHigh);
      resetCategoryTabs();
      scrollToTop();
    }
  }
  const applyprice = document
    .querySelector(".mobile-filter-price")!
    .querySelector(".apply-price")! as HTMLButtonElement;
  applyprice.addEventListener("click", applyPriceFilter);
}
