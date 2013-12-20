package edu.helsinki.sulka.services;

import static org.junit.Assert.*;

import java.math.BigDecimal;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import edu.helsinki.sulka.models.Coordinate;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
@ActiveProfiles("dev")
public class CoordinateServiceTest {

	@Autowired
	private CoordinateService coordinateService;
	private Coordinate coordinate;
	private BigDecimal latitude;
	private BigDecimal longitude;
	
	private static final BigDecimal correctReturnedLatitude = new BigDecimal(6666639);
	private static final BigDecimal correctReturnedLongitude = new BigDecimal(3333331);
	private static final String correctAka = "ykj";
	
	@Before
	public void setUp(){
		coordinate = new Coordinate();
		latitude = new BigDecimal(60.077640218789);
		longitude = new BigDecimal(24.002369855155);
		coordinate.setLat(latitude);
		coordinate.setLon(longitude);
	}
	
	@Test
	public void testConvertCoordinatesReturnsSomething(){
		Coordinate converted = coordinateService.convertCoordinate(coordinate);
		assertNotNull(converted);
	}
	
	@Test
	public void testConvertCoordinatesReturnsCorrectLatitude(){
		Coordinate converted = coordinateService.convertCoordinate(coordinate);
		assertEquals(correctReturnedLatitude, converted.getLat());
	}
	
	@Test
	public void testConvertCoordinatesReturnsCorrectLongitude(){
		Coordinate converted = coordinateService.convertCoordinate(coordinate);
		assertEquals(correctReturnedLongitude, converted.getLon());
	}
	
	@Test
	public void testConvertCoordinatesReturnsCorrectAka(){
		Coordinate converted = coordinateService.convertCoordinate(coordinate);
		assertEquals(correctAka, converted.getAka());
	}
}
