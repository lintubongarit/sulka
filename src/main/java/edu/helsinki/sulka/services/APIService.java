package edu.helsinki.sulka.services;

public abstract class APIService {
	private String password;
	private String userName;
	
	APIService(String userName, String password) {
		this.userName = userName;
		this.password = password;
	}
}
