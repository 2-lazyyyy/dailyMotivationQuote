$(document).ready(() => {
    const quoteElement = $('#quote');
    const authorName = $('#author');
    const intro = $('#intro');
    const backToday = $('.today');
    const totalQuotes = 119; // Total number of quotes
    const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in one day

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const startOfNextYear = new Date(now.getFullYear() + 1, 0, 0);
    const startOfPreviousYear = new Date(now.getFullYear() - 1, 0, 0);

    const getDayOfYear = (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / oneDay);

    const loadQuote = (index, dayOfYear, year) => {
        fetch(`app/get_quote.php?index=${index}`)
            .then(response => response.json())
            .then(data => {
                quoteElement.text(data.quote);
                authorName.text(data.author);
                intro.text(`This is ${index + 1}th quote for ${dayOfYear}th day of ${year}.`);
                currentQuoteIndex = index;
            });
    }

    // Initialize the current date and quote index
    let currentDate = now;
    let currentDayOfYear = getDayOfYear(currentDate);
    let currentQuoteIndex = currentDayOfYear % totalQuotes;

    loadQuote(currentQuoteIndex, currentDayOfYear, now.getFullYear());

    const updateBackTodayButton = () => {
        backToday.html('Back Today <i class="fa-solid fa-arrow-right" style="font-size: 50px; cursor: pointer"></i>');
        backToday.addClass('back');
        
        backToday.on('click', () => {
            location.reload();
        });

        backToday.on('mouseenter', () => {
            backToday.find('i').css({
                'transform': 'translateX(10px)',
                'transition': 'transform .5s ease'
            });
        });

        backToday.on('mouseleave', () => {
            backToday.find('i').css({
                'transform': 'translateX(0)'
            });
        });
    };

    $('#nextQuote').on('click', () => {
        if (currentQuoteIndex !== null) {
            currentDate = new Date(currentDate.getTime() + oneDay); // Move to the next day
            currentDayOfYear = getDayOfYear(currentDate);

            let nextIndex = (currentQuoteIndex + 1) % totalQuotes;

            if (currentDayOfYear >= Math.floor((startOfNextYear - startOfYear) / oneDay)) {
                currentDate = startOfNextYear;
                currentDayOfYear = getDayOfYear(currentDate);
                nextIndex = 0; // Start from the first quote of the new year
            }

            loadQuote(nextIndex, currentDayOfYear, currentDate.getFullYear());
            updateBackTodayButton();
        }
    });

    $('#prevQuote').on('click', () => {
        if (currentQuoteIndex !== null) {
            currentDate = new Date(currentDate.getTime() - oneDay); // Move to the previous day
            currentDayOfYear = getDayOfYear(currentDate);

            let prevIndex = (currentQuoteIndex - 1 + totalQuotes) % totalQuotes;

            if (currentDayOfYear < 1) {
                currentDate = startOfPreviousYear;
                currentDayOfYear = getDayOfYear(currentDate);
                prevIndex = totalQuotes - 1; // Go to the last quote of the previous year
            }

            loadQuote(prevIndex, currentDayOfYear, currentDate.getFullYear());
            updateBackTodayButton();
        }
    });

    $('#searchForm').on('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        const query = $('#searchInput').val().trim();

        if (query) {
            fetch(`app/search_quotes.php?query=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    const resultList = $('#resultList');
                    resultList.empty(); // Clear previous results

                    if (data && data.length > 0) {
                        data.forEach(result => {
                            resultList.append(`<li class="result-item">${result.quote} <em style="display: block;">- ${result.author}</em></li>`);
                        });
                    } else {
                        resultList.append('<li class="result-item">No results found.</li>');
                    }
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                    $('#resultList').html('<li class="result-item">Error fetching results.</li>');
                });

            // Show the modal
            const myModal = new bootstrap.Modal($('#exampleModal'));
            myModal.show();
        }
    });
});
