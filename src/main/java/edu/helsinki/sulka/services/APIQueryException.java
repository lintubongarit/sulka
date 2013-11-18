package edu.helsinki.sulka.services;

public class APIQueryException extends Exception {
	private static final long serialVersionUID = 1L;
	APIQueryException(String message) {
		super(message);
	}
}
