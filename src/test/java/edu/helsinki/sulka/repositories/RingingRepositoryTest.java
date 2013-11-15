package edu.helsinki.sulka.repositories;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import edu.helsinki.sulka.models.LocalDatabaseRow;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/database.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
@ActiveProfiles("dev")
public class RingingRepositoryTest {

	@Autowired
	private RingingsRepository ringingRepository;
	
	private LocalDatabaseRow row;
	private String rowData = "asdolkjaeoorids";
	
	@Before
	public void setUp(){
		row = new LocalDatabaseRow();
		row.setRow(rowData);
	}
	
	@After
	public void tearDown(){
		ringingRepository.delete(row);
	}

	@Test
	public void testNewRowsGetIdFromRepository() {
		row = ringingRepository.save(row);
		assertNotNull(row.getId());
	}
	
	@Test
	public void testDefinedRowDataIsKept(){
		row = ringingRepository.save(row);
		assertEquals(row.getRow(), rowData);
	}
	
}


