package edu.helsinki.sulka.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class User {
	
	@JsonProperty("login_id")
	private String login_id;
	
	@JsonProperty("expires_at")
	private long expires_at;
	
	@JsonProperty("email")
	private String email;
	
	@JsonProperty("name")
	private String name;
	
	@JsonProperty("auth_for")
	private String auth_for;
	
	@JsonProperty("type")
	private String type;
	
	@JsonProperty("error")
	private String error;
	
	@JsonProperty("pass")
	private boolean pass = true;
	
	/**
	 * 
	 * @return 0 if access is OK
	 * 		   1 if access expired
	 * 		   2 if auth variables are false
	 */
	public int accessStatus(){
		if (this.isPass() && this.getExpires_at() - System.currentTimeMillis() / 1000 >= 0)
			return 0;
		else if (this.isPass())
			return 1;
		else
			return 2;
	}
	
	@Override
	public String toString(){
		return login_id + " " + expires_at + " " + email + " " + name + " " + auth_for + " " + type + " " + error + " " + pass;
	}

	public String getLogin_id() {
		return login_id;
	}

	public void setLogin_id(String login_id) {
		this.login_id = login_id;
	}

	public long getExpires_at() {
		return expires_at;
	}

	public void setExpires_at(long expires_at) {
		this.expires_at = expires_at;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAuth_for() {
		return auth_for;
	}

	public void setAuth_for(String auth_for) {
		this.auth_for = auth_for;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public boolean isPass() {
		return pass;
	}

	public void setPass(boolean pass) {
		this.pass = pass;
	}
	
	private final int refreshIncrementInMinutes = 10;

	public void refreshSession() {
		setExpires_at(System.currentTimeMillis() / 1000 + refreshIncrementInMinutes * 60);
	}
	
	public long getRingerId() {
		if (getLogin_id() != null) {
			try {
				return Long.parseLong(getLogin_id());
			}
			catch (NumberFormatException e) {
				return -1;
			}
		}
		return -1;
	}
	
	private long[] ringerIdArray = null;
	public long[] getRingerIdAsArray() {
		if (ringerIdArray == null) {
			ringerIdArray = new long[]{ getRingerId() };
		}
		return ringerIdArray;
	}
}
