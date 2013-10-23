package edu.helsinki.sulka;

import java.util.Arrays;

import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

import edu.helsinki.sulka.models.User;

public class SecuritySessionHelper {
	public static MockHttpSession createSession(User user, GrantedAuthority grants[]) {
		MockHttpSession session = new MockHttpSession();
		
		if (user != null) {
			session.setAttribute("user", user);
		}
		
		Authentication authentication = new UsernamePasswordAuthenticationToken(
				user.getLogin_id(), user.getEmail(), Arrays.asList(grants));
		SecurityContext securityContext = SecurityContextHolder.getContext();
		securityContext.setAuthentication(authentication);
		session.setAttribute(
				HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
				securityContext);
		return session;
	}
	
	public static MockHttpSession createUserSession(User user) {
		return createSession(user, new GrantedAuthority[] { new SimpleGrantedAuthority("USER") });
	}
	
	public static MockHttpSession createUserSession() {
		User legitUser = new User();
		legitUser.setPass(true);
		legitUser.setLogin_id("10020");
		legitUser.setExpires_at(System.currentTimeMillis() / 1000 + 60);
		legitUser.setName("Test User");
		legitUser.setEmail("test@user.invalid");
		return createUserSession(legitUser);
	}
	
	public static MockHttpSession createUserSession(String ringerID) {
		User legitUser = new User();
		legitUser.setPass(true);
		legitUser.setLogin_id(ringerID);
		legitUser.setExpires_at(System.currentTimeMillis() / 1000 + 60);
		legitUser.setName("Test User");
		legitUser.setEmail("test@user.invalid");
		return createUserSession(legitUser);
	}
	
	public static MockHttpSession createAdminSession(User user) {
		return createSession(
				user, new GrantedAuthority[] { new SimpleGrantedAuthority("USER"), new SimpleGrantedAuthority("ADMIN") });
	}
	
	public static MockHttpSession createAdminSession() {
		User legitUser = new User();
		legitUser.setPass(true);
		legitUser.setLogin_id("admin_holopainen");
		legitUser.setExpires_at(System.currentTimeMillis() / 1000 + 60);
		legitUser.setName("Test Admin");
		legitUser.setEmail("test@admin.invalid");
		return createAdminSession(legitUser);
	}
	
	public static MockHttpSession createBadSession(User user) {
		return createSession(user, new GrantedAuthority[] {});
	}
	
	public static MockHttpSession createBadSession() {
		return createBadSession(null);
	}
	
	public static MockHttpSession createEmptySession() {
		return new MockHttpSession();
	}
}

