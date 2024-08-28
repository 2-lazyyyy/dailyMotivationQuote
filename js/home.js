$(document).ready(function() {
    // Fetch username dynamically
    $.getJSON('app/fetch_username.php', function(data) {
        const $header = $('.msg');
        const $scores = $('.scores');
        const $login = $('.login');
        const $register = $('.register');
        const $logoutButton = $('#logoutButton');

        if (data.loggedIn) {
            // User is logged in
            $header.text(`Welcome, ${data.username}`);
            $scores.text('Scores').attr('href', 'scores.html').removeClass('hidden');
            $login.add($register).addClass('hidden');
            $register.parent('li').removeClass('nav-item');
            $login.parent('li').removeClass('nav-item');
            $logoutButton.text('Logout').attr('href', '#').removeClass('hidden');
            
            $logoutButton.off('click').on('click', function(e) {
                e.preventDefault(); // Prevent default link behavior
                $.post('app/logout.php', function(response) {
                    if (response === 'Logout successful') {
                        window.location.href = 'index.html';
                    }
                });
            });
        } else {
            // User is not logged in
            $scores.parent('li').removeClass('nav-item');
            $header.text('Please Log in');
            $login.text('Login').attr('href', 'login.html').removeClass('hidden');
            $register.text('Register').attr('href', 'signup.html').removeClass('hidden');
            $scores.add($logoutButton).addClass('hidden');
        }
    });

    $('#prevQuote').popover({
        trigger: 'hover',
        content: 'Previous',
        placement: 'left' // You can adjust the position if needed
      });

    $('#nextQuote').popover({
        trigger: 'hover',
        content: 'Next',
        placement: 'right' // You can adjust the position if needed
      });
});
