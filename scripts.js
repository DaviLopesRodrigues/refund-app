const form = document.querySelector("form");
const refundTitle = document.querySelector("#refundTitle");
const refundCategory = document.querySelector("#refundCategory");
const refundAmount = document.querySelector("#refundAmount");
const totalAmountRefunded = document.querySelector("#totalAmountRefunded");
const totalRefundsQuantity = document.querySelector("#totalRefundsQuantity");

let refundsArray = [];

const categoriesAndIcons = {
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
    updateStatistics(refundsArray);
  }
}

function addRefundToArray(refund) {
  refundsArray.push(refund);
  saveToLocalStorage();
}

function updateStatistics(refundsArray) {
  let total = refundsArray.reduce((accumulator, refund) => {
    return accumulator + refund.amount;
  }, 0);

  totalAmountRefunded.innerText = `${total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;

  totalRefundsQuantity.innerText = `${refundsArray.length}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let refund = new Refund(
    refundTitle.value,
    refundCategory.value,
    refundAmount.value
  );

  addRefundToArray(refund);

  updateStatistics(refundsArray);

  createItemRefund(refundsArray);

  clearInputs(refundTitle, refundCategory, refundAmount);
});

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
  if (id !== null) {
    refundsArray = refundsArray.filter((refund) => refund.id !== id);
    saveToLocalStorage();
    updateStatistics(refundsArray);
    const itemToRemove = document.querySelector(`[data-id="${id}"]`);
    if (itemToRemove) {
      itemToRemove.remove();
    } else {
      alert("Erro ao excluir item");
    }
  }
}

function clearInputs(inputRefundTitle, inputRefundCategory, inputRefundAmount) {
  inputRefundTitle.value = "";
  inputRefundCategory.value = "";
  inputRefundAmount.value = "";
}

loadFromLocalStorage();
