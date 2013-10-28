package edu.helsinki.sulka.controllers;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Handles HTTP error views.
 */
@Controller
public class ErrorController {
	@Autowired
	private Logger logger;
	
	@RequestMapping(value = "/status/403", method = RequestMethod.GET)
	public String accessDenied(Model model) {
		return "/status/403";
	}

	
	@RequestMapping(value = "/status/404", method = RequestMethod.GET)
	public String notFound(Model model) {
		return "/status/404";
	}
	
	
	@RequestMapping(value = "/status/401", method = RequestMethod.GET)
	public String unauthorizedAccess(Model model) {
		return "/status/401";
	}
}