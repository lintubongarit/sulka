package edu.helsinki.sulka.repositories;

import static org.junit.Assert.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import edu.helsinki.sulka.models.DatabaseRow;
import edu.helsinki.sulka.repositories.RingingRepository;

@RunWith(SpringJUnit4ClassRunner.class)  
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/database.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class RingingRepositoryTest {

	@Autowired  
	private RingingRepository ringingRepository;

	@Test
	public void testNewRowsGetIdFromRepository() {  
		DatabaseRow row = new DatabaseRow();
		row.setRow("asd");  
		  
		row = ringingRepository.save(row);
		assertNotNull(row.getId());
	}     
	
	@Test
	public void testDefinedRowDataIsKept(){
		String rowData = "asdolkjaeoorids";
		DatabaseRow row = new DatabaseRow();
		row.setRow(rowData);  
		  
		row = ringingRepository.save(row);
		assertEquals(row.getRow(), rowData);
	}
	
}


