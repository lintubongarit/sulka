package edu.helsinki.sulka.repositories;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import edu.helsinki.sulka.models.UserSettings;

@RunWith(SpringJUnit4ClassRunner.class)  
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/database.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class UserSettingsRepositoryTest {

	@Autowired
	private UserSettingsRepository userSettingsRepository;

	private UserSettings userSettings;
	private static final String COLUMNS_DATA = "asdfasdfasdfwetsdfgs";
	private static final String USER_ID = "UserSettingsRepository_USER_ID";
	
	@Before
	public void setUp(){
		userSettings = new UserSettings();
		userSettings.setUserId(USER_ID);
		userSettings.setColumns(COLUMNS_DATA);
	}
	
	@After
	public void tearDown(){
		userSettingsRepository.delete(userSettings);
	}
	
	@Test
	public void testDefinedRowDataIsKept(){
		userSettings = userSettingsRepository.save(userSettings);
		assertEquals(userSettings.getColumns(), COLUMNS_DATA);
	}
	

}
