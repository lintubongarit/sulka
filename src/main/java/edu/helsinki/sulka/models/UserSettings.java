package edu.helsinki.sulka.models;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=false)
@Entity
@Table(name="User_Settings")
public class UserSettings implements Serializable{
	
	private static final long serialVersionUID = -8338155036854013157L;

	@Id
	@JsonProperty("userId_viewMode")
	@Column(name = "userId_viewMode")
	private String userId_viewMode;
	@JsonProperty("columns")
	@Column(name = "columns", length = 3000)
	private String columns;
	@JsonProperty("filters")
	@Column(name = "filters")
	private String filters;

	public String getUserId() {
		return userId_viewMode;
	}
	public void setUserId(String userId) {
		this.userId_viewMode = userId;
	}
	public String getColumns() {
		return columns;
	}
	public void setColumns(String columns) {
		this.columns = columns;
	}
	public String getFilters() {
		return filters;
	}
	public void setFilters(String filters) {
		this.filters = filters;
	}
}
