package edu.helsinki.sulka.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Municipality {
	private String id;
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class ElyCentre {
		@JsonProperty("name")
		private String name;
	}
	@JsonProperty("ely-centre")
	private ElyCentre elyCentre;
	
	@JsonProperty("centerpoint-lat")
	private double centerpointLat;
	
	@JsonProperty("centerpoint-lon")
	private double centerpointLon;
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class OldCounty {
		@JsonProperty("name")
		private String name;
	}
	@JsonProperty("old-county")
	private OldCounty oldCounty;
	
	@JsonProperty("joined-to")
	private String joinedTo;
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class Name {
		@JsonProperty("content")
		private String content;
		
		@JsonProperty("lang")
		private String languageCode;
	}
	@JsonProperty("name")
	private Name[] names;
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	public static class Province {
		public String name;
	}
	private Province province;
	
	private double radius;
	
	@JsonProperty("merikotka-suuralue")
	private String haliaeetusAlbicillRegion;
	
	/* Accessors */
	/**
	 * @return municipality ID (short string code of upper-case letters, mostly 4-6 letters long)
	 */
	public String getID() {
		return this.id;
	}
	
	/**
	 * Returns municipality's name in given language
	 * @param languageCode either "FI" or "SV" (Finnish or Swedish)
	 * @return municipality's name in the language requested, or null if municipality does not define a name in that language.
	 */
	public String getName(final String languageCode) {
		for (Name curName : this.names) {
			if (languageCode.equals(curName.languageCode)) {
				return curName.content;
			}
		}
		return null;
	}
	
	/**
	 * @return municipality's hit calculation radius
	 */
	public double getRadius() {
		return this.radius;
	}
	
	/**
	 * @return municipality's ELY centre's name, or null if not defined
	 */
	public String getElyCentreName() {
		if (this.elyCentre != null) {
			return this.elyCentre.name;
		}
		return null;
	}
	
	/**
	 * @return municipality's old county's name, or null if not defined
	 */
	public String getOldCountyName() {
		if (this.oldCounty != null) {
			return this.oldCounty.name;
		}
		return null;
	}
}
