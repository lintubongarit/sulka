package edu.helsinki.sulka.repositories;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import edu.helsinki.sulka.models.RecoveryDatabaseRow;
import edu.helsinki.sulka.repositories.RecoveriesRepository;

@RunWith(SpringJUnit4ClassRunner.class)  
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/database.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class RecoveriesRepositoryTest {

	@Autowired  
	private RecoveriesRepository recoveriesRepository;
	
	private RecoveryDatabaseRow row;
	private String rowData = "asdolkjaeoprids";
	
	@Before
	public void setUp(){
		row = new RecoveryDatabaseRow();
		row.setRow(rowData);  
	}
	
	@After
	public void tearDown(){
		recoveriesRepository.delete(row);
	}

	@Test
	public void testNewRowsGetIdFromRepository() {  
		row = recoveriesRepository.save(row);
		assertNotNull(row.getId());
	}     
	
	@Test
	public void testDefinedRowDataIsKept(){
		row = recoveriesRepository.save(row);
		assertEquals(row.getRow(), rowData);
	}

}
