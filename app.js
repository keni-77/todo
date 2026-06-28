const STORAGE_KEY = "tasks_simple_edit_v2";
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let saveTimer = null;
const SAVE_DEBOUNCE_MS = 300;

// --- ここから追加 ---
const priorityLabels = {
  5: "👑 神の託宣",
  4: "🔥 烈火の如く",
  3: "⚔️ 日常の戦い",
  2: "☕ 気が向けば",
  1: "🍃 忘却の彼方"
};

const typeLabels = {
  'daily': "🔁 毎日",
  'weekly': "📅 毎週",
  'once': "✨ 単発",
  'deadline_weekly': "🔥 課題(週)",
  'deadline_once': "🔥 課題(単)"
};
// --- ここまで追加 ---

// ★【超・網羅版】1年間の主要な国際デー・記念日リスト（130個以上！）
const INTL_DAYS = {
  "01-01": "世界平和の日 🕊️", "01-04": "世界点字デー ⠃", "01-24": "国際教育デー 📚", "01-27": "ホロコースト犠牲者想起国際デー 🕯️",
  "02-02": "世界湿地デー 🦆", "02-04": "世界対がんデー 🎗️", "02-06": "女性器切除不認容の国際デー 🙅", "02-10": "世界豆類デー 🫘", "02-11": "科学における女性と女児の国際デー 👩‍🔬", "02-13": "世界ラジオデー 📻", "02-20": "世界社会正義の日 ⚖️", "02-21": "国際母語デー 🗣️",
  "03-01": "差別ゼロ・デー 🦋", "03-03": "世界野生生物デー 🦊", "03-08": "国際女性デー ♀️", "03-20": "国際幸福デー 😊", "03-21": "国際人種差別撤廃デー 🌍 / 世界ダウン症の日 / 国際森林デー 🌳", "03-22": "世界水の日 💧", "03-23": "世界気象の日 ☀️", "03-24": "世界結核デー 🩺",
  "04-02": "世界自閉症啓発デー 🧩", "04-04": "地雷に関する啓発国際デー 🚫", "04-05": "国際良心デー 🕯️", "04-06": "開発と平和のためのスポーツ国際デー 🏅", "04-07": "世界保健デー 🩺", "04-12": "人間の宇宙飛行国際デー 🚀", "04-21": "世界創造性とイノベーション・デー 💡", "04-22": "アースデー（地球の日） 🌱", "04-23": "世界図書・著作権デー 📖", "04-24": "平和のための外交・マルチラテラリズム国際デー 🤝", "04-25": "世界マラリアデー 🦟", "04-26": "世界知的財産デー 📜", "04-28": "国際労働安全衛生デー 👷", "04-30": "国際ジャズ・デー 🎷",
  "05-02": "世界マグロデー 🐟", "05-03": "世界報道自由デー 📰", "05-08": "第二次世界大戦犠牲者追悼・和解の日 🕊️", "05-15": "国際家族デー 🏠", "05-16": "国際光デー 💡 / 共に平和に生きる国際デー", "05-17": "世界電気通信・情報社会デー 💻", "05-20": "世界ミツバチ・デー 🐝", "05-21": "対話と開発のための文化多様性世界デー 🎭", "05-22": "国際生物多様性の日 🦁", "05-23": "国際産科瘻孔撲滅デー 🏥", "05-29": "国連平和維持要員の国際デー 🇺🇳", "05-31": "世界禁煙デー 🚭",
  "06-01": "国際親の日 👨‍👩‍👧", "06-03": "世界自転車デー 🚲", "06-04": "侵略による無辜の幼児犠牲者の国際デー 😢", "06-05": "世界環境デー 🌳", "06-07": "世界食品安全デー 🍏", "06-08": "世界海洋デー 🌊", "06-12": "児童労働反対世界デー 🎒", "06-13": "国際白皮症啓発デー 🏳️", "06-14": "世界献血者デー 🩸", "06-15": "世界高齢者虐待認識デー 👵", "06-16": "国際家庭送金デー 💸", "06-17": "砂漠化および干ばつと闘う世界デー 🏜️", "06-19": "紛争における性的暴力根絶の国際デー 🚫", "06-20": "世界難民の日 🤝", "06-21": "国際ヨガの日 🧘 / 世界水路の日 🗺️", "06-23": "国連公務員デー 🏛️ / 国際寡婦デー 👩‍", "06-25": "船員の日 🚢", "06-26": "国際薬物乱用・不正取引防止デー 🙅 / 拷問犠牲者支援国際デー", "06-27": "零細・中小企業デー 🏢", "06-29": "国際熱帯デー 🌴", "06-30": "国際小惑星デー ☄️ / 国際議会制度デー",
  "07-07": "七夕の節句 🌌", "07-11": "世界人口デー 👥", "07-15": "世界若者技能デー 🛠️", "07-20": "国際チェス・デー ♟️", "07-25": "世界溺水防止デー 🛟", "07-28": "世界肝炎デー 🧬", "07-30": "国際友情デー 🤝 / 人身取引反対世界デー",
  "08-09": "世界の先住民族の国際デー 🏹", "08-12": "国際青少年デー 🧑‍🤝‍🧑", "08-19": "世界人道デー ❤️", "08-21": "テロ被害者想起・追悼国際デー 🕯️", "08-22": "宗教に基づく暴力行為の犠牲者を追悼する国際デー", "08-23": "奴隷貿易とその廃止を記憶する国際デー ⛓️", "08-29": "核実験反対国際デー ☢️", "08-30": "強制失踪犠牲者の国際デー", "08-31": "アフリカ系人々の国際デー 🌍",
  "09-05": "国際チャリティー・デー 💖", "09-07": "青空のためのきれいな空気の国際デー 🌤️", "09-08": "国際識字デー 📝", "09-09": "教育を攻撃から守る国際デー 🏫", "09-12": "南南協力のための国連デー 🤝", "09-15": "国際民主主義デー 🗳️", "09-16": "オゾン層保護のための国際デー 🌍", "09-17": "世界患者安全デー 🏥", "09-21": "国際平和デー 🕊️", "09-23": "国際手話言語デー 🧏", "09-26": "核兵器の全面的廃絶のための国際デー ⚛️", "09-27": "世界観光デー ✈️", "09-28": "情報への普遍的アクセスに関する国際デー ℹ️ / 世界狂犬病デー 🐕", "09-29": "食料のロスと廃棄に関する啓発の国際デー 🌾", "09-30": "国際翻訳デー 🗣️",
  "10-01": "国際高齢者デー 👴", "10-02": "国際非暴力デー 🕊️", "10-05": "世界教師デー 🧑‍🏫", "10-09": "世界郵便デー ✉️", "10-10": "世界メンタルヘルス・デー 🧠", "10-11": "国際ガールズ・デー 👧", "10-13": "国際防災デー 🦺", "10-15": "国際農山漁村女性デー 👩‍🌾", "10-16": "世界食料デー 🍎", "10-17": "国際貧困撲滅デー 🤲", "10-24": "国連デー 🇺🇳 / 世界開発情報デー", "10-27": "世界音響映像遺産の日 📹", "10-31": "世界都市デー 🏙️",
  "11-02": "ジャーナリストに対する犯罪不処罰をなくす国際デー 🎙️", "11-05": "世界津波の日 🌊", "11-06": "戦争と武力紛争における環境搾取防止国際デー 🌿", "11-10": "平和と開発のための世界科学デー 🔬", "11-14": "世界糖尿病デー 🩺", "11-16": "国際寛容デー 🤝", "11-19": "世界トイレデー 🚽 / 国際男性デー 👨", "11-20": "世界こどもの日 🧸", "11-21": "世界テレビジョン・デー 📺", "11-25": "女性に対する暴力撤廃国際デー 🚫", "11-29": "パレスチナ連帯国際デー 🕊️", "11-30": "化学戦のすべての犠牲者を追悼する日の国際デー",
  "12-01": "世界エイズデー 🎗️", "12-02": "奴隷制廃止国際デー ⛓️", "12-03": "国際障害者デー ♿", "12-04": "国際銀行デー 🏦", "12-05": "国際ボランティア・デー 🙋 / 世界土壌デー 🌱", "12-07": "国際民間航空デー ✈️", "12-09": "国際反汚職デー 💼 / ジェノサイドの罪の犠牲者を追悼する国際デー", "12-10": "人権デー ⚖️", "12-11": "国際山岳デー 🏔️", "12-12": "国際ユニバーサル・ヘルス・カバレッジ・デー / 国際中立デー", "12-18": "国際移住者デー 🧳 / 国際アラビア語デー", "12-20": "国際人間の連帯デー 🤝", "12-25": "クリスマス 🎄", "12-27": "国際流行対策準備デー 😷"
};

