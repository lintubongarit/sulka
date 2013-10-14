package edu.helsinki.sulka.services;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
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
		@JsonProperty("rows")
		private Map<String, String>[] rows;
		
		@JsonProperty("countOfRows")
		private long countOfRows;
		
		@JsonProperty("countOfRowsTotal")
		private long countOfRowsTotal;
		
		@JsonProperty("success")
		private boolean success;
		
		private static class ErrorDescription {
			@JsonProperty("localizedErrorText")
			private String localizedErrorText;
			
			@JsonProperty("errorName")
			private String errorName;
		}
		@JsonProperty("errors")
		private ErrorDescription[] errors;
		
		/*
		 * Accessors
		 */
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
			if (isSuccess() || errors == null) return null;
			String errorString = "";
			String delimiter = "";
			for (ErrorDescription ed : errors) {
				errorString += delimiter + ed.localizedErrorText;
				delimiter = ", ";
			}
			return errorString;
		}
	}
	
	public static class QueryException extends Exception {
		private static final long serialVersionUID = 1L;
		QueryException(String message) {
			super(message);
		}
	}
	
	private enum RowFilter {
		RINGINGS,
		RECOVERIES,
		ALL
	}
	
	/**
	 * Get all matching recovery and ringing rows from the API.
	 * @param ringerFilters List of ringers IDs to match, or null to return all.
	 * @param municipalityFilters List of municipality shorthand codes to match, or null to return all.
	 * @param speciesFilters List of bird species short hand codes to match, or null to return all.
	 * @param ringPrefixFilter A ring code prefix to match, or null to return all.
	 * @param startDate Beginning of the date interval.
	 * @param endDate End of the date interval. If this is null and startDate is not null, only return
	 * rows from startDate
	 * @param sortBy A sort to use, such as [ "ringStart", "date" ], or null to use default sort.
	 * @return list of rows
	 * @throws QueryException If the query was not successful (message describes the error)
	 */
	public List<Row> getRows(final long[] ringerFilters, final String[] municipalityFilters,
			final String[] speciesFilters, String ringPrefixFilter, LocalDate startDate, LocalDate endDate,
			final String[] sortBy)
			throws QueryException {
		return getRowsByType(RowFilter.ALL,
				ringerFilters, municipalityFilters, speciesFilters, ringPrefixFilter, startDate, endDate,
				sortBy);
	}
	
	/**
	 * Get all matching recovery rows from the API.
	 * @param ringerFilters List of ringers IDs to match, or null to return all.
	 * @param municipalityFilters List of municipality shorthand codes to match, or null to return all.
	 * @param speciesFilters List of bird species short hand codes to match, or null to return all.
	 * @param ringPrefixFilter A ring code prefix to match, or null to return all.
	 * @param startDate Beginning of the date interval.
	 * @param endDate End of the date interval. If this is null and startDate is not null, only return
	 * rows from startDate
	 * @param sortBy A sort to use, such as [ "ringStart", "date" ], or null to use default sort.
	 * @return list of rows
	 * @throws QueryException If the query was not successful (message describes the error)
	 */
	public List<Row> getRingings(final long[] ringerFilters, final String[] municipalityFilters,
			final String[] speciesFilters, String ringPrefixFilter, LocalDate startDate, LocalDate endDate,
			final String[] sortBy)
			throws QueryException {
		return getRowsByType(RowFilter.RINGINGS,
				ringerFilters, municipalityFilters, speciesFilters, ringPrefixFilter, startDate, endDate,
				sortBy);
	}
	
	
	/**
	 * Get all matching ringing rows from the API.
	 * @param ringerFilters List of ringers IDs to match, or null to return all.
	 * @param municipalityFilters List of municipality shorthand codes to match, or null to return all.
	 * @param speciesFilters List of bird species short hand codes to match, or null to return all.
	 * @param ringPrefixFilter A ring code prefix to match, or null to return all.
	 * @param startDate Beginning of the date interval.
	 * @param endDate End of the date interval. If this is null and startDate is not null, only return
	 * rows from startDate
	 * @param sortBy A sort to use, such as [ "ringStart", "date" ], or null to use default sort.
	 * @return list of rows
	 * @throws QueryException If the query was not successful (message describes the error)
	 */
	public List<Row> getRecoveries(final long[] ringerFilters, final String[] municipalityFilters,
			final String[] speciesFilters, String ringPrefixFilter, LocalDate startDate, LocalDate endDate,
			final String[] sortBy)
			throws QueryException {
		return getRowsByType(
				RowFilter.RECOVERIES,
				ringerFilters, municipalityFilters, speciesFilters, ringPrefixFilter, startDate, endDate,
				sortBy);
	}
	
	/**
	 * Get rows by query type from the API.
	 * @param ringerFilters List of ringers IDs to match, or null to return all.
	 * @param municipalityFilters List of municipality shorthand codes to match, or null to return all.
	 * @param speciesFilters List of bird species short hand codes to match, or null to return all.
	 * @param ringPrefixFilter A ring code prefix to match, or null to return all.
	 * @param startDate Beginning of the date interval.
	 * @param endDate End of the date interval. If this is null and startDate is not null, only return
	 * rows from startDate
	 * @param sortBy A sort to use, such as [ "ringStart", "date" ], or null to use default sort.
	 * @return list of rows
	 * @throws QueryException If the query was not successful (message describes the error)
	 */
	private List<Row> getRowsByType(RowFilter rowFilter, final long[] ringerFilters, final String[] municipalityFilters,
			final String[] speciesFilters, String ringPrefixFilter, LocalDate startDate, LocalDate endDate,
			final String[] sortBy)
			throws QueryException {
		Map<String, Field> fieldsByFieldName = fieldsService.getAllFieldsByFieldName();
		
		RowsResponse response = filterQuery(rowFilter,
				ringerFilters, municipalityFilters, speciesFilters, ringPrefixFilter, startDate, endDate, sortBy);
		if (!response.isSuccess()) {
			throw new QueryException(response.getError());
		}
		
		ArrayList<Row> rows = new ArrayList<Row>(response.rows.length);
		for (Map<String, String> rowValues : response.rows) {
			rows.add(new Row(rowValues, fieldsByFieldName));
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
	
	private final DateTimeFormatter API_DATE_FORMAT = DateTimeFormat.forPattern("dd.MM.YYYY");
	/**
	 * Query API for rows
	 * @param rowFilter Row type filter.
	 * @param ringerFilters List of ringers IDs to match, or null to return all.
	 * @param municipalityFilters List of municipality shorthand codes to match, or null to return all.
	 * @param speciesFilters List of bird species short hand codes to match, or null to return all.
	 * @param ringPrefixFilter A ring code prefix to match, or null to return all.
	 * @param startDate Beginning of the date interval.
	 * @param endDate End of the date interval. If this is null and startDate is not null, only return
	 * rows from startDate
	 * @param sortBy A sort to use, such as [ "ringStart", "date" ], or null to use default sort.
	 * @return API response to this query
	 */
	private RowsResponse filterQuery(RowFilter rowFilter,
			final long[] ringerFilters, final String[] municipalityFilters,
			final String[] speciesFilters, String ringPrefixFilter, LocalDate startDate, LocalDate endDate,
			final String[] sortBy) {
		String query = "";
		String nextParamSeparator = "";
		
		if (rowFilter != null) {
			if (rowFilter == RowFilter.RECOVERIES) {
				query += nextParamSeparator + "type=onlyRecoveries";
				nextParamSeparator = "&";
			}
			else if (rowFilter == RowFilter.RINGINGS) {
				query += nextParamSeparator + "type=onlyRingings";
				nextParamSeparator = "&";
			}
		}
		
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
		
		if (startDate != null && (endDate == null || !endDate.isBefore(startDate))) {
			query += nextParamSeparator + "eventDate=" + startDate.toString(API_DATE_FORMAT);
			if (endDate != null && endDate.isAfter(startDate)) {
				query += "/" + endDate.toString(API_DATE_FORMAT);
			}
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
