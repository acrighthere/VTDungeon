package Controller;

import Util.RequestUtils;
import Util.RequestUtils.InputParams;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ControllerServlet extends HttpServlet {
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {

    RequestUtils.setupCommonAttributes(req);

    String action = req.getParameter("action");
    if ("reset".equals(action)) {
      getServletContext().removeAttribute("results");
      resp.setStatus(HttpServletResponse.SC_OK);
      return;
    }

    boolean isSubmitted =
        req.getParameterMap().containsKey("x")
            || req.getParameterMap().containsKey("y")
            || req.getParameterMap().containsKey("r");

    if (!isSubmitted) {
      req.getRequestDispatcher("/index.jsp").forward(req, resp);
      return;
    }

    InputParams params = RequestUtils.extractAndValidate(req);

    if (params != null) {
      req.setAttribute("validatedParams", params);

      req.getRequestDispatcher("/payment").forward(req, resp);

    } else {
      req.setAttribute("errorMessage", "Некорректные или отсутствующие параметры!");
      req.getRequestDispatcher("/index.jsp").forward(req, resp);
    }
  }
}
