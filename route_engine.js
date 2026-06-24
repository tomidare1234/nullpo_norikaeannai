// route_engine.js
let stations = [];
let lastFoundPath = null;
let activeLineTypes = {}; // 各路線の現在の選択種別を保持

function init() {
    stations = [];
    for (let comp in companyData) {
        let line = companyData[comp].lineName;
        if (!activeLineTypes[line]) activeLineTypes[line] = "local"; // デフォルトは普通/各停
        companyData[comp].stations.forEach(st => {
            stations.push({ 
                id: st.id, name: st.name, line: line, comp: comp, 
                types: st.types, color: companyData[comp].color, dark: companyData[comp].textDark 
            });
        });
    }
}

function searchRoute() {
    init();
    let startName = document.getElementById("startSt").value.trim();
    let goalName = document.getElementById("goalSt").value.trim();
    if (!startName || !goalName || startName === goalName) return alert("駅名を正しく入力してください");

    // ベースとなる全接続グラフの構築
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

    let queue = startIds.map(id => ({ path: [id], lastTransfer: false }));
    lastFoundPath = null;

    while (queue.length > 0) {
        let node = queue.shift();
        let currId = node.path[node.path.length - 1];
        if (stations.find(s => s.id === currId).name === goalName) { lastFoundPath = node.path; break; }

        (graph[currId] || []).forEach(edge => {
            if (!node.path.includes(edge.id)) {
                if (!edge.train && node.lastTransfer) return; 
                queue.push({ path: [...node.path, edge.id], lastTransfer: !edge.train });
            }
        });
    }

    renderRoute();
}

function onLineTypeChange(lineName, newType) {
    activeLineTypes[lineName] = newType;
    renderRoute(); // 種別を変えたら再描画
}

function renderRoute() {
    let container = document.getElementById("result");
    if (!lastFoundPath) { container.innerHTML = "❌ 経路が見つかりません。"; container.style.display = "block"; return; }

    let html = "";
    let currLine = "";
    let intermediateStack = [];

    function flushStack() {
        if (intermediateStack.length === 0) return "";
        let randId = "acc_" + Math.random().toString(36).substr(2, 9);
        let s = `<div class="acc-btn" onclick="document.getElementById('${randId}').style.display=(document.getElementById('${randId}').style.display==='block')?'none':'block'">▼ 途中 ${intermediateStack.length} 駅を表示/非表示</div><div class="acc-content" id="${randId}">`;
        intermediateStack.forEach(row => s += row);
        s += `</div>`;
        intermediateStack = [];
        return s;
    }

    lastFoundPath.forEach((id, idx) => {
        let st = stations.find(s => s.id === id);
        let compInfo = companyData[st.comp];
        let currentType = activeLineTypes[st.line];

        // 路線が変わった時のヘッダー処理
        if (st.line !== currLine) {
            html += flushStack();
            if (idx > 0) html += `</div><div style="padding:5px 12px;font-size:0.8rem;color:#e67e22;font-weight:bold;">🔄 徒歩のりかえ</div>`;
            
            currLine = st.line;
            let bg = compInfo.typeColors[currentType] || compInfo.color;
            let textCol = compInfo.typeTextColor ? (compInfo.typeTextColor[currentType] || "white") : (st.dark ? "black" : "white");
            
            // 別種別が存在する場合のみセレクトボックスを生成
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

        // 通過・停車判定
        let isStop = st.types.includes(currentType);
        let rowClass = isStop ? "st-row" : "st-row pass-station";
        let passText = isStop ? "" : " <span style='font-size:0.75rem;'>(通過)</span>";
        let rowHtml = `<div class="${rowClass}"><b>${id}</b>&nbsp;${st.name}${passText}</div>`;

        // 起点・終点・乗換駅の判定
        let isBoundary = (idx === 0 || idx === lastFoundPath.length - 1 || 
                         (lastFoundPath[idx+1] && stations.find(s => s.id === lastFoundPath[idx+1]).line !== st.line) || 
                         (lastFoundPath[idx-1] && stations.find(s => s.id === lastFoundPath[idx-1]).line !== st.line));

        if (isBoundary) {
            html += flushStack();
            html += rowHtml;
        } else {
            intermediateStack.push(rowHtml);
        }
    });

    html += flushStack() + "</div>";
    container.innerHTML = html;
    container.style.display = "block";
}
