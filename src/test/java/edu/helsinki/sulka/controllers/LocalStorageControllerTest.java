package edu.helsinki.sulka.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import edu.helsinki.sulka.SecuritySessionHelper;
import edu.helsinki.sulka.models.LocalDatabaseRow;
import edu.helsinki.sulka.models.User;
import edu.helsinki.sulka.services.LocalDatabaseService;
import edu.helsinki.sulka.services.LocalDatabaseService.Table;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/security.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
@ActiveProfiles("dev")
public class LocalStorageControllerTest {
	
	@Autowired
	private WebApplicationContext wac;
	
	@Autowired
	private FilterChainProxy springSecurityFilterChain;
	
	@Autowired
	private LocalDatabaseService localDatabaseService;

	private MockMvc mockMvc;
	private MockHttpSession lokkiHttpSession;
	
	private static final String USER_ID = "LocalStorageControllerTestUserId_123456789";
	private static final String OTHER_USER_ID = "LocalStorageControllerTestUserId_123456789x";
	private static final byte[] validOnlyRow = "{\"row\":\"asdflkakgh\"}".getBytes();
	private static final byte[] validRowAndId = "{\"id\":\"1234\", \"row\":\"asdflkakgh\"}".getBytes();
	private static final byte[] invalidId = "{\"JOTAIN\":\"1234\", \"row\":\"asdflkakgh\"}".getBytes();
	private static final byte[] invalidRow = "{\"id\":\"1234\", \"ABCD\":\"asdflkakgh\"}".getBytes();
	private static final byte[] validSettings = "{\"columns\":\"asdfawerfasdasdfaasdf\"}".getBytes();
	private long otherUserRecoveryId;
	private long otherUserRingingId;
	private long recoveryToBeDeletedId;
	private long ringingToBeDeletedId;

	/**
	 * @return row id
	 */
	private long insertRecovery(String userId) {
    	LocalDatabaseRow recovery = new LocalDatabaseRow();
    	recovery.setUserId(userId);
    	return localDatabaseService.addRow(Table.RECOVERIES, recovery).getId();
	}
	
	/**
	 * @return row id
	 */
	private long insertRinging(String userId) {
		LocalDatabaseRow ringing = new LocalDatabaseRow();
    	ringing.setUserId(userId);
    	return localDatabaseService.addRow(Table.RINGINGS, ringing).getId();
	}
	
	@Before
    public void setup() {
    	mockMvc = webAppContextSetup(wac).addFilters(springSecurityFilterChain).build();
    	
    	User lokki = new User();
    	lokki.setPass(true);
    	lokki.setLogin_id(USER_ID);
    	lokki.setExpires_at(System.currentTimeMillis() / 1000 + 60);
    	lokkiHttpSession = SecuritySessionHelper.createUserSession(lokki);
    	
    	// Create mock data
    	insertRecovery(USER_ID);
    	insertRecovery(USER_ID);
    	insertRecovery(USER_ID);
    	
    	insertRinging(USER_ID);
    	insertRinging(USER_ID);
    	insertRinging(USER_ID);
    	
    	insertRecovery(OTHER_USER_ID);
    	insertRecovery(OTHER_USER_ID);
    	otherUserRecoveryId = insertRecovery(OTHER_USER_ID);
    	
    	insertRinging(OTHER_USER_ID);
    	insertRinging(OTHER_USER_ID);
    	otherUserRingingId = insertRinging(OTHER_USER_ID);
    	
    	recoveryToBeDeletedId = insertRecovery(USER_ID);
    	ringingToBeDeletedId = insertRecovery(USER_ID);
	}
	
	@After
	public void tearDown(){
		List<LocalDatabaseRow> ringings = localDatabaseService.getRowsByUserId(Table.RINGINGS, USER_ID);
		List<LocalDatabaseRow> recoveries = localDatabaseService.getRowsByUserId(Table.RECOVERIES, USER_ID);
		
		for(LocalDatabaseRow toBeDeleted: ringings) {
			localDatabaseService.removeRow(Table.RINGINGS, toBeDeleted);
		}
		for(LocalDatabaseRow toBeDeleted: recoveries) {
			localDatabaseService.removeRow(Table.RECOVERIES, toBeDeleted);
		}
		
		ringings = localDatabaseService.getRowsByUserId(Table.RINGINGS, OTHER_USER_ID);
		recoveries = localDatabaseService.getRowsByUserId(Table.RECOVERIES, OTHER_USER_ID);
		
		for(LocalDatabaseRow toBeDeleted: ringings) {
			localDatabaseService.removeRow(Table.RINGINGS, toBeDeleted);
		}
		for(LocalDatabaseRow toBeDeleted: recoveries) {
			localDatabaseService.removeRow(Table.RECOVERIES, toBeDeleted);
		}
	}
	
