package edu.helsinki.sulka.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/security.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class LoginControllerTest {
    @Autowired
    private WebApplicationContext wac;
    
	@Autowired
	private FilterChainProxy springSecurityFilterChain;

    private MockMvc mockMvc;
    
    private String REDIRECT_URI = "http://lintuvaara.ihku.fi/";

    @Before
    public void setup() {
    	mockMvc = MockMvcBuilders.webAppContextSetup(wac).addFilters(springSecurityFilterChain).build();
    }

    @Test
    public void testLoginIsBadRequestWithoutAnyAuthVars() throws Exception {
    	mockMvc.perform(get("/login"))
    		.andExpect(redirectedUrl(REDIRECT_URI))
    		.andReturn();
	}
    
    @Test
    public void testLoginIsBadRequestWithOnlySomeAuthVars() throws Exception {
    	mockMvc.perform(get("/login?key=test"))
    		.andExpect(redirectedUrl(REDIRECT_URI))
    		.andReturn();
    	mockMvc.perform(get("/login?iv=test"))
			.andExpect(redirectedUrl(REDIRECT_URI))
			.andReturn();
    	mockMvc.perform(get("/login?data=test"))
			.andExpect(redirectedUrl(REDIRECT_URI))
			.andReturn();
    	mockMvc.perform(get("/login?key=test&iv=test"))
			.andExpect(redirectedUrl(REDIRECT_URI))
			.andReturn();
    	mockMvc.perform(get("/login?key=test&iv=test"))
			.andExpect(redirectedUrl(REDIRECT_URI))
			.andReturn();
    	mockMvc.perform(get("/login?key=test&data=test"))
			.andExpect(redirectedUrl(REDIRECT_URI))
			.andReturn();
    	mockMvc.perform(get("/login?iv=test&data=test"))
			.andExpect(redirectedUrl(REDIRECT_URI))
			.andReturn();
	}
}
