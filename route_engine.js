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
        for (let line in companyData[comp]) {
            let data = companyData[comp][line];
            data.stations.forEach(st => {
                stations.push({ 
                    id: st.id, name: st.name, 
                    line: line, // 【修正】data.lineName ではなく、オブジェクトのキーである line をそのまま使う
                    comp: comp, types: st.types, color: data.color, dark: data.textDark 
                });
            });
        }
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
    for (let lineName in companyData[comp]) {
        let opt = document.createElement("option");
        opt.value = lineName; opt.textContent = lineName;
        lineSelect.appendChild(opt);
    }
    updateStations(pos);
}

function updateStations(pos) {
    let comp = document.getElementById(`${pos}Comp`).value;
    let lineName = document.getElementById(`${pos}Line`).value;
    let stSelect = document.getElementById(`${pos}St`);
    stSelect.innerHTML = "";
    if (!companyData[comp][lineName]) return;
    companyData[comp][lineName].stations.forEach(st => {
        let opt = document.createElement("option");
        opt.value = st.name; opt.textContent = `${st.id} : ${st.name}`;
        stSelect.appendChild(opt);
    });
}

let suggestState = { start: { items: [], hi: -1 }, goal: { items: [], hi: -1 } };

function onTextInput(pos) {
    initData();
    let val = document.getElementById(`${pos}Input`).value.trim();
    let listEl = document.getElementById(`${pos}Suggest`);
    let state = suggestState[pos];

    if (!val) { listEl.style.display = "none"; listEl.innerHTML = ""; state.items = []; state.hi = -1; return; }

    let matches = stations.filter(s => s.name.includes(val));
    // 同じ駅名・同じ路線の重複（会社データ内の重複記載など）を除去
    let seen = new Set();
    matches = matches.filter(s => {
        let key = `${s.comp}|${s.line}|${s.name}`;
        if (seen.has(key)) return false;
        seen.add(key); return true;
    }).slice(0, 15);

    state.items = matches; state.hi = -1;
    renderSuggestions(pos);
}

function renderSuggestions(pos) {
    let listEl = document.getElementById(`${pos}Suggest`);
    let state = suggestState[pos];
    if (!state.items.length) {
        listEl.innerHTML = `<div class="suggest-empty">該当する駅が見つかりません</div>`;
        listEl.style.display = "block";
        return;
    }
    listEl.innerHTML = state.items.map((s, i) => `
        <div class="suggest-item ${i === state.hi ? 'hi' : ''}" data-idx="${i}"
             onmousedown="selectSuggestion('${pos}', ${i})">
            <span class="suggest-badge" style="background:${s.color};color:${s.dark ? '#333' : 'white'};">${s.id}</span>
            <span class="suggest-name">${s.name}</span>
            <span class="suggest-sub">${s.line}（${s.comp}）</span>
        </div>
    `).join("");
    listEl.style.display = "block";
}

function selectSuggestion(pos, idx) {
    let state = suggestState[pos];
    let match = state.items[idx];
    if (!match) return;
    document.getElementById(`${pos}Comp`).value = match.comp;
    updateLines(pos);
    document.getElementById(`${pos}Line`).value = match.line;
    updateStations(pos);
    document.getElementById(`${pos}St`).value = match.name;
    document.getElementById(`${pos}Input`).value = match.name;

    let listEl = document.getElementById(`${pos}Suggest`);
    listEl.style.display = "none"; listEl.innerHTML = "";
    state.items = []; state.hi = -1;
}

function onSuggestKeydown(evt, pos) {
    let state = suggestState[pos];
    if (!state.items.length) return;
    if (evt.key === "ArrowDown") {
        evt.preventDefault();
        state.hi = (state.hi + 1) % state.items.length;
        renderSuggestions(pos);
    } else if (evt.key === "ArrowUp") {
        evt.preventDefault();
        state.hi = (state.hi - 1 + state.items.length) % state.items.length;
        renderSuggestions(pos);
    } else if (evt.key === "Enter") {
        evt.preventDefault();
        selectSuggestion(pos, state.hi >= 0 ? state.hi : 0);
    } else if (evt.key === "Escape") {
        document.getElementById(`${pos}Suggest`).style.display = "none";
    }
}

document.addEventListener("click", (evt) => {
    ["start", "goal"].forEach(pos => {
        let wrap = document.getElementById(`${pos}Input`).closest(".input-row");
        if (wrap && !wrap.contains(evt.target)) {
            document.getElementById(`${pos}Suggest`).style.display = "none";
        }
    });
});

function onSelectInput(pos) {
    let stName = document.getElementById(`${pos}St`).value;
    document.getElementById(`${pos}Input`).value = stName;
    document.getElementById(`${pos}Suggest`).style.display = "none";
}

