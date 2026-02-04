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





