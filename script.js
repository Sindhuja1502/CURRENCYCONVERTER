const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");/*used to access from and tocurrency*/
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg"); /*final amount is stored in msg*/

for (let select of dropdowns) {
  for (currCode in countryList) {/*getting all country codes in dropdown .from code.js file*/
    let newOption = document.createElement("option");  
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") { /*initially keeping the options as usd and inr*/
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {/*when the selection changes it goes to update flag function   aandd select comes in the console indicating option is selected to someother county*/
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value; /*what we type in the textarea that will be displayed in console*/
  /*we are only performing action not automatic action is done we prevented it with  evt.preventDefault();*/
  if (amtVal === "" || amtVal < 1) {/*if nothing is enter or negative enterd and button is clicked then set it to 1*/
    amtVal = 1;
    amount.value = "1";
  }
  // console.log(fromCurr.value,toCurr.value);/*can check curreency values in console*/
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  let response = await fetch(URL); /*await is used to need to make updateexchangerate function async*  AND we can see response in console */
  if (!response.ok) {
  msg.innerText = "Exchange rate not available!";
  return;
}
  let data = await response.json(); /*we get date and inr(option selected at TO) data when printed in cosole*/
 let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
 /*selected will be converted to exchanged rate like for inr the rate will be 80   for this from is usd only*/

  let finalAmount = amtVal * rate;
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`; /*final amount is displayed from 1 cuurency amount to another currency amount*/
};

const updateFlag = (element) => {
  let currCode = element.value; /*once we get the county code then changes can be made so get that first*/
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();/*preventing some things to happen ex:changing adress in address bar*/
  updateExchangeRate();/*when event occurs means like after selecting clicking on button then the currency exchange will be done in function updateexchangerate*/
});

window.addEventListener("load", () => {  /*when the page loads it automatically we get converted one*/
  updateExchangeRate();
});