// マイグレーション
tasks = tasks.map(t => {
  if(t.type === "deadline_weekly" && t.startWd === undefined) {
    return {...t, startWd: 1, startTime: "08:00", endWd: 5, endTime: "23:59"};
  }
  if(t.type === "deadline_once" && t.endTime === undefined) {
    return {...t, endTime: "23:59"};
  }
  return t;
});

const displayTab = document.getElementById("displayTab");
const editTab = document.getElementById("editTab");
const displayArea = document.getElementById("displayArea");
const editArea = document.getElementById("editArea");
const todayLabel = document.getElementById("todayLabel");
const birthdayBanner = document.getElementById("birthdayBanner");
const internationalDayBox = document.getElementById("internationalDay");

todayLabel.textContent = new Date().toLocaleDateString("ja-JP");

function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function todayISO(){ return toLocalDateString(new Date()); }

function saveDebounced(){
  if(saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(()=> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    saveTimer = null;
  }, SAVE_DEBOUNCE_MS);
}
function weekdayName(n){ return ["日","月","火","水","木","金","土"][n] || ""; }
function formatMonthDay(iso){ if(!iso) return ""; const d = new Date(iso); return `${d.getMonth()+1}月${d.getDate()}日`; }
function escapeHtml(s){ if(!s) return ""; return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"); }

function getMostRecentPastDayOfWeekTime(now, targetWd, targetTime) {
  const [h, m] = targetTime.split(':').map(Number);
  let d = new Date(now);
  d.setHours(h, m, 0, 0);
  let diff = d.getDay() - targetWd;
  if (diff < 0) diff += 7;
  d.setDate(d.getDate() - diff);
  if (d > now) d.setDate(d.getDate() - 7);
  return d;
}

function getNextDayOfWeekTime(now, targetWd, targetTime) {
  const [h, m] = targetTime.split(':').map(Number);
  let d = new Date(now);
  d.setHours(h, m, 0, 0);
  let diff = targetWd - d.getDay();
  if (diff < 0) diff += 7;
  d.setDate(d.getDate() + diff);
  if (d < now) d.setDate(d.getDate() + 7);
  return d;
}

let currentMode = "display";
function switchMode(mode){
  currentMode = mode;
  if(mode === "display"){
    displayArea.style.display = ""; editArea.style.display = "none";
    displayTab.classList.add("active"); editTab.classList.remove("active");
    cleanupExpiredDates(); resetDailyChecks(); render();
  } else {
    displayArea.style.display = "none"; editArea.style.display = "";
    displayTab.classList.remove("active"); editTab.classList.add("active");
    stopBirthdayEffects(); // 編集モードではクラッカーを止める
    renderEdit();
  }
}
displayTab.addEventListener("click", ()=> switchMode("display"));
editTab.addEventListener("click", ()=> switchMode("edit"));

window.addEventListener("load", () => { cleanupExpiredDates(); resetDailyChecks(); render(); });
document.addEventListener("visibilitychange", () => {
  if(document.visibilityState === "visible"){
    cleanupExpiredDates(); resetDailyChecks();
    if(currentMode === "display") render(); else renderEdit();
  }
});

setInterval(() => {
  if(currentMode === "display") {
    resetDailyChecks();
    render();
  }
}, 60000);

function cleanupExpiredDates(){
  const today = todayISO();
  const now = new Date();
  tasks = tasks.filter(t => {
    if(t.type === "once" && t.date && t.date < today) return false;
    if(t.type === "deadline_once" && t.isDone && t.date) {
      const [h, m] = (t.endTime || "23:59").split(':').map(Number);
      const limit = new Date(t.date); limit.setHours(h, m, 0, 0);
      if(limit < now) return false;
    }
    return true;
  });
  saveDebounced();
}

function resetDailyChecks(){
  const today = todayISO();
  const now = new Date();
  let changed = false;
  tasks.forEach(t => {
    if(t.isDone) {
      if(t.type === "daily" || t.type === "weekly" || t.everyday) {
        if(t.lastDoneDate !== today){ t.isDone = false; changed = true; }
      } 
      else if(t.type === "deadline_weekly") {
        if(t.startWd !== undefined && t.startTime !== undefined) {
          const recentReset = getMostRecentPastDayOfWeekTime(now, Number(t.startWd), t.startTime);
          if(t.lastDoneTime && t.lastDoneTime < recentReset.getTime()) {
             t.isDone = false; changed = true; 
          }
        }
      }
    }
  });
  if(changed) saveDebounced();
}

function getDeadlineInfo(task, now) {
  let deadlineDate = null;
  if (task.type === "deadline_weekly") {
    deadlineDate = getNextDayOfWeekTime(now, Number(task.endWd), task.endTime || "23:59");
  } else if (task.type === "deadline_once" && task.date) {
    deadlineDate = new Date(task.date);
    const [h, m] = (task.endTime || "23:59").split(':').map(Number);
    deadlineDate.setHours(h, m, 0, 0);
  }

  if (!deadlineDate) return { color: "#ea580c", text: "", isWarning: false };

  const timeLeft = deadlineDate.getTime() - now.getTime();
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;

  let isWarning = false;
  let color = "#ea580c"; 
  let text = "";

  if (timeLeft < 0) {
    color = "#dc2626"; 
    text = "期限切れ";
    isWarning = true;
  } else if (timeLeft <= ONE_DAY) {
    // 24時間以内に向けて徐々に赤くするグラデーション(HSL)
    const hue = Math.max(0, Math.min(25, (timeLeft / ONE_DAY) * 25));
    color = `hsl(${hue}, 100%, 45%)`;
    
    if (timeLeft <= ONE_HOUR) {
      isWarning = true; 
      const m = Math.floor(timeLeft / 60000);
      text = `残り ${m} 分！`;
    } else {
      const h = Math.floor(timeLeft / ONE_HOUR);
      text = `残り約 ${h} 時間`;
    }
  } else {
    color = "#2563eb"; // まだ余裕があるときは青
    text = "余裕あり";
  }

  return { color, text, isWarning, deadlineDate };
}

// ★バチクソ祝うための紙吹雪演出スクリプト
function startBirthdayEffects() {
  if (document.getElementById("confetti-container")) return;
  const container = document.createElement("div");
  container.id = "confetti-container";
  container.style.position = "fixed";
  container.style.top = "0"; container.style.left = "0";
  container.style.width = "100vw"; container.style.height = "100vh";
  container.style.pointerEvents = "none"; container.style.zIndex = "9999";
  container.style.overflow = "hidden";
  document.body.appendChild(container);

  const emojis = ["🎉", "🎂", "✨", "💖", "🎁", "🎈", "🥳", "🍰", "👑"];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.position = "absolute";
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = "-60px";
    el.style.fontSize = Math.random() * 24 + 24 + "px";
    el.style.opacity = Math.random() * 0.5 + 0.5;
    
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 6;
    el.style.animation = `fall ${duration}s linear ${delay}s infinite`;
    container.appendChild(el);
  }
}
function stopBirthdayEffects() {
  const container = document.getElementById("confetti-container");
  if (container) container.remove();
}

