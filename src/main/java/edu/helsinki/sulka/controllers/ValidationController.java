package edu.helsinki.sulka.controllers;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;

import edu.helsinki.sulka.models.Row;
import edu.helsinki.sulka.models.Validation;
import edu.helsinki.sulka.services.ValidationService;


/*
 * Handles requests for validation
 */
@Controller
public class ValidationController extends JSONController {
	
	@Autowired
	private Logger logger;
	
	@Autowired
	private ValidationService validationService;
	
	/*
	 * @returns Validation of row
	 */
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/validate", method = RequestMethod.GET)
	@ResponseBody
	public Validation validate(@RequestParam(value="data", required=true) String data) {
		System.out.println(validationService.validate(data).isPasses());
		return validationService.validate(data);
	}

}
