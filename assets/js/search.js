// Search functionality
const SEARCH_API_KEY = "AIzaSyClSXPxjAzchdDLnUQtsqpObaWMjaCpVsc";
const SEARCH_ENGINE_ID = "941011482ddeb4a66";

let currentSearchQuery = '';
let browserStartIndex = 1;
let isLoadingMore = false;

async function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        showError('Введите поисковый запрос');
        return;
    }

    currentSearchQuery = query;
    browserStartIndex = 1;
    isLoadingMore = false;
    
    showLoading(query);
    
    try {
        if (currentMode === 'youtube') {
            await searchYouTubeVideos(query);
        } else {
            await searchWeb(query);
        }
    } catch (error) {
        showError(`Ошибка: ${error.message}`);
    }
}

async function searchWeb(query, loadMore = false) {
    if (!loadMore) {
        browserStartIndex = 1;
    }
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${SEARCH_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&start=${browserStartIndex}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        if (data.items && data.items.length > 0) {
            browserStartIndex = data.queries.nextPage ? data.queries.nextPage[0].startIndex : null;
            
            if (loadMore) {
                appendBrowserResults(data.items, query, data.searchInformation);
            } else {
                displayBrowserResults(data.items, query, data.searchInformation);
            }
        } else {
            if (!loadMore) showNoResults(query);
        }
    } catch (error) {
        await fallbackSearch(query, loadMore);
    }
}

function displayBrowserResults(items, query, searchInfo) {
    const resultsDiv = document.getElementById('results');
    const totalResults = searchInfo?.formattedTotalResults || items.length;
    
    let html = `
        <div style="color: #aaa; font-size: 14px; margin-bottom: 15px; padding: 0 10px;">
            🔍 Найдено результатов: ${totalResults}
        </div>
    `;
    
    items.forEach((item) => {
        html += `
            <div class="browser-result" onclick="window.open('${item.link}', '_blank')">
                <div class="result-title">${item.title}</div>
                <div class="result-url">${item.displayLink}</div>
                <div class="result-snippet">${item.snippet}</div>
            </div>
        `;
    });
    
    if (browserStartIndex) {
        html += `
            <div class="load-more-container">
                <button class="load-more-btn" onclick="loadMoreResults()">
                    📥 Загрузить еще (10 результатов)
                </button>
            </div>
        `;
    }
    
    resultsDiv.innerHTML = html;
}

function searchQuick(query) {
    document.getElementById('searchInput').value = query;
    performSearch();
}

// ... остальные функции поиска ...
