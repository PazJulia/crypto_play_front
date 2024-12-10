const searchWrapper = document.querySelector('.input-wrapper');

function buscarMoeda() {
    let inputCoin = document.getElementById('coinSearch').value;

    if (inputCoin === '') {
        alert("Preencha a busca");
    } else {
        searchCoin(inputCoin);
    }
}

async function searchCoin(inputCoin) {
    const params = new URLSearchParams({ nome: inputCoin });
    const url = `http://127.0.0.1:5000/moeda?${params.toString()}`;

    try {
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        renderResults(data.coins);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderResults(results) {
    const ul = document.querySelector('.results ul');

    // Clear the previous list items
    ul.innerHTML = '';

    if (!results.length) {
        searchWrapper.classList.remove('show');
        alert("Nenhum resultado encontrado")
        return;
    }

    results.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.name;  // Assuming 'name' is the property you want to display

        // Add a click event listener to each list item
        li.addEventListener('click', () => {
            handleItemClick(item); // Handle click event and pass the full item
        });

        ul.appendChild(li);
    });

    searchWrapper.classList.add('show');
}

function handleItemClick(item) {
    alert(`You clicked on: ${item.name}\nSymbol: ${item.symbol}\nDescription: ${item.description}`);
    // Perform further actions with the `item` object here
}

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
