package edu.helsinki.sulka.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import edu.helsinki.sulka.models.Field;
import edu.helsinki.sulka.models.Row;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class RowsServiceTest {
	@Autowired
	private Logger logger;
	
    @Autowired
    private RowsService rowsService;

    @Autowired
    private FieldsService fieldsService;

    private final long LOKKI_ID = 846;
    private final String KANAHAUKKA = "ACCGEN";
    
	@Test
	public void testGetAllRows() throws Exception {
		List<Row> getRows = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, null, null, 0, 0);
		List<Row> getAllRows = rowsService.getAllRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, null, null);
		assertEquals("getRows and getAllRows outputs have the same amount of rows", getRows.size(), getAllRows.size());
		
		for (int i=0; i<getRows.size(); i++) {
			Row r1 = getRows.get(i);
			Row r2 = getAllRows.get(i);
			assertEquals("getRows and getAllRows output rows have the same amount of fields", r1.getAvailableFields().size(), r2.getAvailableFields().size());
			for (Field f : r1.getAvailableFields()) {
				assertTrue("getRows and getAllRows outputs have the same rows", r1.hasField(f));
				assertTrue("getRows and getAllRows outputs have the same rows", r1.hasField(f.getFieldName()));
				assertTrue("getRows and getAllRows outputs have the same rows", r2.hasField(f));
				assertTrue("getRows and getAllRows outputs have the same rows", r2.hasField(f.getFieldName()));
				assertEquals("getRows and getAllRows outputs are equal", r1.getFieldValue(f), r2.getFieldValue(f));
				assertEquals("getRows and getAllRows outputs are equal", r1.getFieldValue(f.getFieldName()), r2.getFieldValue(f));
				assertEquals("getRows and getAllRows outputs are equal", r1.getFieldValue(f), r2.getFieldValue(f.getFieldName()));
				assertEquals("getRows and getAllRows outputs are equal", r1.getFieldValue(f.getFieldName()), r2.getFieldValue(f.getFieldName()));
			}
		}
	}
    
    private final String LOKKI_ESPOO_ACCGEN_RING_PREFIX_SUBSET = "D 027135";
	@Test
	public void testGetRows() throws Exception {
		Map<String, Field> allFields = fieldsService.getAllFieldsByFieldName();
		
		List<Row> res = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, null, null, 0, 0);
		assertNotNull("Lokki has Kanahaukka ringings in Espoo", res);
		assertTrue("Lokki has Kanahaukka ringings in Espoo", res.size() > 0);
		for (Row row : res) {
			Field personField = row.getFieldMetaInfo("person");
			Field speciesField = row.getFieldMetaInfo("species");
			Field municipalityField = row.getFieldMetaInfo("municipality");
			Field ringStartField = row.getFieldMetaInfo("ringStart");
			
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a person field", row.hasField(personField));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a person field", row.hasField("person"));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a person field", row.hasField(allFields.get("person")));
			
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a species field", row.hasField(speciesField));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a species field", row.hasField("species"));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a species field", row.hasField(allFields.get("species")));
			
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a municipality field", row.hasField(municipalityField));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a municipality field", row.hasField("municipality"));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a municipality field", row.hasField(allFields.get("municipality")));
			
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a ringStart field", row.hasField(ringStartField));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a ringStart field", row.hasField("ringStart"));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a ringStart field", row.hasField(allFields.get("ringStart")));
			
			assertEquals("Person fields of Lokki's Kanahaukka ringings in Espoo equal to those returned by fieldsService",
					allFields.get("person"), personField);
			assertEquals("Species fields of Lokki's Kanahaukka ringings in Espoo equal to those returned by fieldsService",
					allFields.get("species"), speciesField);
			assertEquals("Municipality fields of Lokki's Kanahaukka ringings in Espoo equal to those returned by fieldsService",
					allFields.get("municipality"), municipalityField);
			assertEquals("Municipality fields of Lokki's Kanahaukka ringings in Espoo equal to those returned by fieldsService",
					allFields.get("ringStart"), ringStartField);
			
			assertTrue("Rows have more than three fields", row.getAvailableFields().size() > 3);
			assertEquals("Rows have equal amount of fields as returned by fieldsService", allFields.size(), row.getAvailableFields().size());
			
			for (Field f : row.getAvailableFields()) {
				assertTrue("All row fields are contained in fieldsService",
						allFields.containsKey(f.getFieldName()));
				assertEquals("Row fields are equal to those returned by fieldsService",
						allFields.get(f.getFieldName()), f);
			}
			
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Lokki as person", String.valueOf(LOKKI_ID), row.getFieldValue(personField));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Lokki as person", String.valueOf(LOKKI_ID), row.getFieldValue("person"));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Lokki as person", String.valueOf(LOKKI_ID), row.getFieldValue(allFields.get("person")));
			
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Kanahaukka as species", KANAHAUKKA, row.getFieldValue(speciesField));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Kanahaukka as species", KANAHAUKKA, row.getFieldValue("species"));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Kanahaukka as species", KANAHAUKKA, row.getFieldValue(allFields.get("species")));
			
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Espoo as municipality", "ESPOO", row.getFieldValue(municipalityField));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Espoo as municipality", "ESPOO", row.getFieldValue("municipality"));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Espoo as municipality", "ESPOO", row.getFieldValue(allFields.get("municipality")));
			
			assertNotNull("Lokki's Kanahaukka ringings in Espoo have non-null ringStart", row.getFieldValue(ringStartField));
			assertNotNull("Lokki's Kanahaukka ringings in Espoo have Espoo as municipality", row.getFieldValue("ringStart"));
			assertNotNull("Lokki's Kanahaukka ringings in Espoo have Espoo as municipality", row.getFieldValue(allFields.get("ringStart")));
		}
		
		List<Row> subset = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, LOKKI_ESPOO_ACCGEN_RING_PREFIX_SUBSET, null, 0, 0);
		assertNotNull("Lokki has a subset of Kanahaukka ringings in Espoo", subset);
		assertTrue("Lokki has a subset of Kanahaukka ringings in Espoo", subset.size() > 0);
		assertTrue("Subset of Lokki's Kanahaukka ringings in Espoo have less rows than the full list", subset.size() < res.size());
		
		List<Row> sort1 = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, LOKKI_ESPOO_ACCGEN_RING_PREFIX_SUBSET, new String[]{ "numberOfYoungs" }, 0, 0);
		List<Row> sort2 = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, LOKKI_ESPOO_ACCGEN_RING_PREFIX_SUBSET, new String[]{ "numberOfYoungs", "species" }, 0, 0);
		List<Row> sort3 = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, LOKKI_ESPOO_ACCGEN_RING_PREFIX_SUBSET, new String[]{ "person" }, 0, 0);
		assertNotNull("Special sorted subset has rows", sort1);
		assertNotNull("Special sorted subset has rows", sort2);
		assertNotNull("Special sorted subset has rows", sort3);
		
		assertEquals("Special sorted subset has as many rows as default sorted subset", subset.size(), sort1.size());
		assertEquals("Special sorted subset has as many rows as default sorted subset", subset.size(), sort2.size());
		assertEquals("Special sorted subset has as many rows as default sorted subset", subset.size(), sort3.size());

		int lastNumberOfYoungs = Integer.MAX_VALUE;
		for (Row row : sort1) {
			String numberOfYoungsValue = row.getFieldValue("numberOfYoungs");
			int numberOfYoungs;
			if (numberOfYoungsValue == null) {
				numberOfYoungs = Integer.MIN_VALUE;
			} else {
				numberOfYoungs = Integer.parseInt(numberOfYoungsValue);
			}
			assertTrue("Query is sroted by numberOfYoungs value", numberOfYoungs <= lastNumberOfYoungs);
			lastNumberOfYoungs = numberOfYoungs;
		}
	}
}
