// ----------------- Глобальные переменные -----------------
let canvas, ctx;
const size = 400;
const center = size / 2;
const scale = 40;

// Хранилище точек [{x,y,r,hit}]
let points = [];

// ----------------- ИНИЦИАЛИЗАЦИЯ CANVAS -----------------
function initGraph() {
    canvas = document.getElementById("graph");
    if (!canvas) return;

    canvas.width = size;
    canvas.height = size;

    ctx = canvas.getContext("2d");

    // Повторно вешаем обработчик клика (после AJAX обновления он теряется)
    canvas.onclick = handleCanvasClick;

    // Повторно вешаем обработчики на R
    attachRListeners();

    drawScene();
}

// ----------------- Получаем выбранные R -----------------
function getSelectedRs() {
    const rPanel = document.getElementById("rPanel");
    if (!rPanel) return [];

    return Array.from(rPanel.querySelectorAll("input[type='checkbox']:checked"))
        .map(cb => parseFloat(cb.value))
        .filter(v => !isNaN(v));
}

// ----------------- Преобразование координат -----------------
function toCanvasX(x) { return center + x * scale; }
function toCanvasY(y) { return center - y * scale; }

// ----------------- Рисуем фигуры -----------------
function drawShapes() {
    const rValues = getSelectedRs().sort((a, b) => a - b);
    if (!rValues.length) return;

    rValues.forEach(R => {
        ctx.fillStyle = "rgba(0, 128, 255, 0.3)";

        // 2-я четверть — сектор круга
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, R * scale / 2, Math.PI, 1.5 * Math.PI);
        ctx.closePath();
        ctx.fill();

        // 3-я четверть — прямоугольник
        ctx.beginPath();
        ctx.rect(center - R * scale, center, R * scale, (R * scale) / 2);
        ctx.fill();

        // 4-я четверть — треугольник
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(center + (R * scale) / 2, center);
        ctx.lineTo(center, center + (R * scale) / 2);
        ctx.closePath();
        ctx.fill();
    });
}

// ----------------- Оси -----------------
function drawAxes() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    // Ось X
    ctx.beginPath();
    ctx.moveTo(0, center);
    ctx.lineTo(size, center);
    ctx.stroke();

    // Ось Y
    ctx.beginPath();
    ctx.moveTo(center, 0);
    ctx.lineTo(center, size);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = -5; i <= 5; i++) {
        if (i === 0) continue;

        // X
        ctx.beginPath();
        ctx.moveTo(center + i * scale, center - 5);
        ctx.lineTo(center + i * scale, center + 5);
        ctx.stroke();
        ctx.fillText(i, center + i * scale, center + 15);

        // Y
        ctx.beginPath();
        ctx.moveTo(center - 5, center - i * scale);
        ctx.lineTo(center + 5, center - i * scale);
        ctx.stroke();
        ctx.fillText(i, center - 15, center - i * scale);
    }
}

// ----------------- Рисуем точки -----------------
function drawPoints() {
    points.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = p.hit ? "green" : "red";
        ctx.arc(toCanvasX(p.x), toCanvasY(p.y), 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ----------------- Полная сцена -----------------
function drawScene() {
    ctx.clearRect(0, 0, size, size);
    drawShapes();
    drawAxes();
    drawPoints();
}

// ----------------- Клик по canvas -----------------
function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) - center) / scale;
    const y = (center - (e.clientY - rect.top)) / scale;

    const rValues = getSelectedRs();
    if (!rValues.length) {
        alert("Выберите хотя бы один R!");
        return;
    }

    const R = rValues[0];

    document.getElementById("mainForm:hiddenX").value = x.toFixed(4);
    document.getElementById("mainForm:hiddenY").value = y.toFixed(4);
    document.getElementById("mainForm:hiddenR").value = R;

    if (typeof submitFromCanvas === "function") submitFromCanvas();
}

// ----------------- Добавление точки из сервера -----------------
function addPointFromServer(x, y, r, hit) {
    points.push({ x, y, r, hit });
    drawScene();
}

// ----------------- Подключение обработчиков к R -----------------
function attachRListeners() {
    const rPanel = document.getElementById("rPanel");
    if (!rPanel) return;

    rPanel.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.onchange = drawScene;
    });
}

// ----------------- Инициализация при загрузке страницы -----------------
document.addEventListener("DOMContentLoaded", initGraph);
