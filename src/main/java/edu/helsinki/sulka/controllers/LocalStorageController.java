package edu.helsinki.sulka.controllers;

import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import edu.helsinki.sulka.models.DatabaseRow;
import edu.helsinki.sulka.models.User;
import edu.helsinki.sulka.services.LocalDatabaseService;


@Controller
public class LocalStorageController extends JSONController {
	
	@Autowired
	private LocalDatabaseService localDatabaseService;
	
	public static class LocalStorageException extends Exception {
		private static final long serialVersionUID = 1L;
		LocalStorageException(String message) {
			super(message);
		}
	}
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/ringing",
					method = RequestMethod.GET,
					produces = "application/json;charset=UTF-8")
	@ResponseBody
	public ListResponse<DatabaseRow> getRingings(HttpSession session) {
		String userId = ((User) session.getAttribute("user")).getLogin_id();
		return new ListResponse<DatabaseRow>(localDatabaseService.getRingings(userId));
	}
		
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/ringing",
					method = RequestMethod.POST,
					produces = "application/json;charset=UTF-8",
					consumes="application/json")
	@ResponseBody
	public ObjectResponse<DatabaseRow> saveRinging(HttpSession session,
			@RequestBody DatabaseRow ringing,
			BindingResult bindingResult) throws LocalStorageException {
		
		if(bindingResult.hasErrors()){
			throw new LocalStorageException("Database update failed");
		}
		ringing.setUserId(((User) session.getAttribute("user")).getLogin_id());
		
		return new ObjectResponse<DatabaseRow>(localDatabaseService.addRinging(ringing));
	}
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/ringing",
					method = RequestMethod.DELETE,
					produces = "application/json;charset=UTF-8",
					consumes="application/json")
	@ResponseBody
	public ObjectResponse<String> deleteRinging(HttpSession session,
			@RequestBody DatabaseRow ringing,
			BindingResult bindingResult) throws LocalStorageException {
		if(bindingResult.hasErrors()){
			throw new LocalStorageException("Database update failed.");
		}
		if(!((User) session.getAttribute("user")).getLogin_id().equals(ringing.getUserId()))
			throw new LocalStorageException("Database update failed. User id and row owner id doesn't match.");

		localDatabaseService.removeRinging(ringing);
		
		return new ObjectResponse<String>("Database updated.");
	}
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/recovery",
					method = RequestMethod.GET,
					produces = "application/json;charset=UTF-8")
	@ResponseBody
	public ListResponse<DatabaseRow> getRecoveries(HttpSession session) {
		String userId = ((User) session.getAttribute("user")).getLogin_id();
		return new ListResponse<DatabaseRow>(localDatabaseService.getRecoveries(userId));
	}
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/recovery",
					method = RequestMethod.POST,
					produces = "application/json;charset=UTF-8",
					consumes="application/json")
	@ResponseBody
	public ObjectResponse<DatabaseRow> saveRecovery(HttpSession session,
			@RequestBody DatabaseRow recovery,
			BindingResult bindingResult) throws LocalStorageException {
		if(bindingResult.hasErrors()){
			throw new LocalStorageException("Database update failed");
		}
		recovery.setUserId(((User) session.getAttribute("user")).getLogin_id());
		
		return new ObjectResponse<DatabaseRow>(localDatabaseService.addRecovery(recovery));
	}
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/recovery",
					method = RequestMethod.DELETE,
					produces = "application/json;charset=UTF-8",
					consumes="application/json")
	@ResponseBody
	public ObjectResponse<String> deleteRecovery(HttpSession session,
			@RequestBody DatabaseRow recovery,
			BindingResult bindingResult) throws LocalStorageException {
		if(bindingResult.hasErrors()){
			throw new LocalStorageException("Database update failed.");
		}
		if(!((User) session.getAttribute("user")).getLogin_id().equals(recovery.getUserId()))
			throw new LocalStorageException("Database update failed. User id and row owner id doesn't match.");

		localDatabaseService.removeRinging(recovery);
		
		return new ObjectResponse<String>("Database updated.");
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
