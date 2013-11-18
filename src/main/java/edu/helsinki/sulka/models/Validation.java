package edu.helsinki.sulka.models;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Validation {
	
	@JsonProperty("errors")
	private Map<String, Error[]> errors;
	
	@JsonProperty("passes")
	private boolean valid;
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class Error {
		
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
		
		@Override
		public String toString() {
			return "Error " + getErrorName() + ": '" + getLocalizedErrorText() + "'";
		}
	}
	

	public boolean isValid() {
		return valid;
	}

	public void setValid(boolean valid) {
		this.valid = valid;
	}

	public Error[] getErrorsForField(String fieldName) {
		if (errors.containsKey(fieldName)) {
			return errors.get(fieldName);
		}
		return new Error[]{};
	}

	public Map<String, Error[]> getErrors() {
		return errors;
	}

	public void setErrors(Map<String, Error[]> errors) {
		this.errors = errors;
	}
}
