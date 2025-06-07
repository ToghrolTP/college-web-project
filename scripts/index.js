class ContentManipulator {
    constructor() {
        this.fontSize = 16;
        this.isAllExpanded = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadFontSize();
        console.log('Content Manipulator initialized');
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-content')) {
                this.togglePost(e.target);
            }
        });

        document.getElementById('expand-all')?.addEventListener('click', () => this.expandAll());
        document.getElementById('collapse-all')?.addEventListener('click', () => this.collapseAll());
        document.getElementById('copy-links')?.addEventListener('click', () => this.copyAllLinks());

        document.getElementById('font-increase')?.addEventListener('click', () => this.changeFontSize(2));
        document.getElementById('font-decrease')?.addEventListener('click', () => this.changeFontSize(-2));
        document.getElementById('font-reset')?.addEventListener('click', () => this.resetFontSize());

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-url')) {
                this.copyUrl(e.target.dataset.url);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'e':
                        e.preventDefault();
                        this.expandAll();
                        break;
                    case 'c':
                        e.preventDefault();
                        this.collapseAll();
                        break;
                    case '=':
                    case '+':
                        e.preventDefault();
                        this.changeFontSize(2);
                        break;
                    case '-':
                        e.preventDefault();
                        this.changeFontSize(-2);
                        break;
                    case '0':
                        e.preventDefault();
                        this.resetFontSize();
                        break;
                }
            }
        });
    }

    togglePost(button) {
        const postExcerpt = button.closest('.post-excerpt');
        const fullContent = postExcerpt.querySelector('.full-content');
        const excerptText = postExcerpt.querySelector('.excerpt-text');
        
        if (fullContent.style.display === 'none' || !fullContent.style.display) {
            fullContent.style.display = 'block';
            excerptText.style.display = 'none';
            button.textContent = '← کمتر نمایش دهید';
            button.classList.add('expanded');
            
        } else {
            fullContent.style.display = 'none';
            excerptText.style.display = 'block';
            button.textContent = '→ بیشتر بخوانید';
            button.classList.remove('expanded');
        }
    }

    expandAll() {
        const toggleButtons = document.querySelectorAll('.toggle-content');
        toggleButtons.forEach(button => {
            const fullContent = button.closest('.post-excerpt').querySelector('.full-content');
            const excerptText = button.closest('.post-excerpt').querySelector('.excerpt-text');
            
            if (fullContent.style.display === 'none' || !fullContent.style.display) {
                fullContent.style.display = 'block';
                excerptText.style.display = 'none';
                button.textContent = '← کمتر نمایش دهید';
                button.classList.add('expanded');
            }
        });
        
        this.isAllExpanded = true; 
        this.showNotification('همه پست‌ها گسترش یافتند'); 
    }

    collapseAll() {
        const toggleButtons = document.querySelectorAll('.toggle-content');
        toggleButtons.forEach(button => {
            const fullContent = button.closest('.post-excerpt').querySelector('.full-content');
            const excerptText = button.closest('.post-excerpt').querySelector('.excerpt-text');
            
            fullContent.style.display = 'none';
            excerptText.style.display = 'block';
            button.textContent = '→ بیشتر بخوانید';
            button.classList.remove('expanded');
        });
        
        this.isAllExpanded = false; 
        this.showNotification('همه پست‌ها جمع شدند'); 
    }

    copyAllLinks() {
        const links = Array.from(document.querySelectorAll('.copy-url')).map(btn => btn.dataset.url);
        const linkText = links.join('\n'); 
        
        this.copyToClipboard(linkText); 
        this.showNotification(`${links.length} لینک کپی شد`); 
    }

    copyUrl(url) {
        this.copyToClipboard(url);
        this.showNotification('لینک کپی شد');
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Unable to copy', err);
        }
        
        document.body.removeChild(textArea);
    }

    changeFontSize(delta) {
        this.fontSize = Math.max(12, Math.min(24, this.fontSize + delta));
        document.documentElement.style.fontSize = this.fontSize + 'px';
        localStorage.setItem('blog-font-size', this.fontSize);
        this.showNotification(`اندازه فونت: ${this.fontSize}px`);
    }

    resetFontSize() {
        this.fontSize = 16;
        document.documentElement.style.fontSize = this.fontSize + 'px';
        localStorage.removeItem('blog-font-size');
        this.showNotification('اندازه فونت بازنشانی شد');
    }

    loadFontSize() {
        const savedSize = localStorage.getItem('blog-font-size');
        if (savedSize) {
            this.fontSize = parseInt(savedSize);
            document.documentElement.style.fontSize = this.fontSize + 'px';
        }
    }

    showNotification(message) {
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;

        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const contentManipulator = new ContentManipulator();
});
