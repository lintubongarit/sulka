package edu.helsinki.sulka.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import edu.helsinki.sulka.models.User;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration({ "file:src/main/webapp/WEB-INF/spring/root-context.xml",
                "file:src/main/webapp/WEB-INF/spring/security.xml",
                "file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"

})
@ActiveProfiles("dev")
public class TabsControllerTest {

        @Autowired
        private FilterChainProxy springSecurityFilterChain;

        @Autowired
        private WebApplicationContext wac;

        private MockMvc mockMvc;

        private final String LOGIN_PAGE_URL = "/login";
        private final String SECURED_URI = "/";

        @Before
        public void setup() {
                mockMvc = webAppContextSetup(wac)
                                // Enable Spring Security
                                .addFilters(springSecurityFilterChain)
                                .build();
        }

        @Test
        public void itShouldDenyAnonymousAccess() throws Exception {
                mockMvc.perform(get(SECURED_URI)).andExpect(status().isUnauthorized());
        }
        
        private static final String SSO_URL = "http://lintuvaara.ihku.fi/";
        
        @Test
        public void itShouldRedirectAnonymousAccessToSSOPage() throws Exception {
                mockMvc.perform(get(LOGIN_PAGE_URL)).andExpect(redirectedUrl(SSO_URL));
        }


        @Test
        public void itShouldAllowAccessToSecuredPageForPermittedUser()
                        throws Exception {

                User legitUser = new User();
                legitUser.setPass(true);
                legitUser.setLogin_id("10020");
                legitUser.setExpires_at(System.currentTimeMillis() / 1000 + 60);
                legitUser.setName("Test User");
                legitUser.setEmail("test@user.invalid");

                List<GrantedAuthority> userAuths = new ArrayList<GrantedAuthority>();
                userAuths.add(new SimpleGrantedAuthority("USER"));

                MockHttpSession session = new MockHttpSession();

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                                legitUser.getLogin_id(), legitUser.getEmail(), userAuths);

                SecurityContext securityContext = SecurityContextHolder.getContext();

                securityContext.setAuthentication(authentication);

                session.setAttribute("user", legitUser);

                session.setAttribute(
                                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                                securityContext);

                mockMvc.perform(get(SECURED_URI).session(session)).andExpect(
                                status().isOk());
        }

}