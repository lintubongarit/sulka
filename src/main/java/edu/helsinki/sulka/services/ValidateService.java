package edu.helsinki.sulka.services;

import java.net.URI;
import java.net.URISyntaxException;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.Validation;

@Service
public class ValidateService {
	
	@Autowired
	private Logger logger;
	
	@Autowired
	@Qualifier("StagingAPIConfiguration")
	private APIService apiService;

	public Validation validate(String data){
		System.out.println("here also");
		
		data = "data=" + data;
		
		URI url;
		
		try {
			url = new URI(apiService.getURLForPath("/ringing/validate/"));
			url = new URI(url.getScheme(), url.getUserInfo(), url.getHost(), url.getPort(), url.getPath(), data, url.getFragment());
			System.out.println(url);
		} catch (URISyntaxException e) {
			throw new Error(e);
		}
		
		System.out.println("passes:" + apiService.getRestTemplate()
				.getForObject(
						url,
						Validation.class).isPasses());
		
		return apiService.getRestTemplate()
				.getForObject(
						url,
						Validation.class);
	}
}
