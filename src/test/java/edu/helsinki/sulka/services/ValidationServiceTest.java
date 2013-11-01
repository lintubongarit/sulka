package edu.helsinki.sulka.services;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import edu.helsinki.sulka.models.Validation;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class ValidationServiceTest {
	
	@Autowired
	private Logger logger;
	
    @Autowired
    private ValidationService validateService;
    
    private Validation validRow;
    private Validation invalidRow;
    
    
    @Before
    public void setup() {
    	
    	String validDate = "27.6.2005";
    	
		String validRowString = "{\"nameRing\":\"B 0123469\",\"ring\":\"B 0123469\",\"lon\":\"33615\",\"eventDate\":\""
				+ validDate + "\",\"sex\":\"K\",\"species\":\"ACCNIS\",\"sexDeterminationMethod\":\"K\",\"municipality\":\"HAUHO\",\"weightInGrams\":\"112\",\"hour\":\"12\",\"wingLengthInMillimeters\":\"81\",\"type\":\"Rengastus\",\"id\":\"B 0123469\",\"clutchNumber\":\"2\",\"ringer\":\"846\",\"age\":\"PP\",\"coordinateType\":\"ykj\",\"lat\":\"67885\",\"ringEnd\":\"B 0123469\"}";
		validRow = validateService.validate(validRowString);
		
		String invalidDate = "57.6.2005";
		
		String invalidRowString = "{\"nameRing\":\"B 0123469\",\"ring\":\"B 0123469\",\"lon\":\"33615\",\"eventDate\":\""
				+ invalidDate + "\",\"sex\":\"K\",\"species\":\"ACCNIS\",\"sexDeterminationMethod\":\"K\",\"municipality\":\"HAUHO\",\"weightInGrams\":\"112\",\"hour\":\"12\",\"wingLengthInMillimeters\":\"81\",\"type\":\"Rengastus\",\"id\":\"B 0123469\",\"clutchNumber\":\"2\",\"ringer\":\"846\",\"age\":\"PP\",\"coordinateType\":\"ykj\",\"lat\":\"67885\",\"ringEnd\":\"B 0123469\"}";
		invalidRow = validateService.validate(invalidRowString);
    	
    }

	@Test
	public void testValidateServiceReturnsPassesIsTrueWithValidRow() {
		assertTrue("valid passes with valid row", validRow.isPasses());
	}
	
	@Test
	public void testValidateServiceReturnsPassesIsFalseWithInvalidRow() {
		assertFalse("invalid doesn't pass with invalid row", invalidRow.isPasses());
	}

}