function searchRoute() {
    initData();
    
    globalPaths = []; 
    activeLineTypes = {}; 
    document.getElementById("tabs").innerHTML = "";
    document.getElementById("result").innerHTML = "";

    let startName = document.getElementById("startSt").value;
    let goalName = document.getElementById("goalSt").value;
    if (!startName || !goalName || startName === goalName) return alert("出発駅と目的駅を別々に選択してください");

    let graph = {};
    stations.forEach(s => graph[s.id] = []);
    for (let comp in companyData) {
        for (let lineName in companyData[comp]) {
            let sts = companyData[comp][lineName].stations;
            for (let i = 0; i < sts.length - 1; i++) {
                graph[sts[i].id].push({ id: sts[i+1].id, train: true });
                graph[sts[i+1].id].push({ id: sts[i].id, train: true });
            }
        }
    }
    hubConnections.forEach(([a, b]) => { 
        if(graph[a] && graph[b]) { 
            graph[a].push({ id: b, train: false }); 
            graph[b].push({ id: a, train: false }); 
        } 
    });

    let startIds = stations.filter(s => s.name === startName).map(s => s.id);
    let queue = startIds.map(id => ({ path: [id], lastTransfer: false }));
    
    // 【修正】「どの駅IDに、どの経路長（コスト）で到達したか」を記録するマップ
    // これにより、同じ駅IDへの無駄な大回りルートのみを正確にカットします
    let minCost = {};
    startIds.forEach(id => { minCost[id] = 1; });

    while (queue.length > 0 && globalPaths.length < 3) {
        let node = queue.shift();
        let currId = node.path[node.path.length - 1];
        let currSt = stations.find(s => s.id === currId);

        if (currSt.name === goalName) {
            if (!globalPaths.some(p => p.join('-') === node.path.join('-'))) {
                globalPaths.push(node.path);
            }
            continue;
        }

        (graph[currId] || []).forEach(edge => {
            let nextId = edge.id;
            let nextCost = node.path.length + 1;

            // すでにその駅IDにより短い（または同じ）経路で到達している場合はスキップ
            if (minCost[nextId] !== undefined && minCost[nextId] <= nextCost) return;

            // 経路自体の重複チェック
            if (!node.path.includes(nextId)) {
                if (!edge.train && node.lastTransfer) return; // 連続する徒歩乗り換えは不可
                
                minCost[nextId] = nextCost;
                queue.push({ path: [...node.path, nextId], lastTransfer: !edge.train });
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

    let lineSegments = {};
    path.forEach((id, idx) => {
        let st = stations.find(s => s.id === id);
        if (!lineSegments[st.line]) lineSegments[st.line] = [];
        lineSegments[st.line].push({ st: st, idx: idx });
    });

    for (let line in lineSegments) {
    let seg = lineSegments[line];
    let endpoints = [seg[0].st, seg[seg.length - 1].st]; 
    
    // すでにユーザーが選択している場合は自動判定で上書きしない
    if (!activeLineTypes[line]) {
        let compName = seg[0].st.comp;
        let lineData = companyData[compName][line];
        let availableTypes = Object.keys(lineData.typeColors);
            
        let safeType = "local";
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
        let lineData = companyData[st.comp][st.line];
        let currentType = activeLineTypes[st.line];

        if (st.line !== currLine) {
            html += flushStack();
            if (idx > 0) html += `<div class="transfer-row">🔄 乗り換え</div>`;
            currLine = st.line;
            let bg = lineData.typeColors[currentType] || lineData.color;
            let textCol = lineData.typeTextColor ? (lineData.typeTextColor[currentType] || "white") : (st.dark ? "black" : "white");
            
            let selectHtml = `<select onchange="onLineTypeChange('${st.line}', this.value)">`;
            let typeKeys = Object.keys(lineData.typeColors);
            typeKeys.forEach(k => {
                selectHtml += `<option value="${k}" ${k === currentType ? 'selected' : ''}>${k}</option>`;
            });
            selectHtml += `</select>`;
            html += `<div class="line-block"><div class="line-header" style="background:${bg};color:${textCol};"><span>${st.line}</span>${selectHtml}</div><div class="station-container" style="--line-color:${lineData.color}">`;
        }

        let displayId = (st.comp === "日原鉄道") ? id.replace(/[0-9]/g, '') : id;
        
        let isStop = st.types.includes(currentType);
        let rowClass = isStop ? "st-row" : "st-row pass-station";
        let passLabel = isStop ? "" : "<span class='pass-label'>通過</span>";
        let rowHtml = `<div class="${rowClass}"><div class="st-badge">${displayId}</div><div class="st-name">${st.name}</div>${passLabel}</div>`;

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
