package edu.helsinki.sulka.controllers;

import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;

import edu.helsinki.sulka.models.Row;
import edu.helsinki.sulka.models.Validation;
import edu.helsinki.sulka.services.FieldsService;
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
	
	@Autowired
	private FieldsService fieldsService;
	
	/**
	 * @returns Validation of row
	 */
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/validate", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public Validation validate(@RequestBody Map<String, String> data) throws JsonProcessingException {
		return validationService.validate(new Row(data, fieldsService.getAllFieldsByFieldName()));
	}

}
