const scheduleTemplate = [
    { subject: "语文", day: 7, start: "09:00", end: "11:30" },
    { subject: "数学", day: 7, start: "15:00", end: "17:00" },
    { subject: "物理或历史", day: 8, start: "09:00", end: "10:15" },
    { subject: "外语（含听力）", day: 8, start: "15:00", end: "17:00" },
    { subject: "化学", day: 9, start: "08:30", end: "09:45" },
    { subject: "地理", day: 9, start: "11:00", end: "12:15" },
    { subject: "思想政治", day: 9, start: "14:30", end: "15:45" },
    { subject: "生物", day: 9, start: "17:00", end: "18:15" }
];
let examYear = 2026;
let startTime = new Date("2026-06-07T09:00:00+08:00");
let endTime = new Date("2026-06-09T18:15:00+08:00");
let examSchedule = [];
const timerEl = document.getElementById("timer");
const kickerEl = document.getElementById("kicker");
const startInfoEl = document.getElementById("start-info");
const endInfoEl = document.getElementById("end-info");
const sloganEl = document.getElementById("slogan");
const beijingTimeEl = document.getElementById("Beijing_z43d");
const localDateEl = document.getElementById("local-date");
const statusEl = document.getElementById("status");
const params = new URLSearchParams(window.location.search);
const yearParam = Number(params.get("year") || params.get("gaokaoYear"));
const customSlogan = params.get("slogan");
const blessingMessages = Array.isArray(window.gaokaoBlessings) && window.gaokaoBlessings.length ? window.gaokaoBlessings : [sloganEl.textContent];
const randomBlessing = blessingMessages[Math.floor(Math.random() * blessingMessages.length)];
const sloganText = (customSlogan || randomBlessing).slice(0, 80);
renderSlogan(sloganText);
window.addEventListener("resize", () => renderSlogan(sloganText));
let timeOffset = 0;

function getCurrentTimeMs() {
    return Date.now() + timeOffset;
}

function buildDate(year, month, day, time) {
    return new Date(`${year}-${pad(month)}-${pad(day)}T${time}:00+08:00`);
}

function getBeijingYear(nowMs) {
    return new Date(nowMs + 8 * 60 * 60 * 1000).getUTCFullYear();
}

function resolveExamYear(nowMs) {
    if (Number.isInteger(yearParam) && yearParam >= 2000 && yearParam <= 2100) {
        return yearParam;
    }

    const currentYear = getBeijingYear(nowMs);
    const currentYearEnd = buildDate(currentYear, 6, 9, "18:15");

    return nowMs <= currentYearEnd.getTime() ? currentYear : currentYear + 1;
}

function buildExamSchedule(year) {
    return scheduleTemplate.map(exam => ({
        ...exam,
        startTime: buildDate(year, 6, exam.day, exam.start),
        endTime: buildDate(year, 6, exam.day, exam.end)
    }));
}

function applyExamYear(year) {
    if (year === examYear && examSchedule.length) {
        return;
    }

    examYear = year;
    startTime = buildDate(year, 6, 7, "09:00");
    endTime = buildDate(year, 6, 9, "18:15");
    examSchedule = buildExamSchedule(year);
    kickerEl.textContent = `距离 ${year} 年高考开始还有`;
    startInfoEl.textContent = `开始时间：${year} 年 6 月 7 日 09:00:00`;
    endInfoEl.textContent = `结束时间：${year} 年 6 月 9 日 18:15:00`;
}

function updateExamYear(nowMs) {
    applyExamYear(resolveExamYear(nowMs));
}

function shouldSplitSlogan() {
    return sloganEl.clientWidth < 720;
}

function splitSlogan(value) {
    const normalized = value.trim().replace(/\s+/g, " ");
    if (!normalized) {
        return [];
    }

    if (!shouldSplitSlogan()) {
        return [normalized];
    }

    const sentenceParts = normalized.split(/(?<=[，。！？；,.!?;])\s*/).filter(Boolean);
    if (sentenceParts.length > 1) {
        return sentenceParts;
    }

    const compact = normalized.replace(/\s+/g, "");
    if (compact.length === 16) {
        return [compact.slice(0, 8), compact.slice(8)];
    }

    const spaceParts = normalized.split(" ").filter(Boolean);
    if (spaceParts.length > 1) {
        return spaceParts;
    }

    return [normalized];
}

function renderSlogan(value) {
    const lines = splitSlogan(value);
    sloganEl.replaceChildren(...lines.map(line => {
        const span = document.createElement("span");
        span.className = "slogan-line";
        span.textContent = line;
        return span;
    }));
}

function renderStatus(sourceText, refreshText = "倒计时每秒刷新。") {
    statusEl.replaceChildren();

    const source = document.createElement("span");
    source.className = "status-source";
    source.textContent = sourceText;

    const refresh = document.createElement("span");
    refresh.className = "status-refresh";
    refresh.textContent = refreshText;

    statusEl.append(source, refresh);
}

function pad(value) {
    return String(value).padStart(2, "0");
}