function render(){
  const taskList = document.getElementById("taskList");
  const hiddenList = document.getElementById("hiddenList");
  taskList.innerHTML = ""; hiddenList.innerHTML = "";

  const now = new Date();
  const todayStr = todayISO(); 
  const wd = now.getDay();
  let birthdayNames = [];

  // 国際デーのセット
  const currentMD = todayStr.slice(5); // "MM-DD"
  if (INTL_DAYS[currentMD]) {
    internationalDayBox.innerHTML = `🌍 今日は <strong>${INTL_DAYS[currentMD]}</strong>`;
    internationalDayBox.style.display = "block";
  } else {
    internationalDayBox.style.display = "none";
  }

  // ★追加：表示する直前に、重要度(5→1) ＞ 頻度 の順にタスクをソートする
  tasks.sort((a, b) => {
    // 【第1優先】重要度（5 から 1 の順）。設定がない場合は3とする
    const priA = a.priority || 3;
    const priB = b.priority || 3;
    if (priB !== priA) return priB - priA;

    // 【第2優先】頻度
    const typeOrder = { 'daily': 1, 'weekly': 2, 'once': 3, 'deadline_weekly': 3, 'deadline_once': 3, 'birthday': 5 };
    const orderA = typeOrder[a.type] || 4;
    const orderB = typeOrder[b.type] || 4;
    return orderA - orderB;
  });

  tasks.forEach(task => {
    if(task.isDraft) return;

    // ★誕生日データはタスクとして出さず、名前だけストックしてスキップする
    if(task.type === "birthday"){
      if(task.date && task.date.slice(5) === currentMD){
        birthdayNames.push(task.title);
      }
      return; 
    }

    let isToday = false;
    if(task.type === "daily") isToday = true;
    else if(task.type === "weekly"){
      if(task.everyday) isToday = true;
      else if(Array.isArray(task.weekdays) && task.weekdays.includes(wd)) isToday = true;
    } 
    else if(task.type === "once" && task.date === todayStr) isToday = true;
    else if(task.type === "deadline_weekly" || task.type === "deadline_once"){ isToday = true; }

    if(!isToday && !task.isDone) return;

    if(task.isDone){
      hiddenList.appendChild(createTaskCard(task, true, now));
    } else if(isToday){
      taskList.appendChild(createTaskCard(task, false, now));
    }
  });

  // ★誕生日が一人でもいればバチクソに祝う
  if(birthdayNames.length > 0){
    document.body.classList.add("birthday-mode");
    birthdayBanner.style.display = "block";
    const names = birthdayNames.map(n => escapeHtml(n)).join(" & ");
    birthdayBanner.innerHTML = `🎉 🎂 🎉 🎂 🎉 🎂 🎉<br>HAPPY BIRTHDAY!!!<br>今日は 【${names}】 の誕生日！<br>おめでとううううう！！ 🎁 ✨ 🥳`;
    startBirthdayEffects();
  } else {
    document.body.classList.remove("birthday-mode");
    birthdayBanner.style.display = "none";
    stopBirthdayEffects();
  }

  const hiddenArea = document.getElementById("hiddenArea");
  const toggleBtn = document.getElementById("toggleHidden");
  if(getComputedStyle(hiddenArea).display !== "none"){
    toggleBtn.textContent = "非表示を閉じる";
  } else { toggleBtn.textContent = "- 完了したタスクを表示 -"; }

  document.querySelectorAll('.undoBtn').forEach(btn => btn.addEventListener('click', () => undoTask(Number(btn.dataset.id))));
  document.querySelectorAll('.chkTask').forEach(cb => cb.addEventListener('click', () => checkTask(Number(cb.dataset.id))));
}

