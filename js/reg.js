document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const surname = document.getElementById('surname').value;
        const name = document.getElementById('name').value;
        const patronimyc = document.getElementById('patronimyc').value;
        const login = document.getElementById('login').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('confirmPassword').value

        if (password !== confirmPassword){
            document.getElementById('passwordDontMatch').style.display = "unset";
            console.log('password doesnt match')
            return;
        } else {
           fetch('php/registration.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `surname=${encodeURIComponent(surname)}&` +
                    `name=${encodeURIComponent(name)}&` +
                    `patronimyc=${encodeURIComponent(patronimyc)}&` +
                    `login=${encodeURIComponent(login)}&` +
                    `email=${encodeURIComponent(email)}&` +
                    `password=${encodeURIComponent(password)}`,
           })
           .then(response => response.json())
           .then(data => {
            if (data.success) {
                console.log('reg is ok!')
                localStorage.setItem('login', login);
                localStorage.setItem('user_id', data.user_id);
                window.location.href = 'cabinet.html';
            } else {
                if (data.error === 'Login or Email Exist') {
                    console.log('log or email');
                } else {
                    console.log('unknown');
                }
            }
        });
        }
    });
});