package edu.helsinki.sulka.services;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.Ringer;

/**
 * Autowireable Service that should be used to retrieve information about ringers.
 */
@Service
public class RingersService {
	@Autowired
	private Logger logger;
	
	@Autowired
	@Qualifier("DevAPIConfiguration")
	private APIService apiService;
	
	private static class RingersResponse {
		private static class RingersResponseLevel2 {
			public Ringer[] ringer;
		}
		
		public RingersResponseLevel2 ringers;
	}
	
	private static class RingerResponse {
		private static class RingerResponseLevel2 {
			public Ringer ringer;
		}
		
		public RingerResponseLevel2 ringers;
	}
	
	/**
	 * @return all ringers from the API.
	 */
	public Ringer[] getAllRingers() {
		return apiService
				.getRestTemplate()
				.getForObject(
						apiService.getURLForPath("/ringers?format=json"),
						RingersResponse.class).ringers.ringer;
	}
	
	/**
	 * @return ringer with ID from the API.
	 */
	public Ringer getRingerByID(long ID) {
		return apiService
				.getRestTemplate()
				.getForObject(
						apiService.getURLForPath("/ringers/{id}?format=json"),
						RingerResponse.class,
						Long.toString(ID)).ringers.ringer;
	}
}
