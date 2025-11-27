// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let canvas, ctx;
const SIZE = 400;
const CENTER = SIZE / 2;
const SCALE = 32;
let points = [];

// ==================== КОНВЕРТАЦИЯ КООРДИНАТ ====================
const toCanvasX = x => CENTER + x * SCALE;
const toCanvasY = y => CENTER - y * SCALE;

// ==================== ГЛАВНАЯ ФУНКЦИЯ — ЧТО ВЫБРАНО ПО R ====================
function getSelectedRs() {
    const checked = document.querySelectorAll('input[name="mainForm:rCheckbox"]:checked');
    const result = [];
    checked.forEach(cb => {
        if (["1","2","3","4","5"].includes(cb.value)) {
            result.push(parseFloat(cb.value));
        }
    });
    return result;
}

// ==================== РИСОВАНИЕ ФИГУР ====================
function drawShapes() {
    const rs = getSelectedRs();
    if (rs.length === 0) return;

    rs.forEach(R => {
        ctx.fillStyle = "rgba(0, 128, 255, 0.35)";

        // 2-я четверть — четверть круга радиусом R/2
        ctx.beginPath();
        ctx.arc(CENTER, CENTER, R * SCALE / 2, Math.PI, 1.5 * Math.PI, false);
        ctx.lineTo(CENTER, CENTER);
        ctx.closePath();
        ctx.fill();

        // 3-я четверть — прямоугольник
        ctx.beginPath();
        ctx.rect(CENTER - R * SCALE, CENTER, R * SCALE, R * SCALE / 2);
        ctx.fill();

        // 4-я четверть — треугольник
        ctx.beginPath();
        ctx.moveTo(CENTER, CENTER);
        ctx.lineTo(CENTER + (R * SCALE) / 2, CENTER);
        ctx.lineTo(CENTER, CENTER + (R * SCALE) / 2);
        ctx.closePath();
        ctx.fill();
    });
}

// ==================== ОСИ И ПОДПИСИ ====================
function drawAxes() {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.beginPath();
    ctx.moveTo(0, CENTER); ctx.lineTo(SIZE, CENTER);
    ctx.moveTo(CENTER, 0); ctx.lineTo(CENTER, SIZE);
    ctx.stroke();

    for (let i = -5; i <= 5; i++) {
        if (i === 0) continue;
        const p = CENTER + i * SCALE;
        ctx.fillText(i, p, CENTER + 18);
        const py = CENTER - i * SCALE;
        ctx.fillText(i, CENTER - 20, py);
    }
}

// ==================== ТОЧКИ ====================
function drawPoints() {
    points.forEach(p => {
        ctx.fillStyle = p.hit ? "#00ff00" : "#ff0000";
        ctx.beginPath();
        ctx.arc(toCanvasX(p.x), toCanvasY(p.y), 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// ==================== ПОЛНАЯ ПЕРЕРИСОВКА ====================
function drawScene() {
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    drawShapes();
    drawAxes();
    drawPoints();
}

// ==================== ДОБАВЛЕНИЕ ТОЧКИ С СЕРВЕРА ====================
function addPointFromServer(x, y, r, hit) {
    points.push({ x: +x, y: +y, r: +r, hit: hit === true || hit === "true" });
    drawScene();
}

// ==================== ОТПРАВКА ТОЧКИ С КАНВАСА ====================
function sendPointFromGraph() {
    const selected = getSelectedRs();
    if (selected.length === 0) {
        alert("Выбери хотя бы одно R!");
        return;
    }
    submitFromCanvas(); // да, вызов самого remoteCommand по имени
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("graph");
    if (!canvas) return;

    ctx = canvas.getContext("2d");

    canvas.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) - CENTER) / SCALE;
        const y = (CENTER - (e.clientY - rect.top)) / SCALE;

        document.getElementById('mainForm:hiddenX').value = x.toFixed(8);
        document.getElementById('mainForm:hiddenY').value = y.toFixed(8);

        sendPointFromGraph();
    };

    // Перерисовка при смене R
    const rPanel = document.getElementById("rPanel");
    if (rPanel) {
        rPanel.addEventListener("change", drawScene);
    }

    // Кнопка очистки истории точек
    const resetBtn = document.getElementById("mainForm:j_idt51");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            points = [];
            drawScene();
        });
    }

    drawScene();
});

// Глобальные функции
window.drawScene = drawScene;
window.addPointFromServer = addPointFromServer;
