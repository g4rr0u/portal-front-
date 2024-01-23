document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        fetch('php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `login=${encodeURIComponent(login)}&` +
                    `password=${encodeURIComponent(password)}`,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('auth is ok!');
                localStorage.setItem('login', data.login);
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('fullName', data.surname + " " + data.name + " " + data.patronimyc)
                if (data.role === 2) {
                    window.location.href = 'adminPanel.html';
                } else {
                    window.location.href = 'cabinet.html';
                }
            } else {
                console.log('invalid data')
            }
        })
    });
});