function createTaskCard(task, hidden=false, now=null){
  const div = document.createElement("div");
  // ★クラス名に type-${task.type} を組み込み
  div.className = "task-card " + (hidden ? "hidden-task" : `type-${task.type}`);
  
  const top = document.createElement("div"); top.className = "task-top";
  const left = document.createElement("div"); left.style.display="flex"; left.style.alignItems="center"; left.style.gap="10px";

  if(!hidden){
    const chk = document.createElement("input"); chk.type="checkbox"; chk.className="chkTask"; chk.dataset.id = task.id; left.appendChild(chk);
    const title = document.createElement("div"); title.className="task-title"; title.innerHTML = escapeHtml(task.title || "(無題)");
    left.appendChild(title);
  } else {
    const doneMark = document.createElement("div"); doneMark.textContent="✓"; doneMark.style.color="#10b981"; doneMark.style.fontWeight="900"; left.appendChild(doneMark);
    const title = document.createElement("div"); title.className="task-title"; title.innerHTML = escapeHtml(task.title || "(無題)");
    left.appendChild(title);
  }
  top.appendChild(left);

  // ★追加：タイトルのすぐ下に2つのバッジ（重要度と頻度）を挟み込む
  if (!hidden && task.type !== "birthday") {
    const badgeContainer = document.createElement("div");
    badgeContainer.className = "task-badges";
    
    const pLevel = task.priority || 3;
    badgeContainer.innerHTML = `
      <span class="badge-priority p-${pLevel}">${priorityLabels[pLevel] || "⚔️ 日常の戦い"}</span>
      <span class="badge-type t-${task.type}">${typeLabels[task.type] || "⚙️ タスク"}</span>
    `;
    top.appendChild(badgeContainer);
  }

  const meta = document.createElement("div"); meta.className="task-meta";
  
  // 期限タスクにおける、近づくにつれて赤くなる処理
  if(!hidden && (task.type === "deadline_weekly" || task.type === "deadline_once")) {
    const info = getDeadlineInfo(task, now || new Date());
    let metaHTML = "";
    
    // ★課題の期限が迫るほど、枠線とカード背景の下側が赤く染まる！
    div.style.borderColor = info.color;
    div.style.borderWidth = "2px";
    div.style.background = `linear-gradient(180deg, #ffffff 60%, ${info.color}15 100%)`;
    
    if(info.isWarning) {
      div.className = "task-card warning-pulse"; // うるさい警告発動
      metaHTML += `<div class="warning-badge">🚨 逃げ場なし！期限直前 🚨</div><br>`;
    }
    
    let deadlineStr = "";
    if(task.type === "deadline_weekly") deadlineStr = `${weekdayName(task.endWd)}曜 ${task.endTime} まで`;
    else deadlineStr = `${formatMonthDay(task.date)} ${task.endTime || "23:59"} まで`;

    metaHTML += `期限: ${deadlineStr}`;
    if(info.text) metaHTML += `<br><span style="font-size:12px; font-weight:800;">[${info.text}]</span>`;
    
    meta.innerHTML = metaHTML;
    meta.style.color = info.color;
  }
  else if(task.type === "weekly") meta.textContent = task.everyday ? "毎日" : (task.weekdays||[]).map(n=>weekdayName(n)).join("・") + "曜";
  else if(task.type === "once") meta.textContent = formatMonthDay(task.date) + " に実行";
  else meta.textContent = "毎日";
  top.appendChild(meta);

  const memo = document.createElement("div"); memo.className="task-memo"; memo.textContent = task.memo || "";

  const actions = document.createElement("div"); actions.className="task-actions";
  if(hidden){
    const undo = document.createElement("button"); undo.className="btn"; undo.textContent="戻す"; undo.dataset.id = task.id; undo.classList.add("undoBtn"); actions.appendChild(undo);
  } else {
    const infoBtn = document.createElement("button"); infoBtn.className="btn"; infoBtn.textContent="編集";
    infoBtn.addEventListener('click', ()=> { switchMode("edit"); setTimeout(()=> { const el = document.querySelector(`#editList .edit-row[data-id='${task.id}']`); if(el) el.scrollIntoView({behavior:'smooth', block:'center'}); }, 120); });
    actions.appendChild(infoBtn);
  }

  div.appendChild(top);
  if(task.memo && task.type !== "birthday") div.appendChild(memo);
  div.appendChild(actions);
  return div;
}

