package edu.helsinki.sulka.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
	
	private static long CACHE_TIME_GROUPS = 60*60*1000; // 1 hour
	private APIService.CachedData<FieldGroupsResponse> cachedGroupsResponse =
			new APIService.CachedData<FieldGroupsResponse>(CACHE_TIME_GROUPS) {
		@Override
		protected FieldGroupsResponse refresh() {
			FieldGroupsResponse resp = apiService
					.getRestTemplate()
					.getForObject(
							apiService.getURLForPath("/ringing/fields"),
							FieldGroupsResponse.class);
			return resp;
		}
	};
	
	/**
	 * @return all field groups from the API.
	 */
	public FieldGroup[] getAllFieldGroups() {
		return cachedGroupsResponse.get().groups;
	}
	
	private APIService.ParametizedCachedData<Field.ViewMode, List<FieldGroup>> cachedGroupsByViewModeResponse =
			new APIService.ParametizedCachedData<Field.ViewMode, List<FieldGroup>>(CACHE_TIME_GROUPS) {
		@Override
		protected List<FieldGroup> refresh(Field.ViewMode viewMode) {
			// Filter by viewMode, remove empty groups
			FieldGroup[] groups = getAllFieldGroups();
			ArrayList<FieldGroup> filteredGroups = new ArrayList<FieldGroup>(groups.length);
			for (FieldGroup fg : groups) {
				ArrayList<Field> filteredFields = new ArrayList<Field>(fg.getFields().size());
				for (Field f : fg.getFields()) {
					if (f.getViewModes().contains(viewMode)) {
						filteredFields.add(f);
					}
				}
				if (!filteredFields.isEmpty()) {
					filteredGroups.add(new FieldGroup(fg.getName(), fg.getDescription(), filteredFields));
				}
			}
			return filteredGroups;
		}
	};
	
	/**
	 * @param viewMode the view mode to filter displayed rows by.
	 * @return all field groups from the API for the view mode.
	 */
	public List<FieldGroup> getAllFieldGroups(Field.ViewMode viewMode) {
		return cachedGroupsByViewModeResponse.get(viewMode);
	}
	
	/**
	 * @return all fields from the API
	 */
	public List<Field> getAllFields() {
		FieldGroup[] fieldGroups = getAllFieldGroups();
		int numOfFields = 0;
		for (FieldGroup fg : fieldGroups) {
			numOfFields += fg.getFields().size();
		}
		
		ArrayList<Field> allFields = new ArrayList<Field>(numOfFields);
		for (FieldGroup fg : fieldGroups) {
			allFields.addAll(fg.getFields());
		}
		
		return allFields;
	}
	
	/**
	 * @param viewMode the view mode to filter displayed rows by.
	 * @return all fields from the API for the view mode.
	 */
	public List<Field> getAllFields(Field.ViewMode viewMode) {
		List<FieldGroup> fieldGroups = getAllFieldGroups(viewMode);
		int numOfFields = 0;
		for (FieldGroup fg : fieldGroups) {
			numOfFields += fg.getFields().size();
		}
		
		ArrayList<Field> allFields = new ArrayList<Field>(numOfFields);
		for (FieldGroup fg : fieldGroups) {
			allFields.addAll(fg.getFields());
		}
		
		return allFields;
	}
	
	private APIService.CachedData<Map<String, Field>> cachedFieldsByFieldNameValue =
			new APIService.CachedData<Map<String, Field>>(CACHE_TIME_GROUPS) {
		@Override
		protected Map<String, Field> refresh() {
			List<Field> allFields = getAllFields();
			HashMap<String, Field> fieldsByFieldName = new HashMap<String, Field>(allFields.size());
			for (Field f : allFields) {
				fieldsByFieldName.put(f.getFieldName(), f);
			}
			return fieldsByFieldName;
		}
	};
	
	/**
	 * @return all fields by field name
	 */
	public Map<String, Field> getAllFieldsByFieldName() {
		return cachedFieldsByFieldNameValue.get();
	}
}
