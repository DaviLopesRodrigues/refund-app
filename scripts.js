// Seleciona elementos do DOM para manipulação e exibição de dados
const refundForm = document.querySelector("form"); // Seleciona o elemento <form> para manipulação dos eventos de submissão
const refundTitle = document.querySelector("#refundTitle"); // Seleciona o campo de entrada do título do reembolso
const refundCategory = document.querySelector("#refundCategory"); // Seleciona o campo de entrada da categoria do reembolso
const refundAmount = document.querySelector("#refundAmount"); // Seleciona o campo de entrada do valor do reembolso
const totalAmountRefunded = document.querySelector("#totalAmountRefunded"); // Seleciona o elemento onde o total reembolsado será exibido
const totalRefundsQuantity = document.querySelector("#totalRefundsQuantity"); // Seleciona o elemento onde a quantidade total de reembolsos será exibida

// Array para armazenar os dados dos reembolsos
let refundsArray = []; // Inicializa um array vazio para armazenar os reembolsos

// Objeto que mapeia categorias para seus ícones e nomes em português
const categoriesAndIcons = {
  food: {
    category_pt_br: "Alimentação", // Nome da categoria em português
    icon: "assets/images/food.svg", // Caminho do ícone correspondente
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

// Classe para criar objetos de reembolso
class Refund {
  constructor(title, category, amount) {
    this.id = crypto.randomUUID(); // Gera um ID único para o reembolso
    this.title = String(title); // Converte o título para string
    this.category = String(category); // Converte a categoria para string
    this.amount = Number(amount); // Converte o valor para número
  }
}

// Evento que captura a submissão do formulário e executa funções para adicionar o reembolso
refundForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Impede o comportamento padrão de recarregar a página ao submeter o formulário
  let refund = new Refund(
    refundTitle.value, // Obtém o valor do título do reembolso
    refundCategory.value, // Obtém o valor da categoria do reembolso
    refundAmount.value // Obtém o valor do valor do reembolso
  );

  addRefundToArray(refund); // Adiciona o reembolso ao array

  updateStatistics(refundsArray); // Atualiza as estatísticas de reembolsos

  createItemRefund(refundsArray); // Cria e exibe o item de reembolso na interface

  clearInputs(refundTitle, refundCategory, refundAmount); // Limpa os campos de entrada do formulário
});

// Função para adicionar o reembolso ao array e salvar no localStorage
function addRefundToArray(refund) {
  refundsArray.push(refund); // Adiciona o reembolso ao array de reembolsos
  saveToLocalStorage(); // Salva o array atualizado no localStorage
}

// Função para criar os elementos de reembolso na interface
function createItemRefund(refundsArray) {
  let ul = document.querySelector("#refundRequestsList"); // Seleciona o elemento <ul> que contém a lista de reembolsos
  ul.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

  refundsArray.forEach((item) => {
    let li = document.createElement("li"); // Cria um novo elemento <li> para cada reembolso
    li.setAttribute("class", "expense"); // Adiciona a classe "expense" ao <li>
    li.setAttribute("data-id", `${item.id}`); // Define o atributo data-id com o ID do reembolso

    let iconCategory = document.createElement("img"); // Cria um elemento <img> para o ícone da categoria
    iconCategory.setAttribute(
      "src",
      `${categoriesAndIcons[item.category]["icon"]}` // Define o caminho do ícone com base na categoria
    );
    iconCategory.setAttribute("id", "categoryIcon"); // Define o ID do ícone

    let div = document.createElement("div"); // Cria um elemento <div> para informações do reembolso
    div.setAttribute("class", "expense-info"); // Adiciona a classe "expense-info" ao <div>

    let title = document.createElement("strong"); // Cria um elemento <strong> para o título
    title.innerText = `${item.title}`; // Define o texto do título com o valor do reembolso

    let category = document.createElement("span"); // Cria um elemento <span> para a categoria
    category.innerText = `${
      categoriesAndIcons[item.category]["category_pt_br"] // Define o texto da categoria em português
    }`;

    let amount = document.createElement("span"); // Cria um elemento <span> para o valor
    amount.innerText = `${item.amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`; // Formata o valor como moeda brasileira

    let removeRefund = document.createElement("img"); // Cria um elemento <img> para o ícone de remover
    removeRefund.setAttribute("src", "./assets/images/remove.svg"); // Define o caminho do ícone de remoção
    removeRefund.setAttribute("class", "remove-icon"); // Define a classe do ícone de remoção

    removeRefund.addEventListener("click", () => {
      let itemId = li.getAttribute("data-id"); // Obtém o ID do reembolso a ser removido

      removeItemRefund(itemId); // Chama a função para remover o reembolso
    });

    ul.appendChild(li); // Adiciona o <li> à lista
    li.appendChild(iconCategory); // Adiciona o ícone da categoria ao <li>
    li.appendChild(div); // Adiciona o <div> ao <li>
    div.appendChild(title); // Adiciona o título ao <div>
    div.appendChild(category); // Adiciona a categoria ao <div>
    li.appendChild(amount); // Adiciona o valor ao <li>
    li.appendChild(removeRefund); // Adiciona o ícone de remoção ao <li>
  });
}

// Função para remover um item de reembolso do array e da interface
function removeItemRefund(id) {
  if (id !== null) {
    refundsArray = refundsArray.filter((refund) => refund.id !== id); // Filtra o array removendo o reembolso com o ID correspondente
    saveToLocalStorage(); // Salva o array atualizado no localStorage
    updateStatistics(refundsArray); // Atualiza as estatísticas de reembolsos
    const itemToRemove = document.querySelector(`[data-id="${id}"]`); // Seleciona o elemento <li> correspondente ao ID
    if (itemToRemove) {
      itemToRemove.remove(); // Remove o elemento da interface
    } else {
      alert("Erro ao excluir item"); // Exibe um alerta em caso de erro
    }
  }
}

// Função para atualizar as estatísticas de valor total e quantidade de reembolsos
function updateStatistics(refundsArray) {
  let total = refundsArray.reduce((accumulator, refund) => {
    return accumulator + refund.amount; // Calcula o total acumulado dos valores dos reembolsos
  }, 0);

  totalAmountRefunded.innerText = `${total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`; // Atualiza o total reembolsado formatado como moeda brasileira

  totalRefundsQuantity.innerText = `${refundsArray.length}`; // Atualiza a quantidade total de reembolsos
}

// Função para salvar o array de reembolsos no localStorage
function saveToLocalStorage() {
  localStorage.setItem("refunds", JSON.stringify(refundsArray)); // Salva o array de reembolsos no localStorage
}

// Função para carregar os reembolsos salvos no localStorage ao iniciar a aplicação
function loadFromLocalStorage() {
  const savedRefunds = localStorage.getItem("refunds"); // Obtém os reembolsos salvos no localStorage
  if (savedRefunds) {
    refundsArray = JSON.parse(savedRefunds); // Converte a string JSON de volta para um array
    createItemRefund(refundsArray); // Cria os itens de reembolso na interface
    updateStatistics(refundsArray); // Atualiza as estatísticas de reembolsos
  }
}

// Função para limpar os campos de entrada do formulário
function clearInputs(inputRefundTitle, inputRefundCategory, inputRefundAmount) {
  inputRefundTitle.value = ""; // Limpa o campo de entrada do título
  inputRefundCategory.value = ""; // Limpa o campo de entrada da categoria
  inputRefundAmount.value = ""; // Limpa o campo de entrada do valor
}

// Chama a função para carregar os reembolsos do localStorage ao iniciar
loadFromLocalStorage();
