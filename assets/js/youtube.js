// YouTube functionality
const YOUTUBE_API_KEY = "AIzaSyCSeZzG1u99LqcTpm78P3-XSg4poOQEVCo";

let currentYouTubeTab = 'search';
let nextPageToken = '';
let currentChannelId = '';
let currentChannelFilter = 'all';
let currentChannelSort = 'newest';
let channelVideos = [];
let channelStreams = [];

function switchYouTubeTab(tab) {
    currentYouTubeTab = tab;
    
    document.querySelectorAll('.youtube-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    switch(tab) {
        case 'search':
            showEmptyYouTubeState();
            break;
        case 'history':
            showWatchHistory();
            break;
        case 'subscriptions':
            showSubscriptions();
            break;
        case 'channels':
            showChannelSearch();
            break;
    }
}

function showWatchHistory() {
    const resultsDiv = document.getElementById('results');
    
    if (watchHistory.length === 0) {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <h3>История просмотров пуста</h3>
                <p>${currentUser ? 'Начните смотреть видео, чтобы они появились здесь' : 'Войдите в аккаунт, чтобы сохранять историю просмотров'}</p>
                ${!currentUser ? `
                    <button class="search-btn" onclick="showAuthModal()" style="margin-top: 15px;">
                        🔐 Войти в аккаунт
                    </button>
                ` : ''}
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="color: #aaa; font-size: 14px; margin-bottom: 15px; padding: 0 10px;">
            📚 История просмотров: ${watchHistory.length} видео
            ${currentUser ? '<span style="color: #44ff44; margin-left: 10px;">💾 Сохранено</span>' : ''}
        </div>
    `;
    
    watchHistory.slice(-20).reverse().forEach(item => {
        const progressPercent = item.currentTime && item.duration ? 
            (item.currentTime / item.duration) * 100 : 0;
        const progressTime = formatTime(item.currentTime || 0);
        
        html += `
            <div class="history-item" onclick="playYouTubeVideo('${item.videoId}', ${item.currentTime || 0})">
                <img src="${item.thumbnail}" class="history-thumbnail" alt="${item.title}">
                <div class="history-info">
                    <div class="history-title">${item.title}</div>
                    <div class="history-channel">📺 ${item.channel}</div>
                    <div class="history-progress">
                        ${progressPercent > 0 ? `⏳ Просмотрено: ${progressTime} (${Math.round(progressPercent)}%)` : 'Не начато'}
                    </div>
                    <div style="color: #888; font-size: 12px; margin-top: 5px;">
                        📅 ${formatDate(item.watchedAt)}
                    </div>
                </div>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

function showSubscriptions() {
    const resultsDiv = document.getElementById('results');
    
    if (subscriptions.length === 0) {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⭐</div>
                <h3>${currentUser ? 'Нет подписок' : 'Войдите в аккаунт'}</h3>
                <p>${currentUser ? 'Подпишитесь на каналы, чтобы они появились здесь' : 'Чтобы сохранять подписки'}</p>
                ${!currentUser ? `
                    <button class="search-btn" onclick="showAuthModal()" style="margin-top: 15px;">
                        🔐 Войти в аккаунт
                    </button>
                ` : `
                    <button class="search-btn" onclick="switchYouTubeTab('channels')" style="margin-top: 15px;">
                        🔍 Найти каналы
                    </button>
                `}
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="color: #aaa; font-size: 14px; margin-bottom: 15px; padding: 0 10px;">
            ⭐ Подписки: ${subscriptions.length} каналов
            ${currentUser ? '<span style="color: #44ff44; margin-left: 10px;">💾 Сохранено</span>' : ''}
        </div>
    `;
    
    subscriptions.forEach(channel => {
        html += `
            <div class="channel-card" onclick="openChannel('${channel.id}')">
                <img src="${channel.thumbnail}" class="channel-avatar" alt="${channel.title}">
                <div class="channel-info">
                    <div class="channel-name">${channel.title}</div>
                    <div class="channel-stats">
                        👥 ${formatSubscribers(channel.subscriberCount)} • 📺 ${formatViews(channel.videoCount)} видео
                    </div>
                    <div class="channel-description">${channel.description || 'Описание отсутствует'}</div>
                </div>
                <button class="subscribe-btn subscribed" onclick="event.stopPropagation(); toggleSubscription('${channel.id}')">
                    ✅ Подписан
                </button>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = html;
}

// ... остальные функции YouTube ...
