package edu.helsinki.sulka.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Ringer {
	private long id;
	
	@JsonProperty("lastname")
	private String lastName;
	
	@JsonProperty("firstname")
	private String firstName;
	
	private long permission;
		
	@JsonProperty("mobile-phone")
	private String mobilePhone;
	
	@JsonProperty("yearofbirth")
	private String yearOfBirth;
	
	private String email;
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class RingerAddress {
		@JsonProperty("street")
		private String street;
		
		@JsonProperty("postcode")
		private String postcode;
		
		@JsonProperty("city")
		private String city;
	}
	private RingerAddress address;
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class RingerPermit {
		@JsonProperty("codes")
		private String codes;
		
		@JsonProperty("year")
		private String year;
		
		@JsonProperty("content")
		private String content;
	}
	private RingerPermit permit;
	
	/* Accessors */
	
	/**
	 * @return ringer ID (usually in the range [1-10000])
	 */
	public long getID() {
		return this.id;
	}
	
	/**
	 * @return ringer last name. Usually upper-case.
	 */
	public String getLastName() {
		return this.lastName;
	}

	/**
	 * @return ringer first name. Usually upper-case.
	 */
	public String getFirstName() {
		return this.firstName;
	}
	
	/**
	 * @return get ringer year of birth
	 */
	public long getYearOfBirth() {
		return Long.parseLong(this.yearOfBirth);
	}
}
