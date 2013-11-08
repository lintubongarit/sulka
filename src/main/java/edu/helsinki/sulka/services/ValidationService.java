package edu.helsinki.sulka.services;

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
		return apiService
				.getRestTemplate()
				.getForObject(
						apiService.getURLForPath("/ringing/validate?data=" + data),
						Validation.class,
						data);
	}
}
