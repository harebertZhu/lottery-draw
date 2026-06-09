const targetCountInput = document.querySelector("#targetCount");
const startBtn = document.querySelector("#startBtn");
const selectBtn = document.querySelector("#selectBtn");
const resetBtn = document.querySelector("#resetBtn");
const rollingName = document.querySelector("#rollingName");
const rollingClass = document.querySelector("#rollingClass");
const statusText = document.querySelector("#statusText");
const progressText = document.querySelector("#progressText");
const winnerList = document.querySelector("#winnerList");
const winnerCount = document.querySelector("#winnerCount");

const candidates = [
  { id: "p2", name: "常耕源", className: "高二1班", probability: 0 },
  { id: "p3", name: "陈欣雨", className: "", probability: 0 },
  { id: "p4", name: "胡凯文", className: "离校", probability: 0 },
  { id: "p5", name: "刘羽梵", className: "高二4班", probability: 10 },
  { id: "p6", name: "徐艺泓", className: "离校", probability: 0 },
  { id: "p7", name: "杨思颖", className: "高二3班", probability: 0 },
  { id: "p8", name: "章楚依", className: "高二3班", probability: 10 },
  { id: "p9", name: "高浩茗", className: "高一2班", probability: 40 },
  { id: "p10", name: "彭子凌", className: "高一1班", probability: 10 },
  { id: "p11", name: "乔彦谦", className: "高一1班", probability: 10 },
  { id: "p12", name: "杨清越", className: "高一1班", probability: 10 },
  { id: "p13", name: "刘梓茸", className: "九年级3班", probability: 10 },
  { id: "p14", name: "钱多乐", className: "九年级1班", probability: 0 },
  { id: "p15", name: "王盈鑫", className: "九年级4班", probability: 0 },
  { id: "p16", name: "叶恺源", className: "九年级3班", probability: 0 },
  { id: "p17", name: "张轩语", className: "九年级1班", probability: 10 },
  { id: "p18", name: "郑弘艺", className: "九年级4班", probability: 0 },
  { id: "p19", name: "朱心楠", className: "九年级5班", probability: 0 },
  { id: "p20", name: "曹语芯", className: "八年级3班", probability: 10 },
  { id: "p21", name: "何思洋", className: "八年级1班", probability: 10 },
  { id: "p22", name: "李孟哲", className: "八年级3班", probability: 10 },
  { id: "p23", name: "魏诗芮", className: "八年级3班", probability: 0 },
  { id: "p24", name: "徐秦天", className: "八年级3班", probability: 0 },
  { id: "p25", name: "于馨然", className: "八年级3班", probability: 0 },
  { id: "p26", name: "虞腾景", className: "八年级5班", probability: 0 },
  { id: "p27", name: "张晨熙", className: "八年级1班", probability: 0 },
  { id: "p28", name: "张宇喆", className: "八年级1班", probability: 10 },
  { id: "p29", name: "陈依璐", className: "七年级4班", probability: 0 },
  { id: "p30", name: "李晋萱", className: "七年级4班", probability: 0 },
  { id: "p31", name: "刘淏悠", className: "七年级2班", probability: 10 },
  { id: "p32", name: "舒浩轩", className: "七年级3班", probability: 0 },
  { id: "p33", name: "田耘睿", className: "七年级5班", probability: 10 },
  { id: "p34", name: "汪振宇", className: "七年级3班", probability: 0 },
  { id: "p35", name: "王孝正", className: "七年级3班", probability: 10 },
  { id: "p36", name: "杨皓宸", className: "七年级6班", probability: 10 },
  { id: "p37", name: "叶知远", className: "七年级4班", probability: 0 },
  { id: "p38", name: "周昊辰", className: "七年级6班", probability: 10 },
  { id: "p39", name: "岑佳芊", className: "六年级2班", probability: 10 },
  { id: "p40", name: "陈慕耘", className: "六年级2班", probability: 0 },
  { id: "p41", name: "陆奕辰", className: "六年级6班", probability: 10 },
  { id: "p42", name: "谢博涵", className: "六年级1班", probability: 0 },
  { id: "p43", name: "张昊哲", className: "六年级4班", probability: 10 },
  { id: "p44", name: "林胜泽", className: "六年级1班", probability: 10 },
  { id: "p45", name: "王孝正", className: "七年级3班", probability: 0 },
];

let winners = [];
let rollingTimer = null;
let currentPerson = null;
let isAnimating = false;

const eligibleCandidates = candidates.filter((person) => person.probability > 0);
const guaranteedCandidates = candidates.filter((person) => person.probability >= 100);

targetCountInput.max = String(eligibleCandidates.length);
targetCountInput.addEventListener("input", updateProgress);
startBtn.addEventListener("click", startRolling);
selectBtn.addEventListener("click", selectOne);
resetBtn.addEventListener("click", resetSelection);

updateProgress();

