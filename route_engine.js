// route_engine.js
let stations = [];
let globalPaths = [];
let activeLineTypes = {}; 
let activeRouteIdx = 0;

window.onload = function() {
    initData();
    populateCompanySelect('start');
    populateCompanySelect('goal');
};

function initData() {
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

function populateCompanySelect(pos) {
    let compSelect = document.getElementById(`${pos}Comp`);
    compSelect.innerHTML = "";
    for (let comp in companyData) {
        let opt = document.createElement("option");
        opt.value = comp; opt.textContent = comp;
        compSelect.appendChild(opt);
    }
    updateLines(pos);
}

function updateLines(pos) {
    let comp = document.getElementById(`${pos}Comp`).value;
    let lineSelect = document.getElementById(`${pos}Line`);
    lineSelect.innerHTML = "";
    let opt = document.createElement("option");
    opt.value = companyData[comp].lineName; opt.textContent = companyData[comp].lineName;
    lineSelect.appendChild(opt);
    updateStations(pos);
}

function updateStations(pos) {
    let comp = document.getElementById(`${pos}Comp`).value;
    let stSelect = document.getElementById(`${pos}St`);
    stSelect.innerHTML = "";
    companyData[comp].stations.forEach(st => {
        let opt = document.createElement("option");
        opt.value = st.name; opt.textContent = `${st.id} : ${st.name}`;
        stSelect.appendChild(opt);
    });
}

function onTextInput(pos) {
    initData();
    let val = document.getElementById(`${pos}Input`).value.trim();
    if(!val) return;
    let match = stations.find(s => s.name.includes(val));
    if (match) {
        document.getElementById(`${pos}Comp`).value = match.comp;
        updateLines(pos);
        document.getElementById(`${pos}St`).value = match.name;
    }
}

function onSelectInput(pos) {
    let stName = document.getElementById(`${pos}St`).value;
    document.getElementById(`${pos}Input`).value = stName;
}

function searchRoute() {
    initData();
    let startName = document.getElementById("startSt").value;
    let goalName = document.getElementById("goalSt").value;
    if (!startName || !goalName || startName === goalName) return alert("出発駅と目的駅を別々に選択してください");

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
    if (!globalPaths.length) { container.innerHTML = "❌ 経路が見つかりません。"; container.style.display = "block"; tabs.style.display = "none"; return; }

    globalPaths.forEach((path, idx) => {
        let tab = document.createElement("div");
        tab.className = `tab ${idx === 0 ? 'active' : ''}`;
        tab.textContent = `経路 ${idx + 1}`;
        tab.onclick = () => {
            document.querySelectorAll(".tab").forEach((t, i) => t.classList.toggle("active", i === idx));
            activeRouteIdx = idx; renderActiveRoute();
        };
        tabs.appendChild(tab);
    });
    tabs.style.display = "flex"; activeRouteIdx = 0; 
    
    for (let key in activeLineTypes) activeLineTypes[key] = "local"; 
    renderActiveRoute();
}

function onLineTypeChange(lineName, newType) {
    activeLineTypes[lineName] = newType;
    renderActiveRoute();
}

function renderActiveRoute() {
    let container = document.getElementById("result");
    let path = globalPaths[activeRouteIdx];
    let html = ""; let currLine = ""; let intermediateStack = []; let stopCount = 0;

    // 【修正】各路線の乗り降り駅をチェックし、「現在選ばれている種別」が通過駅なら安全な種別に落とす
    let lineSegments = {};
    path.forEach((id, idx) => {
        let st = stations.find(s => s.id === id);
        if (!lineSegments[st.line]) lineSegments[st.line] = [];
        lineSegments[st.line].push({ st: st, idx: idx });
    });

    for (let line in lineSegments) {
        let seg = lineSegments[line];
        let endpoints = [seg[0].st, seg[seg.length - 1].st]; 
        let currentType = activeLineTypes[line];
        
        // 現在選択中の種別だと降りられない場合
        let invalid = endpoints.some(st => !st.types.includes(currentType));
        if (invalid) {
            // ★特急がダメでも快速が停車するなら快速にする、快速もダメならローカルにするステップ判定
            let compName = seg[0].st.comp;
            let availableTypes = Object.keys(companyData[compName].typeColors); // ["local", "rapid", "express"] など
            
            let safeType = "local"; // 最悪でも普通
            // 利用可能な種別のうち、乗り降り駅が両方停車するものの中で一番上位（配列の後ろ側）のものを探す
            for (let i = availableTypes.length - 1; i >= 0; i--) {
                let t = availableTypes[i];
                if (endpoints.every(st => st.types.includes(t))) {
                    safeType = t;
                    break;
                }
            }
            activeLineTypes[line] = safeType;
        }
    }

    function flushStack() {
        if (intermediateStack.length === 0) return "";
        let randId = "acc_" + Math.random().toString(36).substr(2, 9);
        let s = `<div class="acc-btn" onclick="document.getElementById('${randId}').style.display=(document.getElementById('${randId}').style.display==='block')?'none':'block'">▼ 途中 ${stopCount} 駅を表示/非表示</div><div class="acc-content" id="${randId}">`;
        intermediateStack.forEach(row => s += row);
        s += `</div>`;
        intermediateStack = []; stopCount = 0; return s;
    }

    path.forEach((id, idx) => {
        let st = stations.find(s => s.id === id);
        let compInfo = companyData[st.comp];
        let currentType = activeLineTypes[st.line];

        if (st.line !== currLine) {
            html += flushStack();
            if (idx > 0) html += `<div class="transfer-row">🔄 乗り換え</div>`;
            currLine = st.line;
            let bg = compInfo.typeColors[currentType] || compInfo.color;
            let textCol = compInfo.typeTextColor ? (compInfo.typeTextColor[currentType] || "white") : (st.dark ? "black" : "white");
            
            let selectHtml = "";
            let typeKeys = Object.keys(compInfo.typeColors);
            if (typeKeys.length > 1) {
                const rawNames = { "local": "普通", "rapid": "快速", "express": "特急" };
                selectHtml = `<select onchange="onLineTypeChange('${st.line}', this.value)">`;
                typeKeys.forEach(k => {
                    let customName = (st.comp === "霞野新都市交通" && k === "local") ? "各駅停車" : 
                                     (st.comp === "霞野新都市交通" && k === "rapid") ? "空港快速" : rawNames[k];
                    
                    let lineStations = path.filter(pid => stations.find(s => s.id === pid).line === st.line);
                    let myEndpoints = [lineStations[0], lineStations[lineStations.length - 1]].map(pid => stations.find(s => s.id === pid));
                    let isDisabled = myEndpoints.some(est => !est.types.includes(k)) ? "disabled" : "";

                    selectHtml += `<option value="${k}" ${k === currentType ? 'selected' : ''} ${isDisabled}>${customName}${isDisabled ? ' (停車しません)' : ''}</option>`;
                });
                selectHtml += `</select>`;
            }
            html += `<div class="line-block"><div class="line-header" style="background:${bg};color:${textCol};"><span>${st.line}</span>${selectHtml}</div><div class="station-container" style="--line-color:${compInfo.color}">`;
        }

        let isStop = st.types.includes(currentType);
        let rowClass = isStop ? "st-row" : "st-row pass-station";
        let passLabel = isStop ? "" : "<span class='pass-label'>通過</span>";
        let rowHtml = `<div class="${rowClass}"><div class="st-badge">${id}</div><div class="st-name">${st.name}</div>${passLabel}</div>`;

        let isBoundary = (idx === 0 || idx === path.length - 1 || 
                         (path[idx+1] && stations.find(s => s.id === path[idx+1]).line !== st.line) || 
                         (path[idx-1] && stations.find(s => s.id === path[idx-1]).line !== st.line));

        if (isBoundary) {
            html += flushStack(); html += rowHtml;
        } else {
            if (isStop) stopCount++;
            intermediateStack.push(rowHtml);
        }
    });

    html += flushStack() + "</div></div>";
    container.innerHTML = html; container.style.display = "block";
}
