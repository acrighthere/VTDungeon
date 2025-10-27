package Config;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public final class YooKassaConfig {

  private final String shopId;
  private final String secretKey;

  private YooKassaConfig(String shopId, String secretKey) {
    this.shopId = shopId;
    this.secretKey = secretKey;
  }

  public String getShopId() {
    return shopId;
  }

  public String getSecretKey() {
    return secretKey;
  }

  public static YooKassaConfig load(ServletContext context) throws ServletException {
    Properties properties = new Properties();
    try (InputStream input = context.getResourceAsStream("/WEB-INF/yookassa.properties")) {
      if (input == null) {
        throw new ServletException("Не найден файл /WEB-INF/yookassa.properties");
      }
      properties.load(input);
      String shopId = properties.getProperty("shopId");
      String secretKey = properties.getProperty("secretKey");
      if (shopId == null || secretKey == null) {
        throw new ServletException("shopId или secretKey не указаны в yookassa.properties");
      }
      return new YooKassaConfig(shopId, secretKey);
    } catch (IOException e) {
      throw new ServletException("Ошибка при загрузке yookassa.properties", e);
    }
  }
}
