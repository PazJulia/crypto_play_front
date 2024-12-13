// URL base para as requisições
const baseUrl = `http://127.0.0.1:5000`;

// Elementos HTML relacionados à busca e informações da moeda
const searchWrapper = document.querySelector('.input-wrapper');
const infoMoedaWrapper = document.querySelector('.coin-info');
const moedasAdicionadasWrapper = document.querySelector('.added-coins');

/**
 * Função a ser chamada na inicialização para buscar dados de saldo e moedas do usuário
 */
function buscarDadosUsuario() {
    const url = `${baseUrl}/usuario`;

    fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(data => renderizarUserInfo(data))
        .catch(err => console.log(err));
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
buscarDadosUsuario();

/**
 * Função que renderiza infos do Usuário
 * @param {Object} data - Objeto contendo dados de moeda.
 * @param {string} data.coin_gecko_id - O ID único da moeda.
 * @param {number} data.cota - Valor da cota comprada.
 * @param {string} data.nome - Nome da moeda.
 * @param {string} data.simbolo_url - Url para renderizar ícone da moeda.
 */
function renderizarUserInfo(data) {
    let saldo = document.getElementById('saldo-disponivel');
    let balanco = document.getElementById('balanco-total');

    saldo.textContent = data.saldo_disponivel;
    balanco.textContent = data.balanco_total;

    // Verificar se possui filhos e remover
    while (moedasAdicionadasWrapper.firstChild) {
        moedasAdicionadasWrapper.removeChild(moedasAdicionadasWrapper.firstChild);
    }

    const existemMoedas = data.moedas.length > 0;
    if (existemMoedas) {
        data.moedas?.forEach(moeda => {
            const cardMoeda = document.createElement('div');
            cardMoeda.classList.add('card');
            cardMoeda.innerHTML = `<div class="flex flex-column align-center gap-1">
                    <div class="flex flex-row gap-05"><img src="${moeda.simbolo_url}" alt="${moeda.nome}" class="coin-image" />
                    <strong>${moeda.nome}</strong></div>
                    <span><strong>Cota:</strong> ${moeda.cota}</span>
                </div>`;

            // Adiciona um evento de clique para cada item
            /*li.addEventListener('click', () => {
                handleItemClick(item); // Passa o item completo para o evento de clique
            });
*/
            moedasAdicionadasWrapper.appendChild(cardMoeda);
        })
    }
}

/**
 * Formata um valor numérico para o formato de moeda BRL (Real Brasileiro).
 * @param {number} value - O valor numérico que será formatado.
 * @returns {string} - O valor formatado como uma string no formato de moeda BRL.
 */
function formatCurrencyBRL(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

/**
 * Função que executa a busca por moedas a partir do valor digitado no campo de pesquisa.
 * Se o campo estiver vazio, exibe um alerta.
 */
function buscarMoedas() {
    let inputCoin = document.getElementById('coinSearch').value;
    if (inputCoin === '') {
        alert("Preencha a busca");
    } else {
        searchCoin(inputCoin).then();
    }
}

/**
 * Realiza uma busca assíncrona por informações sobre as moedas.
 * @async
 * @param {string} inputCoin - O nome ou símbolo da moeda a ser buscada.
 */
async function searchCoin(inputCoin) {
    const params = new URLSearchParams({nome: inputCoin});
    const url = `${baseUrl}/moeda?${params.toString()}`;

    try {
        const response = await fetch(url, {method: 'GET'});
        const data = await response.json();
        renderResults(data.coins);
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Limpa os resultados da pesquisa, escondendo o wrapper de resultados.
 */
function limparResultadoPesquisa() {
    searchWrapper.classList.remove('show');
}

/**
 * Renderiza os resultados da pesquisa na tela.
 * @param {Array} results - A lista de moedas retornada pela busca.
 */
function renderResults(results) {
    const ul = document.querySelector('.results ul');
    ul.innerHTML = ''; // Limpar resultados anteriores

    if (!results.length) {
        limparResultadoPesquisa();
        alert("Nenhum resultado encontrado");
        return;
    }

    results.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.name;  // Exibe o nome da moeda

        // Adiciona um evento de clique para cada item
        li.addEventListener('click', () => {
            handleItemClick(item); // Passa o item completo para o evento de clique
        });

        ul.appendChild(li);
    });

    searchWrapper.classList.add('show');
}

/**
 * Busca informações detalhadas de uma moeda específica.
 * @async
 * @param {Object} moeda - O objeto da moeda selecionada.
 * @param {string} moeda.id - O ID único da moeda.
 */
async function buscarMoeda(moeda) {
    const url = encodeURI(`${baseUrl}/moeda/info?coin_gecko_id=${encodeURIComponent(moeda.id)}`);

    try {
        const response = await fetch(url, {method: 'GET'});
        const data = await response.json();
        createCoinCard(moeda, data);
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Função de placeholder para a lógica de compra da moeda.
 * Se obtiver sucesso, exibe alerta e recarrega dados de moedas e de saldo
 * @param {string} value - O campo de entrada do valor a ser comprado.
 * @param {Object} coin - Objeto com informações da moeda.
 * @param {number} price - Valor da moeda em BRL.
 */
function comprar(value, coin, price) {
    if (!value.length) alert("Insira o valor");
    else {
        const formData = new FormData();
        formData.append('coin_gecko_id', coin.symbol);
        formData.append('nome', coin.name);
        formData.append('simbolo_url', coin.thumb);
        formData.append('valor_moeda', price[coin.id]['brl']);
        formData.append('valor', parseCurrencyToNumber(value).toString());


        const url = `${baseUrl}/moeda/comprar`;
        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                removerCoinCard();
                buscarDadosUsuario();
            })
            .catch(error => console.log(error));
    }
}

function removerCoinCardChild() {
    if (infoMoedaWrapper.firstChild) {
        infoMoedaWrapper.removeChild(infoMoedaWrapper.firstChild);
    }
}

function removerCoinCard() {
    removerCoinCardChild();
    infoMoedaWrapper.classList.remove('card');
}

/**
 * Cria e exibe um card com informações detalhadas sobre uma moeda.
 * @param {Object} coin - O objeto que contém os dados da moeda.
 * @param {Object} price - O valor atual da moeda em BRL.
 * @param {string} coin.id - O ID único da moeda.
 * @param {string} coin.name - O nome da moeda.
 * @param {string} coin.symbol - O símbolo da moeda.
 * @param {string} coin.thumb - A URL da imagem da moeda.
 */
function createCoinCard(coin, price) {
    // Limpa o cartão existente, se houver
    removerCoinCardChild();

    // Cria o elemento do cartão
    const card = document.createElement('div');
    card.className = 'coin-card';

    const transformedCoinPrice = formatCurrencyBRL(price[coin.id]['brl']); // Formata o preço da moeda

    // Define o conteúdo do cartão
    card.innerHTML = `
        <div class="flex flex-column">
            <div class="flex justify-space-between flex-wrap align-center">
                <div class="flex align-center gap-1">
                    <img src="${coin.thumb}" alt="${coin.name}" class="coin-image" />
                    <strong>${coin.name} (${coin.symbol.toUpperCase()})</strong>
                </div>
                <span>${transformedCoinPrice}</span>
            </div>
            <div class="flex flex-row flex-wrap">
                <input type="text" id="buy-coin-input" placeholder="Digite um valor" />
                <button id="buy-coin-btn" class="primary-btn">Comprar</button>
            </div>
        </div>
    `;

    // Adiciona o cartão à interface
    infoMoedaWrapper.classList.add('card');
    infoMoedaWrapper.appendChild(card);

    // Adiciona evento ao campo de entrada e botão de compra
    const input = card.querySelector('#buy-coin-input');
    input.addEventListener('input', handleCurrencyInput);
    input.addEventListener('blur', handleCurrencyInput);

    const btn = card.querySelector('#buy-coin-btn');
    btn.addEventListener('click', () => comprar(input.value, coin, price)); // Lógica de compra
}

/**
 * Manipula o valor inserido no campo de entrada de moeda, formatando-o de acordo com o tipo de evento.
 * @param {Event} event - O evento disparado quando o usuário interage com o campo de entrada.
 */
function handleCurrencyInput(event) {
    const input = event.target;
    const isBlurEvent = event.type === 'blur';
    const rawValue = input.value.replace(/[^\d,]/g, ''); // Remove caracteres não numéricos
    const numericValue = parseFloat(rawValue.replace(',', '.')); // Converte para número

    if (rawValue === '') {
        input.value = ''; // Mantém campo vazio
        return;
    }

    if (!isNaN(numericValue)) {
        if (isBlurEvent) {
            // Formata como moeda ao sair do campo
            input.value = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(numericValue);
        } else {
            // Limita a 2 casas decimais enquanto o usuário digita
            input.value = numericValue
                .toFixed(2)
                .replace('.', ',');
        }
    }
}

/**
 * Converte uma string formatada como moeda em um número.
 *
 * @param {string} currencyString - A string contendo o valor monetário formatado (ex: "R$ 1.234,56").
 * @returns {number} - O valor numérico correspondente à string fornecida, ou 0 se a conversão falhar.
 */
function parseCurrencyToNumber(currencyString) {
    // Remove o símbolo da moeda (R$) e qualquer outro caractere não numérico, exceto a vírgula
    const cleanedString = currencyString.replace(/[^\d,.-]/g, '').replace(',', '.');

    // Converte para número
    const numericValue = parseFloat(cleanedString);

    // Retorna o número, ou 0 se a conversão falhar
    return isNaN(numericValue) ? 0 : numericValue;
}

/**
 * Função chamada ao clicar em um item da lista de moedas.
 * Limpa os resultados da pesquisa e exibe informações sobre a moeda selecionada.
 * @param {Object} item - O objeto da moeda selecionada.
 */
function handleItemClick(item) {
    limparResultadoPesquisa(); // Limpa os resultados
    buscarMoeda(item); // Busca informações da moeda selecionada
}

/**
 * Função que gerencia a troca entre os temas claro e escuro da interface.
 * O tema é salvo no localStorage para ser persistido entre as sessões.
 */
const themeToggleButton = document.getElementById('themeIcon');
const rootElement = document.documentElement;
const savedTheme = localStorage.getItem('theme');
const lightThemeToken = 'light-theme';

// Aplica a preferência salva se existir
if (savedTheme) {
    rootElement.classList.toggle(lightThemeToken, savedTheme === 'light');
}

const isLightTheme = rootElement.classList.contains(lightThemeToken);
const moonIcon = '<i class="fas fa-moon"></i>';
const sunIcon = '<i class="fas fa-sun"></i>';

themeToggleButton.innerHTML = isLightTheme
    ? moonIcon
    : sunIcon;

// Adiciona o evento de troca de tema
themeToggleButton.addEventListener('click', () => {
    const isLightTheme = rootElement.classList.toggle(lightThemeToken);

    // Salva a preferência no localStorage
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');

    // Atualiza o ícone
    themeToggleButton.innerHTML = isLightTheme
        ? moonIcon
        : sunIcon;
});
