package edu.helsinki.sulka.controllers;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import edu.helsinki.sulka.models.LocalDatabaseRow;
import edu.helsinki.sulka.models.LocalDatabaseRow.RowType;
import edu.helsinki.sulka.models.User;
import edu.helsinki.sulka.models.UserSettings;
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
	
	
	private enum ServiceType {
		ringings,
		recoveries
	}
	
	private RowType serviceToRowType(ServiceType service) {
		switch (service) {
		case ringings:
			return RowType.RINGING;
		case recoveries:
		default:
			return RowType.RECOVERY;
		}
	}
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/{type}",
					method = RequestMethod.GET,
					produces = "application/json;charset=UTF-8")
	@ResponseBody
	public ListResponse<LocalDatabaseRow> getRows(HttpSession session, @PathVariable ServiceType type) {
		String userId = ((User) session.getAttribute("user")).getLogin_id();
		return new ListResponse<LocalDatabaseRow>(localDatabaseService.getRowsByUserId(serviceToRowType(type), userId));
	}
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/{type}",
					method = RequestMethod.POST,
					produces = "application/json;charset=UTF-8",
					consumes = "application/json")
	@ResponseBody
	public ObjectResponse<LocalDatabaseRow> saveRow(HttpSession session,
			@PathVariable ServiceType type,
			@RequestBody LocalDatabaseRow row,
			BindingResult bindingResult) throws LocalStorageException, NotFoundException, UnauthorizedException {
		RowType rowType = serviceToRowType(type);
		
		if (bindingResult.hasErrors()){
			throw new LocalStorageException("Database update failed");
		}
		
		String userId = ((User) session.getAttribute("user")).getLogin_id();
		
		if (row.getId() != null) {
			LocalDatabaseRow existingRow = localDatabaseService.getRowOfAnyType(row.getId());
			if (existingRow == null || existingRow.getRowType() != rowType) {
				throw new NotFoundException("Row not found or row type mismatch.");
			}
			if (!existingRow.getUserId().equals(userId)) {
				throw new UnauthorizedException("Database update failed. User id and row owner id don't match.");
			}
		}
		
		row.setUserId(((User) session.getAttribute("user")).getLogin_id());
		row.setRowType(serviceToRowType(type));
		
		return new ObjectResponse<LocalDatabaseRow>(localDatabaseService.addRow(row));
	}
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/{type}/{rowId}", method = RequestMethod.DELETE)
	@ResponseStatus(value=HttpStatus.NO_CONTENT)
	@ResponseBody
	public String deleteRow(HttpSession session, @PathVariable ServiceType type, @PathVariable long rowId)
			throws LocalStorageException, NotFoundException, UnauthorizedException {
		RowType rowType = serviceToRowType(type);
		
		LocalDatabaseRow row = localDatabaseService.getRow(serviceToRowType(type), rowId);
		
		if (row == null || row.getRowType() != rowType) {
			throw new NotFoundException("Row not found or row type mismatch.");
		}
		
		if (!((User) session.getAttribute("user")).getLogin_id().equals(row.getUserId())) {
			throw new UnauthorizedException("Database update failed. User id and row owner id don't match.");
		}
		
		localDatabaseService.removeRow(row);
		return "";
	}
	
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/settings",
					method = RequestMethod.GET)
	@ResponseBody
	public ObjectResponse<UserSettings> getSettings(HttpSession session) throws LocalStorageException {
		String userId = ((User) session.getAttribute("user")).getLogin_id();
		return new ObjectResponse<UserSettings>(localDatabaseService.getSettings(userId));
	}
	
	@PreAuthorize("hasRole('USER')")
	@RequestMapping(value = "/api/storage/settings",
					method = RequestMethod.POST,
					consumes = "application/json")
	@ResponseBody
	public String saveSettings(HttpSession session, @RequestBody UserSettings settings, BindingResult bindingResult)
			throws LocalStorageException {
		if (bindingResult.hasErrors()){
			throw new LocalStorageException("Database update failed.");
		}
		String userId = ((User) session.getAttribute("user")).getLogin_id();
		settings.setUserId(userId);
		localDatabaseService.saveSettings(settings);
		return "User settings saved.";
	}
	
	
	/**
	 * Handles storage exceptions gracefully.
	 */
	@ExceptionHandler(LocalStorageException.class)
	@ResponseBody
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public ErrorResponse handleLocalStorageException(Exception e) {
		return new ErrorResponse(e.getMessage());
	}

}
