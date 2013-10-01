package edu.helsinki.sulka.services;

import static org.junit.Assert.*;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class LintuvaaraAuthDecryptServiceTest {
	
	@Autowired
	LintuvaaraAuthDecryptService authService;

	@Test
	public void testAuthSuccessWithLegitLoginVariables() {
		//auth vars of admin_holopainen
		String key = "VjYOpNMekO7Glh%2Bvo1EKtQ%2BidYpbdGglbvbwLuCOR26H0qSxfm7epuckbtFf%0AuO1UXWMZbJPo14h3wmHbkPDwzGjFXCRn21pixeOJ5DgAh%2FI4wUFqZn2efKVO%0AbJgsGDn6cHlrg7bONHChSRVYqB0bXVQdL6hncHrvZx6Ii8qr8P4%3D%0A";
		String iv = "PbTjZwHH7QdNvnh5Lg7UXjkfhy7rNMq%2B1PttscCGJ8lWYKQXpC15woK7ZjWb%0Au4PX94v8SLoIWp%2Frjug97lte2grlehXn5rJ02Y5N7jTXjf6jQbaW5xk35oHE%0AhEE0W4GH0Qux9bu%2BVCTKLWzVQihqfxvzFpGjbLwkTarl1y3DtY0%3D%0A";
		String data = "8SjNZpsxoGKjckOp3igNx%2FrdsChKdkOdtsJ%2BZ2La%2FJ5FrP48lj0vmCKr7DUL%0Azv0rLcZzfbEvTCAFaaVq%2FOj9I2jfYd4PH0yIOTix44%2FHlbZeBURggle914f1%0AyHRNeWfCOgY59KOVpnTGrHaOmGvst80IuyBvd5tZYJHykP39Ifeth7U7JiU7%0A3pCnl4vqYOJE6fVafXZH%2Bzg%2BOajmjyq6Ps3VpsonzVCh7%2B9XeCm0iSyZ9Wai%0AMb17dnaogJl3Y6FSPCxbRPjlCxt%2Bqn7l3UKYJAJr5LnE3xVgGoKnfiS%2F0CRM%0AG1SL82Magx%2FfuxSA9Q3jYxL5%2FhyRolBMW6hotdyqagRbTBuYGK7YBwOTE2HI%0AQjo%3D%0A";
		assertTrue("auth is success with legit login values", authService.auth(key, iv, data));
	}
	
	@Test
	public void testAuthFailsWithFalseLoginVariables() {
		String key = "xVjYOpNMekO7Glh%2Bvo1EKtQ%2BidYpbdGglbvbwLuCOR26H0qSxfm7epuckbtFf%0AuO1UXWMZbJPo14h3wmHbkPDwzGjFXCRn21pixeOJ5DgAh%2FI4wUFqZn2efKVO%0AbJgsGDn6cHlrg7bONHChSRVYqB0bXVQdL6hncHrvZx6Ii8qr8P4%3D%0A";
		String iv = "PbTjZwHH7QdNvnh5Lg7UXjkfhy7rNMq%2B1PttscCGJ8lWYKQXpC15woK7ZjWb%0Au4PX94v8SLoIWp%2Frjug97lte2grlehXn5rJ02Y5N7jTXjf6jQbaW5xk35oHE%0AhEE0W4GH0Qux9bu%2BVCTKLWzVQihqfxvzFpGjbLwkTarl1y3DtY0%3D%0A";
		String data = "8SjNZpsxoGKjckOp3igNx%2FrdsChKdkOdtsJ%2BZ2La%2FJ5FrP48lj0vmCKr7DUL%0Azv0rLcZzfbEvTCAFaaVq%2FOj9I2jfYd4PH0yIOTix44%2FHlbZeBURggle914f1%0AyHRNeWfCOgY59KOVpnTGrHaOmGvst80IuyBvd5tZYJHykP39Ifeth7U7JiU7%0A3pCnl4vqYOJE6fVafXZH%2Bzg%2BOajmjyq6Ps3VpsonzVCh7%2B9XeCm0iSyZ9Wai%0AMb17dnaogJl3Y6FSPCxbRPjlCxt%2Bqn7l3UKYJAJr5LnE3xVgGoKnfiS%2F0CRM%0AG1SL82Magx%2FfuxSA9Q3jYxL5%2FhyRolBMW6hotdyqagRbTBuYGK7YBwOTE2HI%0AQjo%3D%0A";
		assertFalse("auth fails with false login values", authService.auth(key, iv, data));
	}

}
