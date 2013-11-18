package edu.helsinki.sulka.configurations;

public class SSOLoginPageURLConfiguration {
	public SSOLoginPageURLConfiguration(String URL) { this.URL = URL; }
	
	private String URL = "http://cs.helsinki.fi/";
	public String getURL() {
		return this.URL;
	}
}