function formatCountdownGroup(value, unit, className = "") {
    return `<span class="countdown-group ${className}"><span class="countdown-number">${value}</span><span class="countdown-unit">${unit}</span></span>`;
}

function formatClock(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${pad(hours)}时${pad(minutes)}分${pad(seconds)}秒`;
}

function getCurrentExam(nowMs) {
    return examSchedule.find(exam => nowMs >= exam.startTime.getTime() && nowMs < exam.endTime.getTime());
}

function getFinishedExams(nowMs) {
    return examSchedule.filter(exam => nowMs >= exam.endTime.getTime());
}

function getNextExam(nowMs) {
    return examSchedule.find(exam => nowMs < exam.startTime.getTime());
}

function renderExamPanel(nowMs, currentExam) {
    const finishedExams = getFinishedExams(nowMs);
    const nextExam = currentExam ? null : getNextExam(nowMs);
    const finishedHtml = finishedExams.length ? `
        <span class="finished-exams">
            <span class="exam-label">已考完</span>
            <span class="finished-list">${finishedExams.map(exam => exam.subject).join("、")}</span>
        </span>` : "";
    const activeHtml = currentExam ? `
        <span class="current-exam">
            <span class="exam-label">正在考</span>
            <span class="exam-subject">${currentExam.subject}</span>
            <span class="exam-meta">${formatClock(currentExam.startTime)} - ${formatClock(currentExam.endTime)}</span>
            <span class="exam-left">本科剩余：${formatDuration(currentExam.endTime.getTime() - nowMs)}</span>
        </span>` : "";
    const nextHtml = nextExam ? `
        <span class="next-exam">
            <span class="exam-label">下一科</span>
            <span class="exam-subject">${nextExam.subject}</span>
            <span class="exam-meta">${formatClock(nextExam.startTime)} - ${formatClock(nextExam.endTime)}</span>
        </span>` : "";

    return `<span class="exam-panel">${finishedHtml}${activeHtml}${nextHtml}</span>`;
}

function renderCountdown(nowMs) {
    updateExamYear(nowMs);
    const diff = startTime.getTime() - nowMs;

    if (nowMs >= endTime.getTime()) {
        document.body.classList.remove("exam-active");
        timerEl.classList.remove("countdown-urgent");
        timerEl.classList.add("countdown-ended");
        timerEl.innerHTML = `<span class="ended-title">高考已结束</span><span class="ended-blessing">愿你前程似锦，得偿所愿。</span>`;
        return;
    }

    if (diff <= 0) {
        const currentExam = getCurrentExam(nowMs);
        const examHtml = renderExamPanel(nowMs, currentExam);
        document.body.classList.add("exam-active");

        timerEl.classList.remove("countdown-urgent");
        timerEl.classList.add("countdown-ended");
        timerEl.innerHTML = `<span class="ended-title">高考已开始</span>${examHtml}<span class="ended-blessing">祝你落笔生花，旗开得胜。</span>`;
        return;
    }

    document.body.classList.remove("exam-active");
    timerEl.classList.remove("countdown-ended");

    const totalSeconds = Math.ceil(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    timerEl.classList.toggle("countdown-urgent", days <= 10);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    timerEl.innerHTML = [
        formatCountdownGroup(String(days).padStart(3, "0"), "天", "countdown-days"),
        formatCountdownGroup(pad(hours), "时"),
        formatCountdownGroup(pad(minutes), "分"),
        formatCountdownGroup(pad(seconds), "秒")
    ].join("");
}

function renderLocalDate(nowMs) {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
    });

    localDateEl.textContent = `北京时间日期：${formatter.format(new Date(nowMs))}`;
}

function renderBeijingTime(nowMs) {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    beijingTimeEl.textContent = formatter.format(new Date(nowMs));
}

function tick() {
    const nowMs = getCurrentTimeMs();
    renderCountdown(nowMs);
    renderBeijingTime(nowMs);
}

function renderMinuteInfo() {
    renderLocalDate(getCurrentTimeMs());
}

async function syncNationalTime() {
    const requestedAt = Date.now();

    try {
        const proxyUrl = params.get("timeProxy") || "https://time.360nenz.top/time";
        const response = await fetch(proxyUrl, {
            cache: "no-store"
        });
        const data = await response.json();

        if (!response.ok || !data.ok || !Number.isFinite(Number(data.timeMs))) {
            throw new Error(data.error || "Invalid proxy response");
        }

        const receivedAt = Date.now();
        const serverTime = Number(data.timeMs);
        timeOffset = serverTime + (receivedAt - requestedAt) / 2 - receivedAt;
        renderStatus(`时间来源：${data.source}`);
        tick();
        renderMinuteInfo();
    } catch (error) {
        timeOffset = 0;
        renderStatus("本地时间代理未启动或不可用，当前使用本地系统时间", "倒计时每秒刷新。");
        tick();
        renderMinuteInfo();
    }
}

tick();
renderMinuteInfo();
syncNationalTime();
window.setInterval(tick, 1000);
window.setInterval(renderMinuteInfo, 60000);
window.setInterval(syncNationalTime, 300000);
