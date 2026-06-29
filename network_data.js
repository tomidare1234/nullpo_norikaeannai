// === network_data.js ===

const companyData = {
    "霞野高速鉄道": {
        lineName: "霞陸線", color: "#50C878", textDark: false,
        typeColors: { "local": "#50C878", "rapid": "#7b3f99", "express": "#F54738" },
        typeTextColor: { "local": "white", "rapid": "white", "express": "white" },
        stations: [
            { id: "KA01", name: "霞野", types: ["local", "rapid", "express"] },
            { id: "KA02", name: "北二丁目", types: ["local", "rapid"] },
            { id: "KA03", name: "西高前", types: ["local"] },
            { id: "KA04", name: "泉園", types: ["local"] },
            { id: "KA05", name: "新霞野", types: ["local", "rapid", "express"] },
            { id: "KA06", name: "向原", types: ["local"] },
            { id: "KA07", name: "旭町", types: ["local", "rapid"] },
            { id: "KA08", name: "桜ヶ丘公園", types: ["local"] },
            { id: "KA09", name: "豊丘", types: ["local"] },
            { id: "KA10", name: "北陸原", types: ["local", "rapid", "express"] },
            { id: "KA11", name: "陸原工業団地", types: ["local", "rapid"] },
            { id: "KA12", name: "陸原流通センター", types: ["local", "rapid"] },
            { id: "KA13", name: "平沼", types: ["local"] },
            { id: "KA14", name: "千石町", types: ["local", "rapid", "express"] },
            { id: "KA15", name: "運動公園", types: ["local", "rapid"] },
            { id: "KA16", name: "博物館前", types: ["local", "rapid"] },
            { id: "KA17", name: "陸原市役所前", types: ["local", "rapid", "express"] },
            { id: "KA18", name: "中央大通", types: ["local", "rapid", "express"] },
            { id: "KA19", name: "錦町", types: ["local", "rapid"] },
            { id: "KA20", name: "陸原", types: ["local", "rapid", "express"] }
        ]
    },
    "霞野新都市交通": {
        lineName: "霞野空港線", color: "#4a86e8", textDark: false,
        typeColors: { "local": "#4a86e8", "rapid": "blue" },
        typeTextColor: { "local": "white", "rapid": "white" },
        stations: [
            { id: "KS01", name: "霞野", types: ["local", "rapid"] },
            { id: "KS02", name: "西霞野", types: ["local", "rapid"] },
            { id: "KS03", name: "学園町", types: ["local"] },
            { id: "KS04", name: "けやき台", types: ["local"] },
            { id: "KS05", name: "弍原神社", types: ["local", "rapid"] },
            { id: "KS06", name: "原ヶ谷", types: ["local"] },
            { id: "KS07", name: "新豊田", types: ["local"] },
            { id: "KS08", name: "下川原", types: ["local"] },
            { id: "KS09", name: "向陽台", types: ["local"] },
            { id: "KS10", name: "霞野空港", types: ["local", "rapid"] }
        ]
    },
    "かすみび あおぞら鉄道": {
        lineName: "かすみび あおぞら鉄道線", color: "#ADD8E6", textDark: true,
        typeColors: { "local": "#ADD8E6" },
        typeTextColor: { "local": "#333" },
        stations: [
            { id: "KB01", name: "霞野", types: ["local"] }, { id: "KB02", name: "霞野ドーム", types: ["local"] },
            { id: "KB03", name: "霞野一丁目", types: ["local"] }, { id: "KB04", name: "薬園", types: ["local"] },
            { id: "KB05", name: "天森", types: ["local"] }, { id: "KB06", name: "新町", types: ["local"] },
            { id: "KB07", name: "霞野医療センター", types: ["local"] }, { id: "KB08", name: "茶畑", types: ["local"] },
            { id: "KB09", name: "恵", types: ["local"] }, { id: "KB10", name: "霞台", types: ["local"] },
            { id: "KB11", name: "市場前", types: ["local"] }, { id: "KB12", name: "東霞ヶ嶺", types: ["local"] },
            { id: "KB13", name: "里下", types: ["local"] }, { id: "KB14", name: "千歳", types: ["local"] },
            { id: "KB15", name: "山谷", types: ["local"] }, { id: "KB16", name: "海見", types: ["local"] },
            { id: "KB17", name: "苦道", types: ["local"] }, { id: "KB18", name: "楽道", types: ["local"] },
            { id: "KB19", name: "龍虫", types: ["local"] }, { id: "KB20", name: "山野道", types: ["local"] },
            { id: "KB21", name: "的茂", types: ["local"] }, { id: "KB22", name: "大井山", types: ["local"] },
            { id: "KB23", name: "今澤", types: ["local"] }, { id: "KB24", name: "相厳", types: ["local"] },
            { id: "KB25", name: "幣村", types: ["local"] }, { id: "KB26", name: "内藁", types: ["local"] },
            { id: "KB27", name: "弥下", types: ["local"] }, { id: "KB28", name: "浅川", types: ["local"] },
            { id: "KB29", name: "大隈", types: ["local"] }, { id: "KB30", name: "竹下", types: ["local"] },
            { id: "KB31", name: "石上", types: ["local"] }, { id: "KB32", name: "片丘津宮", types: ["local"] },
            { id: "KB33", name: "嫋竹", types: ["local"] }, { id: "KB34", name: "若座", types: ["local"] },
            { id: "KB35", name: "町野", types: ["local"] }, { id: "KB36", name: "稿", types: ["local"] },
            { id: "KB37", name: "あおぞら棚姫", types: ["local"] }, { id: "KB38", name: "木岡北", types: ["local"] },
            { id: "KB39", name: "諸岡", types: ["local"] }, { id: "KB40", name: "上縄", types: ["local"] },
            { id: "KB41", name: "日原", types: ["local"] }
        ]
    },
    "陸原開発鉄道": {
        lineName: "陸原線", color: "#4c5866", textDark: false,
        typeColors: { "local": "#4c5866" },
        typeTextColor: { "local": "white" },
        stations: [
            { id: "KG01", name: "陸原工業団地", types: ["local"] },
            { id: "KG02", name: "陸原テックロード", types: ["local"] }
        ]
    },
    "日原鉄道本線": {
        lineName: "日原鉄道本線", color: "#0066cc", textDark: false,
        typeColors: { 
            "local": "#0066cc",   // 普通（本線路線色）
            "rapid": "#6906ff",   // 快速
            "express": "#ff0000"  // 特急
        },
        typeTextColor: { "local": "white", "rapid": "white", "express": "white" },
        stations: [
            { id: "HH01", name: "蒲生", types: ["local", "express"] },
            { id: "HH02", name: "未加島", types: ["local"] },
            { id: "HH03", name: "野傘", types: ["local"] },
            { id: "HH04", name: "貝道", types: ["local"] },
            { id: "HH05", name: "殿茶屋", types: ["local", "express"] },
            { id: "HH06", name: "東殿茶屋", types: ["local"] },
            { id: "HH07", name: "植和", types: ["local"] },
            { id: "HH08", name: "組野", types: ["local"] },
            { id: "HH09", name: "身野山", types: ["local", "express"] },
            { id: "HH10", name: "栗羽", types: ["local"] },
            { id: "HH11", name: "忘明", types: ["local"] },
            { id: "HH12", name: "元野", types: ["local", "rapid", "express"] },
            { id: "HH13", name: "柿沢", types: ["local"] },
            { id: "HH14", name: "芝元", types: ["local"] },
            { id: "HH15", name: "編指", types: ["local"] },
            { id: "HH16", name: "甥出", types: ["local", "rapid"] },
            { id: "HH17", name: "京鷹", types: ["local"] },
            { id: "HH18", name: "層菓", types: ["local", "rapid"] },
            { id: "HH19", name: "南日ニュータウン", types: ["local", "rapid"] },
            { id: "HH20", name: "大組", types: ["local"] },
            { id: "HH21", name: "町藁", types: ["local"] },
            { id: "HH22", name: "縄貫", types: ["local"] },
            { id: "HH23", name: "東日原", types: ["local", "rapid"] },
            { id: "HH24", name: "日原", types: ["local", "rapid", "express"] },
            { id: "HH25", name: "北日原", types: ["local", "rapid", "express"] },
            { id: "HH26", name: "和田野", types: ["local"] },
            { id: "HH27", name: "井伊和", types: ["local"] },
            { id: "HH28", name: "流泣", types: ["local", "rapid", "express"] },
            { id: "HH29", name: "北流泣", types: ["local", "rapid"] },
            { id: "HH30", name: "厚止", types: ["local"] },
            { id: "HH31", name: "内友口", types: ["local", "rapid"] },
            { id: "HH32", name: "内友", types: ["local", "rapid", "express"] },
            { id: "HH33", name: "有黄", types: ["local", "rapid", "express"] },
            { id: "HH34", name: "真間石", types: ["local"] },
            { id: "HH35", name: "南葉間", types: ["local", "rapid"] },
            { id: "HH36", name: "葉間", types: ["local", "rapid", "express"] },
            { id: "HH37", name: "本葉間", types: ["local", "rapid", "express"] },
            { id: "HH38", name: "南平公園", types: ["local"] },
            { id: "HH39", name: "宮ノ後", types: ["local", "rapid"] },
            { id: "HH40", name: "高柳", types: ["local"] },
            { id: "HH41", name: "神田", types: ["local"] },
            { id: "HH42", name: "栄町", types: ["local", "rapid"] },
            { id: "HH43", name: "霞ヶ嶺", types: ["local", "rapid", "express"] },
            { id: "HH44", name: "本町通", types: ["local", "rapid"] },
            { id: "HH45", name: "常盤台", types: ["local"] },
            { id: "HH46", name: "霞野温泉", types: ["local", "rapid", "express"] },
            { id: "HH47", name: "鷺ノ宮", types: ["local"] },
            { id: "HH48", name: "向河原", types: ["local"] },
            { id: "HH49", name: "千歳橋", types: ["local", "rapid"] },
            { id: "HH50", name: "霞野タウン", types: ["local", "rapid", "express"] },
            { id: "HH51", name: "鍛冶町", types: ["local", "rapid"] },
            { id: "HH52", name: "霞野", types: ["local", "rapid", "express"] }
        ]
    },
    "日原鉄道得元線": {
        lineName: "日原鉄道得元線", color: "#3bfad1", textDark: true,
        typeColors: { 
            "local": "#3bfad1",   // 普通（路線色）
            "rapid": "#6906ff",   // 快速
            "express": "#ff0000"  // 特急
        },
        typeTextColor: { "local": "black", "rapid": "white", "express": "white" },
        stations: [
            { id: "HE01", name: "元野", types: ["local", "rapid", "express"] },
            { id: "HE02", name: "山東", types: ["local"] },
            { id: "HE03", name: "北面堀", types: ["local"] },
            { id: "HE04", name: "重堀", types: ["local", "rapid"] },
            { id: "HE05", name: "西守", types: ["local"] },
            { id: "HE06", name: "家居", types: ["local"] },
            { id: "HE07", name: "小脇", types: ["local", "rapid"] },
            { id: "HE08", name: "陰陽", types: ["local"] },
            { id: "HE09", name: "森湧", types: ["local"] },
            { id: "HE10", name: "得湧", types: ["local", "rapid", "express"] },
            { id: "HE11", name: "南得湧", types: ["local", "rapid", "express"] },
            { id: "HE12", name: "谷村", types: ["local"] },
            { id: "HE13", name: "橋本境", types: ["local"] },
            { id: "HE14", name: "飯田通", types: ["local", "rapid", "express"] },
            { id: "HE15", name: "喜多栄", types: ["local"] },
            { id: "HE16", name: "南雲田", types: ["local"] },
            { id: "HE17", name: "三和飯井", types: ["local"] },
            { id: "HE18", name: "考板", types: ["local", "rapid"] },
            { id: "HE19", name: "赤石", types: ["local"] },
            { id: "HE20", name: "和村町", types: ["local", "rapid", "express"] },
            { id: "HE21", name: "東谷川", types: ["local"] },
            { id: "HE22", name: "音羽", types: ["local", "rapid"] },
            { id: "HE23", name: "今村橋", types: ["local"] },
            { id: "HE24", name: "浜路", types: ["local"] },
            { id: "HE25", name: "高丸", types: ["local"] },
            { id: "HE26", name: "黒坂野", types: ["local"] },
            { id: "HE27", name: "緑競", types: ["local"] },
            { id: "HE28", name: "和岡", types: ["local", "rapid", "express"] },
            { id: "HE29", name: "大木川", types: ["local"] },
            { id: "HE30", name: "我老和", types: ["local"] },
            { id: "HE31", name: "滝野口", types: ["local"] },
            { id: "HE32", name: "広見野", types: ["local"] },
            { id: "HE33", name: "舞野", types: ["local", "rapid"] },
            { id: "HE34", name: "谷口台", types: ["local"] },
            { id: "HE35", name: "上杉野", types: ["local", "rapid", "express"] },
            { id: "HE36", name: "杉野", types: ["local"] },
            { id: "HE37", name: "青木沢", types: ["local"] },
            { id: "HE38", name: "古川西柏原町", types: ["local"] },
            { id: "HE39", name: "川内谷", types: ["local"] },
            { id: "HE40", name: "宝大川", types: ["local", "rapid", "express"] },
            { id: "HE41", name: "雲坂", types: ["local"] },
            { id: "HE42", name: "東", types: ["local"] },
            { id: "HE43", name: "久世", types: ["local"] },
            { id: "HE44", name: "新開原", types: ["local", "rapid"] },
            { id: "HE45", name: "野田端", types: ["local"] },
            { id: "HE46", name: "馬衛門", types: ["local", "rapid"] },
            { id: "HE47", name: "北大淵", types: ["local"] },
            { id: "HE48", name: "中通り", types: ["local", "rapid", "express"] },
            { id: "HE49", name: "北橋本", types: ["local"] },
            { id: "HE50", name: "橋本中央", types: ["local", "rapid", "express"] }
        ]
    },
    "日原空港線": {
        lineName: "日原空港線", color: "#fc00ea", textDark: false,
        typeColors: { 
            "local": "#fc00ea",           // 普通（路線色）
            "airport_rapid": "#e8782e",   // 空港快速
            "express": "#ff0000"          // 特急
        },
        typeTextColor: { "local": "white", "airport_rapid": "white", "express": "white" },
        stations: [
            { id: "HA01", name: "北日原", types: ["local", "airport_rapid", "express"] },
            { id: "HA02", name: "抜田", types: ["local"] },
            { id: "HA03", name: "八牧", types: ["local"] },
            { id: "HA04", name: "魚", types: ["local", "airport_rapid", "express"] },
            { id: "HA05", name: "空港南口", types: ["local"] },
            { id: "HA06", name: "日原空港", types: ["local", "airport_rapid", "express"] }
        ]
    },
    "日原鉄道元野港線": {
        lineName: "日原鉄道元野港線", color: "#2b0000", textDark: false,
        typeColors: { "local": "#2b0000" },
        typeTextColor: { "local": "white" },
        stations: [
            { id: "HM01", name: "元野", types: ["local"] },
            { id: "HM02", name: "白菊澤", types: ["local"] },
            { id: "HM03", name: "日原元野港", types: ["local"] }
        ]
    },
    "日原鉄道生竹線": {
        lineName: "日原鉄道生竹線", color: "#8a0106", textDark: false,
        typeColors: { "local": "#8a0106", "express": "#ff0000" },
        typeTextColor: { "local": "white", "express": "white" },
        stations: [
            { id: "HS01", name: "北日原", types: ["local", "express"] },
            { id: "HS02", name: "大沖", types: ["local"] },
            { id: "HS03", name: "木岡", types: ["local"] },
            { id: "HS04", name: "前門", types: ["local"] },
            { id: "HS05", name: "階折", types: ["local"] },
            { id: "HS06", name: "新流泣", types: ["local", "express"] },
            { id: "HS07", name: "金創", types: ["local"] },
            { id: "HS08", name: "片丘津宮", types: ["local", "express"] },
            { id: "HS09", name: "庵", types: ["local"] },
            { id: "HS10", name: "与板", types: ["local"] },
            { id: "HS11", name: "枚木", types: ["local"] },
            { id: "HS12", name: "大黄", types: ["local", "express"] },
            { id: "HS13", name: "村奈", types: ["local"] },
            { id: "HS14", name: "織錦", types: ["local"] },
            { id: "HS15", name: "複合センター前", types: ["local"] },
            { id: "HS16", name: "生竹", types: ["local", "express"] },
            { id: "HS17", name: "戸羽センター前", types: ["local"] },
            { id: "HS18", name: "西田宮本町", types: ["local", "express"] },
            { id: "HS19", name: "新田宮", types: ["local"] },
            { id: "HS20", name: "下川区役所通り", types: ["local"] },
            { id: "HS21", name: "下川橋", types: ["local"] },
            { id: "HS22", name: "和戸森林公園", types: ["local"] },
            { id: "HS23", name: "和戸市役所前", types: ["local", "express"] },
            { id: "HS24", name: "和戸免許センター前", types: ["local"] },
            { id: "HS25", name: "和戸", types: ["local", "express"] }
        ]
    }
};

const hubConnections = [
    ["KA01", "KB01"], ["KA01", "KS01"], ["KB01", "KS01"],
    ["KA11", "KG01"],
    
    // === 日原鉄道 相互乗り換え・結節点接続 ===
    // 【元野駅】本線、得元線、元野港線の3路線
    ["HH12", "HE01"], ["HH12", "HM01"], ["HE01", "HM01"],
    
    // 【日原駅】本線、かすみびあおぞら鉄道線の接続
    ["HH24", "KB41"],
    
    // 【北日原駅】本線、空港線、生竹線の3路線
    ["HH25", "HA01"], ["HH25", "HS01"], ["HA01", "HS01"],
    
    // 【片丘津宮駅】生竹線、かすみびあおぞら鉄道線の接続
    ["HS08", "KB32"],
    
    // 【霞野駅】本線、霞野高速鉄道、霞野新都市交通の接続
    ["HH52", "KA01"], ["HH52", "KS01"]
];
