package edu.helsinki.sulka.services;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.helsinki.sulka.models.Row;
import edu.helsinki.sulka.models.Validation;
import edu.helsinki.sulka.models.Validation.Error;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})

@ActiveProfiles("dev")
public class ValidationServiceTest {
	
	@Autowired
	private Logger logger;
	
    @Autowired
    private ValidationService validationService;
    
    @Autowired
    private FieldsService fieldsService;
    
    private Row validRow;
    private Row invalidRow;
    
    @Before
    public void setup() throws JsonProcessingException, IOException {
    	ObjectMapper mapper = new ObjectMapper();
    	
    	String validDate = "27.6.2005";
		String validRowJson = "{\"nameRing\":\"B 0123469\",\"ring\":\"B 0123469\",\"lon\":\"33615\",\"eventDate\":\""
				+ validDate + "\",\"sex\":\"K\",\"species\":\"ACCNIS\",\"sexDeterminationMethod\":\"K\",\"municipality\":\"HAUHO\",\"weightInGrams\":\"112\",\"hour\":\"12\",\"wingLengthInMillimeters\":\"81\",\"type\":\"Rengastus\",\"id\":\"B 0123469\",\"clutchNumber\":\"2\",\"ringer\":\"846\",\"age\":\"PP\",\"coordinateType\":\"ykj\",\"lat\":\"67885\",\"ringEnd\":\"B 0123469\"}";
		
		Map<String, String> validValues = mapper.readValue(validRowJson, new TypeReference<Map<String,String>>() {});
		validRow = new Row(validValues, fieldsService.getAllFieldsByFieldName());
		
		String invalidDate = "57.6.2005";
		String invalidRowJson = "{\"nameRing\":\"B 0123469\",\"ring\":\"B 0123469\",\"lon\":\"33615\",\"eventDate\":\""
				+ invalidDate + "\",\"sex\":\"K\",\"species\":\"ACCNIS\",\"sexDeterminationMethod\":\"K\",\"municipality\":\"HAUHO\",\"weightInGrams\":\"112\",\"hour\":\"12\",\"wingLengthInMillimeters\":\"81\",\"type\":\"Rengastus\",\"id\":\"B 0123469\",\"clutchNumber\":\"2\",\"ringer\":\"846\",\"age\":\"PP\",\"coordinateType\":\"ykj\",\"lat\":\"67885\",\"ringEnd\":\"B 0123469\"}";
		Map<String, String> invalidValues = mapper.readValue(invalidRowJson, new TypeReference<Map<String,String>>() {});
		invalidRow = new Row(invalidValues, fieldsService.getAllFieldsByFieldName());
    }

	@Test
	public void testValidateServiceReturnsPassesIsTrueWithValidRow() throws JsonProcessingException {
		assertTrue("valid row is valid", validationService.validate(validRow).isValid());
	}
	
	@Test
	public void testValidateServiceReturnsPassesIsFalseWithInvalidRow() throws JsonProcessingException {
		Validation invalidValidation = validationService.validate(invalidRow);
		assertFalse("invalid row is invalid", invalidValidation.isValid());
		assertTrue("there are no errors for field 'nameRing'", invalidValidation.getErrorsForField("nameRing").length == 0);
		assertTrue("there are errors for 'eventDate'", invalidValidation.getErrorsForField("eventDate").length > 0);
		
		boolean foundInvalidDate = false;
		for (Error error : invalidValidation.getErrorsForField("eventDate")) {
			if (error.getErrorName().equals("invalid_date")) {
				foundInvalidDate = true;
				break;
			}
		}
		assertTrue("eventDate has error 'invalid_date'", foundInvalidDate);
	}

}