	@Test
	public void testGetRingings() throws Exception {
		mockMvc.perform(get("/api/storage/ringings")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.error").value(nullValue()))
				.andExpect(jsonPath("$.objects").isArray())
				.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(USER_ID))))
				.andReturn();
	}

	@Test
	public void testGetRecoveries() throws Exception {
		mockMvc.perform(get("/api/storage/recoveries")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.error").value(nullValue()))
				.andExpect(jsonPath("$.objects").isArray())
				.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(USER_ID))))
				.andReturn();
	}
	
	@Test
	public void testSaveRinging() throws Exception {
		mockMvc.perform(post("/api/storage/ringings")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content(validOnlyRow))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andReturn();
	}
	
	@Test
	public void testSaveRecovery() throws Exception {
		mockMvc.perform(post("/api/storage/recoveries")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content(validOnlyRow))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andReturn();
	}
	
	@Test
	public void testSaveRingingReturnsErrorIfPostDataIsntJSON() throws Exception {
		mockMvc.perform(post("/api/storage/ringings")
					.session(lokkiHttpSession)
					.contentType(MediaType.APPLICATION_XML)
					.content(validRowAndId))
				.andExpect(status().isUnsupportedMediaType())
				.andReturn();
	}
	
	@Test
	public void testSaveRecoveryReturnsErrorIfPostDataIsntJSON() throws Exception {
		mockMvc.perform(post("/api/storage/recoveries")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_XML)
				.content(validRowAndId))
			.andExpect(status().isUnsupportedMediaType())
			.andReturn();
	}
	
	@Test
	public void testSaveRingingReturnsErrorWithWronglyNamedIdField() throws Exception {
		mockMvc.perform(post("/api/storage/ringings")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(invalidId))
			.andExpect(status().isBadRequest())
			.andReturn();
	}
	
	@Test
	public void testSaveRecoveryReturnsErrorWithWronglyNamedIdField() throws Exception {
		mockMvc.perform(post("/api/storage/recoveries")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(invalidId))
			.andExpect(status().isBadRequest())
			.andReturn();
	}

	@Test
	public void testSaveRingingReturnsErrorWithWronglyNamedRowField() throws Exception {
		mockMvc.perform(post("/api/storage/ringings")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(invalidRow))
			.andExpect(status().isBadRequest())
			.andReturn();
	}

	@Test
	public void testSaveRecoveryReturnsErrorWithWronglyNamedRowField() throws Exception {
		mockMvc.perform(post("/api/storage/recoveries")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(invalidRow))
			.andExpect(status().isBadRequest())
			.andReturn();
	}

	@Test
	public void testSaveRingingReturnsRowWithCorrectColumns() throws Exception {
		mockMvc.perform(post("/api/storage/ringings")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(validOnlyRow))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.object.id").value(notNullValue()))
			.andExpect(jsonPath("$.object.userId").value(notNullValue()))
			.andExpect(jsonPath("$.object.row").value(notNullValue()))
			.andReturn();
	}
	
	@Test
	public void testSaveRecoveryReturnsRowWithCorrectColumns() throws Exception {
		mockMvc.perform(post("/api/storage/recoveries")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(validOnlyRow))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.object.id").value(notNullValue()))
			.andExpect(jsonPath("$.object.userId").value(notNullValue()))
			.andExpect(jsonPath("$.object.row").value(notNullValue()))
			.andReturn();
	}
	
	@Test
	public void testDeleteRingingReturnsErrorIfUserIdDoesNotMatchRowUserId() throws Exception {
		mockMvc.perform(delete("/api/storage/ringings/" + otherUserRingingId)
				.session(lokkiHttpSession))
			.andExpect(status().isUnauthorized())
			.andReturn();
	}
	
	@Test
	public void testDeleteRecoveryReturnsErrorIfUserIdDoesNotMatchRowUserId() throws Exception {
		mockMvc.perform(delete("/api/storage/recoveries/" + otherUserRecoveryId)
				.session(lokkiHttpSession))
			.andExpect(status().isUnauthorized())
			.andReturn();
	}
	
	@Test
	public void testDeleteRingingStatusIsOk() throws Exception {
		mockMvc.perform(delete("/api/storage/ringings/" + ringingToBeDeletedId)
				.session(lokkiHttpSession))
				.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andReturn();
	}
	
	@Test
	public void testDeleteRecoveryStatusIsOk() throws Exception {
		mockMvc.perform(delete("/api/storage/recoveries/" + recoveryToBeDeletedId)
				.session(lokkiHttpSession))
				.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andReturn();
	}
	
	@Test
	public void testGetSettingsReturnsJSONWithCorrectColumns() throws Exception {
		mockMvc.perform(get("/api/storage/settings")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.object.userId").value(notNullValue()))
				.andExpect(jsonPath("$.object.columns").value(notNullValue()))
				.andReturn();
	}
	
	@Test
	public void testSaveSettingsStatusIsOk() throws Exception {
		mockMvc.perform(post("/api/storage/settings")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content(validSettings))
				.andExpect(status().isOk())
				.andReturn();
	}
	
	@Test
	public void testSaveSettingsReturnsErrorIfDataIsntJSON() throws Exception {
		mockMvc.perform(post("/api/storage/settings")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_XML)
						.content(validSettings))
				.andExpect(status().isUnsupportedMediaType())
				.andReturn();
	}
}
