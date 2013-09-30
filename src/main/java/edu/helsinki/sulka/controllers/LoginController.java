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

import edu.helsinki.sulka.services.LintuvaaraAuthDecryptService;

@Controller
public class LoginController {

	@Autowired
	private Logger logger;

	@Autowired
	private LintuvaaraAuthDecryptService auth;

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String home(Model model, @RequestParam(value = "key") String key, @RequestParam(value = "iv") String iv, @RequestParam(value = "data") String data) throws Exception {
		/*key = URLEncoder.encode(key, "UTF-8");
		iv = URLEncoder.encode(iv, "UTF-8");
		data = URLEncoder.encode(data, "UTF-8");*/
		model.addAttribute("key", key);
		model.addAttribute("iv", iv);
		model.addAttribute("data", data);
		
		model.addAttribute("auth", auth.auth(key, iv, data));
		return "login";
	}

}
