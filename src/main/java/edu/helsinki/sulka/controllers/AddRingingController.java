package edu.helsinki.sulka.controllers;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Handles requests for the application home page.
 */
@Controller
public class AddRingingController {
	@Autowired
	private Logger logger;
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	
	@PreAuthorize("hasAnyRole('USER,ADMIN')")
	@RequestMapping(value = "/addringing", method = RequestMethod.GET)
	public String home(Locale locale, Model model, HttpSession session) {
		Calendar c = Calendar.getInstance();
		DateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy");
		
		model.addAttribute("startDate", dateFormat.format(c.getTime()));
		System.out.println(dateFormat.format(c.getTime()));
		
		c.set(c.get(c.YEAR) - 1, c.get(c.MONTH), c.get(c.DAY_OF_MONTH));
		model.addAttribute("endDate", dateFormat.format(c.getTime()));
		System.out.println(dateFormat.format(c.getTime()));
		
		return "addRinging";
	}
}
