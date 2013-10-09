package edu.helsinki.sulka.models;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class Row extends HashMap<String, String> {
	private static final long serialVersionUID = 1L;

	/**
	 * Construct new Row with given fields and values.
	 * @param values Mapping from field names to field values.
	 * @param values Mapping from field names to Field objects.
	 */
	public Row(Map<String, String> values, Map<String, Field> fieldMapper) {
		super(values);
		fieldsByName = fieldMapper;
	}
	
	private Map<String, Field> fieldsByName;

	/* The class-wide JSON serializer */
	/*@JsonValue
	public Map<String, String> toJSON() {
		Map<String, String> json = new HashMap(fieldValues.size());
		for (Map.Entry<Field, String> entry : fieldValues.entrySet()) {
			json.put(entry.getKey().getFieldName(), entry.getValue());
		}
		return json;
	}*/
	
	/* Generic accessors */
	
	/**
	 * Get field value by Field object
	 * @param field Field
	 * @return Value of field in this row
	 */
	public String get(final Field field) {
		return super.get(field.getFieldName());
	}
	
	/**
	 * Set field value. Field is created if it does not exist already for this row.
	 * @param field Field
	 * @param value New value.
	 */
	public void put(final Field field, final String value) {
		super.put(field.getFieldName(), value);
	}
	
	/**
	 * @return get all fields defined for this row
	 */
	public Collection<Field> getAvailableFields() {
		return fieldsByName.values();
	}
	
	/**
	 * @return whether value for field has been defined for this row
	 */
	public boolean containsKey(final Field field) {
		return fieldsByName.containsKey(field.getFieldName());
	}
	
	/**
	 * @return Field object by field name that is defined for this row
	 */
	public Field getField(final String fieldName) {
		return fieldsByName.get(fieldName);
	}
	
	/* Specific accessors */
	
	/**
	 * @return ringer ID for the person who entered this row
	 */
	public long getRinger() {
		return Long.parseLong(super.get("ringer"));
	}
	
	/**
	 * @return shorthand name of the species
	 */
	public String getSpeciesCode() {
		return super.get("species");
	}
	
	/**
	 * @return full name of the species
	 */
	public String getSpeciesFullName() {
		return getField("species").getEnumerationDescription(super.get("species"));
	}
}
