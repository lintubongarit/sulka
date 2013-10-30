package edu.helsinki.sulka.controllers;

import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
	public void testLocalStorageControllerStatusIsOk() throws Exception {
		mockMvc.perform(post("/api/storage/ringing/save")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"id\":\"1234\", \"row\":\"asdflkaöjö\"}".getBytes()))
				.andExpect(status().isOk())
				.andReturn();
	}
	@Test
	public void testLocalStorageControllerReturnsJSON() throws Exception {
		mockMvc.perform(post("/api/storage/ringing/save")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"id\":\"1234\", \"row\":\"asdflkaöjö\"}".getBytes()))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andReturn();
	}
	
	@Test
	public void testLocalStorageControllerReturnsErrorIfPostDataIsntJSON() throws Exception {
		mockMvc.perform(post("/api/storage/ringing/save")
						.session(lokkiHttpSession)
						.contentType(MediaType.APPLICATION_XML)
						.content("{\"id\":\"1234\", \"row\":\"asdflkaöjö\"}".getBytes()))
				.andExpect(status().isUnsupportedMediaType())
				.andReturn();
	}
	
	@Test
	public void testLocalStorageControllerReturnsErrorWithWronglyNamedIdField() throws Exception {
		mockMvc.perform(post("/api/storage/ringing/save")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"JOTAIN\":\"1234\", \"row\":\"asdflkaöjö\"}".getBytes()))
		.andExpect(status().isBadRequest()) // Should be internal server error
		.andReturn();
	}

	@Test
	public void testLocalStorageControllerReturnsErrorWithWronglyNamedRowField() throws Exception {
		mockMvc.perform(post("/api/storage/ringing/save")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"id\":\"1234\", \"ABCD\":\"asdflkaöjö\"}".getBytes()))
		.andExpect(status().isBadRequest()) // Should be internal server error
		.andReturn();
	}
}
