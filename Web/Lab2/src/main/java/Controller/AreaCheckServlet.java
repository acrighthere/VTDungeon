package Controller;

import Model.HitResult;
import Service.AreaCheckService;
import Util.RequestUtils.InputParams;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class AreaCheckServlet extends HttpServlet {

  private final AreaCheckService service = new AreaCheckService();

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {

    Util.RequestUtils.setupCommonAttributes(req);

    HttpSession session = req.getSession(false);
    if (session == null) {
      req.setAttribute("errorMessage", "Нет данных для проверки точки. Сначала пройдите оплату.");
      req.getRequestDispatcher("/index.jsp").forward(req, resp);
      return;
    }

    Double x = (Double) session.getAttribute("pendingX");
    Double y = (Double) session.getAttribute("pendingY");
    @SuppressWarnings("unchecked")
    List<Double> rList = (List<Double>) session.getAttribute("pendingR");
    String confirmationUrl = (String) session.getAttribute("confirmationUrl");

    if (x == null || y == null || rList == null) {
      req.setAttribute("errorMessage", "Нет данных для проверки точки. Сначала пройдите оплату.");
      req.getRequestDispatcher("/index.jsp").forward(req, resp);
      return;
    }

    // В тестовом режиме считаем платеж успешным
    System.err.println("AreaCheckServlet: Обрабатываем результат платежа");
    System.err.println("X: " + x + ", Y: " + y + ", R: " + rList);

    InputParams params = new InputParams(x, y, rList);

    List<HitResult> results = service.checkPoints(params.x(), params.y(), params.rList());
    ServletContext context = getServletContext();
    synchronized (context) {
      @SuppressWarnings("unchecked")
      List<HitResult> contextResults = (List<HitResult>) context.getAttribute("results");
      if (contextResults == null) {
        contextResults = new ArrayList<>();
        context.setAttribute("results", contextResults);
      }
      contextResults.addAll(results);
    }

    req.setAttribute("results", results);

    session.removeAttribute("pendingX");
    session.removeAttribute("pendingY");
    session.removeAttribute("pendingR");
    session.removeAttribute("confirmationUrl");

    req.getRequestDispatcher("/result.jsp").forward(req, resp);
  }
}
