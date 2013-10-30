package edu.helsinki.sulka.controllers;

import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.helsinki.sulka.models.Validation;
import edu.helsinki.sulka.services.ValidationService;


/*
 * Handles requests for validation
 */
@Controller
public class ValidationController {
	
	@Autowired
	private Logger logger;
	
	@Autowired
	private ValidationService validateService;
	
	/*
	 * @returns Validation of row
	 */
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/validate", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public Validation validate(Locale locale, Model model, HttpSession session,
			@RequestParam(value="data", required=true) String data){
		return validateService.validate(data);
	}

}
