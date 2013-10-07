package edu.helsinki.sulka.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.helsinki.sulka.models.Field;
import edu.helsinki.sulka.models.FieldGroup;

/**
 * Autowireable Service that should be used to retrieve meta information about ringing row fields from the API.
 */
@Service
public class FieldsService {
	@Autowired
	private Logger logger;
	
	@Autowired
	@Qualifier("StagingAPIConfiguration")
	private APIService apiService;
	
	private static class FieldGroupsResponse {
		@JsonProperty("groups")
		private FieldGroup[] groups;
	}
	
	/**
	 * @return all field groups from the API.
	 */
	public FieldGroup[] getAllFieldGroups() {
		return apiService
				.getRestTemplate()
				.getForObject(
						apiService.getURLForPath("/ringing/fields"),
						FieldGroupsResponse.class).groups;
	}
	
	/**
	 * @return all fields
	 */
	public Field[] getAllFields() {
		FieldGroup[] fieldGroups = getAllFieldGroups();
		int numOfFields = 0;
		for (FieldGroup fg : fieldGroups) {
			numOfFields += fg.getFields().length;
		}
		
		ArrayList<Field> allFields = new ArrayList<Field>(numOfFields);
		for (FieldGroup fg : fieldGroups) {
			allFields.addAll(Arrays.asList(fg.getFields()));
		}
		
		return allFields.toArray(new Field[numOfFields]);
	}
	
	/**
	 * @return all fields by field name
	 */
	public Map<String, Field> getAllFieldsByFieldName() {
		Field[] allFields = getAllFields();
		HashMap<String, Field> fieldsByFieldName = new HashMap<String, Field>(allFields.length);
		for (Field f : allFields) {
			fieldsByFieldName.put(f.getFieldName(), f);
		}
		
		return fieldsByFieldName;
	}
}
