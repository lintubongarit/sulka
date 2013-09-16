package edu.helsinki.sulka;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Species {
	
	private String id;
	private Name[] name;
	private String euringCode;
	private String protectionStatus;
	
	public String getId(){
		return id;
	}
	
	public void setId(String id){
		this.id= id;
	}
	
	public Name[] getName(){
		return name;
	}
	
	public void setName(Name[] name){
		this.name = name;
	}
	
	public String getEuringCode(){
		return euringCode;
	}
	
	public void setEuringCode(String euringCode){
		this.euringCode= euringCode;
	}
	
	public String getProtectionStatus(){
		return protectionStatus;
	}
	
	public void setProtectionStatus(String protectionStatus){
		this.protectionStatus= protectionStatus;
	}
	
	
}
