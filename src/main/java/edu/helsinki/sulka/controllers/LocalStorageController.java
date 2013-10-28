package edu.helsinki.sulka.controllers;

import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import edu.helsinki.sulka.models.DbRowRingings;


@Controller
public class LocalStorageController extends JSONController {
	public static class LocalStorageException extends Exception {
		private static final long serialVersionUID = 1L;
		LocalStorageException(String message) {
			super(message);
		}
	}
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/ringing/save", method = RequestMethod.POST, produces = "application/json;charset=UTF-8", consumes="application/json")
	@ResponseBody
	public ObjectResponse<String> saveRinging(Locale locale,
			Model model, HttpSession session,
			@RequestBody DbRowRingings ringing,
			BindingResult bindingResult) throws LocalStorageException {
		if(bindingResult.hasErrors()){
			throw new LocalStorageException("Database update failed");
		}
		
		return new ObjectResponse<String>("Database updated successfully.");
	}
	
	/**
	 * Handles storage exceptions gracefully.
	 */
	@ExceptionHandler(LocalStorageException.class)
	@ResponseBody
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public ErrorResponse handleAPIException(Exception e) {
		return new ErrorResponse(e.getMessage());
	}

}
