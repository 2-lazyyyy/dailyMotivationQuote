document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('quote');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let currentQuoteIndex = null;

    function loadQuote(index) {
        fetch(`/app/get_quote.php?index=${index}`)
            .then(response => response.text())
            .then(data => {
                quoteElement.innerHTML = data;
                currentQuoteIndex = index;
            });
    }

    // Initial load
    const dayOfYear = (new Date()).getDay() + 1;
    loadQuote(dayOfYear);

    document.getElementById('nextQuote').addEventListener('click', () => {
        if (currentQuoteIndex !== null) {
            loadQuote((currentQuoteIndex + 1) % 119); // Assuming 119 quotes
        }
    });

    document.getElementById('prevQuote').addEventListener('click', () => {
        if (currentQuoteIndex !== null) {
            loadQuote((currentQuoteIndex - 1 + 119) % 119); // Assuming 119 quotes
        }
    });

    document.getElementById('searchQuote').addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetch(`/app/search_quotes.php?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    searchResults.innerHTML = data.map(quote =>
                        `<blockquote><p>${quote.quote}</p><p>${quote.author}</p></blockquote>`
                    ).join('');
                } else {
                    searchResults.innerHTML = '<p>No quotes found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                searchResults.innerHTML = '<p>Error fetching search results.</p>';
            });
    });

   
});
