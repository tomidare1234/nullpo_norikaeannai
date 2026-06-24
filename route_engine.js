// route_engine.js
let stationFlattenList = [];
let globalSearchResult = [];
// 路線ごとの現在の選択種別を記録するオブジェクト
let lineSelectedTypes = {}; 

const typeNames = { "local": "普通", "rapid": "快速", "express": "特急" };

function initData() {
    stationFlattenList = [];
    for (let comp in companyData) {
        // 初期状態の種別は一律 local (普通) にセット
        if (!lineSelectedTypes[companyData[comp].lineName]) {
            lineSelectedTypes[companyData[comp].lineName] = "local";
        }
        companyData[comp].stations.forEach(st => {
            stationFlattenList.push({
                id: st.id, name: st.name, color: companyData[comp].color, textDark: companyData[comp].textDark, 
                line: companyData[comp].lineName, types: st.types, comp: comp
            });
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initData();
    ['start', 'goal'].forEach(pos => {
        const compSel = document.querySelector(`#${pos}-section .comp-select`);
        for(let comp in companyData) compSel.add(new Option(comp, comp));
    });
});

function updateLineSelect(compElement, pos) {
    const section = document.getElementById(`${pos}-section`);
    const lineSel = section.querySelector('.line-select');
    const stSel = section.querySelector('.st-select');
    lineSel.innerHTML = '<option value="">路線</option>';
    stSel.innerHTML = '<option value="">駅名</option>';
    if(compElement.value) {
        lineSel.add(new Option(companyData[compElement.value].lineName, companyData[compElement.value].lineName));
        lineSel.selectedIndex = 1;
        updateStationSelect(lineSel, pos);
    }
}

function updateStationSelect(lineElement, pos) {
    const section = document.getElementById(`${pos}-section`);
    const compVal = section.querySelector('.comp-select').value;
    const stSel = section.querySelector('.st-select');
    stSel.innerHTML = '<option value="">駅名</option>';
    if(lineElement.value) {
        companyData[compVal].stations.forEach(st => stSel.add(new Option(st.name, st.name)));
    }
}

function syncSelectToText(element, pos) {
    if(element.value) document.getElementById(`text${pos==='start'?'Start':'Goal'}St`).value = element.value;
}

function showSuggest(input, pos) {
    const text = input.value.trim();
    const box = document.getElementById(`suggest${pos==='start'?'Start':'Goal'}`);
    box.innerHTML = '';
    if(!text) { box.style.display = 'none'; return; }
    const matched = stationFlattenList.filter(s => s.name.includes(text));
    if(matched.length > 0) {
        const uniqueNames = [...new Set(matched.map(s => s.name))];
        uniqueNames.forEach(name => {
            let itemSt = matched.find(s => s.name === name);
            let div = document.createElement('div');
            div.className = 'suggest-item';
            div.innerHTML = `<span>${name}</span><span class="line-badge" style="font-size:0.7rem;color:#7f8c8d;">${itemSt.line}</span>`;
            div.onclick = function() {
                input.value = name;
                box.style.display = 'none';
                const section = document.getElementById(`${pos}-section`);
                section.querySelector('.comp-select').value = itemSt.comp;
                updateLineSelect(section.querySelector('.comp-select'), pos);
                section.querySelector('.st-select').value = name;
            };
            box.appendChild(div);
        });
        box.style.display = 'block';
    } else { box.style.display = 'none'; }
}

// ネットワーク接続（駅と駅のつながり）は全種別を包含するベースグラフを作る
function buildBaseNetworkGraph() {
    const graph = {};
    stationFlattenList.forEach(s => graph[s.id] = []);
    for (let comp in companyData) {
        let sts = companyData[comp].stations;
        for (let i = 0; i < sts.length - 1; i++) {
            graph[sts[i].id].push({ id: sts[i+1].id, isTrain: true });
            graph[sts[i+1].id].push({ id: sts[i].id, isTrain: true });
        }
    }
    hubConnections.forEach(([a, b]) => {
        if (graph[a] && graph[b]) {
            graph[a].push({ id: b, isTrain: false });
            graph[b].push({ id: a, isTrain: false });
        }
    });
    return graph;
}

function executeMultiSearch() {
    const startName = document.getElementById('textStartSt').value.trim();
    const goalName = document.getElementById('textGoalSt').value.trim();
    const resContainer = document.getElementById('result-container');
    const tabsContainer = document.getElementById('routeTabs');
    
    if(!startName || !goalName || startName === goalName) { alert("正しい駅を選択してください。"); return; }

    const graph = buildBaseNetworkGraph();
    let startIds = stationFlattenList.filter(s => s.name === startName).map(s => s.id);
    if(startIds.length === 0) { alert("該当する駅が存在しません。"); return; }

    let allPaths = [];
    let queue = [];
    startIds.forEach(id => queue.push({ path: [id], lastActionWasTransfer: false }));

    while(queue.length > 0 && allPaths.length < 3) {
        let node = queue.shift();
        let currentId = node.path[node.path.length - 1];
        let currentSt = stationFlattenList.find(s => s.id === currentId);

        if(currentSt.name === goalName) {
            if(!allPaths.some(p => p.join('-') === node.path.join('-'))) allPaths.push(node.path);
            continue;
        }

        let edges = graph[currentId] || [];
        for(let edge of edges) {
            if(!node.path.includes(edge.id)) {
                if(!edge.isTrain && node.lastActionWasTransfer) continue;
                if(node.path.length < 50) {
                    queue.push({ path: [...node.path, edge.id], lastActionWasTransfer: !edge.isTrain });
                }
            }
        }
    }

    globalSearchResult = allPaths;
    tabsContainer.innerHTML = '';
    if(allPaths.length === 0) {
        resContainer.innerHTML = "❌ ルートが見つかりません。"; resContainer.style.display = 'block'; tabsContainer.style.display = 'none'; return;
    }

    allPaths.forEach((path, idx) => {
        let tab = document.createElement('div');
        tab.className = `route-tab ${idx===0?'active':''}`;
        tab.textContent = `経路 ${idx + 1}`;
        tab.onclick = () => renderActiveRoute(idx);
        tabsContainer.appendChild(tab);
    });
    tabsContainer.style.display = 'flex';
    renderActiveRoute(0);
}

// 特定の路線でユーザーが種別を変更した時のイベント
function changeLineType(lineName, newType, routeIdx) {
    lineSelectedTypes[lineName] = newType;
    renderActiveRoute(routeIdx); // 選択された経路画面を再描画
}

function renderActiveRoute(routeIdx) {
    document.querySelectorAll('.route-tab').forEach((t, i) => t.classList.toggle('active', i === routeIdx));
    const path = globalSearchResult[routeIdx];
    const resContainer = document.getElementById('result-container');
    
    let html = `<div class="result-title" style="font-weight:bold;margin-bottom:10px;">🗺️ 検索結果</div>`;
    let currentLine = ""; 
    let intermediateStack = [];

    function flushStack(lineColor) {
        if (intermediateStack.length === 0) return "";
        let rand = "acc_" + Math.random().toString(36).substr(2, 9);
        let s = `<div class="accordion-btn" onclick="toggleAcc('${rand}')" style="--line-color: ${lineColor}">👁️ 途中 ${intermediateStack.length} 駅を省略 (展開)</div><div class="accordion-content" id="${rand}">`;
        intermediateStack.forEach(st => {
            s += `<div class="station-row" style="--line-color: ${lineColor}"><span class="${st.c}" style="background:${st.bg}">${st.id}</span><span class="station-name" style="color:#777;">${st.n}</span></div>`;
        });
        s += `</div>`; intermediateStack = []; return s;
    }

    path.forEach((id, idx) => {
        const cur = stationFlattenList.find(s => s.id === id);
        const isS = (idx === 0); const isE = (idx === path.length - 1);
        const isT = (!isS && !isE && path[idx+1] && stationFlattenList.find(s => s.id === path[idx+1]).line !== cur.line);
        const isP = (!isS && !isE && path[idx-1] && stationFlattenList.find(s => s.id === path[idx-1]).line !== cur.line);

        // 新しい路線セクションに入った場合
        if (cur.line !== currentLine) {
            if (idx > 0) {
                html += flushStack(stationFlattenList.find(s => s.id === path[idx-1]).color);
                html += `</div><div class="transfer-row"><span>🔄【のりかえ】${cur.name}駅</span></div>`;
            }
            currentLine = cur.line;
            
            // 路線ごとに選ばれている種別を取得
            const activeType = lineSelectedTypes[cur.line];
            const tc = companyData[cur.comp].typeColors[activeType] || "#4d4d4d";
            const tt = companyData[cur.comp].typeTextColor[activeType] || "white";

            // ★路線ごとの「種別変更用セレクトボックス」をヘッダー内に生成
            let selectHtml = `<select onchange="changeLineType('${cur.line}', this.value, ${routeIdx})">`;
            for(let typeKey in companyData[cur.comp].typeColors) {
                let selAttr = (typeKey === activeType) ? "selected" : "";
                selectHtml += `<option value="${typeKey}" ${selAttr}>${typeNames[typeKey]}</option>`;
            }
            selectHtml += `</select>`;

            html += `<div class="route-block"><div class="line-header-box" style="background:${tc}; color:${tt}; border-left: 8px solid ${cur.color};"><span>${cur.line}</span>${selectHtml}</div>`;
        }

        const activeType = lineSelectedTypes[cur.line];
        const bCls = cur.textDark ? "badge dark-text" : "badge";
        
        // 現在選択されている種別が「停車する駅」または「始発・終着・乗換駅」なら表示
        if (cur.types.includes(activeType) || isS || isE || isT || isP) {
            html += flushStack(cur.color);
            // 通過駅だけど重要駅（乗換など）の場合は、少し薄く表示するなどの処理
            let opacityStyle = cur.types.includes(activeType) ? "" : "opacity: 0.5;";
            let passInfo = cur.types.includes(activeType) ? "" : " <span style='font-size:0.75rem;color:#e74c3c;'>(※当種別は通過)</span>";
            
            html += `<div class="station-row ${isS?'is-start':''} ${isE?'is-end':''}" style="--line-color: ${cur.color}; ${opacityStyle}"><span class="${bCls}" style="background:${cur.color}">${id}</span><span class="station-name">${cur.name}${passInfo}</span></div>`;
        } else {
            // 通過駅はアコーディオン（省略）スタックへ
            intermediateStack.push({ id: id, n: cur.name, c: bCls, bg: cur.color });
        }
    });
    
    html += flushStack(stationFlattenList.find(s => s.id === path[path.length-1]).color) + `</div>`;
    resContainer.innerHTML = html; resContainer.style.display = 'block';
}

function toggleAcc(id) { const el = document.getElementById(id); el.style.display = (el.style.display === 'block') ? 'none' : 'block'; }
document.addEventListener('click', e => { if(!e.target.closest('.input-container')) document.querySelectorAll('.suggest-box').forEach(b => b.style.display = 'none'); });
