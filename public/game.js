// Game state
const gameState = {
    saudi: { score: 0, position: 0 },
    uae: { score: 0, position: 0 },
    qatar: { score: 0, position: 0 },
    kuwait: { score: 0, position: 0 },
    bahrain: { score: 0, position: 0 },
    oman: { score: 0, position: 0 }
};

const countryNames = {
    saudi: 'السعودية',
    uae: 'الإمارات',
    qatar: 'قطر',
    kuwait: 'الكويت',
    bahrain: 'البحرين',
    oman: 'عمان'
};

const maxTrackWidth = 500; // Maximum position (in pixels)
let selectedCountry = 'saudi';

// Update selected country
function updateSelectedCountry() {
    selectedCountry = document.getElementById('country-select').value;
}

// Add gift and move player
function addGift(country, giftType, points) {
    // Update score
    gameState[country].score += points;
    
    // Calculate new position (move progressively across track)
    const trackWidth = 400; // pixels
    const maxScore = 1000; // points needed to finish
    gameState[country].position = Math.min((gameState[country].score / maxScore) * trackWidth, trackWidth);
    
    // Update UI
    updatePlayerPosition(country);
    updateScore(country);
    updateLeaderboard();
    
    // Play animation
    playGiftAnimation(giftType, country);
}

// Update player position on track
function updatePlayerPosition(country) {
    const playerElement = document.querySelector(`.${country}-player`);
    if (playerElement) {
        playerElement.style.left = gameState[country].position + 'px';
    }
}

// Update score display
function updateScore(country) {
    const scoreElement = document.getElementById(`${country}-score`);
    if (scoreElement) {
        scoreElement.textContent = gameState[country].score;
    }
}

// Play gift animation
function playGiftAnimation(giftType, country) {
    const playerElement = document.querySelector(`.${country}-player`);
    
    // Add animation class
    playerElement.style.animation = 'none';
    setTimeout(() => {
        playerElement.style.animation = 'bounce 0.6s infinite';
    }, 10);
    
    // Create floating text
    const floatingText = document.createElement('div');
    floatingText.textContent = `+${giftType === 'rose' ? 10 : giftType === 'heart' ? 25 : giftType === 'diamond' ? 50 : 100}`;
    floatingText.style.position = 'absolute';
    floatingText.style.color = '#667eea';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.fontSize = '1.5em';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.animation = 'floatUp 1s ease-out forwards';
    
    playerElement.parentElement.appendChild(floatingText);
    setTimeout(() => floatingText.remove(), 1000);
}

// Update leaderboard
function updateLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    
    // Sort countries by score
    const sorted = Object.entries(gameState)
        .map(([country, data]) => ({
            country,
            score: data.score,
            name: countryNames[country]
        }))
        .sort((a, b) => b.score - a.score);
    
    // Create leaderboard HTML
    leaderboard.innerHTML = sorted.map((item, index) => `
        <div class="leaderboard-item">
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-country">${item.name}</span>
            <span class="leaderboard-score">${item.score} نقطة</span>
        </div>
    `).join('');
    
    // Check for winner
    if (sorted[0].score >= 1000) {
        setTimeout(() => {
            alert(`🎉 مبروك! ${sorted[0].name} فازت بالسباق! 🏆`);
        }, 500);
    }
}

// Reset game
function resetGame() {
    // Reset all scores
    for (let country in gameState) {
        gameState[country].score = 0;
        gameState[country].position = 0;
        updatePlayerPosition(country);
        updateScore(country);
    }
    
    // Update leaderboard
    updateLeaderboard();
    
    alert('✨ تم إعادة تعيين اللعبة بنجاح!');
}

// Add CSS animation for floating text
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.2);
        }
    }
`;
document.head.appendChild(style);

// Initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
    updateLeaderboard();
    console.log('🎮 لعبة السباق جاهزة!');
});

// Keyboard shortcuts (optional)
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        resetGame();
    }
});