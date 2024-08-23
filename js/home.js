$(document).ready(function() {
    // Fetch username dynamically
    $.getJSON('/app/fetch_username.php', function(data) {
        const $header = $('.msg');
        const $dashboard = $('.dashboard');
        const $login = $('.login');
        const $register = $('.register');
        const $logoutButton = $('#logoutButton');

        if (data.loggedIn) {
            // User is logged in
            $header.text(`Welcome, ${data.username}`);
            $dashboard.text('Dashboard').attr('href', '/dashboard.html').removeClass('hidden');
            $login.add($register).addClass('hidden');
            $register.parent('li').removeClass('nav-item');
            $login.parent('li').removeClass('nav-item');
            $logoutButton.text('Logout').attr('href', '#').removeClass('hidden');
            
            $logoutButton.off('click').on('click', function(e) {
                e.preventDefault(); // Prevent default link behavior
                $.post('/app/logout.php', function(response) {
                    if (response === 'Logout successful') {
                        window.location.href = 'index.html';
                    }
                });
            });
        } else {
            // User is not logged in
            $dashboard.parent('li').removeClass('nav-item');
            $header.text('Please Log in');
            $login.text('Login').attr('href', '/login.html').removeClass('hidden');
            $register.text('Register').attr('href', '/signup.html').removeClass('hidden');
            $dashboard.add($logoutButton).addClass('hidden');
        }
    });
});
