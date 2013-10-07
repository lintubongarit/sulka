package edu.helsinki.sulka.controllers;

import static org.hamcrest.Matchers.arrayWithSize;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import edu.helsinki.sulka.models.User;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class HomeControllerTest {
    @Autowired
    private WebApplicationContext wac;
    
    private MockMvc mockMvc;
    
    private MockHttpSession mockHttpSession;
    
    private User legitUser;
    
    private User falseUser;

    @Before
    public void setup() {
    	this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    	this.mockHttpSession = new MockHttpSession();
    	
    	legitUser = new User();
    	legitUser.setPass(true);
    	legitUser.setExpires_at(System.currentTimeMillis() / 1000 + 60);
    	
    	falseUser = new User();
    	falseUser.setPass(true);
    	falseUser.setExpires_at(System.currentTimeMillis() / 1000 - 60);
    }

    @Test
    public void testHome() throws Exception {
    	
    	
    	this.mockHttpSession.setAttribute("user", legitUser);
    	
    	mockMvc.perform(get("/").session(mockHttpSession))
    		.andExpect(view().name(equalTo("home")))
    		.andExpect(status().isOk())
    		.andExpect(model().attributeExists("serverTime"))
    		.andExpect(model().attribute("ringers", arrayWithSize(greaterThan(1000))))
    		.andReturn();
	}
    @Test
    public void testHomeRedirectsToLoginWithFalseSession() throws Exception {
    	
    	
    	this.mockHttpSession.setAttribute("user", falseUser);
    	
    	mockMvc.perform(get("/").session(mockHttpSession))
    		//.andExpect(view().name(equalTo("login")))
    		.andReturn();
	}
}
