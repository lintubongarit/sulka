package edu.helsinki.sulka.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import edu.helsinki.sulka.models.Field;
import edu.helsinki.sulka.models.FieldGroup;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class FieldsServiceTest {
    @Autowired
    private FieldsService fieldsService;
    
    @Autowired
    private Logger logger;

    private final String HELSINKI_CODE = "HELSIN";
    
	@Test
	public void testGetAllFieldGroups() {
		FieldGroup[] fieldGroups = fieldsService.getAllFieldGroups();
		
		assertTrue("There is more than one field group", fieldGroups.length > 0);
		
		FieldGroup common = null;
		FieldGroup place = null;
		for (FieldGroup fg : fieldGroups) {
			if (fg.getName().equals("common")) {
				common = fg;
			}
			else if (fg.getName().equals("place")) {
				place = fg;
			}
		}
		assertNotNull("There is a field group called 'common'", common);
		assertNotNull("There is a field group called 'place'", place);
		
		Field ringer = null;
		for (Field f : common.getFields()) {
			if (f.getFieldName().equals("ringer")) {
				ringer = f;
				break;
			}
		}
		assertNotNull("The field group 'common' has field for 'ringer'", ringer);
		assertTrue("The field 'ringer' has type INTEGER", Field.FieldType.INTEGER == ringer.getType());
		
		Field municipality = null;
		for (Field f : place.getFields()) {
			if (f.getFieldName().equals("municipality")) {
				municipality = f;
				break;
			}
		}
		assertNotNull("The field group 'place' has field for 'municipality'", municipality);
		assertTrue("The field 'municipality' has type ENUMERATION", Field.FieldType.ENUMERATION == municipality.getType());
		
		Field.EnumerationValue[] municipalityValues = municipality.getEnumerationValues();
		Field.EnumerationValue helsinki = null;
		for (Field.EnumerationValue enumValue : municipalityValues) {
			if (enumValue.getValue().equals(HELSINKI_CODE)) {
				helsinki = enumValue;
				break;
			}
		}
		
		assertNotNull("The field 'municipality' has can have value " + HELSINKI_CODE + " (Helsinki)", helsinki);
		assertEquals("The value Helsinki has correct name as description", "HELSINKI", helsinki.getDescription().toUpperCase());
	}

}
