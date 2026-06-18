// TikTok Live Connection
let ws = null;

// Gift to country mapping for TikTok Live
const tiktokGiftMapping = {
    'Rose': { country: 'saudi', points: 10 },
    'Teddy Bear': { country: 'bahrain', points: 35 },
    'Diamond': { country: 'qatar', points: 50 },
    'Heart': { country: 'uae', points: 25 },
    'VirtualGift': { country: 'kuwait', points: 100 },
    'PK Gift': { country: 'oman', points: 100 },
    'Fireworks': { country: 'kuwait', points: 100 }
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

// Handle gift event - كل هدية تحرك دولة محددة
function handleGift(event) {
    const { username, giftName, giftCount } = event;
    
    // Get mapping for this gift
    const mapping = tiktokGiftMapping[giftName];
    
    if (mapping) {
        const country = mapping.country;
        const totalPoints = mapping.points * giftCount;
        
        // Add gift to specific country
        addGift(Object.keys(giftCountryMapping).find(
            key => giftCountryMapping[key].country === country
        ), totalPoints);
        
        console.log(`🎁 Gift from ${username}: ${giftName} x${giftCount} = ${totalPoints} points to ${countryNames[country]}`);
        addActivityLog({
            type: 'gift',
            username: username,
            giftName: giftName,
            giftCount: giftCount,
            country: countryNames[country]
        });
    }
}

// Handle like event - اللايكات تحرك الكويت
function handleLike(event) {
    const { username, likeCount } = event;
    
    // Likes move Kuwait
    const points = likeCount;
    addGift('fireworks', points);
    
    console.log(`👍 Like from ${username}: ${likeCount} likes to الكويت`);
}

// Handle follow event - المتابعة تحرك عمان
function handleFollow(event) {
    const { username } = event;
    
    // Follows move Oman
    addGift('gift', 50);
    
    console.log(`❤️ Follow from ${username} to عمان`);
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
            message = `🎁 ${event.username} أرسل ${event.giftName} x${event.giftCount} → ${event.country}`;
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
