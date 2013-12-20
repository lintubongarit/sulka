package edu.helsinki.sulka.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.ActiveProfiles;
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
@ActiveProfiles("dev")
public class CoordinateControllerTest {

	@Autowired
	private Logger logger;
	
	@Autowired
	private WebApplicationContext wac;
	
	@Autowired
	private FilterChainProxy springSecurityFilterChain;
	
	private static final String USER_ID = "CoordinateControllerTestUserId_123456789";
	private static final int CORRECT_LONGITUDE = 3332967;
	private static final int CORRECT_LATITUDE = 6665447;
	
	private MockMvc mockMvc;
	private MockHttpSession lokkiHttpSession;
	
	@Before
	public void setUp(){
		mockMvc = webAppContextSetup(wac).addFilters(springSecurityFilterChain).build();
    	
    	User lokki = new User();
    	lokki.setPass(true);
    	lokki.setLogin_id(USER_ID);
    	lokki.setExpires_at(System.currentTimeMillis() / 1000 + 60);
    	lokkiHttpSession = SecuritySessionHelper.createUserSession(lokki);
	}
	
	@Test
	public void testConvertCoordinateResponseIsValid() throws Exception {
		mockMvc.perform(get("/api/coordinate?lat=60.066807847369&lon=23.996812547705")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.error").value(nullValue()))
				.andExpect(jsonPath("$.object").value(notNullValue()))
				.andExpect(jsonPath("$.object.lon").exists())
				.andExpect(jsonPath("$.object.lat").exists())
				.andReturn();
	}
	
	@Test
	public void testConvertCoordinatesReturnsCorrectlyConvertedCoordinates() throws Exception{
		mockMvc.perform(get("/api/coordinate?lat=60.066807847369&lon=23.996812547705")
						.session(lokkiHttpSession))
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json;charset=UTF-8"))
				.andExpect(jsonPath("$.object.lon").value(equalTo(CORRECT_LONGITUDE)))
				.andExpect(jsonPath("$.object.lat").value(equalTo(CORRECT_LATITUDE)))
				.andReturn();
	}
	
	@Test
	public void testNoSessionWithConvertCoordinatesPreventsAccess() throws Exception{
		mockMvc.perform(get("/api/coordinate?lat=60.066807847369&lon=23.996812547705"))
			.andExpect(status().isUnauthorized())
			.andReturn();
	}

	@Test
	public void testConvertCoordinatesWithOnlyLatitudeIsBadRequest() throws Exception{
		mockMvc.perform(get("/api/coordinate?lat=60.066807847369")
						.session(lokkiHttpSession))
				.andExpect(status().isBadRequest())
				.andReturn();
	}

	@Test
	public void testConvertCoordinatesWithOnlyLongitudeIsBadRequest() throws Exception{
		mockMvc.perform(get("/api/coordinate?lon=23.996812547705")
						.session(lokkiHttpSession))
				.andExpect(status().isBadRequest())
				.andReturn();
	}
	
	@Test
	public void testConvertCoordinatesWithTextInParamsIsBadRequest() throws Exception{
		mockMvc.perform(get("/api/coordinate?lon=23.asdf&lat=60.4lkjfvi")
						.session(lokkiHttpSession))
				.andExpect(status().isBadRequest())
				.andReturn();
	}
}
