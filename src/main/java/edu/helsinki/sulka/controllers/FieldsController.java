package edu.helsinki.sulka.controllers;

import java.util.Locale;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.helsinki.sulka.models.Field;
import edu.helsinki.sulka.models.FieldGroup;
import edu.helsinki.sulka.services.FieldsService;

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
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/fields/groups", method = RequestMethod.GET)
	@ResponseBody
	public ArrayResponse<FieldGroup> groups(Locale locale, Model model) {
		return new ArrayResponse<FieldGroup>(fieldsService.getAllFieldGroups());
	}
	
	/**
	 * Returns all fields.
	 */
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/fields/all", method = RequestMethod.GET)
	@ResponseBody
	public ListResponse<Field> fields(Locale locale, Model model) {
		return new ListResponse<Field>(fieldsService.getAllFields());
	}
	
	/**
	 * Returns all field groups that have column entries for given view mode.
	 */
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/fields/groups/{viewMode}", method = RequestMethod.GET)
	@ResponseBody
	public ListResponse<FieldGroup> groups(Locale locale, Model model, @PathVariable String viewMode) {
		return new ListResponse<FieldGroup>(fieldsService.getAllFieldGroups(Field.ViewMode.valueOf(viewMode.toUpperCase())));
	}
	
	/**
	 * Returns all fields for given view mode.
	 */
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/fields/all/{viewMode}", method = RequestMethod.GET)
	@ResponseBody
	public ListResponse<Field> fields(Locale locale, Model model, @PathVariable String viewMode) {
		return new ListResponse<Field>(fieldsService.getAllFields(Field.ViewMode.valueOf(viewMode.toUpperCase())));
	}
}
