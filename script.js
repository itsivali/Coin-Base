// Function to fetch currency data from Coinbase API
async function fetchCurrencyData() {
    try {
        const response = await fetch('https://api.coinbase.com/v2/currencies');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching currency data:', error);
        return [];
    }
}

// Function to render currency cards on the page
async function renderCurrencyCards(searchQuery = '') {
    const currencyData = await fetchCurrencyData();
    const filteredData = filterCurrencyData(currencyData, searchQuery);
    const currencyCardsContainer = document.getElementById('crypto-cards');
    currencyCardsContainer.innerHTML = ''; // Clear previous cards

    filteredData.forEach(currency => {
        const currencyCard = createCard(`${currency.name} (${currency.id})`, `Min Size: ${currency.min_size}`);
        currencyCardsContainer.appendChild(currencyCard);
    });
}

// Function to fetch exchange rates from the API
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.coinbase.com/v2/exchange-rates');
        const data = await response.json();
        return data.data.rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return {};
    }
}

// Function to render exchange rate cards on the page
async function renderExchangeRates(searchQuery = '') {
    const exchangeRates = await fetchExchangeRates();
    const exchangeRatesContainer = document.getElementById('crypto-cards');
    exchangeRatesContainer.innerHTML = ''; // Clear previous cards

    Object.keys(exchangeRates).forEach(currency => {
        if (currency.toLowerCase().includes(searchQuery.toLowerCase())) {
            const rate = exchangeRates[currency];
            const card = createCard(currency, `Rate: ${rate}`);
            exchangeRatesContainer.appendChild(card);
        }
    });
}

// Function to fetch buy prices from the API
async function fetchBuyPrices(currencyPair) {
    try {
        const response = await fetch(`https://api.coinbase.com/v2/prices/${currencyPair}/buy`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching buy prices:', error);
        return {};
    }
}

// Function to render buy price cards on the page
async function renderBuyPrices(currencyPair) {
    const buyPrices = await fetchBuyPrices(currencyPair);
    const buyPricesContainer = document.getElementById('crypto-cards');
    buyPricesContainer.innerHTML = ''; // Clear previous cards

    const currency = currencyPair.split('-')[1]; // Extract currency from currency pair

    const card = createCard(`${currency} Buy Price`, `Amount: ${buyPrices.amount}`);
    buyPricesContainer.appendChild(card);
}

// Function to fetch sell prices from the API
async function fetchSellPrices(currencyPair) {
    try {
        const response = await fetch(`https://api.coinbase.com/v2/prices/${currencyPair}/sell`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching sell prices:', error);
        return {};
    }
}

// Function to render sell price cards on the page
async function renderSellPrices(currencyPair) {
    const sellPrices = await fetchSellPrices(currencyPair);
    const sellPricesContainer = document.getElementById('crypto-cards');
    sellPricesContainer.innerHTML = ''; // Clear previous cards

    const currency = currencyPair.split('-')[1]; // Extract currency from currency pair

    const card = createCard(`${currency} Sell Price`, `Amount: ${sellPrices.amount}`);
    sellPricesContainer.appendChild(card);
}

// Function to create a card element
function createCard(title, content) {
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'mb-4');
    card.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${content}</p>
            </div>
        </div>
    `;
    return card;
}

// Function to filter currency data based on search query
function filterCurrencyData(currencyData, searchQuery) {
    return currencyData.filter(currency => {
        return currency.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            currency.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
}

// Add event listener for search button
document.getElementById('search-btn').addEventListener('click', function () {
    const searchQuery = document.getElementById('search-input').value;
    const selectedRadio = document.querySelector('input[type="radio"]:checked');
    if (selectedRadio) {
        const value = selectedRadio.value;
        if (value === 'exchange-rates') {
            renderExchangeRates(searchQuery);
        } else if (value.startsWith('buy-price-')) {
            const currencyPair = value.substring('buy-price-'.length); // Extract currency pair
            renderBuyPrices(currencyPair);
        } else if (value.startsWith('sell-price-')) {
            const currencyPair = value.substring('sell-price-'.length); // Extract currency pair
            renderSellPrices(currencyPair);
        } else if (value === 'currencies') {
            renderCurrencyCards(searchQuery);
        }
    }
    // Clear search input field
    document.getElementById('search-input').value = '';
});
// Add event listener for search input field keyup event
document.getElementById('search-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        const searchQuery = this.value;
        const selectedRadio = document.querySelector('input[type="radio"]:checked');
        if (selectedRadio) {
            const value = selectedRadio.value;
            if (value === 'exchange-rates') {
                renderExchangeRates(searchQuery);
            } else if (value.startsWith('buy-price-')) {
                const currencyPair = value.substring('buy-price-'.length); // Extract currency pair
                renderBuyPrices(currencyPair);
            } else if (value.startsWith('sell-price-')) {
                const currencyPair = value.substring('sell-price-'.length); // Extract currency pair
                renderSellPrices(currencyPair);
            } else if (value === 'currencies') {
                renderCurrencyCards(searchQuery);
            }
        }
        // Clear search input field
        this.value = '';
    }
});

// Render currency cards when the page loads
document.addEventListener('DOMContentLoaded', function () {
    renderCurrencyCards();
});

// Add event listener for radio buttons
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const searchQuery = document.getElementById('search-input').value;
        if (this.value === 'exchange-rates') {
            renderExchangeRates(searchQuery);
        } else if (this.value.startsWith('buy-price-')) {
            const currencyPair = this.value.substring('buy-price-'.length); // Extract currency pair
            renderBuyPrices(currencyPair);
        } else if (this.value.startsWith('sell-price-')) {
            const currencyPair = this.value.substring('sell-price-'.length); // Extract currency pair
            renderSellPrices(currencyPair);
        } else if (this.value === 'currencies') {
            renderCurrencyCards(searchQuery);
        }
    });
});
