package edu.helsinki.sulka.services;

import org.slf4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import edu.helsinki.sulka.models.User;

/**
 * Autowireable Service that should be used to decrypt and authenticate login information from Lintuvaara
 */
@Service
public class LintuvaaraAuthDecryptService {
	
	@Autowired
	private Logger logger;
	
	@Autowired
	@Qualifier("DevAPIConfiguration")
	APIService apiService;
	
	private static class LintuvaaraAuthDecryptResponse {
		@JsonProperty("login")
		public User user;
	}
	
	/**
	 * @return is true if login was successful
	 */
	public boolean auth(String key, String iv, String data){
		return apiService
				.getRestTemplate()
				.getForObject(
						apiService.getURLForPath("/lintuvaara-authentication-decryptor?key={key}&iv={iv}&data={data}&format=json"),
						LintuvaaraAuthDecryptResponse.class,
						key, iv, data).user.isPass();
	}

}