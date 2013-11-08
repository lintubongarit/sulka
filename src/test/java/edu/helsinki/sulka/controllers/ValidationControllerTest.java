package edu.helsinki.sulka.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
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
public class ValidationControllerTest {

	@Autowired
	private WebApplicationContext wac;

	@Autowired
	private FilterChainProxy springSecurityFilterChain;

	private MockMvc mockMvc;
	private MockHttpSession lokkiHttpSession;
	
	private static final int LOKKI_ID = 846;

	@Before
    public void setup() {
		mockMvc = MockMvcBuilders.webAppContextSetup(wac).addFilters(springSecurityFilterChain).build();
		
		User lokki = new User();
    	lokki.setPass(true);
    	lokki.setLogin_id(Integer.toString(LOKKI_ID));
    	lokki.setExpires_at(System.currentTimeMillis() / 1000 + 60);
    	lokkiHttpSession = SecuritySessionHelper.createUserSession(lokki);
	
	}

	@Test
	public void testWithDataParameterRequestIsOK() throws Exception {
		mockMvc.perform(get("/api/validate?data={}").session(lokkiHttpSession))
			.andExpect(status().isOk())
			.andReturn();
	}
	
	@Test
	public void testControllerReturnsJSON() throws Exception {
		mockMvc.perform(get("/api/validate?data={}").session(lokkiHttpSession))
			.andExpect(content().contentType(MediaType.APPLICATION_JSON + ";charset=UTF-8")).andReturn();
	}
	
	@Test
	public void testWithoutDataParameterRequestIsInternalServerError() throws Exception {
		mockMvc.perform(get("/api/validate?").session(lokkiHttpSession))
			.andExpect(status().isBadRequest())
			.andReturn();
	}

}
