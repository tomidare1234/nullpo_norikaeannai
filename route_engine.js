// route_engine.js
let stations = [];
let globalPaths = [];
let activeLineTypes = {}; 
let activeRouteIdx = 0;

function init() {
    stations = [];
    for (let comp in companyData) {
        let line = companyData[comp].lineName;
        if (!activeLineTypes[line]) activeLineTypes[line] = "local";
        companyData[comp].stations.forEach(st => {
            stations.push({ 
                id: st.id, name: st.name, line: line, comp: comp, 
                types: st.types, color: companyData[comp].color, dark: companyData[comp].textDark 
            });
        });
    }
}

// 予測候補サジェストの表示
function showSuggest(input, pos) {
    init();
    let val = input.value.trim();
    let box = document.getElementById(`suggest-${pos}`);
    box.innerHTML = "";
    if (!val) { box.style.display = "none"; return; }
    
    let uniqueNames = [...new Set(stations.filter(s => s.name.includes(val)).map(s => s.name))];
    if (uniqueNames.length > 0) {
        uniqueNames.forEach(name => {
            let div = document.createElement("div");
            div.className = "suggest-item";
            div.textContent = name;
            div.onclick = () => { input.value = name; box.style.display = "none"; };
            box.appendChild(div);
        });
        box.style.display = "block";
    } else { box.style.display = "none"; }
}

// 画面外クリックでサジェストを閉じる
document.addEventListener("click", e => {
    if (!e.target.closest(".input-group")) {
        document.querySelectorAll(".suggest-box").forEach(b => b.style.display = "none");
    }
});

function searchRoute() {
    init();
    let startName = document.getElementById("startSt").value.trim();
    let goalName = document.getElementById("goalSt").value.trim();
    if (!startName || !goalName || startName === goalName) return alert("駅名を正しく入力してください");

    let graph = {};
    stations.forEach(s => graph[s.id] = []);
    for (let comp in companyData) {
        let sts = companyData[comp].stations;
        for (let i = 0; i < sts.length - 1; i++) {
            graph[sts[i].id].push({ id: sts[i+1].id, train: true });
            graph[sts[i+1].id].push({ id: sts[i].id, train: true });
        }
    }
    hubConnections.forEach(([a, b]) => { if(graph[a] && graph[b]) { graph[a].push({ id: b, train: false }); graph[b].push({ id: a, train: false }); } });

    let startIds = stations.filter(s => s.name === startName).map(s => s.id);
    if (!startIds.length) return alert("出発駅が見つかりません");

    // 複数経路（最大3つ）を見つけるためのBFS
    globalPaths = [];
    let queue = startIds.map(id => ({ path: [id], lastTransfer: false }));

    while (queue.length > 0 && globalPaths.length < 3) {
        let node = queue.shift();
        let currId = node.path[node.path.length - 1];
        if (stations.find(s => s.id === currId).name === goalName) {
            if (!globalPaths.some(p => p.join('-') === node.path.join('-'))) globalPaths.push(node.path);
            continue;
        }

        (graph[currId] || []).forEach(edge => {
            if (!node.path.includes(edge.id)) {
                if (!edge.train && node.lastTransfer) return; 
                queue.push({ path: [...node.path, edge.id], lastTransfer: !edge.train });
            }
        });
    }

    renderTabs();
}

function renderTabs() {
    let tabs = document.getElementById("tabs");
    let container = document.getElementById("result");
    tabs.innerHTML = "";
    
    if (!globalPaths.length) {
        container.innerHTML = "❌ 経路が見つかりません。";
        container.style.display = "block"; tabs.style.display = "none"; return;
    }

    globalPaths.forEach((path, idx) => {
        let tab = document.createElement("div");
        tab.className = `tab ${idx === 0 ? 'active' : ''}`;
        tab.textContent = `経路 ${idx + 1}`;
        tab.onclick = () => {
            document.querySelectorAll(".tab").forEach((t, i) => t.classList.toggle("active", i === idx));
            activeRouteIdx = idx;
            renderActiveRoute();
        };
        tabs.appendChild(tab);
    });
    tabs.style.display = "flex";
    activeRouteIdx = 0;
    renderActiveRoute();
}

function onLineTypeChange(lineName, newType) {
    activeLineTypes[lineName] = newType;
    renderActiveRoute();
}

function renderActiveRoute() {
    let container = document.getElementById("result");
    let path = globalPaths[activeRouteIdx];
    
    let html = "";
    let currLine = "";
    let intermediateStack = [];
    let stopCount = 0; // アコーディオン内の「停車する駅」のみを数えるカウンタ

    function flushStack() {
        if (intermediateStack.length === 0) return "";
        let randId = "acc_" + Math.random().toString(36).substr(2, 9);
        // ★通過駅はカウントせず、停車する駅の数（stopCount）だけを表示に反映
        let s = `<div class="acc-btn" onclick="document.getElementById('${randId}').style.display=(document.getElementById('${randId}').style.display==='block')?'none':'block'">▼ 途中 ${stopCount} 駅を表示/非表示</div><div class="acc-content" id="${randId}">`;
        intermediateStack.forEach(row => s += row);
        s += `</div>`;
        intermediateStack = [];
        stopCount = 0;
        return s;
    }

    path.forEach((id, idx) => {
        let st = stations.find(s => s.id === id);
        let compInfo = companyData[st.comp];
        let currentType = activeLineTypes[st.line];

        if (st.line !== currLine) {
            html += flushStack();
            if (idx > 0) html += `</div><div style="padding:5px 12px;font-size:0.8rem;color:#e67e22;font-weight:bold;">🔄 乗り換え</div>`;
            
            currLine = st.line;
            let bg = compInfo.typeColors[currentType] || compInfo.color;
            let textCol = compInfo.typeTextColor ? (compInfo.typeTextColor[currentType] || "white") : (st.dark ? "black" : "white");
            
            let selectHtml = "";
            let typeKeys = Object.keys(compInfo.typeColors);
            if (typeKeys.length > 1) {
                const rawNames = { "local": "普通/各停", "rapid": "快速/空港快", "express": "特急" };
                selectHtml = `<select onchange="onLineTypeChange('${st.line}', this.value)">`;
                typeKeys.forEach(k => {
                    let customName = (st.comp === "霞野新都市交通" && k === "local") ? "各駅停車" : 
                                     (st.comp === "霞野新都市交通" && k === "rapid") ? "空港快速" : rawNames[k];
                    selectHtml += `<option value="${k}" ${k === currentType ? 'selected' : ''}>${customName}</option>`;
                });
                selectHtml += `</select>`;
            }

            html += `<div class="line-block"><div class="line-header" style="background:${bg};color:${textCol};"><span>${st.line}</span>${selectHtml}</div>`;
        }

        let isStop = st.types.includes(currentType);
        let rowClass = isStop ? "st-row" : "st-row pass-station";
        let passText = isStop ? "" : " <span style='font-size:0.75rem;'>(通過)</span>";
        let rowHtml = `<div class="${rowClass}"><b>${id}</b>&nbsp;${st.name}${passText}</div>`;

        let isBoundary = (idx === 0 || idx === path.length - 1 || 
                         (path[idx+1] && stations.find(s => s.id === path[idx+1]).line !== st.line) || 
                         (path[idx-1] && stations.find(s => s.id === path[idx-1]).line !== st.line));

        if (isBoundary) {
            html += flushStack();
            html += rowHtml;
        } else {
            if (isStop) stopCount++; // ★停車する駅のみをカウント
            intermediateStack.push(rowHtml);
        }
    });

    html += flushStack() + "</div>";
    container.innerHTML = html;
    container.style.display = "block";
}
