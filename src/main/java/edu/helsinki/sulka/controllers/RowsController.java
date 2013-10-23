package edu.helsinki.sulka.controllers;

import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.joda.time.LocalDate;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.helsinki.sulka.models.Row;
import edu.helsinki.sulka.models.User;
import edu.helsinki.sulka.services.APIQueryException;
import edu.helsinki.sulka.services.RowsService;

/**
 * Handles requests for ringing and control rows.
 */
@Controller
public class RowsController extends JSONController {
	@Autowired
	private Logger logger;
	
	@Autowired
	private RowsService rowsService;

	/**
	 * Returns all rows by filters.
	 */
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/rows", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public ListResponse<Row> all(
			Locale locale, Model model, HttpSession session,
			@RequestParam(value="municipality", required=false) String[] municipalities,
			@RequestParam(value="species", required=false) String[] species,
			@RequestParam(value="ringPrefix", required=false) String ringPrefix,
			@RequestParam(value="startDate", required=false) @DateTimeFormat(pattern="dd.MM.YYYY") LocalDate startDate,
			@RequestParam(value="endDate", required=false) @DateTimeFormat(pattern="dd.MM.YYYY") LocalDate endDate,
			@RequestParam(value="sort", required=false) String[] sort
			) throws APIQueryException {
		return new ListResponse<Row>(rowsService.getRows(
				((User) session.getAttribute("user")).getRingerIdAsArray(),
				municipalities, species, ringPrefix,
				startDate, endDate,
				sort));
	}
	
	/**
	 * Returns ringing rows by filters.
	 */
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/rows/ringings", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public ListResponse<Row> ringings(
			Locale locale, Model model, HttpSession session,
			@RequestParam(value="municipality", required=false) String[] municipalities,
			@RequestParam(value="species", required=false) String[] species,
			@RequestParam(value="ringPrefix", required=false) String ringPrefix,
			@RequestParam(value="startDate", required=false) @DateTimeFormat(pattern="dd.MM.YYYY") LocalDate startDate,
			@RequestParam(value="endDate", required=false) @DateTimeFormat(pattern="dd.MM.YYYY") LocalDate endDate,
			@RequestParam(value="sort", required=false) String[] sort
			) throws APIQueryException {
		return new ListResponse<Row>(rowsService.getRingings(
				((User) session.getAttribute("user")).getRingerIdAsArray(),
				municipalities, species, ringPrefix,
				startDate, endDate,
				sort));
	}
	
	/**
	 * Returns recovery rows by filters.
	 */
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/rows/recoveries", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public ListResponse<Row> recoveries(
			Locale locale, Model model, HttpSession session,
			@RequestParam(value="municipality", required=false) String[] municipalities,
			@RequestParam(value="species", required=false) String[] species,
			@RequestParam(value="ringPrefix", required=false) String ringPrefix,
			@RequestParam(value="startDate", required=false) @DateTimeFormat(pattern="dd.MM.YYYY") LocalDate startDate,
			@RequestParam(value="endDate", required=false) @DateTimeFormat(pattern="dd.MM.YYYY") LocalDate endDate,
			@RequestParam(value="sort", required=false) String[] sort
			) throws APIQueryException {
		return new ListResponse<Row>(rowsService.getRecoveries(
				((User) session.getAttribute("user")).getRingerIdAsArray(),
				municipalities, species, ringPrefix,
				startDate, endDate,
				sort));
	}
}
