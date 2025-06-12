// 页面加载完成后隐藏加载动画
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }, 100);
});

// 播放/暂停功能
let isPlaying = false;
const playBtn = document.getElementById('playBtn');
const albumCover = document.getElementById('albumCover');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');

playBtn.addEventListener('click', function() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        this.innerHTML = '⏸';
        this.setAttribute('title', '暂停');
        albumCover.classList.add('vinyl-animation');
        startProgressAnimation();
    } else {
        this.innerHTML = '▶';
        this.setAttribute('title', '播放');
        albumCover.classList.remove('vinyl-animation');
        stopProgressAnimation();
    }

    // 播放按钮点击效果
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
});

// 进度条功能
let progressInterval;
let currentProgress = 35;

function startProgressAnimation() {
    progressInterval = setInterval(() => {
        if (!isPlaying) return;
        currentProgress += 0.2;
        if (currentProgress >= 100) {
            currentProgress = 0;
            // 模拟切换下一首
            setTimeout(() => {
                if (isPlaying) {
                    playNextSong();
                }
            }, 1000);
        }
        progress.style.width = currentProgress + '%';
        updateTimeDisplay();
    }, 200);
}

function stopProgressAnimation() {
    if (progressInterval) {
        clearInterval(progressInterval);
    }
}

function updateTimeDisplay() {
    const totalSeconds = 261; // 4:21
    const currentSeconds = Math.floor((currentProgress / 100) * totalSeconds);
    const currentMinutes = Math.floor(currentSeconds / 60);
    const currentSecs = currentSeconds % 60;
    const timeElements = document.querySelectorAll('.time-info span');
    if (timeElements[0]) {
        timeElements[0].textContent = `${currentMinutes}:${currentSecs.toString().padStart(2, '0')}`;
    }
}

// 点击进度条跳转
progressBar.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    currentProgress = clickPosition * 100;
    progress.style.width = currentProgress + '%';
    updateTimeDisplay();
});

// 模拟歌曲列表
const songs = [
    { title: '雨夜咖啡', artist: '温柔民谣 · 李清照', context: '🌧️ 配合今晚的小雨，为你精心挑选' },
    { title: '夏日微风', artist: '清新民谣 · 王安石', context: '🌿 感受午后的温暖阳光' },
    { title: '星空物语', artist: '梦幻电子 · 苏轼', context: '✨ 深夜的静谧时光' },
    { title: '晨曦序曲', artist: '古典钢琴 · 李白', context: '🌅 迎接美好的新一天' }
];

let currentSongIndex = 0;

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSongInfo();
    currentProgress = 0;
    progress.style.width = '0%';
}

function updateSongInfo() {
    const song = songs[currentSongIndex];
    const songTitle = document.querySelector('.song-info h2');
    const songArtist = document.querySelector('.song-info p');
    const weatherContext = document.querySelector('.weather-context small');

    // 添加淡出效果
    songTitle.style.opacity = '0';
    songArtist.style.opacity = '0';
    weatherContext.style.opacity = '0';

    setTimeout(() => {
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        weatherContext.textContent = song.context;

        // 淡入效果
        songTitle.style.transition = 'opacity 0.5s ease';
        songArtist.style.transition = 'opacity 0.5s ease';
        weatherContext.style.transition = 'opacity 0.5s ease';

        songTitle.style.opacity = '1';
        songArtist.style.opacity = '1';
        weatherContext.style.opacity = '1';
    }, 300);
}

// 控制按钮功能
document.querySelectorAll('.control-btn').forEach((btn, index) => {
    if (index === 0) { // 上一首
        btn.addEventListener('click', function() {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            updateSongInfo();
            currentProgress = 0;
            progress.style.width = '0%';
            this.style.transform = 'scale(0.9)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    } else if (index === 2) { // 下一首
        btn.addEventListener('click', function() {
            playNextSong();
            this.style.transform = 'scale(0.9)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    } else if (index === 3) { // 喜爱
        btn.addEventListener('click', function() {
            this.style.color = this.style.color === 'rgb(212, 175, 55)' ? '' : 'var(--primary-warm)';
            this.style.transform = 'scale(1.2)';
            setTimeout(() => { this.style.transform = ''; }, 200);
            showNotification('已添加到我的喜爱 💖');
        });
    }
});

// 共鸣按钮交互
document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const emoji = this.textContent;
        const messages = {
            '🤗': '温暖的拥抱已送达',
            '👏': '共鸣的掌声已送出',
            '☕': '一杯温暖的咖啡已分享'
        };

        // 按钮动画
        this.style.transform = 'scale(1.5) rotate(15deg)';
        this.style.background = 'rgba(212, 81, 111, 0.3)';

        setTimeout(() => {
            this.style.transform = '';
            this.style.background = '';
        }, 300);

        showNotification(messages[emoji] + ' 💝');

        // 创建飞行的表情
        createFlyingEmoji(emoji, this);
    });
});

