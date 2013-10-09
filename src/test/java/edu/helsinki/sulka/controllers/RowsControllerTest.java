package edu.helsinki.sulka.controllers;

import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
public class RowsControllerTest {
    @Autowired
    private WebApplicationContext wac;
    
    private MockMvc mockMvc;
    private MockHttpSession mockHttpSession;

    @Before
    public void setup() {
    	this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    	this.mockHttpSession = new MockHttpSession();
    	
    	User legitUser = new User();
    	legitUser.setPass(true);
    	legitUser.setExpires_at(System.currentTimeMillis() / 1000 + 60);
    	this.mockHttpSession.setAttribute("user", legitUser);
    }

    private static final int LOKKI_ID = 846;
    
    @SuppressWarnings("unchecked")
	@Test
    public void testRingings() throws Exception {
    	/* These tests need to run as Heikki Lokki */
    	mockMvc.perform(get("/api/rows/ringings").session(mockHttpSession))
    		.andExpect(status().isBadRequest())
    		.andExpect(content().contentType("application/json;charset=UTF-8"))
    		.andExpect(jsonPath("$.success").value(false))
    		.andExpect(jsonPath("$.error").value(notNullValue()))
    		.andReturn();
    	mockMvc.perform(get("/api/rows/ringings?municipality=ESPOO").session(mockHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects", hasSize(greaterThanOrEqualTo(7))))
			.andExpect(jsonPath("$.objects[*].ringer", everyItem(equalTo(Integer.toString(LOKKI_ID)))))
			.andExpect(jsonPath("$.objects[*].municipality", everyItem(equalTo("ESPOO"))))
			.andReturn();
    	mockMvc.perform(get("/api/rows/ringings?municipality=VANTAA").session(mockHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects", hasSize(greaterThanOrEqualTo(2))))
			.andExpect(jsonPath("$.objects[*].person", everyItem(equalTo(Integer.toString(LOKKI_ID)))))
			.andExpect(jsonPath("$.objects[*].municipality", everyItem(equalTo("VANTAA"))))
			.andReturn();
    	mockMvc.perform(get("/api/rows/ringings?municipality=VANTAA&municipality=ESPOO").session(mockHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects", hasSize(greaterThanOrEqualTo(2))))
			.andExpect(jsonPath("$.objects[*].ringer", everyItem(equalTo(Integer.toString(LOKKI_ID)))))
			.andExpect(jsonPath("$.objects[*].municipality", everyItem(anyOf(equalTo("VANTAA"), equalTo("ESPOO")))))
			.andReturn();
	}
    
    @SuppressWarnings("unchecked")
	@Test
    public void testControls() throws Exception {
    	/* These tests need to run as Heikki Lokki */
    	mockMvc.perform(get("/api/rows/controls").session(mockHttpSession))
    		.andExpect(status().isBadRequest())
    		.andExpect(content().contentType("application/json;charset=UTF-8"))
    		.andExpect(jsonPath("$.success").value(false))
    		.andExpect(jsonPath("$.error").value(notNullValue()))
    		.andReturn();
    	mockMvc.perform(get("/api/rows/controls?municipality=ESPOO").session(mockHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects", hasSize(greaterThanOrEqualTo(7))))
			.andExpect(jsonPath("$.objects[*].ringer", everyItem(equalTo(Integer.toString(LOKKI_ID)))))
			.andExpect(jsonPath("$.objects[*].municipality", everyItem(equalTo("ESPOO"))))
			.andReturn();
    	mockMvc.perform(get("/api/rows/controls?municipality=VANTAA").session(mockHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects", hasSize(greaterThanOrEqualTo(2))))
			.andExpect(jsonPath("$.objects[*].ringer", everyItem(equalTo(Integer.toString(LOKKI_ID)))))
			.andExpect(jsonPath("$.objects[*].municipality", everyItem(equalTo("VANTAA"))))
			.andReturn();
    	mockMvc.perform(get("/api/rows/controls?municipality=VANTAA&municipality=ESPOO").session(mockHttpSession))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects", hasSize(greaterThanOrEqualTo(2))))
			.andExpect(jsonPath("$.objects[*].ringer", everyItem(equalTo(Integer.toString(LOKKI_ID)))))
			.andExpect(jsonPath("$.objects[*].municipality", everyItem(anyOf(equalTo("VANTAA"), equalTo("ESPOO")))))
			.andReturn();
	}
}
