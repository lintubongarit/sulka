package edu.helsinki.sulka.services;

import java.net.URI;
import java.net.URISyntaxException;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.Validation;


/**
 * Autowireable Service that should be used to check if row's information is valid.
 */
@Service
public class ValidationService {

	@Autowired
	private Logger logger;

	@Autowired
	@Qualifier("StagingAPIConfiguration")
	private APIService apiService;

	/*
	 * @returns Validation object that contains information of row's validity.
	 */
	public Validation validate(String data) {
		
		data = "data=" + data;

		URI url;

		try {
			url = new URI(apiService.getURLForPath("/ringing/validate/"));
			url = new URI(url.getScheme(), url.getUserInfo(), url.getHost(),
					url.getPort(), url.getPath(), data, url.getFragment());
			System.out.println("URL WAS: " + url);
		} catch (URISyntaxException e) {
			throw new Error(e);
		}
		
		return apiService.getRestTemplate().getForObject(url, Validation.class);
	}
}
