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
  //console.log(refundsArray);
}

function calculateTotalAmountRefunded(refundsArray) {
  let totalAmountRefunded = document.querySelector("#totalAmountRefunded");

  let total = refundsArray.reduce((accumulator, refund) => {
    return accumulator + refund.amount;
  }, 0);

  totalAmountRefunded.innerText = `${total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;
}

function calculateRefundsQuantity(refundsArray) {
  let totalRefundsQuantity = document.querySelector("#totalRefundsQuantity");
  totalRefundsQuantity.innerText = `${refundsArray.length}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const refundTitle = document.querySelector("#refundTitle").value;
  const refundCategory = document.querySelector("#refundCategory").value;
  const refundAmount = document.querySelector("#refundAmount").value;

  let refund = new Refund(refundTitle, refundCategory, refundAmount);

  addRefundToArray(refund);

  calculateTotalAmountRefunded(refundsArray);

  calculateRefundsQuantity(refundsArray);

  createItemRefund(refundsArray);
});

function createItemRefund(refundsArray) {
  let ul = document.querySelector("#refundRequestsList");

  ul.innerHTML = "";

  refundsArray.forEach((item) => {
    let li = document.createElement("li");
    li.setAttribute("class", "expense");

    let iconCategory = document.createElement("img");
    iconCategory.setAttribute("src", "./assets/images/food.svg");

    let div = document.createElement("div");
    div.setAttribute("class", "expense-info");

    let title = document.createElement("strong");
    title.innerText = `${item.title}`;

    let category = document.createElement("span");
    category.innerText = `${item.category}`;

    let amount = document.createElement("span");
    amount.innerText = `${item.amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`;

    let removeRefund = document.createElement("img");
    removeRefund.setAttribute("src", "./assets/images/remove.svg");
    removeRefund.setAttribute("class", "remove-icon");

    ul.appendChild(li);
    li.appendChild(iconCategory);
    li.appendChild(div);
    div.appendChild(title);
    div.appendChild(category);
    li.appendChild(amount);
    li.appendChild(removeRefund);
  });
}
