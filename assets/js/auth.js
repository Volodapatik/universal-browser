// Simple Auth System for GitHub Pages
let currentUser = null;
let watchHistory = [];
let subscriptions = [];

// Auth Functions
function showAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}

function hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    clearAuthErrors();
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    document.querySelector(`.auth-tab[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
    
    clearAuthErrors();
}

function clearAuthErrors() {
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

function registerWithEmail() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorElement = document.getElementById('registerError');

    if (!name || !email || !password) {
        errorElement.textContent = 'Заполните все поля';
        return;
    }

    if (!email.includes('@')) {
        errorElement.textContent = 'Введите корректный email';
        return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
    if (existingUsers[email]) {
        errorElement.textContent = 'Пользователь с таким email уже существует';
        return;
    }

    existingUsers[email] = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('users', JSON.stringify(existingUsers));

    const userData = {
        watchHistory: [],
        subscriptions: []
    };
    localStorage.setItem(`user_${email}`, JSON.stringify(userData));

    hideAuthModal();
    showNotification('✅ Аккаунт создан успешно! Теперь войдите.');
    switchAuthTab('login');
}

function loginWithEmail() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');

    if (!email || !password) {
        errorElement.textContent = 'Заполните все поля';
        return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
    const user = existingUsers[email];

    if (!user) {
        errorElement.textContent = 'Пользователь не найден';
        return;
    }

    if (user.password !== password) {
        errorElement.textContent = 'Неверный пароль';
        return;
    }

    currentUser = {
        uid: email,
        email: email,
        displayName: user.name
    };

    const userData = JSON.parse(localStorage.getItem(`user_${email}`) || '{"watchHistory":[],"subscriptions":[]}');
    watchHistory = userData.watchHistory || [];
    subscriptions = userData.subscriptions || [];

    updateAuthUI();
    hideAuthModal();
    showNotification('✅ Вход выполнен успешно!');
}

function loginWithGoogle() {
    showNotification('🔧 Google авторизация временно недоступна. Используйте email и пароль.');
}

function logout() {
    currentUser = null;
    watchHistory = JSON.parse(localStorage.getItem('youtubeHistory')) || [];
    subscriptions = JSON.parse(localStorage.getItem('youtubeSubscriptions')) || [];
    updateAuthUI();
    showNotification('🔒 Вы вышли из аккаунта');
}

function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    
    if (currentUser) {
        const displayName = currentUser.displayName || currentUser.email.split('@')[0];
        const firstLetter = displayName.charAt(0).toUpperCase();
        
        authSection.innerHTML = `
            <div class="user-profile" onclick="showUserMenu()">
                <div class="user-avatar">${firstLetter}</div>
                <div class="user-name">${displayName}</div>
            </div>
        `;
    } else {
        authSection.innerHTML = '<button class="auth-btn" onclick="showAuthModal()">Войти</button>';
    }
}

function showUserMenu() {
    if (confirm('Вы хотите выйти из аккаунта?')) {
        logout();
    }
}

function saveUserData() {
    if (!currentUser) {
        localStorage.setItem('youtubeHistory', JSON.stringify(watchHistory));
        localStorage.setItem('youtubeSubscriptions', JSON.stringify(subscriptions));
        return;
    }

    const userData = {
        watchHistory: watchHistory,
        subscriptions: subscriptions
    };
    localStorage.setItem(`user_${currentUser.email}`, JSON.stringify(userData));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(255, 68, 68, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
