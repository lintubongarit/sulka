package edu.helsinki.sulka.services;

import java.util.ArrayList;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.helsinki.sulka.models.Field;
import edu.helsinki.sulka.models.Row;

/**
 * Autowireable Service that should be used to retrieve ringing and control rows from the API.
 */
@Service
public class RowsService {
	@Autowired
	private Logger logger;
	
	@Autowired
	@Qualifier("StagingAPIConfiguration")
	private APIService apiService;
	
	@Autowired
	FieldsService fieldsService;
	
	private static class RowsResponse {
		@JsonProperty("values")
		private String[][] values;
		
		@JsonProperty("fields")
		private String[] fields;
		
		private long countOfValueRows;
		
		private long countOfValueRowsTotal;
		
		private long page;
		
		private long pageSize;
		
		private boolean success;
		
		/*
		 * Accessors
		 */
		private Field[] mappedFields = null;
		public Field[] getMappedFields(final Map<String, Field> mapper) {
			if (this.mappedFields != null) {
				return this.mappedFields;
			}
			
			ArrayList<Field> mappedFields = new ArrayList<Field>(fields.length);
			for (String fieldString : fields) {
				mappedFields.add(mapper.get(fieldString));
			}
			return this.mappedFields = mappedFields.toArray(new Field[mappedFields.size()]);
		}
	}
	
	public Row[] getRows(long[] ringerFilters, String[] municipalityFilters, String[] speciesFilters, String ringPrefixFilter) {
		String url = apiService.getURLForPath("/ringing/rows");
		Map<String, Field> fieldsByFieldName = fieldsService.getAllFieldsByFieldName();
		
		return apiService
				.getRestTemplate()
				.getForObject(
						apiService.getURLForPath("/municipalities?format=json"),
						RowsResponse.class);
		return new Row[0];
	}
}
