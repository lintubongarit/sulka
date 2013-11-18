package edu.helsinki.sulka.services;

import static org.junit.Assert.*;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
@ActiveProfiles("dev")
public class LintuvaaraAuthDecryptServiceTest {
	
	@Autowired
	LintuvaaraAuthDecryptService authService;

	@Test
	public void testAuthSuccessWithLegitLoginVariables() {
		//auth vars of admin_holopainen
		String key = "G7Nx2EUkReBDcFECQbDPXXOkFB9o0yqH51HcxmyjxXQtAEJ47r+Z8MLfbAUX\nqPyoFCmLzPsHZ9zO51Wrd4InEb4m1QcWWJ0Yxt4/WfGOIEot4Q9oAbMQcHRG\nD41ZhiCQivUO111N3iaZFOQICVKtDqoR1Gcy2pXM5grdekoATTw=";
		String iv = "orP/vmSaczR9Qjw9L1GdQhTnn2VkzYt7T2wP7ubG3a84nRFtSQ7XW082xaM4\nR2Kun0X5qgTZy0RBENhDdnxZwzNLkaHJAya1qVxsKE9TvjE+xtxWfexolSUO\neQ50EFOhIgqC0v1drp5vAXHXgs1csNPRvCUO4C6OyU2tGzu8gHY=";
		String data = "by1gtHADfbCmyyfpNg7zpPU68m1kubLnl8mWyc6Qq/b0XPuL03Iy2SfmCt54\nfEvU2fYwaEwR+DtKcrht/pZ5Ap0qMrap4ZfEG9HZk6tNAdaQcP7uM2zlKlzo\n19D0lRwtwzZ7+SFb8spHqKznQeBA034HqXTBV+RWAiWIdl1DvdPJKOAX+i96\nvDt42FeVS9O1TxAKTccoEr+vIl8kaSyMUG2SiiFBmE61lQtIL8YEMAMWun2L\n8ETJMV5Hmcp00mYxRb+Ra7V+/R8gt3/gwZkNvRxIaYtZ3GgNTybyaNk2fHUu\nnNWTZx1W2sBddPOWjpwDxivf4nRmMKe31vK1UNzZEZ7EQmsIjcvQgWFkoj1h\n2T8=";
		assertTrue("auth is success with legit login values", authService.auth(key, iv, data).accessStatus() == 1);
	}
	
	@Test
	public void testAuthFailsWithFalseLoginVariables() {
		String key = "xVjYOpNMekO7Glh%2Bvo1EKtQ%2BidYpbdGglbvbwLuCOR26H0qSxfm7epuckbtFf%0AuO1UXWMZbJPo14h3wmHbkPDwzGjFXCRn21pixeOJ5DgAh%2FI4wUFqZn2efKVO%0AbJgsGDn6cHlrg7bONHChSRVYqB0bXVQdL6hncHrvZx6Ii8qr8P4%3D%0A";
		String iv = "PbTjZwHH7QdNvnh5Lg7UXjkfhy7rNMq%2B1PttscCGJ8lWYKQXpC15woK7ZjWb%0Au4PX94v8SLoIWp%2Frjug97lte2grlehXn5rJ02Y5N7jTXjf6jQbaW5xk35oHE%0AhEE0W4GH0Qux9bu%2BVCTKLWzVQihqfxvzFpGjbLwkTarl1y3DtY0%3D%0A";
		String data = "8SjNZpsxoGKjckOp3igNx%2FrdsChKdkOdtsJ%2BZ2La%2FJ5FrP48lj0vmCKr7DUL%0Azv0rLcZzfbEvTCAFaaVq%2FOj9I2jfYd4PH0yIOTix44%2FHlbZeBURggle914f1%0AyHRNeWfCOgY59KOVpnTGrHaOmGvst80IuyBvd5tZYJHykP39Ifeth7U7JiU7%0A3pCnl4vqYOJE6fVafXZH%2Bzg%2BOajmjyq6Ps3VpsonzVCh7%2B9XeCm0iSyZ9Wai%0AMb17dnaogJl3Y6FSPCxbRPjlCxt%2Bqn7l3UKYJAJr5LnE3xVgGoKnfiS%2F0CRM%0AG1SL82Magx%2FfuxSA9Q3jYxL5%2FhyRolBMW6hotdyqagRbTBuYGK7YBwOTE2HI%0AQjo%3D%0A";
		assertFalse("auth fails with false login values", authService.auth(key, iv, data).accessStatus() == 0);
	}

}
