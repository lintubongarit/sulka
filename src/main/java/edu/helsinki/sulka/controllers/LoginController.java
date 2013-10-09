package edu.helsinki.sulka.controllers;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.helsinki.sulka.configurations.TestLoginCodeConfiguration;
import edu.helsinki.sulka.models.User;
import edu.helsinki.sulka.services.LintuvaaraAuthDecryptService;

/**
 * Handles requests for the login page and passing authentication variables to Tipu-API's Lintuvaara authentication decryptor service
 */
@Controller
@SessionAttributes("user")
public class LoginController {

	@Autowired
	private Logger logger;

	@Autowired
	private LintuvaaraAuthDecryptService authService;

	/**
	 * redirects authentication variables key, iv and data to Tipu-API's Lintuvaara authentication decryptor service and saves user to session
	 */
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String login(Model model, @RequestParam String key, @RequestParam String iv, @RequestParam String data) {
		User user = authService.auth(key, iv, data);
		model.addAttribute("user", user);
		return "login";
	}

	/**
	 * This value should be set from a bean and disabled for production.
	 */
	@Autowired
	private TestLoginCodeConfiguration testLoginCodeConfiguration;
	
	/**
	 * Creates a fake session for JS tests.
	 */
	@RequestMapping(value = "/testLogin/{code}", method = RequestMethod.GET)
	public String testLogin(HttpServletResponse response, Model model, @PathVariable String code) {
		if (testLoginCodeConfiguration.isCorrectCode(code)) {
			User user = new User();
			user.setPass(true);
			user.setLogin_id("846");
			user.setName("Heikki Lokki");
			user.refreshSession();
			model.addAttribute("user", user);
		} else {
			response.setStatus(403);
			return "login";
		}
		return "login";
	}
}
