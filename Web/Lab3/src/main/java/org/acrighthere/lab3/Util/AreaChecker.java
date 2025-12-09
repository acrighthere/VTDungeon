package org.acrighthere.lab3.Util;

import org.acrighthere.lab3.Model.Point;

public class AreaChecker {
  public static boolean checkHit(Point p) {
    double x = p.getX();
    double y = p.getY();
    double r = p.getR();

    // 2-я четверть — круг
    boolean inSecondQuarter = (x <= 0 && y >= 0 && (x * x + y * y <= Math.pow(r / 2, 2)));

    // 3-я четверть — прямоугольник
    boolean inThirdQuarter = (x <= 0 && y <= 0 && x >= -r && y >= -r / 2);

    // 4-я четверть — треугольник
    boolean inFourthQuarter = (x >= 0 && y <= 0 && y >= x - r / 2);

    return inSecondQuarter || inThirdQuarter || inFourthQuarter;
  }
}
