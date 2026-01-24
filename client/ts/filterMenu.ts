export function productFilter() {
  const topImageBorder = document.querySelector(
    ".top-image-border"
  ) as HTMLDivElement;
  const imageGalleryContainer = document.querySelector(
    ".image-gallery-container"
  )! as HTMLElement;

  const originalDom: NodeListOf<HTMLElement> =
    imageGalleryContainer.querySelectorAll<HTMLElement>(".product-container");

  const filterButtonContainer = document.querySelector(
    ".filter-button-container"
  ) as HTMLDivElement;

  const countContainer = document.querySelector(
    ".product-count"
  )! as HTMLDivElement;

  const createClearFilterButton = () => {
    let clearFilters: HTMLAnchorElement = document.createElement("a");
    clearFilters.href = "#";
    clearFilters.innerHTML = "Clear all filters";
    clearFilters.classList.add("clear-filters");

    //define function to clear all filters applied and reset product count
    clearFilters.onclick = function (e: Event) {
      e.preventDefault();
      imageGalleryContainer.innerHTML = "";
      imageGalleryContainer.append(...originalDom);
      filterButtonContainer.innerHTML = "";
      countContainer.firstElementChild!.textContent = `${originalDom.length.toString()} products`;
    };

    //remove duplicate clear filter button if it exists, before appending new clear filter button
    const filterDuplicate =
      filterButtonContainer.querySelector(".clear-filters");
    if (filterDuplicate) {
      filterDuplicate.remove();
    }
    filterButtonContainer.append(clearFilters);
  };

  //define scrollIntoViewfunction
  const scrollToTop = () => {
    topImageBorder.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  //define function to count products in current DOM
  const productSortCount = () => {
    const productArray: HTMLDivElement[] = [
      ...(imageGalleryContainer.querySelectorAll(
        ".product-container"
      ) as NodeListOf<HTMLDivElement>),
    ];
    const count = productArray.length;
    if (count === 1) {
      countContainer.firstElementChild!.textContent = `${count.toString()} Product`;
    } else {
      countContainer.firstElementChild!.textContent = `${count.toString()} Products`;
    }
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
      resetCategoryTabs();
      scrollToTop();
      return;
    }

    imageGalleryContainer.innerHTML = "";
    imageGalleryContainer.append(...filteredGallery);

    function resetCategoryTabs() {
      parentUl.style.display = "none";
      label.classList.toggle("open");
      for (let inputTag of inputs) {
        inputTag.checked = false;
      }
    }

    productSortCount();
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
        if (fButtonCollection.length) {
          for (let button of fButtonCollection) {
            if (button.textContent.toLowerCase() === string) {
              button.remove();
            }
          }
        }

        filterButtonContainer.append(filterButton);
      });
    };

    createFilterButtons();
    createClearFilterButton();
    scrollToTop();
  }

  for (const button of document.querySelectorAll(".apply-category")) {
    button.addEventListener("click", applyFilter);
  }

  //define helper function
  type HelperFunction = (
    elem1: HTMLDivElement,
    elem2: HTMLDivElement
  ) => number;

  //define helper functions
  const lowHighFirstItemOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    const price1 = Number(
      item1.querySelector(".sale-price")!.innerHTML.trim().slice(1)
    );
    const price2 = Number(
      item2.querySelector(".product-price")!.innerHTML.trim().slice(1)
    );
    return price1 - price2;
  };

  const lowHighSecondItemOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    const price1 = item1
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    const price2 = item2.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    return +price1 - +price2;
  };

  const lowHighBothItemsOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    const price1 = item1.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    const price2 = item2.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    return +price1 - +price2;
  };

  const lowHighDefault: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    const price1 = item1
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    const price2 = item2
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    return +price1 - +price2;
  };

  const highLowFirstItemOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    const price1 = item1.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    const price2 = item2
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    return +price2 - +price1;
  };

  const highLowSecondItemOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    const price1 = item1
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    const price2 = item2.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    return +price2 - +price1;
  };

  const highLowBothItemsOnSale: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    const price1 = item1.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    const price2 = item2.querySelector(".sale-price")!.innerHTML.trim().slice(1);
    return +price2 - +price1;
  };

  const highLowDefault: HelperFunction = (
    item1: HTMLDivElement,
    item2: HTMLDivElement
  ) => {
    const price1 = item1
      .querySelector(".product-price")!
      .innerHTML.trim()
      .slice(1);
    const price2 = item2
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

    const checkedInput: HTMLInputElement[] = [...parentUl.querySelectorAll("input")].filter(
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
      parentUl.style.display = "none";
      label.classList.toggle("open");
      for (let inputTag of inputs) {
        inputTag.checked = false;
      }
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
  const applyprice = document.querySelector(
    ".apply-price"
  )! as HTMLButtonElement;
  applyprice.addEventListener("click", applyPriceFilter);
}