function createFlyingEmoji(emoji, source) {
    const flyingEmoji = document.createElement('div');
    flyingEmoji.textContent = emoji;
    flyingEmoji.style.cssText = `
                position: fixed;
                font-size: 24px;
                pointer-events: none;
                z-index: 1000;
                transition: all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            `;

    const rect = source.getBoundingClientRect();
    flyingEmoji.style.left = rect.left + rect.width / 2 + 'px';
    flyingEmoji.style.top = rect.top + rect.height / 2 + 'px';

    document.body.appendChild(flyingEmoji);

    setTimeout(() => {
        flyingEmoji.style.transform = 'translateY(-100px) scale(2)';
        flyingEmoji.style.opacity = '0';
    }, 100);

    setTimeout(() => {
        document.body.removeChild(flyingEmoji);
    }, 2100);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, var(--primary-warm), #f4e4bc);
                color: white;
                padding: 16px 24px;
                border-radius: 25px;
                font-size: 15px;
                font-weight: 500;
                z-index: 1000;
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
                backdrop-filter: blur(10px);
            `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -50%) translateY(-10px)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) translateY(-30px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2500);
}

// 功能卡片交互
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.4)';
        const icon = this.querySelector('.feature-icon');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.background = '';
        const icon = this.querySelector('.feature-icon');
        icon.style.transform = '';
    });

    card.addEventListener('click', function() {
        const title = this.querySelector('.feature-title').textContent;
        showNotification(`即将推出"${title}"功能 🚀`);
    });
});

// 记忆项目交互
document.querySelectorAll('.memory-item').forEach(item => {
    item.addEventListener('click', function() {
        const song = this.querySelector('.memory-song').textContent;
        showNotification(`正在播放回忆中的 ${song.split('-')[0]} 🎵`);

        // 模拟播放历史歌曲
        this.style.background = 'rgba(212, 175, 55, 0.1)';
        setTimeout(() => {
            this.style.background = '';
        }, 1000);
    });
});

// 模拟实时更新共鸣人数
const listenerCount = document.querySelector('.listener-count');
setInterval(() => {
    const currentCount = parseInt(listenerCount.textContent.match(/\d+/)[0]);
    const change = Math.floor(Math.random() * 20) - 10;
    const newCount = Math.max(1000, currentCount + change);
    listenerCount.innerHTML = `此刻全球有 ${newCount.toLocaleString()} 人`;
}, 8000);

// 咖啡杯动态显示
const coffeeElement = document.querySelector('.coffee-steam');
let coffeeVisible = true;

setInterval(() => {
    if (isPlaying && Math.random() > 0.6) {
        coffeeElement.style.opacity = coffeeVisible ? '0.3' : '0.8';
        coffeeVisible = !coffeeVisible;
    }
}, 6000);

// 专辑封面点击功能
albumCover.addEventListener('click', function() {
    if (!isPlaying) {
        playBtn.click();
    }

    // 创建点击波纹效果
    const ripple = document.createElement('div');
    ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';

    this.style.position = 'relative';
    this.appendChild(ripple);

    setTimeout(() => {
        this.removeChild(ripple);
    }, 600);
});

// 添加波纹动画的CSS
const style = document.createElement('style');
style.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            playBtn.click();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            document.querySelector('.control-btn').click(); // 上一首
            break;
        case 'ArrowRight':
            e.preventDefault();
            document.querySelectorAll('.control-btn')[2].click(); // 下一首
            break;
    }
});

// 初始化时间显示
updateTimeDisplay();

// 添加平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 节日/特殊时间检测
function checkSpecialTime() {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1;
    const date = now.getDate();

    let specialMessage = '';

    if (hour >= 0 && hour < 6) {
        specialMessage = '🌙 深夜时光，音乐伴你入眠';
    } else if (hour >= 6 && hour < 12) {
        specialMessage = '🌅 早安！用音乐开启美好的一天';
    } else if (hour >= 12 && hour < 18) {
        specialMessage = '☀️ 午后时光，让音乐放松你的心情';
    } else {
        specialMessage = '🌆 傍晚时分，享受音乐的温暖';
    }

    // 特殊节日检测
    if (month === 2 && date === 14) {
        specialMessage = '💝 情人节快乐！为你准备了爱的歌单';
    } else if (month === 12 && date === 25) {
        specialMessage = '🎄 圣诞快乐！温暖的节日音乐陪伴你';
    }

    return specialMessage;
}

// 显示特殊时间消息
setTimeout(() => {
    const specialMessage = checkSpecialTime();
    if (Math.random() > 0.7) { // 30%概率显示
        showNotification(specialMessage);
    }
}, 3000);

console.log('🎵 温音播放器已加载完成！');
console.log('💡 快捷键提示：空格键播放/暂停，左右箭头键切换歌曲');