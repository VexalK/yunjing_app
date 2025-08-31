// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 游戏卡片悬停效果
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // 窗口控制按钮功能
    const windowControls = document.querySelectorAll('.window-control-btn');
    // 确保按钮存在才添加事件
            windowControls.forEach(btn => {
                if (!btn) return;
                console.log('Window control button found:', btn.title);
        btn.addEventListener('click', function() {
            const title = this.getAttribute('title');
            // 使用Electron API实现窗口控制
            if (title === '关闭') {
                window.api.closeWindow();
            } else if (title === '最小化') {
                window.api.minimizeWindow();
            } else if (title === '最大化') {
                window.api.maximizeWindow();
            }
        });
    });
    
    // 搜索功能实现
    // 确保选择正确的搜索框元素
        const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        // 使用keyup事件提高兼容性
            searchInput.addEventListener('keyup', function(e) {
                console.log('Search input event triggered:', e.key);
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim().toLowerCase();
                if (searchTerm) {
                    // 定义游戏名称和对应详情页的映射关系
                    const gameMap = {
                        '君成录星际版': 'details-star.html',
                        '星际版': 'details-star.html',
                        'star': 'details-star.html',
                        '君成录狂飙版': 'details-racing.html',
                        '狂飙版': 'details-racing.html',
                        'racing': 'details-racing.html',
                        '君成录探险版': 'details-explore.html',
                        '探险版': 'details-explore.html',
                        'explore': 'details-explore.html',
                        '君成录模拟版': 'details-sim.html',
                        '模拟版': 'details-sim.html',
                        'sim': 'details-sim.html',
                        '君成录射击版': 'details-shooter.html',
                        '射击版': 'details-shooter.html',
                        'shooter': 'details-shooter.html',
                        '君成录冒险版': 'details-adventure.html',
                        '冒险版': 'details-adventure.html',
                        'adventure': 'details-adventure.html'
                    };
                    
                    // 检查搜索词是否匹配任何游戏名称
                    for (const [gameName, detailPage] of Object.entries(gameMap)) {
                        if (gameName.toLowerCase().includes(searchTerm)) {
                            window.location.href = detailPage;
                            return;
                        }
                    }
                    
                    // 如果没有找到匹配的游戏，显示提示
                    alert('未找到匹配的游戏，请尝试其他搜索词');
                }
            }
        });
    }
    
});