/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
    let url = 'http://127.0.0.1:5000/produtos';
    fetch(url, {
        method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um ítem na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
    const formData = new FormData();
    formData.append('nome', inputProduct);
    formData.append('quantidade', inputQuantity);
    formData.append('valor', inputPrice);

    let url = 'http://127.0.0.1:5000/produto';
    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada ítem da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um ítem da lista conforme o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            let div = this.parentElement.parentElement;
            const nomeItem = div.getElementsByTagName('td')[0].innerHTML
            if (confirm("Você tem certeza?")) {
                div.remove()
                deleteItem(nomeItem)
                alert("Removido!")
            }
        }
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um ítem da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
    console.log(item)
    let url = 'http://127.0.0.1:5000/produto?nome=' + item;
    fetch(url, {
        method: 'delete'
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo ítem com nome, quantidade e valor
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
    let inputProduct = document.getElementById("newInput").value;
    let inputQuantity = document.getElementById("newQuantity").value;
    let inputPrice = document.getElementById("newPrice").value;

    if (inputProduct === '') {
        alert("Escreva o nome de um item!");
    } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
        alert("Quantidade e valor precisam ser números!");
    } else {
        insertList(inputProduct, inputQuantity, inputPrice)
        postItem(inputProduct, inputQuantity, inputPrice).then()
        alert("Item adicionado!")
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir ítens na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
    const item = [nameProduct, quantity, price];
    const table = document.getElementById('myTable');
    const row = table.insertRow();

    for (let i = 0; i < item.length; i++) {
        const cel = row.insertCell(i);
        cel.textContent = item[i];
    }
    insertButton(row.insertCell(-1))
    document.getElementById("newInput").value = "";
    document.getElementById("newQuantity").value = "";
    document.getElementById("newPrice").value = "";

    removeElement()
}

/*
  --------------------------------------------------------------------------------------
  Função para alterar tema da página
  --------------------------------------------------------------------------------------
*/

// Obtém o botão de troca de tema e o elemento root do documento
const themeToggleButton = document.getElementById('themeIcon');
const rootElement = document.documentElement;

// Verifica se existe uma preferência de tema salva no localStorage
const savedTheme = localStorage.getItem('theme');

// Se houver preferência salva, aplica o tema correspondente
const lightThemeToken = 'light-theme';
if (savedTheme) {
    rootElement.classList.toggle(lightThemeToken, savedTheme === 'light');
}

// Inicializa o ícone com base no tema salvo
const isLightTheme = rootElement.classList.contains(lightThemeToken);

// Define o ícone correto com base no tema atual
const moonIcon = '<i class="fas fa-moon"></i>';
const sunIcon = '<i class="fas fa-sun"></i>';

themeToggleButton.innerHTML = isLightTheme
    ? moonIcon
    : sunIcon;

// Adiciona o evento de clique no botão de troca de tema
themeToggleButton.addEventListener('click', () => {
    const isLightTheme = rootElement.classList.toggle(lightThemeToken);

    // Salva a preferência de tema do usuário no localStorage
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');

    // Atualiza o ícone com base no tema atual
    themeToggleButton.innerHTML = isLightTheme
        ? moonIcon
        : sunIcon;
});
