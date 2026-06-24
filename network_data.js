// network_data.js
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
    }
};

const hubConnections = [
    ["KA01", "KB01"], ["KA01", "KS01"], ["KB01", "KS01"],
    ["KA11", "KG01"]
];
