package edu.helsinki.sulka.services;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.Municipality;

/**
 * Autowireable Service that should be used to retrieve information about municipalities.
 */
@Service
public class MunicipalitiesService {
	@Autowired
	private Logger logger;
	
	@Autowired
	@Qualifier("DevAPIConfiguration")
	private APIService apiService;
	
	private static class MunicipalitiesResponse {
		private static class MunicipalitiesResponseLevel2 {
			public Municipality[] municipality;
		}
		
		public MunicipalitiesResponseLevel2 municipalities;
	}
	
	private static class MunicipalityResponse {
		private static class MunicipalityResponseLevel2 {
			public Municipality municipality;
		}
		
		public MunicipalityResponseLevel2 municipalities;
	}
	
	/**
	 * @return all municipalities from the API.
	 */
	public Municipality[] getAllMunicipalities() {
		return apiService
				.getRestTemplate()
				.getForObject(
						apiService.getURLForPath("/municipalities?format=json"),
						MunicipalitiesResponse.class).municipalities.municipality;
	}
	
	/**
	 * @return municipality with ID code from the API.
	 */
	public Municipality getMunicipalityByID(String ID) {
		return apiService
				.getRestTemplate()
				.getForObject(
						apiService.getURLForPath("/municipalities/{id}?format=json"),
						MunicipalityResponse.class,
						ID).municipalities.municipality;
	}

}
