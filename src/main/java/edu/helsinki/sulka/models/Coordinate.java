package edu.helsinki.sulka.models;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Coordinate {

	@JsonProperty("lon")
	private BigDecimal lon;
	@JsonProperty("lat")
	private BigDecimal lat;
	@JsonProperty("aka")
	private String aka;
	@JsonProperty("note")
	private String note;
	
	public Coordinate(){
		this.aka = "";
		this.note = "";
	}
	
	public BigDecimal getLon() {
		return lon;
	}
	public void setLon(BigDecimal lon) {
		this.lon = lon;
	}
	public BigDecimal getLat() {
		return lat;
	}
	public void setLat(BigDecimal lat) {
		this.lat = lat;
	}
	public String getAka(){
		return aka;
	}
	public void setAka(String aka){
		this.aka = aka;
	}
	public String getNote(){
		return note;
	}
	public void setNote(String note){
		this.note = note;
	}
		
	/*
	 * Hash implementation
	 */
	@Override
	public int hashCode() {
		return (this.getLon().toString()
				+ this.getLat().toString()
				+ this.getAka())
				.hashCode();
	}
	
	@Override
	public boolean equals(Object other) {
		if (other instanceof Coordinate) {
			return (this.getLat().equals(((Coordinate) other).getLat())) && 
					(this.getLon().equals(((Coordinate) other).getLon())) &&
					(this.getAka().equals(((Coordinate) other).getAka())) &&
					(this.getNote().equals(((Coordinate) other).getNote()));
		}
		return false;
	}
}
