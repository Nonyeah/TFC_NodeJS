function productSearch(e: Event) {
  let query: string | null;
  const pattern = new RegExp("[a-zs]+", "i");
  const searchInput = document.querySelector(
    ".search-input"
  ) as HTMLInputElement;
  if (searchInput) {
    query = searchInput.value;
    const searchQuery: string | number = query.length <= 2 ? 1 : query;
    //check for invalid search strings
    if (searchQuery === 1) {
      return e.preventDefault();
    }
    //validate user input pattern
    const match = pattern.test(query);
    if (match) {
      return true;
    } else {
      return e.preventDefault();
    }
  }
}

function mobileProductSearch(e: Event) {
  let query: string | null;
  const pattern = new RegExp("[a-zs]+", "i");
  const searchInput = document.querySelector(
    ".mobile-search-input"
  ) as HTMLInputElement;
  if (searchInput) {
    query = searchInput.value;
    const searchQuery: string | number = query.length <= 2 ? 1 : query;
    //check for invalid search strings
    if (searchQuery === 1) {
      return e.preventDefault();
    }
    //validate user input pattern
    const match = pattern.test(query);
    if (match) {
      return true;
    } else {
      return e.preventDefault();
    }
  }
}

const form = document.querySelector(".search-form");
if (form) form.addEventListener("submit", (e: Event) => productSearch(e));

const mobileForm = document.querySelector(".mobile-search-form");
if (mobileForm)
  mobileForm.addEventListener("submit", (e: Event) => mobileProductSearch(e));


//add products to wishlist from category pages
function categoryAddWishlistInit() {
  const productCollection = document.querySelectorAll(
    "span[data-rocFormName]"
  ) as NodeListOf<HTMLElement>;
  const wishHeartPages = document.getElementById(
    "wishheart-pages"
  ) as HTMLSpanElement;
  const mobileWishHeartPages = document.getElementById(
    "mobile-wishheart-pages"
  ) as HTMLSpanElement;
  const topNav = document.querySelector(".topnav")! as HTMLDivElement;
  const mobileNavMenu = document.querySelector(
    ".mobile-nav-menu"
  )! as HTMLDivElement;

  function categoryAddWishlist(this: HTMLSpanElement, e: Event) {
    const target = (e.target as HTMLSpanElement).closest("span");
    if (target) {
      const rocAttribute = target.getAttribute("data-rocFormName");
      const itemCodeAttribute = target.getAttribute("data-itemCode");
      if (!rocAttribute) return;
      if (rocAttribute) {
        const parentPara = this.parentElement as HTMLParagraphElement;
        const parentDiv = parentPara.parentElement as HTMLDivElement;
        const brand = parentDiv.querySelector(
          ".product-brand"
        ) as HTMLParagraphElement;
        const name = parentDiv.querySelector(
          ".product-name"
        ) as HTMLParagraphElement;
        const price = parentDiv.querySelector(
          ".product-price"
        ) as HTMLParagraphElement | null;
        const salePrice = parentDiv.querySelector(
          ".sale-price"
        ) as HTMLParagraphElement | null;
        const type = (parentDiv.querySelector("img") as HTMLImageElement).alt;
        const url = (parentDiv.querySelector("span") as HTMLSpanElement).getAttribute("data-urlName");
        const image = (parentDiv.querySelector("img") as HTMLImageElement).src;
        const rocFormName = rocAttribute;
        const itemCode = itemCodeAttribute;

        const productDataObject = {
          brand: brand.textContent,
          name: name.textContent,
          price: price ? price.textContent : "",
          salePrice: salePrice ? salePrice.textContent : "",
          type,
          url,
          image,
          rocFormName,
          itemCode,
        };

        localStorage.setItem(rocAttribute, JSON.stringify(productDataObject));
      }

      const itemAddedTab = document.createElement("span");
      itemAddedTab.textContent = "Item added to wishlist";
      itemAddedTab.classList.add("item-added-tab");
      this.style.color = "red";

      if (!wishHeartPages.style.color) {
        wishHeartPages.style.color = "red";
      }

      if (!mobileWishHeartPages.style.color) {
        mobileWishHeartPages.style.color = "red";
      }

      //append item added tab for desktop site
      if (topNav.getBoundingClientRect().bottom) {
        (async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          topNav.after(itemAddedTab);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          itemAddedTab.remove();
        })();
      } else if (mobileNavMenu.getBoundingClientRect().bottom) {
        //append item added tab for mobile site
        (async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          mobileNavMenu.after(itemAddedTab);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          itemAddedTab.remove();
        })();
      }
    }
  }

  for (let elem of productCollection) {
    elem.addEventListener("click", categoryAddWishlist);
  }
}

const createWishControlsPages = () => {
  const form: HTMLFormElement | undefined = document.getElementById(
    "form-wishlist-pages"
  ) as HTMLFormElement;
  const extractKeys = Object.keys(localStorage);
  const ROCWishlistArray = extractKeys.filter((key) => key.includes("ROC"));
  if (!ROCWishlistArray.length) return false;

  ROCWishlistArray.forEach((wish) => {
    const input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "mywish");
    input.setAttribute("value", wish);
    if (form) form.prepend(input);
  });
  console.log(form.outerHTML);
  return true;
};

const mobileCreateWishControlsPages = () => {
  const form: HTMLFormElement | undefined = document.getElementById(
    "mobile-form-wishlist-pages"
  ) as HTMLFormElement;
  const extractKeys = Object.keys(localStorage);
  const ROCWishlistArray = extractKeys.filter((key) => key.includes("ROC"));
  if (!ROCWishlistArray.length) return false;

  ROCWishlistArray.forEach((wish) => {
    const input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "mywish");
    input.setAttribute("value", wish);
    if (form) form.prepend(input);
  });
  console.log(form.outerHTML);
  return true;
};

function categoryShowWishlistInit() {
  const yourWishlistPages = document.getElementById(
    "form-wishlist-pages"
  ) as HTMLFormElement;
  const yourMobileWishlistPages = document.getElementById(
    "mobile-form-wishlist-pages"
  ) as HTMLFormElement;

  if (yourWishlistPages)
    yourWishlistPages.addEventListener("submit", createWishControlsPages);
  if (yourMobileWishlistPages)
    yourMobileWishlistPages.addEventListener(
      "submit",
      mobileCreateWishControlsPages
    );
}

categoryAddWishlistInit();
categoryShowWishlistInit();
