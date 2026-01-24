const subscriberForm = document.querySelector("#form") as HTMLFormElement;
const input = document.querySelector("#input") as HTMLInputElement;
const button = document.querySelector("#submit-button") as HTMLButtonElement;
const message = document.querySelector(
  "#subscribe-response"
) as HTMLParagraphElement;
const mobileSubscriberForm = document.querySelector("#mobile-form") as HTMLFormElement;
const mobileMessage = document.querySelector(
  "#mobile-subscribe-response"
) as HTMLParagraphElement;
const mobileInput = document.querySelector("#mobile-input") as HTMLInputElement;
const mobileButton = document.querySelector(
  "#mobile-submit-button"
) as HTMLButtonElement;
const text = document.querySelector(
  ".hidden-subscribe-text"
) as HTMLParagraphElement;

const mobileText = document.querySelector(
  ".hidden-subscribe-mobile-text"
) as HTMLParagraphElement;

//input!.addEventListener("click", (e) => e.stopPropagation());

function submitForm(e: Event) {
  e.preventDefault();
  const email = input.value.toLowerCase().trim();
  if (email.length > 80) return;
  const reg = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$");
  const match = reg.test(email);
  try {
    if (match) {
      fetch("/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ email: email }),
      })
        .then((response) => response.text())
        .then((responseMessge) => (message.textContent = responseMessge))
        .then(() => {
          setTimeout(() => {
            message.textContent = "";
            input.value = "";
          }, 6000);
        });
    } else {
      message.innerHTML = "Please enter a vaild email addresss";
      return;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "Error occured. Please try again later";
  } finally {
    text.style.height = "";
  }
}

function mobileSubmitForm(e: Event) {
  e.preventDefault();
  let email = mobileInput.value;
  email = email.toLowerCase().trim();
  if (email.length > 80) return;
  const reg = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$");
  const match = reg.test(email);
  try {
    if (match) {
      fetch("/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ email: email }),
      })
        .then((response) => response.text())
        .then((responseMessge) => (mobileMessage.textContent = responseMessge))
        .then(() => {
          setTimeout(() => {
            mobileMessage.textContent = "";
            mobileInput.value = "";
          }, 6000);
        });
    } else {
      mobileMessage.innerHTML = "Please enter a vaild email addresss";
      return;
    }
  } catch (err) {
    console.log(err);
    mobileMessage.textContent =
      "We can't process your request right now. Please try again later";
  } finally {
    mobileText.style.height = "";
  }
}

subscriberForm.addEventListener("submit", submitForm);
mobileSubscriberForm.addEventListener("submit", mobileSubmitForm);
