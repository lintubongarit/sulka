package edu.helsinki.sulka.controllers;

import java.math.BigDecimal;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.helsinki.sulka.controllers.JSONController.ObjectResponse;
import edu.helsinki.sulka.models.Coordinate;
import edu.helsinki.sulka.services.CoordinateService;

@Controller
public class CoordinateController {
	
	@Autowired
	private CoordinateService coordinateService;

	@RequestMapping(value = "/api/coordinate", method = RequestMethod.GET)
	@ResponseBody
	public ObjectResponse<Coordinate> convertCoordinates(
			HttpSession session,
			@RequestParam(value = "lat")BigDecimal lat,
			@RequestParam(value = "lon")BigDecimal lon){
		Coordinate toBeConverted = new Coordinate();
		toBeConverted.setLat(lat);
		toBeConverted.setLon(lon);
		
		return new ObjectResponse<Coordinate>(coordinateService.convertCoordinate(toBeConverted));
	}
}
