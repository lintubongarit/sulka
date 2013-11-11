package edu.helsinki.sulka.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import edu.helsinki.sulka.models.Municipality;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
@ActiveProfiles("dev")
public class MunicipalitiesServiceTest {
    @Autowired
    private MunicipalitiesService municipalitiesService;
    
    @Autowired
    private Logger logger;

	@Test
	public void testGetAllMunicipalities() {
		Municipality[] muns = municipalitiesService.getAllMunicipalities();
		assertTrue("there are more than 100 municipalities", muns.length > 100);
		for (Municipality mun : muns) {
			assertNotNull("no null Municipality objects", mun);
			assertTrue("every Municipality has an ID between 2 and 6 chars in length", 2 <= mun.getID().length() && mun.getID().length() <= 6);
			assertTrue("every Municipality has a Finnish name", mun.getName("FI") != null && mun.getName("FI").length() > 1);
			assertTrue("every Municipality's Swedish name is either null or non-empty", mun.getName("SV") == null || mun.getName("SV").length() > 1);
			assertTrue("every Municipality has a radius", mun.getRadius() > 0);
		}
	}

	private final String HELSINKI_ID = "HELSIN";
	private final String HELSINKI_ELY = "Uudenmaan ELY";
	private final String HELSINKI_COUNTY = "UUSIMAA, FINLAND";
	
	@Test
	public void testGetMunicipalityByID() {
		Municipality hki = municipalitiesService.getMunicipalityByID(HELSINKI_ID);
		assertNotNull("Helsinki exists", hki);
		assertEquals("Helsinki's code is " + HELSINKI_ID, HELSINKI_ID, hki.getID().toUpperCase());
		assertEquals("Helsinki has the correct Finnish name", "HELSINKI", hki.getName("FI").toUpperCase());
		assertEquals("Helsinki has the correct Swedish name", "HELSINGFORS", hki.getName("SV").toUpperCase());
		assertEquals("Helsinki's ELY centre name is " + HELSINKI_ELY, HELSINKI_ELY.toUpperCase(), hki.getElyCentreName().toUpperCase());
		assertEquals("Helsinki's old county's name is " + HELSINKI_COUNTY, HELSINKI_COUNTY.toUpperCase(), hki.getOldCountyName().toUpperCase());
	}

}
