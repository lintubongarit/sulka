package edu.helsinki.sulka.services;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import edu.helsinki.sulka.models.DbRowRingings;

@RunWith(SpringJUnit4ClassRunner.class)  
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/database.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
@Transactional
public class LocalDatabaseServiceTest {

	@Autowired
	private LocalDatabaseService localDatabaseService;
	
	@Test
	public void testAddRingingGrowsSizeOfReturnedList(){
		DbRowRingings row = new DbRowRingings();
		row.setUserId("1");
		row.setRow("TESTI");
		localDatabaseService.addRinging(row);
		List<DbRowRingings> rows = localDatabaseService.getRingings("1");
		assertEquals(rows.size(), 1);
	}

	@Test
	public void testOnlyUsersRowsAreReturned(){
		for(int i=0; i < 500; i++){
			DbRowRingings row = new DbRowRingings();
			row.setUserId(Integer.toString(i%10));
			row.setRow("Testi: " + i);
		}
		String wantedUserId = "4";
		List<DbRowRingings> rows = localDatabaseService.getRingings("4");
		for(DbRowRingings row: rows){
			assertEquals(row.getUserId(), wantedUserId);
		}
	}
	
	@Test
	public void testAddRingingReturnsSomething(){
		DbRowRingings row = new DbRowRingings();
		row.setUserId("1");
		row.setRow("TESTI");
		row = localDatabaseService.addRinging(row);
		assertNotNull(row);
	}
	
	@Test
	public void testAddRingingReturnsRowWithId(){
		DbRowRingings row = new DbRowRingings();
		row.setUserId("1");
		row.setRow("TESTI");
		row = localDatabaseService.addRinging(row);
		assertNotNull(row.getId());
	}


}
