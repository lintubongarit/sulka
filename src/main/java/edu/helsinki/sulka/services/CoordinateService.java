package edu.helsinki.sulka.services;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonProperty;

import edu.helsinki.sulka.models.Coordinate;

@Service
public class CoordinateService {

	@Autowired
	@Qualifier("DevAPIConfiguration")
	private APIService apiService;
	
	private static class CoordinateResponse{
		@JsonProperty("conversion-response")
		Map<String, Coordinate> conversionResponse;	
	}
	
	private static long CACHE_TIME_COORDINATES = 1000 * 60 * 60; // 1 hour
	
	private APIService.ParametizedCachedData<Coordinate, CoordinateResponse> cachedCoordinateByCoordinateResponse = 
			new APIService.ParametizedCachedData<Coordinate, CoordinateResponse>(CACHE_TIME_COORDINATES) {
		
		@Override
		protected CoordinateResponse refresh(Coordinate coordinate) {
			return apiService
					.getRestTemplate()
					.getForObject(
							apiService.getURLForPath("/coordinate-conversion-service?lon={lon}&lat={lat}&type=wgs84&format=json"),
							CoordinateResponse.class,
							coordinate.getLon().toString(),
							coordinate.getLat().toString());
		}
	};
	
	/**
	 * Convert coordinate from WGS84 to uniform coordinate-system.
	 * @param coordinate Coordinate in WGS84-system to be converted.
	 * @return Converted coordinate in uniform-system.
	 */
	public Coordinate convertCoordinate(Coordinate coordinate){
		return cachedCoordinateByCoordinateResponse.get(coordinate).conversionResponse.get("uniform");
	}

}
