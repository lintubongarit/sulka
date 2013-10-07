package edu.helsinki.sulka.models;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonValue;

public class Row {
	/**
	 * Construct new empty Row
	 */
	public Row() {
		this(0);
	}
	
	/**
	 * Construct new Row with estimated number of fields.
	 * @param numOfFields
	 */
	public Row(int numOfFields) {
		fieldValues = new HashMap<Field, String>(numOfFields);
		fieldsByName = new HashMap<String, Field>(numOfFields);
	}
	
	private Map<Field, String> fieldValues;
	private Map<String, Field> fieldsByName;

	/* The class-wide JSON serializer */
	@JsonValue
	public Map<String, String> toJSON() {
		Map<String, String> json = new HashMap(fieldValues.size());
		for (Map.Entry<Field, String> entry : fieldValues.entrySet()) {
			json.put(entry.getKey().getFieldName(), entry.getValue());
		}
		return json;
	}
	
	/* Generic accessors */
	
	/**
	 * Get field value by Field object
	 * @param field Field
	 * @return Value of field in this row
	 */
	public String getFieldValue(final Field field) {
		return fieldValues.get(field);
	}
	
	/**
	 * Get field value by field name
	 * @param field Field name
	 * @return Field value in this row
	 */
	public String getFieldValue(final String field) {
		return fieldValues.get(fieldsByName.get(field));
	}
	
	/**
	 * Set field value. Field is created if it does not exist already for this row.
	 * @param field Field
	 * @param value New value.
	 */
	public void setFieldValue(final Field field, final String value) {
		fieldsByName.put(field.getFieldName(), field);
		fieldValues.put(field, value);
	}
	
	/**
	 * @return get all fields defined for this row
	 */
	public Set<Field> getAvailableFields() {
		return fieldValues.keySet();
	}
	
	/**
	 * @return whether value for field has been defined for this row
	 */
	public boolean hasField(final Field field) {
		return fieldValues.containsKey(field);
	}
	
	/**
	 * @return whether value for field has been defined for this row
	 */
	public boolean hasField(final String field) {
		return fieldValues.containsKey(fieldsByName.get(field));
	}
	
	/**
	 * @return Field object by field name that is defined for this row
	 */
	public Field getFieldMetaInfo(final String fieldName) {
		return this.fieldsByName.get(fieldName);
	}
	
	/* Specific accessors */
	
	/**
	 * @return ringer ID for the person who entered this row
	 */
	public long getRinger() {
		return Long.parseLong(getFieldValue("person"));
	}
	
	/**
	 * @return shorthand name of the species
	 */
	public String getSpeciesCode() {
		return getFieldValue("species");
	}
	
	/**
	 * @return full name of the species
	 */
	public String getSpeciesFullName() {
		return getFieldMetaInfo("species").getEnumerationDescription(getFieldValue("species"));
	}
}
