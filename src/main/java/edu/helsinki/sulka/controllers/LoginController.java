package edu.helsinki.sulka.controllers;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

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
	public String home(Model model, @RequestParam(value = "key") String key, @RequestParam(value = "iv") String iv, @RequestParam(value = "data") String data) {		
		User user = authService.auth(key, iv, data);
		model.addAttribute("user", user);
		return "login";
	}

}
