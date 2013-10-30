package edu.helsinki.sulka.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;


import edu.helsinki.sulka.SecuritySessionHelper;
import edu.helsinki.sulka.models.User;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/security.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})

public class LocalStorageControllerTest {
	
	@Autowired
	private WebApplicationContext wac;
	
	@Autowired
	private FilterChainProxy springSecurityFilterChain;

	private MockMvc mockMvc;
	private MockHttpSession lokkiHttpSession;
	
	private static final int LOKKI_ID = 846;
	
	@Before
    public void setup() {
    	mockMvc = webAppContextSetup(wac).addFilters(springSecurityFilterChain).build();
    	
    	User lokki = new User();
    	lokki.setPass(true);
    	lokki.setLogin_id(Integer.toString(LOKKI_ID));
    	lokki.setExpires_at(System.currentTimeMillis() / 1000 + 60);
    	lokkiHttpSession = SecuritySessionHelper.createUserSession(lokki);
	}
	
	@Test
	public void testGetRingingsStatusIsOk() throws Exception {
		mockMvc.perform(get("/api/storage/ringing")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andReturn();
	}
	
	@Test
	public void testGetRingingsReturnsJSON() throws Exception {
		mockMvc.perform(get("/api/storage/ringing")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andReturn();
	}
	
	@Test
	public void testGetRingingsReturnJSONsSuccessIsTrue() throws Exception {
		mockMvc.perform(get("/api/storage/ringing")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andReturn();
	}
	
	@Test
	public void testGetRingingsReturnJSONsContainsNoErrors() throws Exception {
		mockMvc.perform(get("/api/storage/ringing")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.error").value(nullValue()))
				.andReturn();
	}
	
	@Test
	public void testGetRingingsReturnJSONsObjectsIsArray() throws Exception {
		mockMvc.perform(get("/api/storage/ringing")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andDo(print())
				.andExpect(jsonPath("$.error").value(nullValue()))
				.andExpect(jsonPath("$.objects").isArray())
				.andReturn();
	}
	
	@Test
	public void testGetRingingsReturnJSONsObjectsUserIdIsCorrect() throws Exception {
		mockMvc.perform(get("/api/storage/ringing")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.error").value(nullValue()))
				.andExpect(jsonPath("$.objects").isArray())
				.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(Integer.toString(LOKKI_ID)))))
				.andReturn();
	}

	@Test
	public void testSaveRingingStatusIsOk() throws Exception {
		mockMvc.perform(post("/api/storage/ringing")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"row\":\"asdflkaöjö\"}".getBytes()))
				.andExpect(status().isOk())
				.andReturn();
	}
	@Test
	public void testSaveRingingReturnsJSON() throws Exception {
		mockMvc.perform(post("/api/storage/ringing")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"id\":\"1234\", \"row\":\"asdflkaöjö\"}".getBytes()))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andReturn();
	}
	
	@Test
	public void testSaveRingingReturnsErrorIfPostDataIsntJSON() throws Exception {
		mockMvc.perform(post("/api/storage/ringing")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_XML)
						.content("{\"id\":\"1234\", \"row\":\"asdflkaöjö\"}".getBytes()))
				.andExpect(status().isUnsupportedMediaType())
				.andReturn();
	}
	
