package edu.helsinki.sulka;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Name {
	private String content;
	private String lang;
	
	public void setContent(String content){
		this.content = content;
	}
	
	public String getContent(){
		return content;
	}
	
	public void setLang(String lang){
		this.lang = lang;
	}
	
	public String getLang(){
		return lang;
	}
}
