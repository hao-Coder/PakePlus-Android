document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('taskList');
    const channelSelect = document.getElementById('channelSelect');
    const queryBtn = document.getElementById('queryBtn');

    let currentTask = null;

    // 获取任务列表 
    async function fetchTasks(channel) {
        try {
            const result = await $request.request('/api/v1/public/'+channel, {
                method: 'GET',
            });
            return result || [];
        } catch (error) {
            App.showToast('获取任务失败: ' + error.message);
            return [];
        }
    }
    //   获取波次门店数据
    async function GetForm(id) {
        try {
            const result = await $request.request('/api/v1/wholesort/'+id+'/form', {
                method: 'GET',
            });
            return result || [];
        } catch (error) {
            App.showToast('获取任务失败: ' + error.message);
            return [];
        }
    }
        //   获取进度数据
    async function GetPage(id) {
        try {
            const result = await $request.request('/api/v1/public/refprogress?id='+id, {
                method: 'GET',
            });

            return result || [];
        } catch (error) {
            App.showToast('获取任务失败: ' + error.message);
            return [];
        }
    }
    // 绑箱
    async function bindContainer(waveno,storeno, containercode,operator,issealing) {
        console.log('bindContainer');
        try {
            const result = await $request.request('/api/v1/containerbindlog/bind', {
                method: 'POST',
                body: { waveno, storeno,containercode,operator,issealing },
            });
            console.log(result);
            return result;
        } catch (error) {
            throw new Error('绑箱失败: ' + error.message);
        }
    }
  // 封箱（调用真实接口）
    async function sealContainer(waveno,storeno, containercode,operator,issealing)  {
        try {
            const result = await $request.request('/api/v1/containerbindlog/sealing', {
                method: 'POST',
                 body: { waveno, storeno,containercode,operator,issealing },
            });
            return result;
        } catch (error) {
            throw new Error('封箱失败: ' + error.message);
        }
    }

    function renderTasks(tasks)
     {
        if (tasks.items.length === 0) {
            taskList.innerHTML = '<div style="text-align:center;padding:40px 0;color:#999;">暂无任务</div>';
            return;
        }
        let html = '';
        tasks.items.forEach((task, index) => {
            html += `
                <div class="task-card" data-index="${task.id}">
                    <div class="task-info">
                        <div class="hidden"></span><span class="value">${task.id}</span></div>
                        <div><span class="label">波次号</span><span class="value">${task.waveNo}</span></div>
                        <div><span class="label">门店编码</span><span class="value">${task.storeno}</span></div>
                        <div><span class="label">门店名称</span><span class="value">${task.storename}</span></div>
                        <div><span class="label">格口</span><span class="value">${task.sortGate}_${task.orderUnderGate}</span></div>
                        <div><span class="label">门店总数</span><span class="value">${task.totalQty}</span></div>
                        <div><span class="label">分拣总数</span><span class="value">${task.completedCount}</span></div>
                        <div style="grid-column:span 2;"><span class="label">容器码</span><span class="value">${task.containercode || '未绑'}</span></div>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-bind" data-action="bind" data-index="${task.id}">绑箱</button>
                        <button class="btn btn-seal" data-action="seal" data-index="${task.id}">封箱</button>
                        <button class="btn btn-progress" data-action="progress" data-index="${task.id}">进度</button>
                    </div>
                </div>
            `;
        });
        taskList.innerHTML = html;

        taskList.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click',async function(e) {
                e.stopPropagation();
                const action = this.getAttribute('data-action');
                const index = parseInt(this.getAttribute('data-index'));
                console.log(index);
                const task =await GetForm(index);
                 const taskProgress =await GetPage(index);
                if (!task) return;
                if (action === 'bind') {
                    openBindModal(task.data);
                } else if (action === 'seal') {
                    openSealModal(task.data);
                } else if (action === 'progress') {
                     console.log(taskProgress);
                    openProgressModal(taskProgress.data);
                }
            });
        });
    }

    // ----- 绑箱弹窗 -----
    function openBindModal(task) {
        document.getElementById('bindWaveNo').textContent = task.waveno;
        document.getElementById('bindStoreCode').textContent = task.storeno;
        document.getElementById('bindStoreName').textContent = task.storename;
        document.getElementById('bindGrid').textContent = task.sortgate+'_'+task.orderundergate;
        document.getElementById('bindContainerCode').value = '';
        App.openModal('bindModal'); // 自动聚焦 autofocus
    }

        document.getElementById('bindConfirmBtn').addEventListener('click', async function() {
        const containerCode = document.getElementById('bindContainerCode').value.trim();
            const waveNo = document.getElementById('bindWaveNo').textContent.trim();
                const storeno = document.getElementById('bindStoreCode').textContent.trim();
        if (!containerCode) {
            App.showToast('请输入容器码');
            return;
        }   
        else{

          const result = await bindContainer(waveNo,storeno,containerCode,'admin',0);
            console.log(result);          
            if(result.data.success){
              App.closeModal('bindModal');
            }else {
                App.showToast(result.data.msg);
            }
        }
    });

    // ----- 封箱弹窗 -----
    function openSealModal(task) {
       console.log(task);
        document.getElementById('sealWaveNo').textContent = task.waveno;
        document.getElementById('sealStoreCode').textContent = task.storeno;
        document.getElementById('sealStoreName').textContent = task.storename;
        document.getElementById('sealGrid').textContent = task.sortgate+'_'+task.orderundergate;
        document.getElementById('sealSign').value = '';
        App.openModal('sealModal');
    }
     // 封箱确认
    document.getElementById('sealConfirmBtn').addEventListener('click', async function() {
        const sign = document.getElementById('sealSign').value.trim();
        if (!sign) {
            App.showToast('请输入封箱签');
            return;
        }
        if (!currentTask) return;
        try {
             const result = await  sealContainer(waveNo,storeno,containerCode,'admin',0);
            App.showToast(result.data.msg);
              console.log(result);          
            if(result.data.success){
               App.closeModal('sealModal');
            }else {
                App.showToast(result.data.msg);
            }
        } catch (error) {
            App.showToast(error.message);
        }
    });

    // ----- 进度弹窗 -----
    function openProgressModal(task) {
        console.log(task);
        document.getElementById('progWaveNo').textContent = task.waveNo;
        document.getElementById('progStoreCode').textContent = task.storeno;
        document.getElementById('progStoreName').textContent = task.storename;
        document.getElementById('progGrid').textContent = task.sortGate+''+task.orderUnderGate;
        document.getElementById('progStoreTotal').textContent = task.totalSKU;
        document.getElementById('progSortTotal').textContent = task.completedCount;

        const tbody = document.getElementById('progressTableBody');
        const goods = task.items || [];
        if (goods.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;">无商品数据</td></tr>';
        } else {
            let rows = '';
            goods.forEach(g => {
                        if(g.completedCount==0){
                    rows += `<tr>
                    <td>${g.sku}</td>
                    <td>${g.skuName}</td>
                    <td>${g.totalQty}</td>
                    <td>${g.completedCount}</td>
                     </tr>`;
                    }
                    if(g.completedCount<g.totalQty){
                    rows += `<tr>
                    <td>${g.sku}</td>
                    <td>${g.skuName}</td>
                    <td>${g.totalQty}</td>
                    <td style="color: #165DFF;">${g.completedCount}</td>
                     </tr>`;
                    }
                    else if(g.completedCount=g.totalQty){
                            rows += `<tr>
                    <td>${g.sku}</td>
                    <td>${g.skuName}</td>
                    <td>${g.totalQty}</td>
                    <td style="color: #00B42A;">${g.completedCount}</td>
                     </tr>`;
                    }
                    else if(g.completedCount>g.totalQty){
                            rows += `<tr>
                    <td>${g.sku}</td>
                    <td>${g.skuName}</td>
                    <td>${g.totalQty}</td>
                    <td style="color: #F53F3F;">${g.completedCount}</td>
                     </tr>`;
                    }
             
            });
            tbody.innerHTML = rows;
        }
        App.openModal('progressModal');
    }

     queryBtn.addEventListener('click',async function() {
           try {
         const tbody =  await fetchTasks(channelSelect.value);
         console.log(tbody.data);
                renderTasks(tbody.data);
        } catch (error) {
            App.showToast('查询失败: ' + error.message);
            }
    });



    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'function-list.html';
    });

});