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

// 播放队列项点击事件
document.querySelectorAll('.queue-item').forEach((item, index) => {
    item.addEventListener('click', function() {
        // 移除所有active状态
        document.querySelectorAll('.queue-item').forEach(i => i.classList.remove('active'));
        // 添加当前项的active状态
        this.classList.add('active');

        const title = this.querySelector('.queue-title').textContent;
        showNotification(`正在播放: ${title} 🎵`);
    });
});

// 播放器底部按钮交互
document.querySelectorAll('.footer-btn').forEach((btn, index) => {
    btn.addEventListener('click', function() {
        const messages = ['已添加到我喜欢的音乐 💝', '已添加到歌单 📋', '分享链接已复制 🔗'];
        if (index < messages.length) {
            showNotification(messages[index]);
        }
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// 音量滑块交互
const volumeSlider = document.querySelector('.volume-slider');
if (volumeSlider) {
    volumeSlider.addEventListener('input', function() {
        const volume = this.value;
        const volumeIcon = document.querySelector('.volume-icon');
        if (volume == 0) {
            volumeIcon.textContent = '🔇';
        } else if (volume < 50) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    });
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

// 推荐歌曲卡片交互
document.querySelectorAll('.song-card').forEach(card => {
    const playBtn = card.querySelector('.card-play-btn');

    playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const title = card.querySelector('h4').textContent;
        showNotification(`正在播放: ${title} 🎵`);
    });

    card.addEventListener('click', function() {
        const title = this.querySelector('h4').textContent;
        const artist = this.querySelector('p').textContent;
        showNotification(`已添加到队列: ${title} - ${artist}`);
    });
});

// 侧边栏链接交互
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // 移除所有active状态
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        // 添加当前链接的active状态
        this.classList.add('active');

        const linkText = this.querySelector('span:last-child').textContent;
        showNotification(`正在加载 ${linkText}...`);
    });
});

// 歌单项交互
document.querySelectorAll('.playlist-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const playlistName = this.textContent;
        showNotification(`正在打开歌单: ${playlistName} 🎵`);
    });
});

// 新建歌单按钮
const addBtn = document.querySelector('.add-btn');
if (addBtn) {
    addBtn.addEventListener('click', function() {
        showNotification('新建歌单功能即将推出 ✨');
    });
}

// 清空队列按钮
const clearBtn = document.querySelector('.clear-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', function() {
        showNotification('播放队列已清空');
    });
}

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

// 导航菜单交互
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // 移除所有active状态
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        // 添加当前按钮的active状态
        this.classList.add('active');

        const page = this.textContent;
        showNotification(`正在加载 ${page} 页面...`);
    });
});

console.log('🎵 温音播放器已加载完成！');
console.log('💡 快捷键提示：空格键播放/暂停，左右箭头键切换歌曲');