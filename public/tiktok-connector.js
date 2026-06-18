// TikTok Live Connection
let ws = null;
const giftMapping = {
    'Rose': 10,
    'Teddy Bear': 25,
    'Diamond': 50,
    'VirtualGift': 100,
    'PK Gift': 100
};

const countryGifts = {
    'saudi': 0,
    'uae': 0,
    'qatar': 0,
    'kuwait': 0,
    'bahrain': 0,
    'oman': 0
};

// Connect to TikTok Live
async function connectToTikTok() {
    const username = document.getElementById('username-input').value.trim();
    
    if (!username) {
        showMessage('الرجاء إدخال اسم المستخدم!', 'error');
        return;
    }

    const messageDiv = document.getElementById('connection-message');
    messageDiv.textContent = '⏳ جاري الاتصال...';
    messageDiv.classList.add('show');

    try {
        const response = await fetch('/api/connect-tiktok', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(`✅ متصل بـ @${username}!`, 'success');
            document.getElementById('connect-btn').style.display = 'none';
            document.getElementById('disconnect-btn').style.display = 'inline-block';
            updateStatusIndicator(true);
            setupWebSocket();
        } else {
            showMessage(`❌ خطأ: ${data.error}`, 'error');
        }
    } catch (error) {
        console.error('Connection error:', error);
        showMessage('❌ فشل الاتصال. تحقق من اسم المستخدم!', 'error');
    }
}

// Disconnect from TikTok Live
async function disconnectFromTikTok() {
    try {
        await fetch('/api/disconnect-tiktok', {
            method: 'POST'
        });

        showMessage('✅ تم قطع الاتصال', 'success');
        document.getElementById('connect-btn').style.display = 'inline-block';
        document.getElementById('disconnect-btn').style.display = 'none';
        updateStatusIndicator(false);
        closeWebSocket();
    } catch (error) {
        console.error('Disconnect error:', error);
    }
}

// Setup WebSocket connection
function setupWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleTikTokEvent(data);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket closed');
    };
}

// Close WebSocket
function closeWebSocket() {
    if (ws) {
        ws.close();
        ws = null;
    }
}

// Handle TikTok events
function handleTikTokEvent(event) {
    addActivityLog(event);

    switch (event.type) {
        case 'gift':
            handleGift(event);
            break;
        case 'like':
            handleLike(event);
            break;
        case 'follow':
            handleFollow(event);
            break;
        case 'connected':
            updateStatusIndicator(true);
            break;
        case 'disconnected':
            updateStatusIndicator(false);
            break;
    }
}

// Handle gift event
function handleGift(event) {
    const { username, giftName, giftCount } = event;
    
    // Map gift to points
    let points = giftMapping[giftName] || 10;
    points *= giftCount;

    // Randomly select a country
    const countries = ['saudi', 'uae', 'qatar', 'kuwait', 'bahrain', 'oman'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];

    // Add gift
    addGift(randomCountry, giftName, points);
    
    console.log(`🎁 Gift from ${username}: ${giftName} x${giftCount} = ${points} points to ${randomCountry}`);
}

// Handle like event
function handleLike(event) {
    const { username, likeCount } = event;
    
    // Add points for likes
    const countries = ['saudi', 'uae', 'qatar', 'kuwait', 'bahrain', 'oman'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    
    // 1 like = 1 point
    const points = likeCount;
    addGift(randomCountry, 'Like', points);
    
    console.log(`👍 Like from ${username}: ${likeCount} likes to ${randomCountry}`);
}

// Handle follow event
function handleFollow(event) {
    const { username } = event;
    
    // Add bonus points for follow
    const countries = ['saudi', 'uae', 'qatar', 'kuwait', 'bahrain', 'oman'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    
    addGift(randomCountry, 'Follow', 50);
    
    console.log(`❤️ Follow from ${username} to ${randomCountry}`);
}

// Update status indicator
function updateStatusIndicator(connected) {
    const indicator = document.getElementById('status-indicator');
    const text = document.getElementById('status-text');
    
    if (connected) {
        indicator.classList.remove('disconnected');
        indicator.classList.add('connected');
        text.textContent = '✅ متصل';
    } else {
        indicator.classList.remove('connected');
        indicator.classList.add('disconnected');
        text.textContent = '❌ غير متصل';
    }
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.getElementById('connection-message');
    messageDiv.textContent = message;
    messageDiv.classList.add('show');
    messageDiv.style.background = type === 'error' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)';
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}

// Add activity log
function addActivityLog(event) {
    const activityList = document.getElementById('activity-list');
    const item = document.createElement('div');
    item.className = `activity-item ${event.type}`;
    
    let message = '';
    
    switch (event.type) {
        case 'gift':
            message = `🎁 ${event.username} أرسل ${event.giftName} x${event.giftCount}`;
            break;
        case 'like':
            message = `👍 ${event.username} أرسل ${event.likeCount} لايك`;
            break;
        case 'follow':
            message = `❤️ ${event.username} متابع جديد!`;
            break;
        case 'connected':
            message = `✅ ${event.message}`;
            break;
        case 'disconnected':
            message = `❌ ${event.message}`;
            break;
    }
    
    item.textContent = message;
    activityList.insertBefore(item, activityList.firstChild);
    
    // Keep only last 20 items
    while (activityList.children.length > 20) {
        activityList.removeChild(activityList.lastChild);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 TikTok Live Connector ready!');
    updateStatusIndicator(false);
});
