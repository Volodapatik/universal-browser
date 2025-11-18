// Main application functionality
let currentMode = 'browser';

function switchMode(mode) {
    currentMode = mode;
    nextPageToken = '';
    currentSearchQuery = '';
    browserStartIndex = 1;
    
    document.getElementById('browserMode').classList.toggle('active', mode === 'browser');
    document.getElementById('youtubeMode').classList.toggle('active', mode === 'youtube');
    
    const searchInput = document.getElementById('searchInput');
    const modeInfo = document.getElementById('modeInfo');
    const statusText = document.getElementById('statusText');
    const youtubeNav = document.getElementById('youtubeNav');
    
    if (mode === 'browser') {
        searchInput.placeholder = "Поиск в интернете...";
        modeInfo.textContent = "Режим: Поиск";
        statusText.textContent = "✅ Готов к поиску в интернете";
        youtubeNav.style.display = 'none';
        showEmptyState();
    } else {
        searchInput.placeholder = "Поиск YouTube видео...";
        modeInfo.textContent = "Режим: YouTube";
        statusText.textContent = "✅ Готов к поиску на YouTube";
        youtubeNav.style.display = 'flex';
        switchYouTubeTab('search');
    }
}

function showEmptyState() {
    document.getElementById('results').innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>Выберите режим и введите запрос</h3>
            <p>Начните поиск в интернете или на YouTube</p>
            
            <div class="quick-actions">
                <button class="quick-btn" onclick="searchQuick('техно музыка')">🎵 Техно</button>
                <button class="quick-btn" onclick="searchQuick('lofi hip hop')">🎶 Lo-Fi</button>
                <button class="quick-btn" onclick="searchQuick('jazz')">🎷 Джаз</button>
                <button class="quick-btn" onclick="searchQuick('фонк')">🔥 Фонк</button>
            </div>
        </div>
    `;
}

function showEmptyYouTubeState() {
    document.getElementById('results').innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📺</div>
            <h3>Введите запрос для поиска на YouTube</h3>
            <p>Или перейдите в другие разделы</p>
            
            <div class="quick-actions">
                <button class="quick-btn" onclick="searchQuick('музыка 2024')">🎵 Музыка 2024</button>
                <button class="quick-btn" onclick="searchQuick('игровые стримы')">🎮 Стримы</button>
                <button class="quick-btn" onclick="searchQuick('обзоры фильмов')">🎬 Обзоры</button>
                <button class="quick-btn" onclick="searchQuick('уроки программирования')">💻 Программирование</button>
            </div>
        </div>
    `;
}

function showLoading(query) {
    document.getElementById('results').innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Ищем "${query}"${currentMode === 'youtube' ? ' на YouTube' : ''}...</p>
        </div>
    `;
}

function showError(message) {
    document.getElementById('results').innerHTML = `
        <div class="error">❌ ${message}</div>
    `;
}

function showNoResults(query) {
    document.getElementById('results').innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>По запросу "${query}" ничего не найдено</h3>
            <p>Попробуйте изменить запрос</p>
        </div>
    `;
}

// Helper functions
function formatSubscribers(count) {
    if (!count) return '0';
    const num = parseInt(count);
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

function formatDate(publishedAt) {
    const date = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дней назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} мес. назад`;
    return `${Math.floor(diffDays / 365)} лет назад`;
}

// Initialize
window.addEventListener('load', function() {
    switchMode('browser');
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    document.getElementById('searchInput').focus();
});
