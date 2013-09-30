package edu.helsinki.sulka.services;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	private static class RowsResponse {
		@JsonProperty("values")
		private String[][] values;
		
		@JsonProperty("fields")
		private String[] fields;
		
		@JsonProperty("countOfValueRows")
		private long countOfValueRows;
		
		@JsonProperty("countOfValueRowsTotal")
		private long countOfValueRowsTotal;
		
		@JsonProperty("page")
		private long page;
		
		@JsonProperty("pageSize")
		private long pageSize;
		
		@JsonProperty("success")
		private boolean success;
		
		@JsonProperty("error")
		private String error;
		
		/*
		 * Accessors
		 */
		private List<Field> mappedFields = null;
		/**
		 * @param mapper A Map that contains fields by their respective names (i.e. obtained from fieldsService.getAllFieldsByFieldName())
		 * @return Cached ordered list of fields in this response.
		 */
		public List<Field> getMappedFields(final Map<String, Field> mapper) {
			if (this.mappedFields != null) {
				return this.mappedFields;
			}
			
			ArrayList<Field> mappedFields = new ArrayList<Field>(fields.length);
			for (String fieldString : fields) {
				mappedFields.add(mapper.get(fieldString));
			}
			return this.mappedFields = mappedFields;
		}
		
		/**
		 * @return If this query was successful.
		 */
		public boolean isSuccess() {
			return success;
		}
		
		/**
		 * @return Error message
		 */
		public String getError() {
			return error;
		}
		
		/**
		 * @return Number of all matching rows across all pages.
		 */
		public long getNumberOfAllRows() {
			return countOfValueRowsTotal;
		}
		
		/**
		 * @return Page size.
		 */
		public long getPageSize() {
			return pageSize;
		}
	}
	
	public static class QueryException extends Exception {
		private static final long serialVersionUID = 1L;
		QueryException(final String message) {
			super(message);
		}
	}
	
	/**
	 * Get all matching rows from the API.
	 * @param ringerFilters List of ringers IDs to match, or null to return all.
	 * @param municipalityFilters List of municipality shorthand codes to match, or null to return all.
	 * @param speciesFilters List of bird species short hand codes to match, or null to return all.
	 * @param ringPrefixFilter A ring code prefix to match, or null to return all.
	 * @param sortBy A sort to use, such as [ "ringStart", "date" ], or null to use default sort.
	 * @return list of row
	 * @throws QueryException If the query was not successful (message describes the error)
	 */
	public List<Row> getAllRows(final long[] ringerFilters, final String[] municipalityFilters,
			final String[] speciesFilters, final String ringPrefixFilter, final String[] sortBy)
			throws QueryException {
		Map<String, Field> fieldsByFieldName = fieldsService.getAllFieldsByFieldName();
		
		int page = 0;
		RowsResponse response = filterQuery(ringerFilters, municipalityFilters, speciesFilters, ringPrefixFilter, sortBy, 0, page);
		if (!response.isSuccess()) {
			throw new QueryException(response.getError());
		}
		
		ArrayList<Row> rows = new ArrayList<Row>((int) response.getNumberOfAllRows());
		while (true) {
			for (String[] rowValues : response.values) {
				Row row = new Row(rowValues.length);
				for (int i=0; i<rowValues.length; i++) {
					row.setFieldValue(response.getMappedFields(fieldsByFieldName).get(i), rowValues[i]);
				}
				rows.add(row);
			}
			
			// Check if another query is needed to get more pages
			if (response.values.length == response.getPageSize() && response.getPageSize() * (page+1) < response.getNumberOfAllRows()) {
				response = filterQuery(ringerFilters, municipalityFilters, speciesFilters, ringPrefixFilter, sortBy, 0, ++page);
				if (!response.isSuccess()) {
					throw new QueryException(response.getError());
				}
			} else {
				break;
			}
		}
		
		return rows;
	}
	/**
	 * Get up to pageSize matching rows with page offset from the API.
	 * @param ringerFilters List of ringers IDs to match, or null to return all.
	 * @param municipalityFilters List of municipality shorthand codes to match, or null to return all.
	 * @param speciesFilters List of bird species short hand codes to match, or null to return all.
	 * @param ringPrefixFilter A ring code prefix to match, or null to return all.
	 * @param sortBy A sort to use, such as [ "ringStart", "date" ], or null to use default sort.
	 * @param pageSize Maximum number of results to return, or non-positive to use default.
	 * @param page Page offset, or non-positive to return the first page.
	 * @return list of rows
	 * @throws QueryException If the query was not successful (message describes the error)
	 */
	public List<Row> getRows(final long[] ringerFilters, final String[] municipalityFilters,
			final String[] speciesFilters, final String ringPrefixFilter, final String[] sortBy,
			final int pageSize, final int page)
			throws QueryException {
		Map<String, Field> fieldsByFieldName = fieldsService.getAllFieldsByFieldName();
		
		RowsResponse response = filterQuery(ringerFilters, municipalityFilters, speciesFilters, ringPrefixFilter, sortBy, pageSize, page);
		if (!response.isSuccess()) {
			throw new QueryException(response.getError());
		}
		
		ArrayList<Row> rows = new ArrayList<Row>(response.values.length);
		for (String[] rowValues : response.values) {
			Row row = new Row(rowValues.length);
			for (int i=0; i<rowValues.length; i++) {
				row.setFieldValue(response.getMappedFields(fieldsByFieldName).get(i), rowValues[i]);
			}
			rows.add(row);
		}
		
		return rows;
	}

	/**
	 * Returns a per-item URI-escaped String array joined by a character.
	 * @param items Strings in non-escaped form.
	 * @param separator Separator to use, such as ','
	 * @return Items joined by separator and URI escaped (e.g. "item%20one,item%20two,item%20three")
	 */
	private static String URIStringJoin(final String[] items, char separator) {
		String result = "";
		if (items == null) {
			return result;
		}
		
		boolean first = true;
		for (String item : items) {
			if (first) {
				result += item;
				first = false;
			} else {
				result += separator + item;
			}
		}
		return result;
	}
	
	/**
	 * Returns a per-item URI-escaped String array joined by a character.
	 * @param items Strings in non-escaped form.
	 * @param separator Separator to use, such as ','
	 * @return Items joined by separator and URI escaped (e.g. "item%20one,item%20two,item%20three")
	 */
	private static String longJoin(final long[] items, char separator) {
		String result = "";
		if (items == null) {
			return result;
		}
		
		boolean first = true;
		for (long item : items) {
			if (first) {
				result += Long.toString(item);
				first = false;
			} else {
				result += separator + Long.toString(item);
			}
		}
		return result;
	}
	
	/**
	 * Query API for rows
	 * @param ringerFilters List of ringers IDs to match, or null to return all.
	 * @param municipalityFilters List of municipality shorthand codes to match, or null to return all.
	 * @param speciesFilters List of bird species short hand codes to match, or null to return all.
	 * @param ringPrefixFilter A ring code prefix to match, or null to return all.
	 * @param sortBy A sort to use, such as [ "ringStart", "date" ], or null to use default sort.
	 * @param pageSize Maximum number of results to return, or non-positive to use default.
	 * @param page Page offset, or non-positive to return the first page.
	 * @return API response to this query
	 */
	private RowsResponse filterQuery(final long[] ringerFilters, final String[] municipalityFilters,
			final String[] speciesFilters, final String ringPrefixFilter, final String[] sortBy,
			final int pageSize, final int page) {
		String query = "";
		String nextParamSeparator = "";
		
		if (ringerFilters != null) {
			query += nextParamSeparator + "ringer=" + longJoin(ringerFilters, ',');
			nextParamSeparator = "&";
		}
		
		if (municipalityFilters != null) {
			query += nextParamSeparator + "municipality=" + URIStringJoin(municipalityFilters, ',');
			nextParamSeparator = "&";
		}
		
		if (speciesFilters != null) {
			query += nextParamSeparator + "species=" + URIStringJoin(speciesFilters, ',');
			nextParamSeparator = "&";
		}
		
		if (ringPrefixFilter != null) {
			try {
				query += nextParamSeparator + "ring=" + URLEncoder.encode(ringPrefixFilter, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				throw new Error(e);
			}
			nextParamSeparator = "&";
		}
		
		if (sortBy != null) {
			query += nextParamSeparator + "sortBy=" + URIStringJoin(sortBy, ',');
			nextParamSeparator = "&";
		}
		
		if (pageSize > 0) {
			query += nextParamSeparator + "pageSize=" + Integer.toString(pageSize);
			nextParamSeparator = "&";
		}
		
		if (page > 1) {
			query += nextParamSeparator + "page=" + Integer.toString(page);
			nextParamSeparator = "&";
		}
		
		URI url;
		try {
			url = new URI(apiService.getURLForPath("/ringing/rows"));
			url = new URI(url.getScheme(), url.getUserInfo(), url.getHost(), url.getPort(), url.getPath(), query, url.getFragment());
		} catch (URISyntaxException e) {
			throw new Error(e);
		}
		
		return apiService
				.getRestTemplate()
				.getForObject(url, RowsResponse.class);
	}
}
