package edu.helsinki.sulka.controllers;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Handles requests for different top level tabs.
 */
@Controller
public class TabsController {
	@Autowired
	private Logger logger;
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String browse() {
		return "browse";
	}
	
	@PreAuthorize("hasAnyRole('USER')")
	@RequestMapping(value = "/addRingings", method = RequestMethod.GET)
	public String addRingings() {
		return "addRingings";
	}
	
	@PreAuthorize("hasAnyRole('USER')")
	@RequestMapping(value = "/addRecoveries", method = RequestMethod.GET)
	public String home() {
		return "addRecoveries";
	}
}
