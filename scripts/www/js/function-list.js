document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('确认登出吗？')) {
            $request.logout(); // 清除 token 并跳转登录
        }
    });

    document.querySelectorAll('.function-card').forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) {
                window.location.href = target;
            }
        });
    });
});