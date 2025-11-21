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
    console.log("→ Ищем R по всему документу...");
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');
    const result = [];

    checked.forEach(cb => {
        if (["1","2","3","4","5"].includes(cb.value)) {
            result.push(parseFloat(cb.value));
        }
    });

    console.log("Найдено R:", result);
    return result;
}


// ==================== РИСОВАНИЕ ФИГУР ====================
function drawShapes() {
    console.log("→ drawShapes() началась");
    const rs = getSelectedRs();

    if (rs.length === 0) {
        return;
    }

    rs.forEach(R => {
        ctx.fillStyle = "rgba(0, 128, 255, 0.35)";

        // 2-я четверть — четверть круга
        ctx.beginPath();
        ctx.arc(CENTER, CENTER, R * SCALE/2, Math.PI, 1.5 * Math.PI, false);
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
        ctx.lineTo(CENTER + (R * SCALE)/2, CENTER);
        ctx.lineTo(CENTER, CENTER + (R * SCALE)/2);
        ctx.closePath();
        ctx.fill();
    });
    console.log("drawShapes() закончена");
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
        ctx.fillText(i, CENTER - 20, p);
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
    console.log("→→→ drawScene() вызвана");
    if (!ctx) {
        console.error("ctx нет — canvas не инициализирован!");
        return;
    }
    ctx.clearRect(0, 0, SIZE, SIZE);
    drawShapes();
    drawAxes();
    drawPoints();
    console.log("drawScene() завершена ←←←");
}

// ==================== ДОБАВЛЕНИЕ ТОЧКИ С СЕРВЕРА ====================
function addPointFromServer(x, y, r, hit) {
    console.log("addPointFromServer:", x, y, r, hit);
    points.push({ x: +x, y: +y, r: +r, hit: hit === true || hit === "true" });
    drawScene();
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Страница загрузилась — инициализируем график");

    canvas = document.getElementById("graph");
    if (!canvas) {
        console.error("Canvas не найден!");
        return;
    }
    ctx = canvas.getContext("2d");
    console.log("Canvas и ctx готовы");

    // Клик по графику
    canvas.onclick = function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - CENTER) / SCALE;
        const y = (CENTER - (e.clientY - rect.top)) / SCALE;
        const rs = getSelectedRs();
        if (rs.length === 0) {
            alert("Выбери R сначала!");
            return;
        }

        const hx = document.getElementById("mainForm:hiddenX");
        const hy = document.getElementById("mainForm:hiddenY");
        const hr = document.getElementById("mainForm:hiddenR");
        if (hx && hy && hr) {
            hx.value = x.toFixed(6);
            hy.value = y.toFixed(6);
            hr.value = rs[0];
            submitFromCanvas();
        }
    };

    const rPanel = document.getElementById("rPanel");
    if (rPanel) {
        rPanel.addEventListener("change", (e) => {
            if (e.target.type === "checkbox") {
                console.log("R изменён — перерисовываем");
                drawScene();
            }
        });
    }

    drawScene(); // первый кадр
});

// Глобальные функции для PrimeFaces
window.drawScene = drawScene;
window.addPointFromServer = addPointFromServer;