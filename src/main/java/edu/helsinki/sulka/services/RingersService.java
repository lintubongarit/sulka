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
	
	private long CACHE_TIME_RINGERS = 60*60*1000;
	private APIService.CachedData<RingersResponse> cachedRingersResponse =
			new APIService.CachedData<RingersResponse>(CACHE_TIME_RINGERS) {
		@Override
		protected RingersResponse refresh() {
			return apiService
					.getRestTemplate()
					.getForObject(
							apiService.getURLForPath("/ringers?format=json"),
							RingersResponse.class);
		}
	};
	
	/**
	 * @return all ringers from the API.
	 */
	public Ringer[] getAllRingers() {
		return cachedRingersResponse.get().ringers.ringer;
	}
	
	private APIService.ParametizedCachedData<Long, RingerResponse> cachedRingerResponse =
			new APIService.ParametizedCachedData<Long, RingerResponse>(CACHE_TIME_RINGERS) {
		@Override
		protected RingerResponse refresh(Long ID) {
			return apiService
					.getRestTemplate()
					.getForObject(
							apiService.getURLForPath("/ringers/{id}?format=json"),
							RingerResponse.class,
							Long.toString(ID));
		}
	};
	
	/**
	 * @return ringer with ID from the API.
	 */
	public Ringer getRingerByID(long ID) {
		return cachedRingerResponse.get(ID).ringers.ringer;
	}
}
