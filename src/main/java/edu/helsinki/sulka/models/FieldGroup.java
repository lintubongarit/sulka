package edu.helsinki.sulka.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class FieldGroup {
	@JsonProperty("name")
	private String name;
	
	@JsonProperty("description")
	private String description;
	
	@JsonProperty("fields")
	private Field[] fields;
	
	/*
	 * Accessors
	 */
	public String getName() {
		return this.name;
	}
	
	public String getDescription() {
		return description;
	}
	
	public Field[] getFields() {
		return fields;
	}
}
