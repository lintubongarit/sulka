package edu.helsinki.sulka.controllers;

import java.util.Locale;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.helsinki.sulka.models.Field;
import edu.helsinki.sulka.models.FieldGroup;
import edu.helsinki.sulka.services.FieldsService;
import edu.helsinki.sulka.services.RowsService;

/**
 * Handles requests for available fields info.
 */
@Controller
public class FieldsController extends JSONController {
	@Autowired
	private Logger logger;
	
	@Autowired
	private FieldsService fieldsService;

	/**
	 * Returns all field groups.
	 */
	@RequestMapping(value = "/api/fields/groups", method = RequestMethod.GET)
	@ResponseBody
	public ArrayResponse<FieldGroup> groups(Locale locale, Model model)
			throws RowsService.QueryException {
		return new ArrayResponse<FieldGroup>(fieldsService.getAllFieldGroups());
	}
	
	/**
	 * Returns all fields.
	 */
	@RequestMapping(value = "/api/fields/all", method = RequestMethod.GET)
	@ResponseBody
	public ArrayResponse<Field> fields(Locale locale, Model model)
			throws RowsService.QueryException {
		return new ArrayResponse<Field>(fieldsService.getAllFields());
	}
}
