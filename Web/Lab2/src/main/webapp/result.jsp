<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Результаты</title>
    <link rel="stylesheet" href="css/result.css">
    <script src="js/video-control.js"></script>
</head>
<body>

<div class="results-container">
    <h2>История запросов</h2>

    <table>
        <thead>
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Попадание</th>
                <th>Время сервера</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="res" items="${results}">
                <tr>
                    <td>${res.point.x}</td>
                    <td>${res.point.y}</td>
                    <td>${res.point.r}</td>
                    <td>${res.hit ? "Да" : "Нет"}</td>
                    <td>${res.formattedServerTime}</td>
                </tr>
            </c:forEach>
        </tbody>
    </table>

    <a href="controller">Назад к форме</a>
</div>

<script>
// Очищаем флаг платежа после успешной обработки
localStorage.removeItem("paymentInProgress");
</script>

<div class="video-container">
    <video autoplay loop muted>
        <source src="videos/background.mp4" type="video/mp4">
        Ваш браузер не поддерживает видео.
    </video>
</div>

</body>
</html>
