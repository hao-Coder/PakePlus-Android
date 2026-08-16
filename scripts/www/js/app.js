// 公共工具函数
const App = {
    // 获取保存的后端地址
    getApiAddress() {
        return localStorage.getItem('apiAddress') || '';
    },
    // 保存后端地址
    setApiAddress(address) {
        localStorage.setItem('apiAddress', address);
    },
    // 显示 Toast
    showToast(msg, duration = 2000) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    },
    // 通用弹窗控制
    openModal(id) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('active');
            // 自动聚焦弹窗内带有 autofocus 属性的输入框
            const focusInput = el.querySelector('input[autofocus]');
            if (focusInput) {
                setTimeout(() => focusInput.focus(), 300);
            }
        }
    },
    closeModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    },
    // 绑定关闭事件（通过 data-close 属性）
    bindModalClose() {
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', function() {
                const targetId = this.getAttribute('data-close');
                App.closeModal(targetId);
            });
        });
        // 点击背景关闭（仅非全屏弹窗，全屏弹窗不关闭）
        document.querySelectorAll('.modal-overlay:not(.fullscreen-modal)').forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    App.bindModalClose();
});