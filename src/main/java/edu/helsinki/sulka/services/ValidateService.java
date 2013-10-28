package edu.helsinki.sulka.services;

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

	public boolean validate(){
		return apiService.getRestTemplate()
				.getForObject(
						apiService.getURLForPath("/ringing/validate"),
						Validation.class).isPasses();
	}
}
