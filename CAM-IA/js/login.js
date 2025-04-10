document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = localStorage.getItem('turisarAuth');
    if (isAuthenticated) {
        redirectToAdminPanel();
    }
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            document.getElementById('error-message').classList.add('hidden');
        });
    });
});


function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    const validCredentials = [
        { username: 'admin', password: 'admin' },
        { username: 'profesor', password: 'ia12025' }
    ];
    const isValid = validCredentials.some(
        cred => cred.username === username && cred.password === password
    );
    
    if (isValid) {
        localStorage.setItem('turisarAuth', 'true');
        localStorage.setItem('turisarUsername', username);
        redirectToAdminPanel();
    } else {
        errorMessage.textContent = 'Usuario o contraseña incorrectos';
        errorMessage.classList.remove('hidden');
    }
}
function redirectToAdminPanel() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect === 'admin') {
        window.location.href = 'admin/dashboard.html';
    } else {
        window.location.href = 'admin/dashboard.html';
    }
}