function checkTask(id){
  const today = todayISO();
  const nowTime = new Date().getTime();
  tasks = tasks.map(t => t.id === id ? {...t, isDone:true, lastDoneDate:today, lastDoneTime: nowTime} : t);
  saveDebounced(); render();
}
function undoTask(id){
  tasks = tasks.map(t => t.id === id ? {...t, isDone:false} : t);
  saveDebounced(); render();
}

function toggleHidden(){
  const area = document.getElementById("hiddenArea");
  const btn = document.getElementById("toggleHidden");
  if(getComputedStyle(area).display !== "none"){ area.style.display = "none"; btn.textContent = "- 完了したタスクを表示 -"; } 
  else { area.style.display = "block"; btn.textContent = "非表示を閉じる"; }
}
document.getElementById("toggleHidden").addEventListener("click", toggleHidden);

/* ---------- 編集モード ---------- */
function renderEdit(){
  const editList = document.getElementById("editList");
  editList.innerHTML = "";

  if(tasks.length === 0){ editList.innerHTML = `<div style="color:var(--muted)">タスクがありません。上の「新規追加」で追加してください。</div>`; return; }

  const dailyTasks = tasks.filter(t => ["daily", "weekly", "once"].includes(t.type) || !t.type);
  const deadlineTasks = tasks.filter(t => ["deadline_weekly", "deadline_once"].includes(t.type));
  const birthdayTasks = tasks.filter(t => t.type === "birthday");

  function createRowElement(task) {
    const row = document.createElement("div"); row.className = "edit-row"; row.dataset.id = task.id;
    const titleInput = document.createElement("input"); titleInput.type="text"; titleInput.value = task.title || ""; titleInput.style.minWidth="160px";
    const memoInput = document.createElement("input"); memoInput.type="text"; memoInput.value = task.memo || ""; memoInput.style.minWidth="140px"; memoInput.placeholder = "メモ";
    
    const typeSelect = document.createElement("select");
    typeSelect.innerHTML = `
      <option value="daily">毎日（ルーティン）</option>
      <option value="weekly">曜日指定（その日だけ）</option>
      <option value="once">日付指定（その日だけ）</option>
      <option value="deadline_weekly">課題（曜日・時間で復活・期限）</option>
      <option value="deadline_once">課題（指定日時が期限）</option>
      <option value="birthday">誕生日（毎年バチクソ祝う）</option>
    `;
    typeSelect.value = task.type || "daily";

    // ★追加：重要度を選ぶセレクトボックスを作る
    const prioritySelect = document.createElement("select");
    prioritySelect.className = "priority-edit";
    prioritySelect.innerHTML = `
      <option value="5">👑 神の託宣 (重要度5)</option>
      <option value="4">🔥 烈火の如く (重要度4)</option>
      <option value="3">⚔️ 日常の戦い (重要度3)</option>
      <option value="2">☕ 気が向けば (重要度2)</option>
      <option value="1">🍃 忘却の彼方 (重要度1)</option>
    `;
    prioritySelect.value = task.priority || 3;

    const wkBox = document.createElement("div"); wkBox.style.display="flex"; wkBox.style.gap="6px"; wkBox.style.alignItems="center";
    for(let i=0;i<7;i++){
      const lab = document.createElement("label");
      const cb = document.createElement("input"); cb.type="checkbox"; cb.value = i; cb.className = "wk-edit";
      cb.checked = Array.isArray(task.weekdays) && task.weekdays.includes(i);
      lab.appendChild(cb); lab.appendChild(document.createTextNode(weekdayName(i)));
      wkBox.appendChild(lab);
    }

    const advTimeBox = document.createElement("div"); advTimeBox.className = "adv-time-box";
    const getWdOptions = (selVal) => [0,1,2,3,4,5,6].map(i => `<option value="${i}" ${selVal==i?'selected':''}>${weekdayName(i)}曜</option>`).join('');
    
    advTimeBox.innerHTML = `
      <div class="deadline-weekly-inputs" style="display:flex; gap:10px; align-items:center;">
        <div>復活: <select class="start-wd">${getWdOptions(task.startWd !== undefined ? task.startWd : 1)}</select> <input type="time" class="start-time" value="${task.startTime || '08:00'}"></div>
        <div>期限: <select class="end-wd">${getWdOptions(task.endWd !== undefined ? task.endWd : 5)}</select> <input type="time" class="end-time" value="${task.endTime || '23:59'}"></div>
      </div>
      <div class="deadline-once-inputs" style="display:flex; gap:10px; align-items:center;">
        <div>期限: <input type="date" class="date-input" value="${task.date || ''}"> <input type="time" class="once-time" value="${task.endTime || '23:59'}"></div>
      </div>
      <div class="regular-date-input">
        <input type="date" class="reg-date" value="${task.date || ''}">
      </div>
    `;

    const exampleSpan = document.createElement("div"); exampleSpan.className = "example";
    
    // ★誕生日のときにインプットやプレースホルダーの見た目を切り替える処理
    function updateVisibility(){
      const t = typeSelect.value;
      wkBox.style.display = t === "weekly" ? "" : "none";
      
      const dwInputs = advTimeBox.querySelector('.deadline-weekly-inputs');
      const doInputs = advTimeBox.querySelector('.deadline-once-inputs');
      const regInputs = advTimeBox.querySelector('.regular-date-input');
      
      dwInputs.style.display = "none";
      doInputs.style.display = "none";
      regInputs.style.display = "none";
      advTimeBox.style.display = "none";

      if (t === "birthday") {
        // 誕生日の特別仕様
        titleInput.placeholder = "お名前";
        memoInput.style.display = "none"; // メモなし
        prioritySelect.style.display = "none"; // ★誕生日に重要度は不要
        advTimeBox.style.display = "";
        regInputs.style.display = "block"; // 日付指定だけ
      } else {
        // 通常タスク
        titleInput.placeholder = "タイトル";
        memoInput.style.display = "";
        prioritySelect.style.display = ""; // ★重要度を表示
        if(t === "deadline_weekly") { advTimeBox.style.display = ""; dwInputs.style.display = "flex"; }
        else if(t === "deadline_once") { advTimeBox.style.display = ""; doInputs.style.display = "flex"; }
        else if(t === "once") { advTimeBox.style.display = ""; regInputs.style.display = "block"; }
      }
      updateExample();
    }

    function updateExample(){
      const t = typeSelect.value;
      if(t === "weekly"){
        const sel = []; wkBox.querySelectorAll(".wk-edit").forEach(cb => { if(cb.checked) sel.push(weekdayName(Number(cb.value))); });
        exampleSpan.textContent = `➡ ${sel.length > 0 ? sel.join("・")+"曜" : "未選択"}のみ表示`;
      } else if(t === "deadline_weekly"){
        const eWd = advTimeBox.querySelector('.end-wd option:checked').text;
        const eTime = advTimeBox.querySelector('.end-time').value;
        exampleSpan.textContent = `➡ ${eWd}の${eTime}がデッドライン`;
      } else if(t === "deadline_once"){
        const dStr = formatMonthDay(advTimeBox.querySelector('.date-input').value) || "未設定";
        const time = advTimeBox.querySelector('.once-time').value;
        exampleSpan.textContent = `➡ ${dStr}の ${time} がデッドライン`;
      } else if(t === "once"){
        const dStr = formatMonthDay(advTimeBox.querySelector('.reg-date').value) || "未設定";
        exampleSpan.textContent = `➡ ${dStr} 当日のみ出現`;
      } else if(t === "birthday"){
        const dStr = formatMonthDay(advTimeBox.querySelector('.reg-date').value) || "未設定";
        exampleSpan.textContent = `🎂 毎年 ${dStr} に画面全体で大暴れ`;
      } else { exampleSpan.textContent = `➡ 毎日リセットされて出現`; }
    }

    const infoSpan = document.createElement("div"); infoSpan.style.color="#6b7280"; infoSpan.style.fontSize="13px"; infoSpan.style.fontWeight="700";
    infoSpan.textContent = task.isDraft ? "下書き" : (task.isDone ? "完了" : "待機中");

    const actions = document.createElement("div"); actions.className = "edit-actions";
    const deleteBtn = document.createElement("button"); deleteBtn.textContent = "削除"; deleteBtn.className="btn danger";
    actions.appendChild(deleteBtn);

    row.appendChild(titleInput); 
    row.appendChild(memoInput); 
    row.appendChild(typeSelect);
    row.appendChild(prioritySelect); // ★追加：重要度の選択肢を画面に配置
    row.appendChild(wkBox); 
    row.appendChild(advTimeBox); 
    row.appendChild(exampleSpan); 
    row.appendChild(infoSpan); 
    row.appendChild(actions);

    updateVisibility();
    typeSelect.addEventListener("change", updateVisibility);
    wkBox.querySelectorAll(".wk-edit").forEach(cb => cb.addEventListener("change", updateExample));
    advTimeBox.querySelectorAll("select, input").forEach(el => el.addEventListener("change", updateExample));
    titleInput.addEventListener("input", updateExample);

    let localTimer = null;
    function autoSave(){
      if(localTimer) clearTimeout(localTimer);
      localTimer = setTimeout(() => {
        const id = Number(row.dataset.id);
        const idx = tasks.findIndex(t => t.id === id);
        if(idx === -1) return;
        const newTitle = titleInput.value.trim();
        const newWeekdays = [];
        wkBox.querySelectorAll(".wk-edit").forEach(cb => { if(cb.checked) newWeekdays.push(Number(cb.value)); });

        const tType = typeSelect.value;
        const pVal = parseInt(prioritySelect.value) || 3; // ★追加：選択された重要度を取得
        
        let dateVal = "", startWd = 1, startTime = "08:00", endWd = 5, endTime = "23:59";
        
        if (tType === "deadline_weekly") {
          startWd = Number(advTimeBox.querySelector('.start-wd').value);
          startTime = advTimeBox.querySelector('.start-time').value;
          endWd = Number(advTimeBox.querySelector('.end-wd').value);
          endTime = advTimeBox.querySelector('.end-time').value;
        } else if (tType === "deadline_once") {
          dateVal = advTimeBox.querySelector('.date-input').value;
          endTime = advTimeBox.querySelector('.once-time').value;
        } else {
          dateVal = advTimeBox.querySelector('.reg-date').value;
        }

        tasks[idx] = {
          ...tasks[idx], title: newTitle, memo: tType === "birthday" ? "" : memoInput.value.trim(),
          type: tType, priority: pVal, // ★追加：保存データに重要度を反映
          date: dateVal, weekdays: newWeekdays,
          startWd, startTime, endWd, endTime,
          isDraft: (tasks[idx].isDraft && newTitle !== "") ? false : tasks[idx].isDraft
        };
        saveDebounced();
        infoSpan.textContent = tasks[idx].isDraft ? "下書き" : (tasks[idx].isDone ? "完了" : "待機中");
      }, SAVE_DEBOUNCE_MS);
    }
    
    // ★追加：prioritySelectをイベント監視リストに追加
    [prioritySelect, titleInput, memoInput, typeSelect, ...wkBox.querySelectorAll(".wk-edit"), ...advTimeBox.querySelectorAll("input, select")].forEach(el => {
      el.addEventListener("input", autoSave); el.addEventListener("change", autoSave);
    });

    deleteBtn.addEventListener("click", () => {
      if(!confirm("このデータを削除しますか？")) return;
      tasks = tasks.filter(t => t.id !== Number(row.dataset.id));
      saveDebounced(); renderEdit();
    });
    return row;
  }

  if(dailyTasks.length > 0) {
    const h = document.createElement("div"); h.className = "edit-group-title"; h.textContent = "📅 普段のルーティンタスク"; editList.appendChild(h);
    dailyTasks.forEach(t => editList.appendChild(createRowElement(t)));
  }
  if(deadlineTasks.length > 0) {
    const h = document.createElement("div"); h.className = "edit-group-title"; h.textContent = "🔥 締め切り・課題"; editList.appendChild(h);
    deadlineTasks.forEach(t => editList.appendChild(createRowElement(t)));
  }
  if(birthdayTasks.length > 0) {
    const h = document.createElement("div"); h.className = "edit-group-title"; h.textContent = "🎂 登録済みのお誕生日（タスクには出現しません）"; editList.appendChild(h);
    birthdayTasks.forEach(t => editList.appendChild(createRowElement(t)));
  }
}

