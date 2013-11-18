package edu.helsinki.sulka.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import edu.helsinki.sulka.services.APIQueryException;

/**
 * Base class for Controllers that only return JSON.
 */
@Controller
public abstract class JSONController {
	@Autowired
	private Logger logger;
	
	public static class NotFoundException extends Exception {
		private static final long serialVersionUID = 1L;
		public NotFoundException() {
			super("Tietuetta ei löydy");
		}
		public NotFoundException(String message) {
			super(message);
		}
	}
	public static class UnauthorizedException extends Exception {
		private static final long serialVersionUID = 1L;
		public UnauthorizedException() {
			super("Ei käyttöoikeutta");
		}
		public UnauthorizedException(String message) {
			super(message);
		}
	}
	
	/**
	 * The error response JSON
	 */
	protected static class ErrorResponse {
	    public ErrorResponse(String msg) { error = msg; }
		public String error;
	    public boolean success = false;
	}

	/**
	 * Multiple objects response JSON using array
	 */
	protected static class ArrayResponse<T> {
		public ArrayResponse(T[] objs) { this.objects = objs; }
		public T[] objects = null;
		public String error = null;
		public boolean success = true;
	}
	
	/**
	 * Multiple objects response JSON using java.util.List
	 */
	protected static class ListResponse<T> {
		public ListResponse(List<T> objs) { this.objects = objs; }
		public List<T> objects = null;
		public String error = null;
		public boolean success = true;
	}
	
	/**
	 * Single object response JSON
	 */
	protected static class ObjectResponse<T> {
		public ObjectResponse(T obj) { this.object = obj; }
		public T object = null;
		public String error = null;
		public boolean success = true;
	}
	
	/**
	 * Handles 404 exceptions gracefully.
	 */
	@ExceptionHandler(NotFoundException.class)
	@ResponseBody
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ErrorResponse handleNotFoundException(Exception e) {
		return new ErrorResponse(e.getMessage());
	}
	
	/**
	 * Handles 401 exceptions gracefully.
	 */
	@ExceptionHandler(UnauthorizedException.class)
	@ResponseBody
	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	public ErrorResponse handleUnauthorizedException(Exception e) {
		return new ErrorResponse(e.getMessage());
	}
	
	/**
	 * Handles API query exceptions gracefully.
	 */
	@ExceptionHandler(APIQueryException.class)
	@ResponseBody
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ErrorResponse handleAPIException(Exception e) {
		return new ErrorResponse(e.getMessage());
	}
}
