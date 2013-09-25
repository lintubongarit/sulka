package edu.helsinki.sulka.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Ringer {
	public long id;
	
	public String lastname;
	public String firstname;
	public long permission;
		
	@JsonProperty("mobile-phone")
	public String mobilePhone;
	
	public String yearofbirth;
	public String email;
	
	public static class RingerAddress {
		public String street;
		public String postcode;
		public String city;
	}
	public RingerAddress address;
	
	public static class RingerPermit {
		public String codes;
		public String year;
		public String content;
	}
	public RingerPermit permit;
	
	/* Accessors */
	public String getLastName() {
		return this.lastname;
	}

	public String getFirstName() {
		return this.firstname;
	}
	
	public long getID() {
		return this.id;
	}
	
	public long getYearOfBirth() {
		return Long.parseLong(this.yearofbirth);
	}
}
