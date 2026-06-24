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

// 【同期処理1】手打ちテキストが入力されたら、部分一致するセレクトボックスを自動選択
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

// 【同期処理2】セレクトボックスで駅が選ばれたら、手打ちテキストに自動反映
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
