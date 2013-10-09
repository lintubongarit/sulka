package edu.helsinki.sulka.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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
public class FieldsControllerTest {
    @Autowired
    private WebApplicationContext wac;
    
    private MockMvc mockMvc;

    @Before
    public void setup() {
    	this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    private static final int LOKKI_ID = 846;
    
    @SuppressWarnings("unchecked")
	@Test
    public void testAllGroups() throws Exception {
    	mockMvc.perform(get("/api/fields/groups"))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[?(@.name=='common')]").exists())
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields").isArray())
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields[?(@.field=='species')]").exists())
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields[?(@.field=='species')].type", everyItem(equalTo("ENUMERATION"))))
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields[?(@.field=='ringer')]").exists())
			.andReturn();
	}
    
    @SuppressWarnings("unchecked")
	@Test
    public void testAllFields() throws Exception {
    	mockMvc.perform(get("/api/fields/all"))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[?(@.field=='species')]").exists())
			.andExpect(jsonPath("$.objects[?(@.field=='species')].type", everyItem(equalTo("ENUMERATION"))))
			.andExpect(jsonPath("$.objects[?(@.field=='species')].enumerationValues").isArray())
			.andExpect(jsonPath("$.objects[?(@.field=='ringer')]").exists())
			.andReturn();
	}
    
    @SuppressWarnings("unchecked")
	@Test
    public void testBrowsingGroups() throws Exception {
    	mockMvc.perform(get("/api/fields/groups/browsing"))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[?(@.name=='common')]").exists())
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields").isArray())
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields[?(@.field=='species')]").exists())
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields[?(@.field=='species')].type", everyItem(equalTo("ENUMERATION"))))
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields[?(@.field=='ringer')]").exists())
			.andReturn();
	}
    
    @SuppressWarnings("unchecked")
	@Test
    public void testBrowsingFields() throws Exception {
    	mockMvc.perform(get("/api/fields/all/browsing"))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[?(@.field=='species')]").exists())
			.andExpect(jsonPath("$.objects[?(@.field=='species')].type", everyItem(equalTo("ENUMERATION"))))
			.andExpect(jsonPath("$.objects[?(@.field=='species')].enumerationValues").isArray())
			.andExpect(jsonPath("$.objects[?(@.field=='ringer')]").exists())
			.andReturn();
	}
    
    @SuppressWarnings("unchecked")
	@Test
    public void testRingingsGroups() throws Exception {
    	mockMvc.perform(get("/api/fields/groups/ringings"))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[?(@.name=='common')]").exists())
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields").isArray())
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields[?(@.field=='species')]").exists())
			.andExpect(jsonPath("$.objects[?(@.name=='common')].fields[?(@.field=='species')].type", everyItem(equalTo("ENUMERATION"))))
			.andReturn();
	}
    
    @SuppressWarnings("unchecked")
	@Test
    public void testRingingsFields() throws Exception {
    	mockMvc.perform(get("/api/fields/all/ringings"))
			.andExpect(status().isOk())
			.andExpect(content().contentType("application/json;charset=UTF-8"))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.error").value(nullValue()))
			.andExpect(jsonPath("$.objects").isArray())
			.andExpect(jsonPath("$.objects[?(@.field=='species')]").exists())
			.andExpect(jsonPath("$.objects[?(@.field=='species')].type", everyItem(equalTo("ENUMERATION"))))
			.andExpect(jsonPath("$.objects[?(@.field=='species')].enumerationValues").isArray())
			.andReturn();
	}
}
