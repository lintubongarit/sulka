package edu.helsinki.sulka.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
	public void testGetAllFieldGroupsByViewMode() {
		List<FieldGroup> browingFieldGroups = fieldsService.getAllFieldGroups(Field.ViewMode.BROWSING);
		List<FieldGroup> ringingsFieldGroups = fieldsService.getAllFieldGroups(Field.ViewMode.RINGINGS);
		List<FieldGroup> allFieldGroups = Arrays.asList(fieldsService.getAllFieldGroups());
		
		List<List<FieldGroup>> fieldGroupsList = new ArrayList<List<FieldGroup>>();
		fieldGroupsList.add(browingFieldGroups);
		fieldGroupsList.add(ringingsFieldGroups);
		fieldGroupsList.add(allFieldGroups);
		
		for (List<FieldGroup> fieldGroups : fieldGroupsList) {
			assertFalse("There is more than one field group", fieldGroups.isEmpty());
			
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
			
			if (fieldGroups != ringingsFieldGroups) {
				Field ringer = null;
				for (Field f : common.getFields()) {
					if (f.getFieldName().equals("ringer")) {
						ringer = f;
						break;
					}
				}
				assertNotNull("The field group 'common' has field for 'ringer'", ringer);
				assertTrue("The field 'ringer' has type INTEGER", Field.FieldType.INTEGER == ringer.getType());
			}
			
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
	
	@Test
	public void testGetAllFields() {
		Set<Field> allFields = new HashSet<Field>(fieldsService.getAllFields());
		Set<Field> browsingFields = new HashSet<Field>(fieldsService.getAllFields(Field.ViewMode.BROWSING));
		Set<Field> ringingsFields = new HashSet<Field>(fieldsService.getAllFields(Field.ViewMode.RINGINGS));
		
		assertFalse("All fields is not empty", allFields.isEmpty());
		assertFalse("All browsing fields is not empty", browsingFields.isEmpty());
		assertFalse("All ringings fields is not empty", ringingsFields.isEmpty());
		
		assertTrue("Browsing fields is a subset of all fields", allFields.containsAll(browsingFields));
		assertTrue("Ringings fields is a subset of all fields", allFields.containsAll(ringingsFields));
		
		for (String fieldName : new String[]{"ringer", "municipality", "ring", "species"}) {
			boolean inBrowsing = false;
			
			for (Field f : browsingFields) {
				if (f.getFieldName().equals(fieldName)) {
					assertFalse("Field " + fieldName + " is only once in browsing fields", inBrowsing);
					inBrowsing = true;
				}
			}
			assertTrue("Field " + fieldName + " is found in browsing fields", inBrowsing);
		}
			
		for (String fieldName : new String[]{"municipality", "ring", "species"}) {
			boolean inRingings = false;
			
			for (Field f : ringingsFields) {
				if (f.getFieldName().equals(fieldName)) {
					assertFalse("Field " + fieldName + " is only once in ringings fields", inRingings);
					inRingings = true;
				}
			}
			assertTrue("Field " + fieldName + " is found in ringings fields", inRingings);
		}
	}
}
