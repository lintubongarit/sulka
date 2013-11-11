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
	@JsonProperty("userId")
	@Column(name = "userId")
	private String userId;
	@JsonProperty("columns")
	@Column(name = "columns")
	private String columns;
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getColumns() {
		return columns;
	}
	public void setColumns(String columns) {
		this.columns = columns;
	}
}
