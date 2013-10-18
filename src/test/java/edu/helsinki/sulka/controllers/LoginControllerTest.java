package edu.helsinki.sulka.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
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
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class LoginControllerTest {
    @Autowired
    private WebApplicationContext wac;
    
    private MockMvc mockMvc;

    @Before
    public void setup() {
    	this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    @Test
    public void testLoginIsBadRequestWithoutAnyAuthVars() throws Exception {
    	mockMvc.perform(get("/login"))
    		.andExpect(status().isBadRequest())
    		.andReturn();
	}
    
    @Test
    public void testLoginIsBadRequestWithOnlySomeAuthVars() throws Exception {
    	mockMvc.perform(get("/login?key=test"))
    		.andExpect(status().isBadRequest())
    		.andReturn();
    	mockMvc.perform(get("/login?iv=test"))
		.andExpect(status().isBadRequest())
		.andReturn();
    	mockMvc.perform(get("/login?data=test"))
		.andExpect(status().isBadRequest())
		.andReturn();
    	mockMvc.perform(get("/login?key=test&iv=test"))
		.andExpect(status().isBadRequest())
		.andReturn();
    	mockMvc.perform(get("/login?key=test&iv=test"))
		.andExpect(status().isBadRequest())
		.andReturn();
    	mockMvc.perform(get("/login?key=test&data=test"))
		.andExpect(status().isBadRequest())
		.andReturn();
    	mockMvc.perform(get("/login?iv=test&data=test"))
		.andExpect(status().isBadRequest())
		.andReturn();
	}
    
    @Test
    public void testLoginRedirectsWithAllAuthVariables() throws Exception {
    	mockMvc.perform(get("/login?key=test&iv=test&data=test"))
    		.andExpect(status().isFound())
    		.andReturn();
	}

}