	@Test
	public void testSaveRingingReturnsErrorWithWronglyNamedIdField() throws Exception {
		mockMvc.perform(post("/api/storage/ringing")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"JOTAIN\":\"1234\", \"row\":\"asdflkaöjö\"}".getBytes()))
		.andExpect(status().isBadRequest()) // Should be internal server error
		.andReturn();
	}

	@Test
	public void testSaveRingingReturnsErrorWithWronglyNamedRowField() throws Exception {
		mockMvc.perform(post("/api/storage/ringing")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"id\":\"1234\", \"ABCD\":\"asdflkaöjö\"}".getBytes()))
		.andExpect(status().isBadRequest()) // Should be internal server error
		.andReturn();
	}

	@Test
	public void testSaveRingingAcceptsContentWithoutId() throws Exception {
		mockMvc.perform(post("/api/storage/ringing")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"row\":\"asdflkaöjö\"}".getBytes()))
		.andExpect(status().isOk()) // Should be internal server error
		.andReturn();
	}
	
	@Test
	public void testSaveRingingReturnsRowWithCorrectColumns() throws Exception {
		mockMvc.perform(post("/api/storage/ringing")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"row\":\"asdflkaöjö\"}".getBytes()))
		.andExpect(status().isOk())
		.andExpect(jsonPath("$.object.id").value(notNullValue()))
		.andExpect(jsonPath("$.object.userId").value(notNullValue()))
		.andExpect(jsonPath("$.object.row").value(notNullValue()))
		.andReturn();
	}
	
	@Test
	public void testDeleteRingingStatusIsOk() throws Exception {
		mockMvc.perform(delete("/api/storage/ringing")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"id\":\"1\", \"userId\":\"846\", \"row\":\"asdflökjasd\"}".getBytes()))
				.andExpect(status().isOk())
				.andReturn();
		}
	
	@Test
	public void testDeleteRingingReturnsJSON() throws Exception {
		mockMvc.perform(delete("/api/storage/ringing")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"id\":\"1\", \"userId\":\"846\", \"row\":\"asdflökjasd\"}".getBytes()))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andReturn();
	}
	
	@Test
	public void testDeleteRingingReturnsErrorIfDeleteDataIsntJSON() throws Exception {
		mockMvc.perform(delete("/api/storage/ringing")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_XML)
						.content("{\"id\":\"1\", \"userId\":\"846\", \"row\":\"asdflökjasd\"}".getBytes()))
				.andExpect(status().isUnsupportedMediaType())
				.andReturn();
	}
	
	@Test
	public void testDeleteRingingReturnsErrorIfUserIdDoesNotMatchRowUserId() throws Exception {
		mockMvc.perform(delete("/api/storage/ringing")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_XML)
						.content("{\"id\":\"1\", \"userId\":\"123\", \"row\":\"asdflökjasd\"}".getBytes()))
				.andExpect(status().isUnsupportedMediaType())
				.andReturn();
	}
	
	@Test
	public void testGetRecoveryStatusIsOk() throws Exception {
		mockMvc.perform(get("/api/storage/recovery")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andReturn();
	}
	
	@Test
	public void testGetRecoveriesReturnsJSON() throws Exception {
		mockMvc.perform(get("/api/storage/recovery")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andReturn();
	}
	
	@Test
	public void testGetRecoveriesReturnJSONsSuccessIsTrue() throws Exception {
		mockMvc.perform(get("/api/storage/recovery")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andReturn();
	}
	
	@Test
	public void testGetRecoveriesReturnJSONsContainsNoErrors() throws Exception {
		mockMvc.perform(get("/api/storage/recovery")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.error").value(nullValue()))
				.andReturn();
	}
	
	@Test
	public void testGetRecoveriesReturnJSONsObjectsIsArray() throws Exception {
		mockMvc.perform(get("/api/storage/recovery")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andDo(print())
				.andExpect(jsonPath("$.error").value(nullValue()))
				.andExpect(jsonPath("$.objects").isArray())
				.andReturn();
	}
	
	@Test
	public void testGetRecoveriesReturnJSONsObjectsUserIdIsCorrect() throws Exception {
		mockMvc.perform(get("/api/storage/recovery")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.error").value(nullValue()))
				.andExpect(jsonPath("$.objects").isArray())
				.andExpect(jsonPath("$.objects[*].userId", everyItem(equalTo(Integer.toString(LOKKI_ID)))))
				.andReturn();
	}
	
	@Test
	public void testSaveRecoveryStatusIsOk() throws Exception {
		mockMvc.perform(post("/api/storage/recovery")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"row\":\"asdflkaöjö\"}".getBytes()))
				.andExpect(status().isOk())
				.andReturn();
	}
	
	@Test
	public void testSaveRecoveryReturnsJSON() throws Exception {
		mockMvc.perform(post("/api/storage/recovery")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"row\":\"asdflkaöjö\"}".getBytes()))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andReturn();
	}
	
	@Test
	public void testSaveRecoveryReturnsErrorIfPostDataIsntJSON() throws Exception {
		mockMvc.perform(post("/api/storage/recovery")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_XML)
						.content("{\"id\":\"1234\", \"row\":\"asdflkaöjö\"}".getBytes()))
				.andExpect(status().isUnsupportedMediaType())
				.andReturn();
	}
	
	@Test
	public void testSaveRecoveryReturnsErrorWithWronglyNamedIdField() throws Exception {
		mockMvc.perform(post("/api/storage/recovery")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"JOTAIN\":\"1234\", \"row\":\"asdflkaöjö\"}".getBytes()))
		.andExpect(status().isBadRequest()) // Should be internal server error
		.andReturn();
	}

	@Test
	public void testSaveRecoveryReturnsErrorWithWronglyNamedRowField() throws Exception {
		mockMvc.perform(post("/api/storage/recovery")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"ABCD\":\"asdflkaöjö\"}".getBytes()))
		.andExpect(status().isBadRequest()) // Should be internal server error
		.andReturn();
	}

	@Test
	public void testSaveRecoveryAcceptsContentWithoutId() throws Exception {
		mockMvc.perform(post("/api/storage/recovery")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"row\":\"asdflkaöjö\"}".getBytes()))
		.andExpect(status().isOk()) // Should be internal server error
		.andReturn();
	}
	
	@Test
	public void testSaveRecoveryReturnsRowWithCorrectColumns() throws Exception {
		mockMvc.perform(post("/api/storage/recovery")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"row\":\"asdflkaöjö\"}".getBytes()))
		.andExpect(status().isOk())
		.andExpect(jsonPath("$.object.id").value(notNullValue()))
		.andExpect(jsonPath("$.object.userId").value(notNullValue()))
		.andExpect(jsonPath("$.object.row").value(notNullValue()))
		.andReturn();
	}
	
	@Test
	public void testDeleteRecoveryStatusIsOk() throws Exception {
		mockMvc.perform(delete("/api/storage/recovery")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"id\":\"1\", \"userId\":\"846\", \"row\":\"asdflökjasd\"}".getBytes()))
				.andExpect(status().isOk())
				.andReturn();
		}
	
	@Test
	public void testDeleteRecoveryReturnsJSON() throws Exception {
		mockMvc.perform(delete("/api/storage/recovery")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"id\":\"1\", \"userId\":\"846\", \"row\":\"asdflökjasd\"}".getBytes()))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andReturn();
	}
	
	@Test
	public void testDeleteRecoveryReturnsErrorIfDeleteDataIsntJSON() throws Exception {
		mockMvc.perform(delete("/api/storage/recovery")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_XML)
						.content("{\"id\":\"1\", \"userId\":\"846\", \"row\":\"asdflökjasd\"}".getBytes()))
				.andExpect(status().isUnsupportedMediaType())
				.andReturn();
	}
	
	@Test
	public void testDeleteRecoveryReturnsErrorIfUserIdDoesNotMatchRowUserId() throws Exception {
		mockMvc.perform(delete("/api/storage/recovery")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_XML)
						.content("{\"id\":\"1\", \"userId\":\"123\", \"row\":\"asdflökjasd\"}".getBytes()))
				.andExpect(status().isUnsupportedMediaType())
				.andReturn();
	}
	
}