function startRolling() {
  const pool = availableCandidates();
  if (!pool.length || isAnimating) return;

  let cursor = 0;
  currentPerson = pool[0];
  setStagePerson(currentPerson, true);
  stopRolling();

  rollingTimer = window.setInterval(() => {
    const visiblePool = availableCandidates();
    if (!visiblePool.length) {
      stopRolling();
      return;
    }
    cursor = (cursor + 1) % visiblePool.length;
    currentPerson = visiblePool[cursor];
    setStagePerson(currentPerson, true);
  }, 65);

  startBtn.disabled = true;
  selectBtn.disabled = false;
  statusText.textContent = "名单滚动中，请确认一位。";
}

function selectOne() {
  if (isAnimating) return;

  const targetTotal = requestedTotal();
  if (winners.length >= targetTotal) {
    finishSelection();
    return;
  }

  const selected = pickNextPerson();
  if (!selected) {
    finishSelection();
    return;
  }

  stopRolling();
  currentPerson = selected;
  setStagePerson(selected, false);
  rollingName.classList.add("selected");
  winners.push(selected);
  isAnimating = true;
  startBtn.disabled = true;
  selectBtn.disabled = true;
  statusText.textContent = `已确认：${selected.name}`;

  animateIntoList(selected, () => {
    renderWinners(selected.id);
    isAnimating = false;
    rollingName.classList.remove("selected");
    updateProgress();

    if (winners.length >= requestedTotal() || !availableCandidates().length) {
      finishSelection();
      return;
    }

    startBtn.disabled = false;
    selectBtn.disabled = true;
    statusText.textContent = "可继续滚动并确认下一位。";
  });
}

function pickNextPerson() {
  const chosenIds = new Set(winners.map((person) => person.id));
  const guaranteed = guaranteedCandidates.find((person) => !chosenIds.has(person.id));
  if (guaranteed) return guaranteed;

  const pool = candidates.filter((person) => person.probability > 0 && !chosenIds.has(person.id));
  if (!pool.length) return null;

  const totalWeight = pool.reduce((sum, person) => sum + person.probability, 0);
  let marker = Math.random() * totalWeight;

  for (const person of pool) {
    marker -= person.probability;
    if (marker <= 0) return person;
  }

  return pool[pool.length - 1];
}

function animateIntoList(person, done) {
  const source = rollingName.getBoundingClientRect();
  const target = winnerList.getBoundingClientRect();
  const flyer = document.createElement("div");
  flyer.className = "flying-name";
  flyer.textContent = person.name;
  flyer.style.left = `${source.left + source.width / 2}px`;
  flyer.style.top = `${source.top + source.height / 2}px`;
  flyer.style.transform = "translate(-50%, -50%) scale(1)";
  document.body.appendChild(flyer);

  window.requestAnimationFrame(() => {
    const targetX = target.left + Math.min(target.width / 2, 240);
    const targetY = target.top + 52;
    flyer.style.transform = `translate(${targetX - (source.left + source.width / 2)}px, ${
      targetY - (source.top + source.height / 2)
    }px) translate(-50%, -50%) scale(0.38)`;
    flyer.style.opacity = "0.12";
  });

  window.setTimeout(() => {
    flyer.remove();
    done();
  }, 760);
}

function renderWinners(newestId = "") {
  winnerCount.textContent = `${winners.length} 人`;
  winnerList.classList.toggle("empty", winners.length === 0);
  winnerList.innerHTML = winners.length
    ? winners
        .map(
          (person) => `
            <li class="${person.id === newestId ? "entering" : ""}">
              <strong>${escapeHtml(person.name)}</strong>
              ${person.className ? `<span>${escapeHtml(person.className)}</span>` : ""}
            </li>
          `,
        )
        .join("")
    : "<li>等待确认</li>";
}

function finishSelection() {
  stopRolling();
  startBtn.disabled = true;
  selectBtn.disabled = true;
  rollingName.classList.remove("active", "selected");
  statusText.textContent = winners.length ? "家长代表名单已确认。" : "暂无可确认人员。";
}

function resetSelection() {
  stopRolling();
  winners = [];
  currentPerson = null;
  isAnimating = false;
  rollingName.classList.remove("active", "selected");
  rollingName.textContent = "准备开始";
  rollingClass.textContent = "名单已就绪";
  startBtn.disabled = eligibleCandidates.length === 0;
  selectBtn.disabled = true;
  renderWinners();
  updateProgress();
  statusText.textContent = "请设置人数后开始。";
}

function availableCandidates() {
  const chosenIds = new Set(winners.map((person) => person.id));
  return candidates.filter((person) => person.probability > 0 && !chosenIds.has(person.id));
}

function requestedTotal() {
  const rawValue = Number.parseInt(targetCountInput.value, 10);
  const requested = Number.isFinite(rawValue) ? rawValue : 1;
  const withGuaranteed = Math.max(requested, guaranteedCandidates.length);
  return Math.max(1, Math.min(withGuaranteed, eligibleCandidates.length));
}

function updateProgress() {
  const total = requestedTotal();
  targetCountInput.value = String(Math.min(Number(targetCountInput.value) || 1, eligibleCandidates.length));
  progressText.textContent = `${winners.length} / ${total}`;
}

function setStagePerson(person, active) {
  rollingName.textContent = person.name;
  rollingClass.textContent = person.className || " ";
  rollingName.classList.toggle("active", active);
}

function stopRolling() {
  if (rollingTimer) {
    window.clearInterval(rollingTimer);
    rollingTimer = null;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
