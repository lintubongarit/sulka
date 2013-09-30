package edu.helsinki.sulka.controllers;

import java.net.URI;
import java.net.URLEncoder;
import java.util.Locale;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.helsinki.sulka.services.LintuvaaraAuthDecryptService;

/**
 * Handles requests for the login page and passing authentication variables to Tipu-API's Lintuvaara authentication decryptor service
 */
@Controller
@SessionAttributes("User")
public class LoginController {

	@Autowired
	private Logger logger;

	@Autowired
	private LintuvaaraAuthDecryptService authService;

	/**
	 * redirects authentication variables key, iv and data to Tipu-API's Lintuvaara authentication decryptor service
	 */
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String home(Model model, @RequestParam(value = "key") String key, @RequestParam(value = "iv") String iv, @RequestParam(value = "data") String data) {
		/*key = URLEncoder.encode(key, "UTF-8");
		iv = URLEncoder.encode(iv, "UTF-8");
		data = URLEncoder.encode(data, "UTF-8");*/
		model.addAttribute("key", key);
		model.addAttribute("iv", iv);
		model.addAttribute("data", data);
		
		model.addAttribute("auth", authService.auth(key, iv, data));
		return "login";
	}

}
