package edu.helsinki.sulka.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import edu.helsinki.sulka.models.Ringer;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class RingersServiceTest {
    @Autowired
    private RingersService ringersService;

	@Test
	public void testGetAllRingers() {
		Ringer[] ringers = ringersService.getAllRingers();
		assertTrue("there are more than 1,000 ringers", ringers.length > 1000);
		for (Ringer ringer : ringers) {
			assertNotNull("no null Ringer objects", ringer);
			assertTrue("every Ringer has an ID", ringer.getID() > 0);
		}
	}

	private final long LOKKI_RINGER_ID = 846;
	private final long LOKKI_BORN = 1952;
	
	@Test
	public void testGetRingerByID() {
		Ringer lokki = ringersService.getRingerByID(LOKKI_RINGER_ID);
		assertNotNull("ringer Lokki exists", lokki);
		assertEquals("ringer Lokki has ID " + LOKKI_RINGER_ID, LOKKI_RINGER_ID, lokki.getID());
		assertEquals("ringer Lokki's first name is Heikki", "HEIKKI", lokki.getFirstName().toUpperCase());
		assertEquals("ringer Lokki's last name is Lokki", "LOKKI", lokki.getLastName().toUpperCase());
		assertEquals("ringer Lokki's year of birth is " + LOKKI_BORN, LOKKI_BORN, lokki.getYearOfBirth());
	}

}
