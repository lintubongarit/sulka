package edu.helsinki.sulka.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Field {
	@JsonProperty("field")
	private String fieldName;
	
	private String name;
	
	private String description;
	
	public static enum FieldType {
		VARCHAR,
		INTEGER,
		DECIMAL,
		DATE,
		ENUMERATION
	}
	@JsonProperty("type")
	private FieldType type;

	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class EnumerationValue {
		private String description;
		
		private String value;
		
		/*
		 * Accessors
		 */
		public String getDescription() {
			return description;
		}
		
		public String getValue() {
			return value;
		}
	}
	private EnumerationValue[] enumerationValues;
	
	/*
	 * Accessors
	 */
	public String getFieldName() {
		return this.fieldName;
	}
	
	public String getName() {
		return this.name;
	}
	
	public String getDescription() {
		return this.description;
	}
	
	public FieldType getType() {
		return type;
	}
	
	public EnumerationValue[] getEnumerationValues() {
		return enumerationValues;
	}
}
