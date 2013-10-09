package edu.helsinki.sulka.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
    
    private final String LOKKI_ESPOO_ACCGEN_RING_PREFIX_SUBSET = "D 027135";
	@Test
	public void testGetRows() throws Exception {
		Map<String, Field> allFields = fieldsService.getAllFieldsByFieldName();
		
		List<Row> res = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, null, null);
		assertNotNull("Lokki has Kanahaukka ringings in Espoo", res);
		assertTrue("Lokki has Kanahaukka ringings in Espoo", res.size() > 0);
		for (Row row : res) {
			Field ringerField = row.getField("ringer");
			Field speciesField = row.getField("species");
			Field municipalityField = row.getField("municipality");
			Field ringField = row.getField("ring");
			
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a ringer field", row.containsKey(ringerField));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a ringer field", row.containsKey("ringer"));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a ringer field", row.containsKey(allFields.get("ringer")));
			
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a species field", row.containsKey(speciesField));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a species field", row.containsKey("species"));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a species field", row.containsKey(allFields.get("species")));
			
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a municipality field", row.containsKey(municipalityField));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a municipality field", row.containsKey("municipality"));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a municipality field", row.containsKey(allFields.get("municipality")));
			
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a ring field", row.containsKey(ringField));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a ring field", row.containsKey("ring"));
			assertTrue("Lokki's Kanahaukka ringings in Espoo have a ring field", row.containsKey(allFields.get("ring")));
			
			assertEquals("Ringer fields of Lokki's Kanahaukka ringings in Espoo equal to those returned by fieldsService",
					allFields.get("ringer"), ringerField);
			assertEquals("Species fields of Lokki's Kanahaukka ringings in Espoo equal to those returned by fieldsService",
					allFields.get("species"), speciesField);
			assertEquals("Municipality fields of Lokki's Kanahaukka ringings in Espoo equal to those returned by fieldsService",
					allFields.get("municipality"), municipalityField);
			assertEquals("Municipality fields of Lokki's Kanahaukka ringings in Espoo equal to those returned by fieldsService",
					allFields.get("ring"), ringField);
			
			assertTrue("Rows have more than three fields", row.getAvailableFields().size() > 3);
			assertEquals("Rows have equal amount of fields as returned by fieldsService", allFields.size(), row.getAvailableFields().size());
			
			for (Field f : row.getAvailableFields()) {
				assertTrue("All row fields are contained in fieldsService",
						allFields.containsKey(f.getFieldName()));
				assertEquals("Row fields are equal to those returned by fieldsService",
						allFields.get(f.getFieldName()), f);
			}
			
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Lokki as ringer", String.valueOf(LOKKI_ID), row.get(ringerField));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Lokki as ringer", String.valueOf(LOKKI_ID), row.get("ringer"));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Lokki as ringer", String.valueOf(LOKKI_ID), row.get(allFields.get("ringer")));
			
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Kanahaukka as species", KANAHAUKKA, row.get(speciesField));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Kanahaukka as species", KANAHAUKKA, row.get("species"));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Kanahaukka as species", KANAHAUKKA, row.get(allFields.get("species")));
			
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Espoo as municipality", "ESPOO", row.get(municipalityField));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Espoo as municipality", "ESPOO", row.get("municipality"));
			assertEquals("Lokki's Kanahaukka ringings in Espoo have Espoo as municipality", "ESPOO", row.get(allFields.get("municipality")));
			
			assertNotNull("Lokki's Kanahaukka ringings in Espoo have non-null ring", row.get(ringField));
			assertNotNull("Lokki's Kanahaukka ringings in Espoo have Espoo as municipality", row.get("ring"));
			assertNotNull("Lokki's Kanahaukka ringings in Espoo have Espoo as municipality", row.get(allFields.get("ring")));
		}
		
		List<Row> filtered = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, LOKKI_ESPOO_ACCGEN_RING_PREFIX_SUBSET, null);
		assertNotNull("Lokki has a subset of Kanahaukka ringings in Espoo", filtered);
		
		Set<Row> subSet = new HashSet<Row>(filtered);
		Set<Row> superSet = new HashSet<Row>(res);
		assertTrue("Lokki has a subset of Kanahaukka ringings in Espoo", subSet.size() > 0);
		assertTrue("Subset of Lokki's Kanahaukka ringings in Espoo has less rows than the full list", subSet.size() < superSet.size());
		assertTrue("Subset of Lokki's Kanahaukka ringings in Espoo is a subset", superSet.containsAll(subSet));
		
		List<Row> sort1 = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, LOKKI_ESPOO_ACCGEN_RING_PREFIX_SUBSET, new String[]{ "numberOfYoungs" });
		List<Row> sort2 = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, LOKKI_ESPOO_ACCGEN_RING_PREFIX_SUBSET, new String[]{ "numberOfYoungs", "species" });
		List<Row> sort3 = rowsService.getRows(new long[] {LOKKI_ID}, new String[]{"ESPOO"}, new String[]{KANAHAUKKA}, LOKKI_ESPOO_ACCGEN_RING_PREFIX_SUBSET, new String[]{ "ringer" });
		assertNotNull("Special sorted subset has rows", sort1);
		assertNotNull("Special sorted subset has rows", sort2);
		assertNotNull("Special sorted subset has rows", sort3);
		
		assertEquals("Special sorted subset has as many rows as default sorted subset", subSet.size(), sort1.size());
		assertEquals("Special sorted subset has as many rows as default sorted subset", subSet.size(), sort2.size());
		assertEquals("Special sorted subset has as many rows as default sorted subset", subSet.size(), sort3.size());

		Set<Row> sortSubset = new HashSet<Row>(sort1);
		for (Row subsetItem : sortSubset) {
			assertTrue("Sorted subset of Lokki's Kanahaukka ringings in Espoo is subset of the full list", superSet.contains(subsetItem));
		}
		sortSubset = new HashSet<Row>(sort2);
		for (Row subsetItem : sortSubset) {
			assertTrue("Sorted subset of Lokki's Kanahaukka ringings in Espoo is subset of the full list", superSet.contains(subsetItem));
		}
		sortSubset = new HashSet<Row>(sort3);
		for (Row subsetItem : sortSubset) {
			assertTrue("Sorted subset of Lokki's Kanahaukka ringings in Espoo is subset of the full list", superSet.contains(subsetItem));
		}
		
		int lastNumberOfYoungs = Integer.MAX_VALUE;
		for (Row row : sort1) {
			String numberOfYoungsValue = row.get("numberOfYoungs");
			int numberOfYoungs;
			if (numberOfYoungsValue == null) {
				numberOfYoungs = Integer.MIN_VALUE;
			} else {
				numberOfYoungs = Integer.parseInt(numberOfYoungsValue);
			}
			assertTrue("Query is sorted by numberOfYoungs value", numberOfYoungs <= lastNumberOfYoungs);
			lastNumberOfYoungs = numberOfYoungs;
		}
	}
}
