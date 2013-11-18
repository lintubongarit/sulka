package edu.helsinki.sulka.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ActiveProfiles;
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
@ActiveProfiles("dev")
public class ValidationControllerTest {

	@Autowired
	private WebApplicationContext wac;

	@Autowired
	private FilterChainProxy springSecurityFilterChain;

	private MockMvc mockMvc;
	private MockHttpSession lokkiHttpSession;
	
	private static final int LOKKI_ID = 846;
	
	private String validRowJson;
	private String invalidRowJson;

	@Before
    public void setup() {
		mockMvc = MockMvcBuilders.webAppContextSetup(wac).addFilters(springSecurityFilterChain).build();
		
		User lokki = new User();
    	lokki.setPass(true);
    	lokki.setLogin_id(Integer.toString(LOKKI_ID));
    	lokki.setExpires_at(System.currentTimeMillis() / 1000 + 60);
    	lokkiHttpSession = SecuritySessionHelper.createUserSession(lokki);
	
    	String validDate = "27.6.2005";
		validRowJson = "{\"nameRing\":\"B 0123469\",\"ring\":\"B 0123469\",\"lon\":\"33615\",\"eventDate\":\""
				+ validDate + "\",\"sex\":\"K\",\"species\":\"ACCNIS\",\"sexDeterminationMethod\":\"K\",\"municipality\":\"HAUHO\",\"weightInGrams\":\"112\",\"hour\":\"12\",\"wingLengthInMillimeters\":\"81\",\"type\":\"Rengastus\",\"id\":\"B 0123469\",\"clutchNumber\":\"2\",\"ringer\":\"846\",\"age\":\"PP\",\"coordinateType\":\"ykj\",\"lat\":\"67885\",\"ringEnd\":\"B 0123469\"}";
	
		String invalidDate = "57.6.2005";
		invalidRowJson = "{\"nameRing\":\"B 0123469\",\"ring\":\"B 0123469\",\"lon\":\"33615\",\"eventDate\":\""
				+ invalidDate + "\",\"sex\":\"K\",\"species\":\"ACCNIS\",\"sexDeterminationMethod\":\"K\",\"municipality\":\"HAUHO\",\"weightInGrams\":\"112\",\"hour\":\"12\",\"wingLengthInMillimeters\":\"81\",\"type\":\"Rengastus\",\"id\":\"B 0123469\",\"clutchNumber\":\"2\",\"ringer\":\"846\",\"age\":\"PP\",\"coordinateType\":\"ykj\",\"lat\":\"67885\",\"ringEnd\":\"B 0123469\"}";
	}

	@Test
	public void testValidJSON() throws Exception {
		mockMvc.perform(post("/api/validate")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(validRowJson))
			.andExpect(status().isOk())
			.andExpect(content().contentType(MediaType.APPLICATION_JSON + ";charset=UTF-8"))
			.andExpect(jsonPath("$.passes").value(true));
	}
	
	@Test
	public void testInvalidJSON() throws Exception {
		mockMvc.perform(post("/api/validate")
				.session(lokkiHttpSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content(invalidRowJson))
			.andExpect(status().isOk())
			.andExpect(content().contentType(MediaType.APPLICATION_JSON + ";charset=UTF-8"))
			.andExpect(jsonPath("$.passes").value(false))
			.andExpect(jsonPath("$.errors.eventDate").isArray())
			.andExpect(jsonPath("$.errors.eventDate[*].errorName", hasItem(equalTo("invalid_date"))));
	}
}
