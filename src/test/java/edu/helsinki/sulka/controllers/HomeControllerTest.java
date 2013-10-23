package edu.helsinki.sulka.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import edu.helsinki.sulka.SecuritySessionHelper;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/security.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class HomeControllerTest {

	@Autowired
	private WebApplicationContext wac;

	@Autowired
	private FilterChainProxy springSecurityFilterChain;

	private MockMvc mockMvc;
	
	private MockHttpSession userSession;

	private final String LOGIN_PAGE_URL = "/login";
	private final String SECURED_URI = "/";

	@Before
	public void setup() {
		mockMvc = webAppContextSetup(wac).addFilters(springSecurityFilterChain).build();
		userSession = SecuritySessionHelper.createUserSession();
	}

	@Test
	public void itShouldDenyAnonymousAccess() throws Exception {
		mockMvc.perform(get(SECURED_URI)).andExpect(status().isUnauthorized());
	}
	
	@Test
	public void anonymousAccessToLoginPageFails() throws Exception {
		mockMvc.perform(get(LOGIN_PAGE_URL)).andExpect(status().isBadRequest());
	}


	@Test
	public void itShouldAllowAccessToSecuredPageForPermittedUser()
			throws Exception {
		mockMvc.perform(get(SECURED_URI).session(userSession)).andExpect(
				status().isOk());
	}

}
