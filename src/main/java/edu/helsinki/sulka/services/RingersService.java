package edu.helsinki.sulka.services;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.Ringer;

@Service
public class RingersService {
	@Autowired
	private Logger logger;
	
	@Autowired
	@Qualifier("APIConfiguration")
	APIService apiService;
	
	private static class RingersResponse {
		private static class RingersResponseLevel2 {
			public Ringer[] ringer;
		}
		
		public RingersResponseLevel2 ringers;
	}
	
	public Ringer[] getRingers() {
		return apiService.getRestTemplate().getForObject(apiService.getURIForPath("/ringers"), RingersResponse.class).ringers.ringer;
	}
}
