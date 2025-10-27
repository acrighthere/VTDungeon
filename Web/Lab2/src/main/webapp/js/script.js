const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const size = 500;
canvas.width = size;
canvas.height = size;
const center = size / 2;
const scale = 40;

// ----------------- Получаем текущие выбранные R -----------------
function getSelectedRs() {
    return Array.from(document.querySelectorAll("input[name='r']:checked"))
        .map(rb => parseFloat(rb.value));
}

// ----------------- Рисуем фигуры -----------------
function drawScene() {
    ctx.clearRect(0, 0, size, size);

    const rValues = getSelectedRs().sort((a, b) => a - b);
    rValues.forEach(R => {
        ctx.fillStyle = "rgba(0, 128, 255, 0.3)";

        // Круг (первая четверть, x>=0, y>=0)
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, R * scale / 2, 1.5 * Math.PI, 2 * Math.PI, false);
        ctx.lineTo(center, center);
        ctx.fill();

        // Квадрат (вторая четверть, x<=0, y>=0)
        ctx.beginPath();
        ctx.rect(center - R * scale, center - R * scale, R * scale, R * scale);
        ctx.fill();

        // Треугольник (четвёртая четверть, x>=0, y<=0)
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(center + R * scale, center);
        ctx.lineTo(center, center + R * scale);
        ctx.closePath();
        ctx.fill();
    });

    drawAxes();
}

// ----------------- Оси -----------------
function drawAxes() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    // OX
    ctx.beginPath();
    ctx.moveTo(0, center);
    ctx.lineTo(size, center);
    ctx.stroke();

    // OY
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

        // OX деления
        ctx.beginPath();
        ctx.moveTo(center + i * scale, center - 5);
        ctx.lineTo(center + i * scale, center + 5);
        ctx.stroke();
        ctx.fillText(i, center + i * scale, center + 15);

        // OY деления
        ctx.beginPath();
        ctx.moveTo(center - 5, center - i * scale);
        ctx.lineTo(center + 5, center - i * scale);
        ctx.stroke();
        ctx.fillText(i, center - 15, center - i * scale);
    }
}

// ----------------- Отправка данных на PaymentServlet -----------------
function submitPoint(x, y, rValues) {
    // Округляем x к ближайшему допустимому значению
    const validXValues = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
    const roundedX = Math.round(x);
    const closestX = validXValues.reduce((prev, curr) => 
        Math.abs(curr - roundedX) < Math.abs(prev - roundedX) ? curr : prev
    );
    
    // Создаем URL-encoded данные
    const params = new URLSearchParams();
    params.append("x", closestX);
    params.append("y", y.toFixed(2));
    rValues.forEach(r => params.append("r", r));

    console.log("Отправляем параметры:", {
        x: closestX,
        y: y.toFixed(2),
        r: rValues,
        body: params.toString()
    });

    fetch("payment", { 
        method: "POST", 
        body: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(resp => {
            console.log("Response status:", resp.status);
            console.log("Response headers:", resp.headers);
            if (!resp.ok) {
                return resp.text().then(text => {
                    console.error("Server response:", text);
                    throw new Error(`HTTP ${resp.status}: ${text}`);
                });
            }
            return resp.json();
        })
        .then(data => {
            console.log("Payment response:", data);
            const confirmationUrl = data.confirmation_url;
            
            if (confirmationUrl) {
                // Сохраняем флаг о том, что платеж в процессе
                localStorage.setItem("paymentInProgress", "true");
                
                // Перенаправляем пользователя на страницу оплаты YooKassa
                console.log("Перенаправляем на страницу оплаты:", confirmationUrl);
                window.location.href = confirmationUrl;
            } else {
                console.error("Не получен URL для подтверждения платежа");
                alert("Ошибка: не получен URL для подтверждения платежа");
            }
        })
        .catch(err => {
            console.error("Payment error:", err);
            alert("Ошибка при создании платежа: " + err.message);
        });
}

// ----------------- Клик по графику -----------------
canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const xClick = ((e.clientX - rect.left) - center) / scale;
    const yClick = (center - (e.clientY - rect.top)) / scale;
    const rValues = getSelectedRs();

    if (!rValues.length) {
        alert("Выберите хотя бы один R!");
        return;
    }
    if (xClick < -5 || xClick > 3 || yClick < -5 || yClick > 5) return;

    submitPoint(xClick, yClick, rValues);
});

// ----------------- Обработчик кнопки "Проверить" -----------------
document.getElementById("submit-btn").addEventListener("click", e => {
    e.preventDefault();

    const xRadio = document.querySelector("input[name='x']:checked");
    const x = xRadio ? parseFloat(xRadio.value) : NaN;
    const y = parseFloat(document.getElementById("y-input").value.replace(",", "."));
    const rValues = getSelectedRs();

    if (isNaN(x) || isNaN(y) || !rValues.length || x>3 || x<-5 || y<-5 || y>5) {
        alert("Введите корректные значения X, Y и выберите хотя бы один R!");
        return;
    }

    submitPoint(x, y, rValues);
});

// ----------------- Сабмит формы (fallback) -----------------
document.getElementById("check-form").addEventListener("submit", e => {
    e.preventDefault();
    // Делегируем обработку кнопке
    document.getElementById("submit-btn").click();
});

// ----------------- Сброс -----------------
document.getElementById("reset-btn").addEventListener("click", () => {
    fetch("controller?action=reset")
        .then(() => window.location.reload())
        .catch(err => alert("Ошибка при сбросе истории: " + err));
});

// ----------------- Возврат после оплаты -----------------
document.getElementById("return-from-payment-btn").addEventListener("click", () => {
    // Перенаправляем на AreaCheckServlet для обработки результата платежа
    window.location.href = "areaCheck";
});

// Показываем кнопку возврата, если есть данные в сессии
window.addEventListener("load", () => {
    // Проверяем, есть ли данные о платеже в localStorage (как fallback)
    const hasPaymentData = localStorage.getItem("paymentInProgress");
    if (hasPaymentData) {
        document.getElementById("return-from-payment-btn").style.display = "inline-block";
    }
    
    // Очищаем флаг платежа, если мы на главной странице
    if (window.location.pathname.includes("index.jsp") || window.location.pathname.endsWith("/")) {
        localStorage.removeItem("paymentInProgress");
    }
});

// ----------------- Перерисовка графика при выборе R -----------------
document.querySelectorAll("input[name='r']").forEach(rb => rb.addEventListener("change", drawScene));

// Инициализация
drawScene();
