// 模拟任务数据
window.MOCK_TASKS = [
    {
        waveNo: 'W2026081601',
        storeCode: 'S001',
        storeName: '朝阳店',
        grid: 'A-12',
        storeTotal: 256,
        sortTotal: 120,
        containerCode: 'CTN-001',
        channel: 'A',
        goods: [
            { code: 'G1001', name: '苹果', required: 50, sorted: 30 },
            { code: 'G1002', name: '香蕉', required: 40, sorted: 20 },
            { code: 'G1003', name: '橙子', required: 30, sorted: 15 }
        ]
    },
    {
        waveNo: 'W2026081602',
        storeCode: 'S002',
        storeName: '海淀店',
        grid: 'B-05',
        storeTotal: 180,
        sortTotal: 90,
        containerCode: '',
        channel: 'B',
        goods: [
            { code: 'G2001', name: '牛奶', required: 60, sorted: 40 },
            { code: 'G2002', name: '面包', required: 30, sorted: 20 }
        ]
    },
    {
        waveNo: 'W2026081603',
        storeCode: 'S003',
        storeName: '西城店',
        grid: 'C-08',
        storeTotal: 320,
        sortTotal: 200,
        containerCode: 'CTN-003',
        channel: 'A',
        goods: [
            { code: 'G3001', name: '洗发水', required: 100, sorted: 80 },
            { code: 'G3002', name: '沐浴露', required: 80, sorted: 60 }
        ]
    }
];

// 若需要更多数据可扩展