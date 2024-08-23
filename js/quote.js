document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('quote');
    const authorName = document.getElementById('author');
    const intro = document.getElementById('intro');
    const backToday = document.querySelector('.today');
    

    const totalQuotes = 119; // Total number of quotes
    const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in one day

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const startOfNextYear = new Date(now.getFullYear() + 1, 0, 0);
    const startOfPreviousYear = new Date(now.getFullYear() - 1, 0, 0);

    function getDayOfYear(date) {
        return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / oneDay);
    }

    function loadQuote(index, dayOfYear, year) {
        fetch(`/app/get_quote.php?index=${index}`)
            .then(response => response.json())
            .then(data => {
                quoteElement.textContent = data.quote;
                authorName.textContent = data.author;
                intro.textContent = `This is ${index + 1}th quote for ${dayOfYear}th day of ${year}.`;
                currentQuoteIndex = index;
            });
    }

    // Initialize the current date and quote index
    let currentDate = now;
    let currentDayOfYear = getDayOfYear(currentDate);
    let currentQuoteIndex = currentDayOfYear % totalQuotes;

    loadQuote(currentQuoteIndex, currentDayOfYear, now.getFullYear());

    document.getElementById('nextQuote').addEventListener('click', () => {
        if (currentQuoteIndex !== null) {
            currentDate = new Date(currentDate.getTime() + oneDay); // Move to the next day
            currentDayOfYear = getDayOfYear(currentDate);

            // Calculate next index
            let nextIndex = (currentQuoteIndex + 1) % totalQuotes;

            // Handle year transition
            if (currentDayOfYear >= Math.floor((startOfNextYear - startOfYear) / oneDay)) {
                currentDate = startOfNextYear;
                currentDayOfYear = getDayOfYear(currentDate);
                nextIndex = 0; // Start from the first quote of the new year
            }

            loadQuote(nextIndex, currentDayOfYear, currentDate.getFullYear());
            backToday.textContent = 'Back Today'
            $('.today').css({'cursor':'pointer'});
            backToday.innerHTML +=  ' <i class="fa-solid fa-arrow-right " style="font-size: 50px; cursor: pointer"></i>'; // Add back arrow icon
            $('.today').addClass('back')    
            $('.back').on('click', function() {
                // Reload the current page
                location.reload();
            });

            $('.today').hover(function() {
                $(this).find('i').css({
                    'transform': 'translateX(10px)',
                    'transition': 'transform .5s ease' // Example of a hover effect
                });
            }, function() {
                $(this).find('i').css({
                    'transform': 'translateX(0)' // Reset scale on mouse out
                });
            });

        }
    });

    document.getElementById('prevQuote').addEventListener('click', () => {
        if (currentQuoteIndex !== null) {
            currentDate = new Date(currentDate.getTime() - oneDay); // Move to the previous day
            currentDayOfYear = getDayOfYear(currentDate);

            // Calculate previous index
            let prevIndex = (currentQuoteIndex - 1 + totalQuotes) % totalQuotes;

            // Handle year transition
            if (currentDayOfYear < 1) {
                currentDate = startOfPreviousYear;
                currentDayOfYear = getDayOfYear(currentDate);
            prevIndex = totalQuotes - 1; // Go to the last quote of the previous year
        }

        loadQuote(prevIndex, currentDayOfYear, currentDate.getFullYear());
        backToday.textContent = 'Back Today'
        $('.today').addClass('back')    
        $('.today').css({'cursor':'pointer'});
        backToday.innerHTML +=  ' <i class="fa-solid fa-arrow-right"></i>'; // Add back arrow icon

        $('.back').on('click', function() {
            // Reload the current page
            location.reload();
        });

        $('.today').hover(function() {
            $(this).find('i').css({
                'transform': 'translateX(10px)',
                'transition': 'transform .5s ease' // Example of a hover effect
            });
        }, function() {
            $(this).find('i').css({
                'transform': 'translateX(0)' // Reset scale on mouse out
            });
        });

    }
});

   
});

$(document).ready(function() {
    $('#searchForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const searchInput = $('#searchInput');
        const query = searchInput.val().trim();
        
        if (query) {
            fetch(`./../app/search_quotes.php?query=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    
                    const resultList = $('#resultList');
                    resultList.empty(); // Clear previous results

                    if (data && data.length > 0) {
                        data.forEach(result => {
                            resultList.append(`<li class="result-item">${result.quote} <em style="display: block;">- ${result.author}</em></li>`);
                        })
                    } else {
                        resultList.append('<li class="result-item">No results found.</li>');
                    }
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                    $('#resultList').html('<li class="result-item">Error fetching results.</li>');
                });

            // Show the modal
            var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            myModal.show();
        }
    });
});