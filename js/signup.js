$(document).ready(() => {
    // Toggle password visibility
    const togglePasswordVisibility = (toggleButtonId, passwordFieldId) => {
        $(toggleButtonId).click(() => {
            const passwordInput = $(passwordFieldId);
            const icon = $(toggleButtonId);
            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                icon.removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                passwordInput.attr('type', 'password');
                icon.removeClass('fa-eye-slash').addClass('fa-eye');
            }
        });
    };

    togglePasswordVisibility('#togglePassword', '#password');
    togglePasswordVisibility('#toggleConfirmPassword', '#confirmPassword');

    // Handle form submission
    $('#signupForm').on('submit', function(e) {
        e.preventDefault();

        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();

        if (password !== confirmPassword) {
            $('#signupStatus').text('Passwords do not match').css('color', 'red');
            return;
        }

        const formData = new FormData(this);

        fetch('/api/signup.php', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            $('#signupStatus').text(data.message).css('color', data.status === 'success' ? 'green' : 'red');
            if (data.status === 'success') {
                window.location.href = '/login.html';
            }
        })
        .catch(() => {
            $('#signupStatus').text('An error occurred. Please try again.').css('color', 'red');
        });
    });
});