document.getElementById("newDraftBtn").addEventListener("click", () => {
  // ★追加：priority: 3 をデフォルトで設定
  const draft = { id: Date.now(), title: "", memo: "", type: "daily", priority: 3, weekdays: [], everyday: false, date: "", isDone: false, lastDoneDate: "", isDraft: true };
  tasks.unshift(draft); saveDebounced(); switchMode("edit");
  setTimeout(()=> {
    renderEdit(); const el = document.querySelector(`#editList .edit-row[data-id='${draft.id}']`);
    if(el){ el.scrollIntoView({behavior:'smooth', block:'center'}); const input = el.querySelector('input[type="text"]'); if(input) input.focus(); }
  }, 80);
});

document.getElementById("deleteAll").addEventListener("click", () => {
  if(!confirm("本当に全てのデータを全削除しますか？")) return;
  tasks = []; saveDebounced(); renderEdit();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const dataStr = JSON.stringify(tasks);
  navigator.clipboard.writeText(dataStr).then(() => {
    alert("全データをコピーしました！");
  }).catch(() => { alert("コピーに失敗しました。"); });
});

document.getElementById("importBtn").addEventListener("click", () => {
  const dataStr = prompt("コピーしたデータをここに貼り付けてください：");
  if(!dataStr) return;
  try {
    const imported = JSON.parse(dataStr);
    if(Array.isArray(imported)) {
      tasks = imported; saveDebounced();
      if(currentMode === "edit") renderEdit(); else render();
      alert("読み込みが完了しました！");
    } else { alert("形式が正しくありません。"); }
  } catch(e) { alert("失敗しました。"); }
});

switchMode("display");

// 🚀 アプリ起動から1.5秒後に、アニメーション画面をフワッと消す
window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = document.getElementById("animation-splash");
    if (splash) {
      splash.style.opacity = "0";
      splash.style.visibility = "hidden";
      // アニメーションが終わったら完全に要素を削除して、操作の邪魔にならないようにする
      setTimeout(() => splash.remove(), 500);
    }
  }, 1500); // 1500ミリ秒（1.5秒）表示する
});
