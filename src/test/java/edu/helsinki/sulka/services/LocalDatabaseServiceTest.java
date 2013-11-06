package edu.helsinki.sulka.services;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import edu.helsinki.sulka.models.RingingDatabaseRow;

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
	public void testGetRingingsReturnsEmptyListWithUnknownUser(){
		List<RingingDatabaseRow> rows = localDatabaseService.getRingings("1ASDF");
		assertTrue(rows.isEmpty());
	}

	@Test
	public void testOnlyUsersRingingsAreReturned(){
		for(int i=0; i < 500; i++){
			RingingDatabaseRow row = new RingingDatabaseRow();
			row.setUserId(Integer.toString(i%10));
			row.setRow("Testi: " + i);
			localDatabaseService.addRinging(row);
		}
		String wantedUserId = "4";
		List<RingingDatabaseRow> rows = localDatabaseService.getRingings(wantedUserId);
		for(RingingDatabaseRow row: rows){
			assertEquals(row.getUserId(), wantedUserId);
		}
	}
	
	@Test
	public void testAddRingingReturnsSomething(){
		RingingDatabaseRow row = new RingingDatabaseRow();
		row.setUserId("1");
		row.setRow("TESTI");
		row = localDatabaseService.addRinging(row);
		assertNotNull(row);
	}
	
	@Test
	public void testAddRingingReturnsRowWithId(){
		RingingDatabaseRow row = new RingingDatabaseRow();
		row.setUserId("1");
		row.setRow("TESTI");
		row = localDatabaseService.addRinging(row);
		assertNotNull(row.getId());
	}

	@Test
	public void testRemoveRingingDeletesRowFromDatabase(){
		RingingDatabaseRow row = new RingingDatabaseRow();
		row.setUserId("1");
		row.setRow("Testi4");
		row = localDatabaseService.addRinging(row);
		localDatabaseService.removeRinging(row);
		List<RingingDatabaseRow> rows = localDatabaseService.getRingings("1");
		assertTrue(rows.isEmpty());
	}
	
	@Test
	public void testGetRecoveryReturnsEmptyListWithUnknownUser(){
		List<RingingDatabaseRow> rows = localDatabaseService.getRecoveries("1ASDF");
		assertTrue(rows.isEmpty());
	}
	
	@Test
	public void testOnlyUsersRecoveriesAreReturned(){
		for(int i=0; i < 500; i++){
			RingingDatabaseRow row = new RingingDatabaseRow();
			row.setUserId(Integer.toString(i%10));
			row.setRow("Testi: " + i);
			localDatabaseService.addRecovery(row);
		}
		String wantedUserId = "5";
		List<RingingDatabaseRow> rows = localDatabaseService.getRecoveries(wantedUserId);
		for(RingingDatabaseRow row: rows){
			assertEquals(row.getUserId(), wantedUserId);
		}
	}
	
	@Test
	public void testAddRecoveryReturnsSomething(){
		RingingDatabaseRow row = new RingingDatabaseRow();
		row.setUserId("1");
		row.setRow("TESTI");
		row = localDatabaseService.addRecovery(row);
		assertNotNull(row);
	}
	
	@Test
	public void testAddRecoveryReturnsRowWithId(){
		RingingDatabaseRow row = new RingingDatabaseRow();
		row.setUserId("1");
		row.setRow("TESTI");
		row = localDatabaseService.addRecovery(row);
		assertNotNull(row.getId());
	}
	
	@Test
	public void testRemoveRecoveryDeletesRowFromDatabase(){
		RingingDatabaseRow row = new RingingDatabaseRow();
		row.setUserId("1");
		row.setRow("Testi4");
		row = localDatabaseService.addRecovery(row);
		localDatabaseService.removeRecovery(row);
		List<RingingDatabaseRow> rows = localDatabaseService.getRecoveries("1");
		assertTrue(rows.isEmpty());
	}

}
