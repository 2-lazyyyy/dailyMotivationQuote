$(document).ready(() => {
    $('#togglePassword').click(() => {
        const passwordInput = $('#password');
        const icon = $('#togglePassword');
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        $.ajax({
            url: 'api/login.php',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: (data) => {
                
                if (data.status === 'success') {
                    window.location.href = 'index.html';
                    $('#loginStatus').text(data.message).css({'color':'green'});
                } else {
                    $('#loginStatus').text(data.message).css({'color':'red'});
                }
            }
        });
    });
});