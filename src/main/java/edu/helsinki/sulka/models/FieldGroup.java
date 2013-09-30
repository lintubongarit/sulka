package edu.helsinki.sulka.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class FieldGroup {
	private String name;
	
	private String description;
	
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
