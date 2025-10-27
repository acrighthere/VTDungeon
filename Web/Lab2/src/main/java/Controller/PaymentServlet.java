package Controller;

import Config.YooKassaConfig;
import Util.RequestUtils;
import Util.RequestUtils.InputParams;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import java.util.UUID;
import org.json.JSONObject;

public class PaymentServlet extends HttpServlet {

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {

    System.err.println("PaymentServlet: Получен POST запрос");
    System.err.println("Request URI: " + req.getRequestURI());
    System.err.println("Context Path: " + req.getContextPath());
    System.err.println("Servlet Path: " + req.getServletPath());

    InputParams params = RequestUtils.extractAndValidate(req);
    if (params == null) {
      System.err.println("PaymentServlet: Ошибка валидации параметров");
      System.err.println("x: " + req.getParameter("x"));
      System.err.println("y: " + req.getParameter("y"));
      System.err.println("r: " + java.util.Arrays.toString(req.getParameterValues("r")));
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Некорректные параметры формы");
      return;
    }

    System.err.println("PaymentServlet: Параметры валидны, создаем платеж");

    try {
      YooKassaConfig config = YooKassaConfig.load(getServletContext());
      String shopId = config.getShopId();
      String secretKey = config.getSecretKey();

      JSONObject bodyJson = new JSONObject();
      JSONObject amountJson = new JSONObject();
      amountJson.put("value", "1.00"); // тестовая сумма
      amountJson.put("currency", "RUB");
      bodyJson.put("amount", amountJson);

      JSONObject confirmationJson = new JSONObject();
      confirmationJson.put("type", "redirect");
      confirmationJson.put("return_url", "http://localhost:8080/Lab2-1.0.0/areaCheck");
      bodyJson.put("confirmation", confirmationJson);

      bodyJson.put("capture", true);
      bodyJson.put("description", "Point check");
      
      JSONObject paymentMethodData = new JSONObject();
      paymentMethodData.put("type", "bank_card");
      bodyJson.put("payment_method_data", paymentMethodData);

      bodyJson.put("save_payment_method", false);

      String auth = Base64.getEncoder().encodeToString((shopId + ":" + secretKey).getBytes());

      System.err.println("YooKassa request body: " + bodyJson.toString());

      HttpRequest request =
          HttpRequest.newBuilder()
              .uri(URI.create("https://api.yookassa.ru/v3/payments"))
              .header("Authorization", "Basic " + auth)
              .header("Content-Type", "application/json")
              .header("Idempotence-Key", UUID.randomUUID().toString())
              .POST(HttpRequest.BodyPublishers.ofString(bodyJson.toString()))
              .build();

      HttpResponse<String> response =
          HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

      System.err.println("YooKassa API response status: " + response.statusCode());
      System.err.println("YooKassa API response body: " + response.body());

      // Извлекаем ID платежа для отслеживания
      JSONObject paymentResponse = new JSONObject(response.body());
      String paymentId = paymentResponse.getString("id");
      System.err.println("Создан платеж с ID: " + paymentId);
      System.err.println("Статус платежа: " + paymentResponse.getString("status"));
      System.err.println("Тестовый режим: " + paymentResponse.getBoolean("test"));

      if (response.statusCode() != 200) {
        throw new RuntimeException(
            "YooKassa API error: " + response.statusCode() + " - " + response.body());
      }

      JSONObject jsonResponse = new JSONObject(response.body());
      String paymentStatus = jsonResponse.getString("status");

      // Сохраняем параметры формы в сессии для последующей проверки точки
      HttpSession session = req.getSession();
      session.setAttribute("pendingX", params.x());
      session.setAttribute("pendingY", params.y());
      session.setAttribute("pendingR", params.rList());

      resp.setContentType("application/json");

      if (jsonResponse.has("confirmation")) {
        // Платеж требует подтверждения - отправляем URL для перенаправления
        JSONObject confirmation = jsonResponse.getJSONObject("confirmation");
        String confirmationUrl = confirmation.getString("confirmation_url");
        session.setAttribute("confirmationUrl", confirmationUrl);
        resp.getWriter()
            .write(new JSONObject().put("confirmation_url", confirmationUrl).toString());
      } else {
        throw new RuntimeException(
            "YooKassa API response missing confirmation and payment not succeeded: "
                + response.body());
      }

    } catch (Exception e) {
      e.printStackTrace();
      resp.sendError(
          HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
          "Ошибка при создании платежа: " + e.getMessage());
    }
  }
}
