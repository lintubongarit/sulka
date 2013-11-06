package edu.helsinki.sulka.services;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import edu.helsinki.sulka.models.RecoveryDatabaseRow;
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
	
	private RingingDatabaseRow ringingRow;
	private RecoveryDatabaseRow recoveryRow;
	
	private static final String USER_ID = "LOCAL_DATABASE_SERVICE_TEST_USER_12345";
	private static final String rowData = "asdfhasdfasesdfawe";
	
	@Before
	public void setUp(){
		ringingRow = new RingingDatabaseRow();
		recoveryRow = new RecoveryDatabaseRow();
		
		ringingRow.setUserId(USER_ID);
		recoveryRow.setUserId(USER_ID);
		
		ringingRow.setRow(rowData);
		recoveryRow.setRow(rowData);
	}
	
	@After
	public void tearDown(){
		List<RingingDatabaseRow> ringingRows = localDatabaseService.getRingings(USER_ID);
		List<RecoveryDatabaseRow> recoveryRows = localDatabaseService.getRecoveries(USER_ID);
		
		for(RingingDatabaseRow toBeDeleted: ringingRows)
			localDatabaseService.removeRinging(toBeDeleted);
		for(RecoveryDatabaseRow toBeDeleted: recoveryRows)
			localDatabaseService.removeRecovery(toBeDeleted);
	}
			
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
		for(int i=0; i < 10; i++){
			List<RingingDatabaseRow> usersRows = localDatabaseService.getRingings(Integer.toString(i));
			for(RingingDatabaseRow toBeDeleted: usersRows)
				localDatabaseService.removeRinging(toBeDeleted);
		}
	}
	
	@Test
	public void testAddRingingReturnsSomething(){
		ringingRow = localDatabaseService.addRinging(ringingRow);
		assertNotNull(ringingRow);
	}
	
	@Test
	public void testAddRingingReturnsRowWithId(){
		ringingRow = localDatabaseService.addRinging(ringingRow);
		assertNotNull(ringingRow.getId());
	}

	@Test
	public void testRemoveRingingDeletesRowFromDatabase(){
		ringingRow = localDatabaseService.addRinging(ringingRow);
		localDatabaseService.removeRinging(ringingRow);
		List<RingingDatabaseRow> rows = localDatabaseService.getRingings(USER_ID);
		assertTrue(rows.isEmpty());
	}
	
	@Test
	public void testGetRecoveryReturnsEmptyListWithUnknownUser(){
		List<RecoveryDatabaseRow> rows = localDatabaseService.getRecoveries("1ASDF");
		assertTrue(rows.isEmpty());
	}
	
	@Test
	public void testOnlyUsersRecoveriesAreReturned(){
		for(int i=0; i < 500; i++){
			RecoveryDatabaseRow row = new RecoveryDatabaseRow();
			row.setUserId(Integer.toString(i%10));
			row.setRow("Testi: " + i);
			localDatabaseService.addRecovery(row);
		}
		String wantedUserId = "5";
		List<RecoveryDatabaseRow> rows = localDatabaseService.getRecoveries(wantedUserId);
		for(RecoveryDatabaseRow row: rows){
			assertEquals(row.getUserId(), wantedUserId);
		}
		for(int i=0; i < 10; i++){
			List<RecoveryDatabaseRow> usersRows = localDatabaseService.getRecoveries(Integer.toString(i));
			for(RecoveryDatabaseRow toBeDeleted: usersRows)
				localDatabaseService.removeRecovery(toBeDeleted);
		}
	}
	
	@Test
	public void testAddRecoveryReturnsSomething(){
		recoveryRow = localDatabaseService.addRecovery(recoveryRow);
		assertNotNull(recoveryRow);
	}
	
	@Test
	public void testAddRecoveryReturnsRowWithId(){
		recoveryRow = localDatabaseService.addRecovery(recoveryRow);
		assertNotNull(recoveryRow.getId());
	}
	
	@Test
	public void testRemoveRecoveryDeletesRowFromDatabase(){
		recoveryRow = localDatabaseService.addRecovery(recoveryRow);
		localDatabaseService.removeRecovery(recoveryRow);
		List<RecoveryDatabaseRow> rows = localDatabaseService.getRecoveries(USER_ID);
		assertTrue(rows.isEmpty());
	}

}
