package edu.helsinki.sulka.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Validation {
	
	@JsonProperty("passes")
	private boolean passes;

	@JsonProperty("errors")
	private Error errors;
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class EventDate {
		
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
	
	@JsonProperty("eventDate")
	private EventDate[] eventDate;

	public boolean isPasses() {
		return passes;
	}

	public void setPasses(boolean passes) {
		this.passes = passes;
	}

	public Error getErrors() {
		return errors;
	}

	public void setErrors(Error errors) {
		this.errors = errors;
	}

	public EventDate[] getEventDate() {
		return eventDate;
	}

	public void setEventDate(EventDate[] eventDate) {
		this.eventDate = eventDate;
	}
	
	
}
