<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>ЛР — попадание точки в область</title>
    <link rel="stylesheet" href="css/style.css" />
    <script defer src="js/script.js"></script>
    <script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js"></script>
</head>
<body>

<!-- Табличная шапка -->
<table class="header" role="presentation">
    <tr>
        <td>
            <div id="student-name">Родионов Максим Артемович</div>
            <div id="student-meta">Группа: P3231 • Вариант: 2244</div>
        </td>
    </tr>
</table>

<!-- Основная область -->
<table class="layout" role="presentation">
<tr>
    <!-- Левая колонка: форма + график -->
    <td class="left-col">
        <form id="check-form">
            <table class="form-table">
                <caption>Параметры</caption>

                <tr>
                    <td><span>X:</span></td>
                    <td>
                        <div class="x-radios">
                            <c:forEach var="xVal" items="${xValues}">
                                <label>
                                    <input type="radio" name="x" value="${xVal}" required> ${xVal}
                                </label>
                            </c:forEach>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td><label for="y-input">Y:</label></td>
                    <td>
                        <input id="y-input" name="y" type="text" placeholder="-5..5" required />
                    </td>
                </tr>

                <tr>
                    <td><span>R:</span></td>
                    <td>
                        <div class="r-checkboxes">
                            <c:forEach var="rVal" items="${rValues}">
                                <label>
                                    <input type="checkbox" name="r" value="${rVal}"> ${rVal}
                                </label>
                            </c:forEach>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td></td>
                    <td>
                        <button id="submit-btn" type="button">Проверить</button>
                    </td>
                </tr>
            </table>
        </form>

        <!-- Контейнер для платежного виджета -->
        <div id="payment-form" style="margin-top:20px;"></div>
        
        <!-- Информация о тестовых картах -->
        <div class="test-cards-info" style="margin-top:20px; padding:15px; background:#f5f5f5; border-radius:5px; font-size:12px;">
            <h4 style="margin:0 0 10px 0; color:#333;">🧪 Тестовые карты для оплаты:</h4>
            <div style="margin-bottom:8px;">
                <strong>✅ Успешный платеж:</strong><br>
                <code>5555 5555 5555 4444</code> (срок: 12/25, CVV: 123)
            </div>
            <div style="margin-bottom:8px;">
                <strong>❌ Недостаточно средств:</strong><br>
                <code>5555 5555 5555 4477</code>
            </div>
            <div>
                <strong>❌ Карта заблокирована:</strong><br>
                <code>5555 5555 5555 4455</code>
            </div>
        </div>

        <!-- График -->
        <div class="canvas-wrapper">
            <canvas id="graph" width="400" height="400"></canvas>
        </div>
    </td>

    <!-- Правая колонка: блок статуса + история -->
    <td class="right-col">
        <table class="meta" role="presentation">
            <caption>Статус</caption>
            <tr>
                <td>Локальное время:</td>
                <td id="local-time">
                    <%= java.time.LocalTime.now().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm:ss")) %>
                </td>
            </tr>
            <tr>
                <td>Последняя ошибка:</td>
                <td id="last-error">${errorMessage != null ? errorMessage : 'нет'}</td>
            </tr>
        </table>

        <div class="reset-wrapper">
            <button id="reset-btn" type="button">Сбросить историю</button>
            <button id="return-from-payment-btn" type="button" style="margin-left: 10px; display: none;">Вернуться после оплаты</button>
        </div>

        <table class="results" id="results-table">
            <caption>История проверок</caption>
            <thead>
                <tr>
                    <th>X</th>
                    <th>Y</th>
                    <th>R</th>
                    <th>Попадание</th>
                    <th>Время сервера</th>
                    <th>Время выполнения (мс)</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="res" items="${results}">
                    <tr>
                        <td>${res.point.x}</td>
                        <td>${res.point.y}</td>
                        <td>${res.point.r}</td>
                        <td>${res.hit ? 'Да' : 'Нет'}</td>
                        <td>${res.formattedServerTime}</td>
                        <td>${res.execTime}</td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </td>
</tr>
</table>
</body>
</html>
