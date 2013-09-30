package edu.helsinki.sulka.services;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Service
public class LintuvaaraAuthDecryptService {
	
	@Autowired
	private Logger logger;
	
	@Autowired
	@Qualifier("DevAPIConfiguration")
	APIService apiService;
	
	@JsonIgnoreProperties(ignoreUnknown=true)
	private static class LintuvaaraAuthDecryptResponse {
		@JsonIgnoreProperties(ignoreUnknown=true)
		private static class LintuvaaraAuthDecryptResponseLevel2 {
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
			
			public String toString(){
				return login_id + " " + expires_at + " " + email + " " + name + " " + auth_for + " " + type + " " + error + " " + pass;
			}
			
		}
		@JsonProperty("login")
		public LintuvaaraAuthDecryptResponseLevel2 login;
	}
	
	public String auth(String key, String iv, String data){
		return apiService
				.getRestTemplate()
				.getForObject(
						apiService.getURLForPath("/lintuvaara-authentication-decryptor?key={key}&iv={iv}&data={data}&format=json"),
						LintuvaaraAuthDecryptResponse.class,
						key, iv, data).login.toString();
	}

}
