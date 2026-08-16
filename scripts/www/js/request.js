// js/request.js - 全局请求模块
(function() {
    // 配置
    const CONFIG = {
        // 从 localStorage 读取后端地址
        get baseURL() {
            return localStorage.getItem('apiAddress') || '';
        },
        // 存储键名
        TOKEN_KEY: 'accessToken',
        REFRESH_TOKEN_KEY: 'refreshToken',
        TOKEN_TYPE_KEY: 'tokenType',
        EXPIRES_KEY: 'expiresIn'
    };

    // 存储 token
    function setToken(data) {
        if (data.accessToken) {
            localStorage.setItem(CONFIG.TOKEN_KEY, data.accessToken);
        }
        if (data.refreshToken) {
            localStorage.setItem(CONFIG.REFRESH_TOKEN_KEY, data.refreshToken);
        }
        if (data.tokenType) {
            localStorage.setItem(CONFIG.TOKEN_TYPE_KEY, data.tokenType);
        }
        if (data.expiresIn) {
            localStorage.setItem(CONFIG.EXPIRES_KEY, data.expiresIn);
        }
    }

    // 获取 token
    function getToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY) || '';
    }

    // 获取 tokenType
    function getTokenType() {
        return localStorage.getItem(CONFIG.TOKEN_TYPE_KEY) || 'Bearer';
    }

    // 清除 token
    function clearToken() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.REFRESH_TOKEN_KEY);
        localStorage.removeItem(CONFIG.TOKEN_TYPE_KEY);
        localStorage.removeItem(CONFIG.EXPIRES_KEY);
    }

    // 核心请求函数
    async function request(url, options = {}) {
        const base = CONFIG.baseURL;
        if (!base) {
            throw new Error('后端地址未设置，请先登录页设置地址');
        }

        // 拼接完整 URL
        const fullUrl = base.startsWith('http') ? base + url : base + url;

        // 默认配置
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        // 如果存在 token，添加 Authorization 头（登录接口除外，由调用方决定是否携带）
        // 但我们约定：登录接口不携带，其他接口自动携带
        // 判断是否登录接口：由调用方传入 skipAuth 标记，或通过 url 判断，我们采用调用方显式传入 skipAuth: true
        if (!options.skipAuth) {
            const token = getToken();
            if (token) {
                const tokenType = getTokenType();
                defaultHeaders['Authorization'] = `${tokenType} ${token}`;
            }
        }

        const config = {
            method: options.method || 'GET',
            headers: {
                ...defaultHeaders,
                ...(options.headers || {})
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        };

        // 如果 method 是 GET 且 body 存在，转为 query string（简易处理）
        if (config.method === 'GET' && options.body) {
            const params = new URLSearchParams(options.body).toString();
            // 注意：这里会覆盖原有 url，我们重新构建
            return request(url + '?' + params, { ...options, method: 'GET', body: undefined });
        }

        try {
            const response = await fetch(fullUrl, config);
            const data = await response.json();

            // 统一处理 code 非 00000 的情况（可根据后端调整）
            if (data.code && data.code !== '00000') {
                // 如果是 token 过期 (假设 code 为 401 或 403)
                if (response.status === 401 || data.code === '401' || data.code === '403') {
                    // 尝试刷新 token（此处简化，直接跳转登录）
                    clearToken();
                    // 可触发全局事件，通知用户重新登录
                    window.dispatchEvent(new CustomEvent('auth:expired'));
                    throw new Error('登录已过期，请重新登录');
                }
                // 其他业务错误
                throw new Error(data.msg || '请求失败');
            }

            return data;
        } catch (error) {
            // 网络错误或其他
            console.error('请求异常:', error);
            throw error;
        }
    }

    // 登录专用
    async function login(username, password) {
        const base = CONFIG.baseURL;
        if (!base) {
            throw new Error('后端地址未设置，请先设置');
        }

        // 登录接口路径，假设为 /auth/login，可根据实际情况修改
        const loginUrl = base + '/api/v1/auth/login2';

        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.code !== '00000') {
            throw new Error(data.msg || '登录失败');
        }

        // 保存 token 信息
        if (data.data) {
            setToken(data.data);
        }

        return data;
    }

    // 登出
    function logout() {
        clearToken();
        // 跳转登录页
        window.location.href = 'index.html';
    }

    // 挂载到全局
    window.$request = {
        request,
        login,
        logout,
        getToken,
        clearToken,
        setToken,
    };

    // 监听 token 过期事件，自动跳转登录
    window.addEventListener('auth:expired', function() {
        // 显示提示并跳转
        if (window.App && window.App.showToast) {
            window.App.showToast('登录已过期，请重新登录', 2000);
        }
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });

})();