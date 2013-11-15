package edu.helsinki.sulka.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import edu.helsinki.sulka.models.LocalDatabaseRow;
import edu.helsinki.sulka.models.LocalDatabaseRow.RowType;
import edu.helsinki.sulka.models.UserSettings;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/database.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
@Transactional
@ActiveProfiles("dev")
public class LocalDatabaseServiceTest {

	@Autowired
	private LocalDatabaseService localDatabaseService;
	
	private LocalDatabaseRow ringingRow;
	private LocalDatabaseRow recoveryRow;
	private UserSettings userSettings;
	
	private static final String USER_ID = "LOCAL_DATABASE_SERVICE_TEST_USER_12345";
	private static final String ROW_DATA = "asdfhasdfasesdfawe";
	private static final String COLUMN_DATA = "asdfawetraweasdf";
	
	@Before
	public void setUp(){
		ringingRow = new LocalDatabaseRow(RowType.RINGING);
		recoveryRow = new LocalDatabaseRow(RowType.RECOVERY);
		userSettings = new UserSettings();
		
		ringingRow.setUserId(USER_ID);
		recoveryRow.setUserId(USER_ID);
		
		ringingRow.setRow(ROW_DATA);
		recoveryRow.setRow(ROW_DATA);
		
		userSettings.setUserId(USER_ID);
		userSettings.setColumns(COLUMN_DATA);
	}
	
	@After
	public void tearDown(){
		List<LocalDatabaseRow> ringingRows = localDatabaseService.getRowsByUserId(RowType.RINGING, USER_ID);
		List<LocalDatabaseRow> recoveryRows = localDatabaseService.getRowsByUserId(RowType.RECOVERY, USER_ID);
		
		for (LocalDatabaseRow toBeDeleted: ringingRows) {
			localDatabaseService.removeRow(toBeDeleted);
		}
		for (LocalDatabaseRow toBeDeleted: recoveryRows) {
			localDatabaseService.removeRow(toBeDeleted);
		}
	}
			
	@Test
	public void testGetRingingsReturnsEmptyListWithUnknownUser(){
		List<LocalDatabaseRow> rows = localDatabaseService.getRowsByUserId(RowType.RINGING, "1ASDF");
		assertTrue(rows.isEmpty());
	}

	@Test
	public void testOnlyUsersRingingsAreReturned(){
		for(int i=0; i < 50; i++){
			LocalDatabaseRow row = new LocalDatabaseRow(RowType.RINGING);
			row.setUserId(Integer.toString(i%10));
			row.setRow("Testi: " + i);
			localDatabaseService.addRow(row);
		}
		String wantedUserId = "4";
		List<LocalDatabaseRow> rows = localDatabaseService.getRowsByUserId(RowType.RINGING, wantedUserId);
		for(LocalDatabaseRow row: rows){
			assertEquals(row.getUserId(), wantedUserId);
		}
		for(int i=0; i < 10; i++){
			List<LocalDatabaseRow> usersRows = localDatabaseService.getRowsByUserId(RowType.RINGING, Integer.toString(i));
			for(LocalDatabaseRow toBeDeleted: usersRows)
				localDatabaseService.removeRow(toBeDeleted);
		}
	}
	
	@Test
	public void testAddRingingReturnsSomething(){
		ringingRow = localDatabaseService.addRow(ringingRow);
		assertNotNull(ringingRow);
	}
	
	@Test
	public void testAddRingingReturnsRowWithId(){
		ringingRow = localDatabaseService.addRow(ringingRow);
		assertNotNull(ringingRow.getId());
	}

	@Test
	public void testRemoveRingingDeletesRowFromDatabase(){
		ringingRow = localDatabaseService.addRow(ringingRow);
		localDatabaseService.removeRow(ringingRow);
		List<LocalDatabaseRow> rows = localDatabaseService.getRowsByUserId(RowType.RINGING, USER_ID);
		assertTrue(rows.isEmpty());
	}
	
	@Test
	public void testGetRecoveryReturnsEmptyListWithUnknownUser(){
		List<LocalDatabaseRow> rows = localDatabaseService.getRowsByUserId(RowType.RECOVERY, "1ASDF");
		assertTrue(rows.isEmpty());
	}
	
	@Test
	public void testOnlyUsersRecoveriesAreReturned(){
		for(int i=0; i < 500; i++){
			LocalDatabaseRow row = new LocalDatabaseRow(RowType.RECOVERY);
			row.setUserId(Integer.toString(i%10));
			row.setRow("Testi: " + i);
			localDatabaseService.addRow(row);
		}
		String wantedUserId = "5";
		List<LocalDatabaseRow> rows = localDatabaseService.getRowsByUserId(RowType.RECOVERY, wantedUserId);
		for(LocalDatabaseRow row: rows){
			assertEquals(row.getUserId(), wantedUserId);
		}
		for(int i=0; i < 10; i++){
			List<LocalDatabaseRow> usersRows = localDatabaseService.getRowsByUserId(RowType.RECOVERY, Integer.toString(i));
			for(LocalDatabaseRow toBeDeleted: usersRows)
				localDatabaseService.removeRow(toBeDeleted);
		}
	}
	
	@Test
	public void testAddRecoveryReturnsSomething(){
		recoveryRow = localDatabaseService.addRow(recoveryRow);
		assertNotNull(recoveryRow);
	}
	
	@Test
	public void testAddRecoveryReturnsRowWithId(){
		recoveryRow = localDatabaseService.addRow(recoveryRow);
		assertNotNull(recoveryRow.getId());
	}
	
	@Test
	public void testRemoveRecoveryDeletesRowFromDatabase(){
		recoveryRow = localDatabaseService.addRow(recoveryRow);
		localDatabaseService.removeRow(recoveryRow);
		List<LocalDatabaseRow> rows = localDatabaseService.getRowsByUserId(RowType.RECOVERY, USER_ID);
		assertTrue(rows.isEmpty());
	}
	
	@Test
	public void testQueryingSettingsForNewUserReturnsEmptySettings(){
		userSettings = localDatabaseService.getSettings(USER_ID);
		assertTrue(userSettings.getColumns().length() == 0);
	}
	
	@Test
	public void testQueryingSettingsForNewUserReturnsSettingsWithCorrectUserId(){
		userSettings = localDatabaseService.getSettings(USER_ID);
		assertTrue(userSettings.getUserId() == USER_ID);
	}
	
	@Test
	public void testQueryingExistingUserReturnsPreviouslySetSettings(){
		localDatabaseService.saveSettings(userSettings);
		userSettings = localDatabaseService.getSettings(USER_ID);
		assertTrue(userSettings.getColumns().equals(COLUMN_DATA));
	}
	
	@Test
	public void testQueryingExistingUserReturnsSettingsWithCorrectUserID(){
		localDatabaseService.saveSettings(userSettings);
		userSettings = localDatabaseService.getSettings(USER_ID);
		assertTrue(userSettings.getUserId().equals(USER_ID));
	}
}
