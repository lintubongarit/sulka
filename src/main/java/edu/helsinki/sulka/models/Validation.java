package edu.helsinki.sulka.models;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Validation {
	
	@JsonProperty("errors")
	private Map<String, Error[]> errors;
	
	@JsonProperty("passes")
	private boolean passes;
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	private static class Error {
		
		@JsonProperty("localizedErrorText")
		private String localizedErrorText;
		
		@JsonProperty("errorName")
		private String errorName;

		public String getLocalizedErrorText() {
			return localizedErrorText;
		}

		public void setLocalizedErrorText(String localizedErrorText) {
			this.localizedErrorText = localizedErrorText;
		}

		public String getErrorName() {
			return errorName;
		}

		public void setErrorName(String errorName) {
			this.errorName = errorName;
		}
		
	}
	

	public boolean isPasses() {
		return passes;
	}

	public void setPasses(boolean passes) {
		this.passes = passes;
	}

	public Map<String, Error[]> getErrors() {
		return errors;
	}

	public void setErrors(Map<String, Error[]> errors) {
		this.errors = errors;
	}
	
	
}
