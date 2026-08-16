document.addEventListener('DOMContentLoaded', function() {
    const barcodeInput = document.getElementById('barcodeInput');
    const submitBtn = document.getElementById('submitExceptionBtn');
    const resultArea = document.getElementById('exceptionResult');

    // 返回
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'function-list.html';
    });

    submitBtn.addEventListener('click', function() {
        const barcode = barcodeInput.value.trim();
        if (!barcode) {
            App.showToast('请输入条码');
            return;
        }

        // 模拟调用后台接口（实际应使用 App.getApiAddress() + '/api/exception'）
        const apiAddr = App.getApiAddress();
        if (!apiAddr) {
            App.showToast('请先设置后端地址');
            return;
        }

        // 模拟请求（演示用）
        resultArea.innerHTML = '⏳ 处理中...';
        setTimeout(() => {
            // 模拟返回数据
            const mockResponse = `条码: ${barcode}\n状态: 异常件已登记\n时间: ${new Date().toLocaleString()}\n处理结果: 已通知仓库复核`;
            resultArea.innerHTML = mockResponse;
            App.showToast('提交成功');
        }, 800);
    });

    // 回车提交
    barcodeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
});