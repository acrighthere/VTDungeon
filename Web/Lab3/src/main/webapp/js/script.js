const canvas = document.querySelector('[id$="graph"]');
const ctx = canvas.getContext("2d");
const size = 400;
const center = size / 2;
const scale = 40;

canvas.width = size;
canvas.height = size;

function getSelectedRs() {
    return Array.from(document.querySelectorAll('input[id$="rCheckbox"]:checked'))
        .map(rb => parseFloat(rb.value));
}

function drawScene() {
    ctx.clearRect(0, 0, size, size);
    drawAxes();

    const rValues = getSelectedRs().sort((a, b) => a - b);
    rValues.forEach(R => {
        ctx.fillStyle = "rgba(0, 128, 255, 0.3)";

        // 2-я четверть — четверть круга
        ctx.beginPath();
        ctx.arc(center, center, R * scale / 2, Math.PI, 1.5 * Math.PI, false);
        ctx.lineTo(center, center);
        ctx.fill();

        // 3-я четверть — прямоугольник
        ctx.beginPath();
        ctx.rect(center - R * scale, center, R * scale, R * scale / 2);
        ctx.fill();

        // 4-я четверть — треугольник
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(center + R * scale / 2, center);
        ctx.lineTo(center, center + R * scale / 2);
        ctx.closePath();
        ctx.fill();
    });
}

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
        // Деления по X
        ctx.beginPath();
        ctx.moveTo(center + i * scale, center - 5);
        ctx.lineTo(center + i * scale, center + 5);
        ctx.stroke();
        ctx.fillText(i, center + i * scale, center + 15);

        // Деления по Y
        ctx.beginPath();
        ctx.moveTo(center - 5, center - i * scale);
        ctx.lineTo(center + 5, center - i * scale);
        ctx.stroke();
        ctx.fillText(i, center - 15, center - i * scale);
    }
}

// Клик по canvas — проверка точки через p:remoteCommand
canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const xClick = ((e.clientX - rect.left) - center) / scale;
    const yClick = (center - (e.clientY - rect.top)) / scale;
    const rValues = getSelectedRs();

    if (!rValues.length) {
        alert("Выберите хотя бы один R!");
        return;
    }
    if (xClick < -5 || xClick > 5 || yClick < -5 || yClick > 5) return;

    // Заполняем скрытые поля формы
    document.querySelector('[id$="hiddenX"]').value = xClick.toFixed(2);
    document.querySelector('[id$="hiddenY"]').value = yClick.toFixed(2);
    document.querySelector('[id$="hiddenR"]').value = rValues[0];

    // Вызываем JSF-метод
    submitFromCanvas();
});

// Перерисовка графика при изменении R
document.querySelectorAll('input[id$="rCheckbox"]').forEach(rb =>
    rb.addEventListener("change", drawScene)
);

drawScene();
