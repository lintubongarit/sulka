package edu.helsinki.sulka.controllers;

import static org.hamcrest.Matchers.*;
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
import org.slf4j.Logger;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.helsinki.sulka.SecuritySessionHelper;
import edu.helsinki.sulka.models.LocalDatabaseRow;
import edu.helsinki.sulka.models.LocalDatabaseRow.RowType;
import edu.helsinki.sulka.models.User;
import edu.helsinki.sulka.services.LocalDatabaseService;

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
	private Logger logger;
	
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
	
	private int otherUserRingingId;
	private int otherUserRecoveryId;
	private int ringingToBeDeletedId;
	private int recoveryToBeDeletedId;
	
	private LocalDatabaseRow saveRinging;
	private LocalDatabaseRow saveRecovery;
	
	private LocalDatabaseRow ringingToBeEdited;
	private LocalDatabaseRow recoveryToBeEdited;

	private LocalDatabaseRow insertRinging(String userId) {
    	return insertRinging(userId, null);
	}
	
	private LocalDatabaseRow insertRecovery(String userId) {
    	return insertRecovery(userId, null);
	}
	
	private LocalDatabaseRow insertRinging(String userId, String rowContent) {
		LocalDatabaseRow ringing = new LocalDatabaseRow(RowType.RINGING);
    	ringing.setUserId(userId);
    	ringing.setRow(rowContent);
    	return localDatabaseService.addRow(ringing);
	}
	
	private LocalDatabaseRow insertRecovery(String userId, String rowContent) {
    	LocalDatabaseRow recovery = new LocalDatabaseRow(RowType.RECOVERY);
    	recovery.setUserId(userId);
    	recovery.setRow(rowContent);
    	return localDatabaseService.addRow(recovery);
	}
	
	private static final String SAVE_CONTENT = "lintu";
	private static final String BEFORE_EDIT_CONTENT = "foobar";
	private static final String AFTER_EDIT_CONTENT = "barfoo";
	
	@Before
    public void setup() {
    	mockMvc = webAppContextSetup(wac).addFilters(springSecurityFilterChain).build();
    	
    	User lokki = new User();
    	lokki.setPass(true);
    	lokki.setLogin_id(USER_ID);
    	lokki.setExpires_at(System.currentTimeMillis() / 1000 + 60);
    	lokkiHttpSession = SecuritySessionHelper.createUserSession(lokki);
    	
    	// Create mock data
    	insertRinging(USER_ID);
    	insertRinging(USER_ID);
    	insertRinging(USER_ID);
    	
    	insertRecovery(USER_ID);
    	insertRecovery(USER_ID);
    	insertRecovery(USER_ID);
    	
    	insertRinging(OTHER_USER_ID);
    	insertRinging(OTHER_USER_ID);
    	otherUserRingingId = insertRinging(OTHER_USER_ID).getId().intValue();
    	
    	insertRecovery(OTHER_USER_ID);
    	insertRecovery(OTHER_USER_ID);
    	otherUserRecoveryId = insertRecovery(OTHER_USER_ID).getId().intValue();
    	
    	ringingToBeDeletedId = insertRinging(USER_ID).getId().intValue();
    	recoveryToBeDeletedId = insertRecovery(USER_ID).getId().intValue();
    	
    	saveRinging = insertRinging(USER_ID, SAVE_CONTENT);
    	saveRecovery = insertRecovery(USER_ID, SAVE_CONTENT);
    	
    	ringingToBeEdited = insertRinging(USER_ID, BEFORE_EDIT_CONTENT);
    	recoveryToBeEdited = insertRecovery(USER_ID, BEFORE_EDIT_CONTENT);
	}
	
	@After
	public void tearDown(){
		List<LocalDatabaseRow> ringings = localDatabaseService.getRowsByUserId(RowType.RINGING, USER_ID);
		List<LocalDatabaseRow> recoveries = localDatabaseService.getRowsByUserId(RowType.RECOVERY, USER_ID);
		
		for(LocalDatabaseRow toBeDeleted: ringings) {
			localDatabaseService.removeRow(toBeDeleted);
		}
		for(LocalDatabaseRow toBeDeleted: recoveries) {
			localDatabaseService.removeRow(toBeDeleted);
		}
		
		ringings = localDatabaseService.getRowsByUserId(RowType.RINGING, OTHER_USER_ID);
		recoveries = localDatabaseService.getRowsByUserId(RowType.RECOVERY, OTHER_USER_ID);
		
		for(LocalDatabaseRow toBeDeleted: ringings) {
			localDatabaseService.removeRow(toBeDeleted);
		}
		for(LocalDatabaseRow toBeDeleted: recoveries) {
			localDatabaseService.removeRow(toBeDeleted);
		}
	}
	
	
	
	private static byte[] toJSON(LocalDatabaseRow row) throws JsonProcessingException {
		return new ObjectMapper().writer().writeValueAsBytes(row);
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
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRingingId))))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRecoveryId))))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeDeletedId))))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeEdited.getId().intValue()))))))
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
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRecoveryId))))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRingingId))))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(ringingToBeDeletedId))))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(ringingToBeEdited.getId().intValue()))))))
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
	public void testSaveRingingAsIsSucceeds() throws Exception {
		mockMvc.perform(post("/api/storage/ringings")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(toJSON(saveRinging)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.object.id").value(saveRinging.getId().intValue()))
			.andExpect(jsonPath("$.object.userId").value(USER_ID))
			.andExpect(jsonPath("$.object.row").value(SAVE_CONTENT))
			.andReturn();
	}
	
	@Test
	public void testSaveRecoveryAsIsSucceeds() throws Exception {
		mockMvc.perform(post("/api/storage/recoveries")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(toJSON(saveRecovery)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.object.id").value(saveRecovery.getId().intValue()))
			.andExpect(jsonPath("$.object.userId").value(USER_ID))
			.andExpect(jsonPath("$.object.row").value(SAVE_CONTENT))
			.andReturn();
	}
	
	@Test
	public void testSaveRingingAsRecoveryFails() throws Exception {
		mockMvc.perform(post("/api/storage/recoveries")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(toJSON(saveRinging)))
			.andExpect(status().isNotFound())
			.andReturn();
	}
	
	@Test
	public void testSaveRecoveryAsRingngFails() throws Exception {
		mockMvc.perform(post("/api/storage/ringings")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(toJSON(saveRecovery)))
			.andExpect(status().isNotFound())
			.andReturn();
	}
	
	@Test
	public void testSaveOverOtherUserRingingFails() throws Exception {
		LocalDatabaseRow saveRow = new LocalDatabaseRow();
		saveRow.setUserId(OTHER_USER_ID);
		saveRow.setId(otherUserRingingId);
		mockMvc.perform(post("/api/storage/ringings")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(toJSON(saveRow)))
			.andExpect(status().isUnauthorized())
			.andReturn();
	}
	
	@Test
	public void testSaveOverOtherUserRecoveryFails() throws Exception {
		LocalDatabaseRow saveRow = new LocalDatabaseRow();
		saveRow.setUserId(OTHER_USER_ID);
		saveRow.setId(otherUserRecoveryId);
		mockMvc.perform(post("/api/storage/recoveries")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(toJSON(saveRow)))
			.andExpect(status().isUnauthorized())
			.andReturn();
	}
	
	public void testSaveOverOtherUserRingingFails2() throws Exception {
		LocalDatabaseRow saveRow = new LocalDatabaseRow();
		saveRow.setUserId(USER_ID);
		saveRow.setId(otherUserRingingId);
		mockMvc.perform(post("/api/storage/ringings")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(toJSON(saveRow)))
			.andExpect(status().isUnauthorized())
			.andReturn();
	}
	
	@Test
	public void testSaveOverOtherUserRecoveryFails2() throws Exception {
		LocalDatabaseRow saveRow = new LocalDatabaseRow();
		saveRow.setUserId(USER_ID);
		saveRow.setId(otherUserRecoveryId);
		mockMvc.perform(post("/api/storage/recoveries")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(toJSON(saveRow)))
			.andExpect(status().isUnauthorized())
			.andReturn();
	}
	
	@Test
	public void testRingingEditingWorks() throws Exception {
		ringingToBeEdited.setRow(AFTER_EDIT_CONTENT);
		mockMvc.perform(get("/api/storage/ringings")
				.session(lokkiHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(USER_ID))))
			.andExpect(jsonPath("$.objects[*].row", hasItem(equalTo(BEFORE_EDIT_CONTENT))))
			.andExpect(jsonPath("$.objects[*].id", hasItem(equalTo(ringingToBeEdited.getId().intValue()))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRingingId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRecoveryId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeDeletedId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeEdited.getId().intValue()))))));
		mockMvc.perform(post("/api/storage/ringings")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(toJSON(ringingToBeEdited)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.object.id").value(ringingToBeEdited.getId().intValue()))
			.andExpect(jsonPath("$.object.userId").value(USER_ID))
			.andExpect(jsonPath("$.object.row").value(AFTER_EDIT_CONTENT));
		mockMvc.perform(get("/api/storage/ringings")
				.session(lokkiHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(USER_ID))))
			.andExpect(jsonPath("$.objects[*].row", hasItem(equalTo(AFTER_EDIT_CONTENT))))
			.andExpect(jsonPath("$.objects[*].id", hasItem(equalTo(ringingToBeEdited.getId().intValue()))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRingingId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRecoveryId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeDeletedId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeEdited.getId().intValue()))))));
	}
	
	@Test
	public void testEditRecoverySuccess() throws Exception {
		recoveryToBeEdited.setRow(AFTER_EDIT_CONTENT);
		mockMvc.perform(get("/api/storage/recoveries")
				.session(lokkiHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(USER_ID))))
			.andExpect(jsonPath("$.objects[*].row", hasItem(equalTo(BEFORE_EDIT_CONTENT))))
			.andExpect(jsonPath("$.objects[*].id", hasItem(equalTo(recoveryToBeEdited.getId().intValue()))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRecoveryId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRingingId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(ringingToBeDeletedId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(ringingToBeEdited.getId().intValue()))))));
		mockMvc.perform(post("/api/storage/recoveries")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(toJSON(recoveryToBeEdited)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.object.id").value(recoveryToBeEdited.getId().intValue()))
			.andExpect(jsonPath("$.object.userId").value(USER_ID))
			.andExpect(jsonPath("$.object.row").value(AFTER_EDIT_CONTENT));
		mockMvc.perform(get("/api/storage/recoveries")
				.session(lokkiHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(USER_ID))))
			.andExpect(jsonPath("$.objects[*].row", hasItem(equalTo(AFTER_EDIT_CONTENT))))
			.andExpect(jsonPath("$.objects[*].id", hasItem(equalTo(recoveryToBeEdited.getId().intValue()))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRecoveryId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRingingId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(ringingToBeDeletedId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(ringingToBeEdited.getId().intValue()))))))
			.andReturn();
	}
	
	@Test
	public void testDeleteRingingReturnsErrorIfUserIdDoesNotMatchRowUserId() throws Exception {
		logger.error("" + otherUserRingingId);
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
	public void testDeleteRinging() throws Exception {
		mockMvc.perform(get("/api/storage/ringings")
					.session(lokkiHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(USER_ID))))
			.andExpect(jsonPath("$.objects[*].id", hasItem(equalTo(ringingToBeDeletedId))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRingingId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRecoveryId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeDeletedId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeEdited.getId().intValue()))))));
		// Can't delete as recovery
		mockMvc.perform(delete("/api/storage/recoveries/" + ringingToBeDeletedId)
				.session(lokkiHttpSession))
			.andExpect(status().isNotFound());
		// Can't delete with invalid ID
		mockMvc.perform(delete("/api/storage/ringings/" + (ringingToBeDeletedId + 24))
				.session(lokkiHttpSession))
			.andExpect(status().isNotFound());
		mockMvc.perform(delete("/api/storage/ringings/" + ringingToBeDeletedId)
				.session(lokkiHttpSession))
			.andExpect(status().isNoContent());
		mockMvc.perform(get("/api/storage/ringings")
					.session(lokkiHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(USER_ID))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem(equalTo(ringingToBeDeletedId)))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRingingId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRecoveryId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeDeletedId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeEdited.getId().intValue()))))))
			.andReturn();
	}
	
	@Test
	public void testDeleteRecovery() throws Exception {
		mockMvc.perform(get("/api/storage/recoveries")
					.session(lokkiHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(USER_ID))))
			.andExpect(jsonPath("$.objects[*].id", hasItem((equalTo(recoveryToBeDeletedId)))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRecoveryId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRingingId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(ringingToBeDeletedId))))))
			.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(ringingToBeEdited.getId().intValue()))))))
			.andReturn();
		// Can't delete as ringing
		mockMvc.perform(delete("/api/storage/ringings/" + recoveryToBeDeletedId)
				.session(lokkiHttpSession))
				.andExpect(status().isNotFound());
		// Can't delete with invalid ID
		mockMvc.perform(delete("/api/storage/recoveries/" + (recoveryToBeDeletedId + 42))
				.session(lokkiHttpSession))
				.andExpect(status().isNotFound());
		mockMvc.perform(delete("/api/storage/recoveries/" + recoveryToBeDeletedId)
				.session(lokkiHttpSession))
				.andExpect(status().isNoContent());
		mockMvc.perform(get("/api/storage/recoveries")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.error").value(nullValue()))
				.andExpect(jsonPath("$.objects").isArray())
				.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(USER_ID))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(recoveryToBeDeletedId))))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRecoveryId))))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(otherUserRingingId))))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(ringingToBeDeletedId))))))
				.andExpect(jsonPath("$.objects[*].id", not(hasItem((equalTo(ringingToBeEdited.getId().intValue()))))))
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
