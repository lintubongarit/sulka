package edu.helsinki.sulka.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class FieldGroup {
	@JsonProperty("name")
	private String name;
	
	@JsonProperty("description")
	private String description;
	
	@JsonProperty("fields")
	private List<Field> fields;
	
	public FieldGroup() {}
	
	public FieldGroup(String name, String description, List<Field> fields) {
		this.name = name;
		this.description = description;
		this.fields = fields;
	}
	
	/*
	 * Accessors
	 */
	public String getName() {
		return this.name;
	}
	
	public String getDescription() {
		return description;
	}
	
	public List<Field> getFields() {
		return fields;
	}
}
