let form = document.querySelector("form");
const refundsArray = [];

class Refund {
  constructor(title, category, amount) {
    this.id = crypto.randomUUID();
    this.title = String(title);
    this.category = String(category);
    this.amount = Number(amount);
  }
}

function addRefundToArray(refund) {
  refundsArray.push(refund);
  console.log(refundsArray);
}

function calculateTotalRefund(refundsArray) {
  return refundsArray.reduce((accumulator, refund) => {
    return accumulator + refund.amount;
  }, 0);
}

function calculateRefundsQuantity(refundsArray) {
  return refundsArray.length;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const refundTitle = document.querySelector("#refundTitle").value;
  const refundCategory = document.querySelector("#refundCategory").value;
  const refundAmount = document.querySelector("#refundAmount").value;

  let refund = new Refund(refundTitle, refundCategory, refundAmount);
  addRefundToArray(refund);
  let totalSumRefunds = calculateTotalRefund(refundsArray);
  console.log(totalSumRefunds);
  let totalRefundRequests = calculateRefundsQuantity(refundsArray);
  console.log(totalRefundRequests);

  createTags(refundsArray);
});

function createTags(refundsArray) {
  let ul = document.querySelector("#refundRequestsList");
  let li = document.createElement("li");
  li.setAttribute("class", "expense");
  let iconCategory = document.createElement("img");
  iconCategory.setAttribute("src", "./assets/images/food.svg");
  let div = document.createElement("div");
  div.setAttribute("class", "expense-info");
  let title = document.createElement("strong");
  let category = document.createElement("span");

  let amount = document.createElement("span");

  let removeRefund = document.createElement("img");
  removeRefund.setAttribute("src", "./assets/images/remove.svg");
  removeRefund.setAttribute("class", "remove-icon");

  refundsArray.forEach((item) => {
    title.innerText = `${item.title}`;
    category.innerText = `${item.category}`;
    amount.innerText = `${item.amount}`;
  });

  ul.appendChild(li);
  li.appendChild(iconCategory);
  li.appendChild(div);
  div.appendChild(title);
  div.appendChild(category);

  li.appendChild(amount);
  li.appendChild(removeRefund);
}
