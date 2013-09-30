package edu.helsinki.sulka.services;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.helsinki.sulka.models.FieldGroup;

/**
 * Autowireable Service that should be used to retrieve information about ringing row fields.
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
}
