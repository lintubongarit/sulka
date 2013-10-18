package edu.helsinki.sulka.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
    
    private MockHttpSession badHttpSession;
    private MockHttpSession goodHttpSession;
    
    @Before
    public void setup() {
    	this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    	
    	this.goodHttpSession = new MockHttpSession();
    	User legitUser = new User();
    	legitUser.setPass(true);
    	legitUser.setLogin_id("10020");
    	legitUser.setExpires_at(System.currentTimeMillis() / 1000 + 60);
    	this.goodHttpSession.setAttribute("user", legitUser);
    	
    	this.badHttpSession = new MockHttpSession();
    	User falseUser = new User();
    	falseUser.setPass(false);
    	legitUser.setLogin_id("10020");
    	falseUser.setExpires_at(System.currentTimeMillis() / 1000 - 60);
    	this.badHttpSession.setAttribute("user", falseUser);
    }

    @Test
    public void testHome() throws Exception {
    	mockMvc.perform(get("/").session(goodHttpSession))
    		.andExpect(view().name(equalTo("slick")))
    		.andExpect(status().isOk())
    		.andReturn();
    	
    	mockMvc.perform(get("/"))
			.andExpect(status().isForbidden())
			.andReturn();
    	
    	mockMvc.perform(get("/").session(badHttpSession))
    		.andExpect(status().isForbidden())
    		.andReturn();
	}
}
