package edu.helsinki.sulka.authentication;

import java.util.List;
import java.util.ArrayList;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class RestAuthenticationProvider implements AuthenticationProvider {

	@Override
	public Authentication authenticate(Authentication auth)
			throws AuthenticationException {

		String username = auth.getName();
		String password = auth.getCredentials().toString();
		List<GrantedAuthority> grantedAuths = new ArrayList<GrantedAuthority>();

		try {
			Long.parseLong(username);
			grantedAuths.add(new SimpleGrantedAuthority("USER"));

		} catch (Exception e) {
			grantedAuths.add(new SimpleGrantedAuthority("ADMIN"));
		}

		auth.setAuthenticated(true);

		return new UsernamePasswordAuthenticationToken(username, password,
				grantedAuths);
	}

	@Override
	public boolean supports(Class<?> authType) {
		return authType.equals(UsernamePasswordAuthenticationToken.class);
	}

}
