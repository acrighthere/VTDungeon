package Util;

import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

public final class RequestUtils {
  private RequestUtils() {}

  private static final List<Integer> X_VALUES = List.of(-5, -4, -3, -2, -1, 0, 1, 2, 3);
  private static final List<Integer> R_VALUES = List.of(1, 2, 3, 4, 5);

  public static void setupCommonAttributes(HttpServletRequest req) {
    req.setAttribute("xValues", X_VALUES);
    req.setAttribute("rValues", R_VALUES);
  }

  public static boolean isValidX(double x) {
    // Проверяем, что x находится в допустимом диапазоне и является целым числом
    return x >= -5 && x <= 3 && x == (int) x && X_VALUES.contains((int) x);
  }

  public static boolean isValidY(double y) {
    return y > -5 && y < 5;
  }

  public static boolean isValidR(double r) {
    return R_VALUES.contains((int) r);
  }

  public static InputParams extractAndValidate(HttpServletRequest req) {
    String xParam = req.getParameter("x");
    String yParam = req.getParameter("y");
    String[] rParams = req.getParameterValues("r");

    if (xParam == null || yParam == null || rParams == null || rParams.length == 0) {
      return null;
    }

    try {
      double x = Double.parseDouble(xParam);
      double y = Double.parseDouble(yParam);

      if (!isValidX(x) || !isValidY(y)) return null;

      List<Double> rList = new ArrayList<>();
      for (String rStr : rParams) {
        double r = Double.parseDouble(rStr);
        if (isValidR(r)) rList.add(r);
      }

      if (rList.isEmpty()) return null;

      return new InputParams(x, y, rList);

    } catch (NumberFormatException e) {
      return null;
    }
  }

  public record InputParams(double x, double y, List<Double> rList) {}
}
