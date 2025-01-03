let form = document.querySelector("form");
let refundsArray = [];

class Refund {
  constructor(title, category, amount) {
    this.id = crypto.randomUUID();
    this.title = String(title);
    this.category = String(category);
    this.amount = Number(amount);
  }
}

function saveToLocalStorage() {
  localStorage.setItem("refunds", JSON.stringify(refundsArray));
}

function loadFromLocalStorage() {
  const savedRefunds = localStorage.getItem("refunds");
  if (savedRefunds) {
    refundsArray = JSON.parse(savedRefunds);
    createItemRefund(refundsArray);
    calculateTotalAmountRefunded(refundsArray);
    calculateRefundsQuantity(refundsArray);
  }
}

function addRefundToArray(refund) {
  refundsArray.push(refund);
  saveToLocalStorage();
  console.log(refundsArray);
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

  clearInputs(
    document.querySelector("#refundTitle"),
    document.querySelector("#refundCategory"),
    document.querySelector("#refundAmount")
  );
});

let categoriesAndIcons = {
  food: {
    category_pt_br: "Alimentação",
    icon: "assets/images/food.svg",
  },
  accommodation: {
    category_pt_br: "Acomodação",
    icon: "assets/images/accommodation.svg",
  },
  services: {
    category_pt_br: "Seviços",
    icon: "assets/images/services.svg",
  },
  transport: {
    category_pt_br: "Transporte",
    icon: "assets/images/transport.svg",
  },
  others: {
    category_pt_br: "Outros",
    icon: "assets/images/others.svg",
  },
};

function createItemRefund(refundsArray) {
  let ul = document.querySelector("#refundRequestsList");
  ul.innerHTML = "";

  refundsArray.forEach((item) => {
    let li = document.createElement("li");
    li.setAttribute("class", "expense");
    li.setAttribute("data-id", `${item.id}`);

    let iconCategory = document.createElement("img");
    iconCategory.setAttribute(
      "src",
      `${categoriesAndIcons[item.category]["icon"]}`
    );
    iconCategory.setAttribute("id", "categoryIcon");

    let div = document.createElement("div");
    div.setAttribute("class", "expense-info");

    let title = document.createElement("strong");
    title.innerText = `${item.title}`;

    let category = document.createElement("span");
    category.innerText = `${
      categoriesAndIcons[item.category]["category_pt_br"]
    }`;

    let amount = document.createElement("span");
    amount.innerText = `${item.amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`;

    let removeRefund = document.createElement("img");
    removeRefund.setAttribute("src", "./assets/images/remove.svg");
    removeRefund.setAttribute("class", "remove-icon");

    removeRefund.addEventListener("click", () => {
      let itemId = li.getAttribute("data-id");

      removeItemRefund(itemId);
    });

    ul.appendChild(li);
    li.appendChild(iconCategory);
    li.appendChild(div);
    div.appendChild(title);
    div.appendChild(category);
    li.appendChild(amount);
    li.appendChild(removeRefund);
  });
}

function removeItemRefund(id) {
  refundsArray = refundsArray.filter((refund) => refund.id !== id);

  saveToLocalStorage();
  calculateTotalAmountRefunded(refundsArray);
  calculateRefundsQuantity(refundsArray);
  createItemRefund(refundsArray);
}

function clearInputs(refundTitle, refundCategory, refundAmount) {
  refundTitle.value = "";
  refundCategory.value = "";
  refundAmount.value = "";
}

loadFromLocalStorage();
