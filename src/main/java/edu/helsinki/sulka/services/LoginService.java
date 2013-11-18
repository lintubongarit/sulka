package edu.helsinki.sulka.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.User;

@Service
public class LoginService {

	@Autowired
	private LintuvaaraAuthDecryptService authService;

	public User login(String iv, String key, String data) {
		User user = authService.auth(key, iv, data);

		if (user.accessStatus() == 0) {
			String userid;
			userid = user.getLogin_id();

			List<GrantedAuthority> grantedAuths = new ArrayList<GrantedAuthority>();

			try {
				Long.parseLong(userid);
				grantedAuths.add(new SimpleGrantedAuthority("USER"));

			} catch (Exception e) {
				if (userid.contains("admin")) {
					grantedAuths.add(new SimpleGrantedAuthority("USER"));
					grantedAuths.add(new SimpleGrantedAuthority("ADMIN"));
				} else {
					return null;
				}
			}

			Authentication authentication = new UsernamePasswordAuthenticationToken(
					user.getName(), user.getEmail(), grantedAuths);
			SecurityContextHolder.getContext()
					.setAuthentication(authentication);

		}
		
		return user;
	}
}
