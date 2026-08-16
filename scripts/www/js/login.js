document.addEventListener('DOMContentLoaded', function() {
    const apiInput = document.getElementById('apiAddress');
    const saved = App.getApiAddress();
    if (saved) apiInput.value = saved;

    document.getElementById('settingsIcon').addEventListener('click', function() {
        App.openModal('settingsModal');
    });

    document.getElementById('settingsBack').addEventListener('click', function() {
        App.closeModal('settingsModal');
    });

    document.getElementById('settingsSaveBtn').addEventListener('click', function() {
        const addr = apiInput.value.trim();
        if (addr) {
            App.setApiAddress(addr);
            App.showToast('地址已保存');
            App.closeModal('settingsModal');
        } else {
            App.showToast('请输入有效地址');
        }
    });

    document.getElementById('loginBtn').addEventListener('click', async function() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (!username || !password) {
            App.showToast('请输入用户名和密码');
            return;
        }
        const apiAddr = App.getApiAddress();
        if (!apiAddr) {
            App.showToast('请先设置后端服务地址', 3000);
            App.openModal('settingsModal');
            return;
        }

        // 调用真实登录
        try {
            const result = await $request.login(username, password);
            App.showToast('登录成功');
            // 保存其他信息（如用户信息等，可选）
            // 跳转功能列表
            setTimeout(() => {
                window.location.href = 'function-list.html';
            }, 500);
        } catch (error) {
            App.showToast(error.message || '登录失败，请重试');
        }
    });

    document.getElementById('password').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginBtn').click();
        }
    });
});