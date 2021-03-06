package edu.helsinki.sulka.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.helsinki.sulka.configurations.SSOLoginPageURLConfiguration;
import edu.helsinki.sulka.configurations.TestLoginCodeConfiguration;
import edu.helsinki.sulka.models.User;
import edu.helsinki.sulka.services.LintuvaaraAuthDecryptService;
import edu.helsinki.sulka.services.LoginService;

/**
 * Handles requests for the login page and passing authentication variables to
 * Tipu-API's Lintuvaara authentication decryptor service
 */
@Controller
@SessionAttributes("user")
public class LoginController implements AuthenticationEntryPoint {

	@Autowired
	private Logger logger;

	@Autowired
	private LoginService loginService;

	/**
	 * This value should be set from a bean and disabled for production.
	 */
	@Autowired
	private SSOLoginPageURLConfiguration SSOLoginURL;

	/**
	 * redirects authentication variables key, iv and data to Tipu-API's
	 * Lintuvaara authentication decryptor service and saves user to session
	 */
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String login(Model model,
			@RequestParam(value = "key", required = false) String key,
			@RequestParam(value = "iv", required = false) String iv,
			@RequestParam(value = "data", required = false) String data) {

		if (key == null || iv == null || data == null) {
			return "redirect:" + SSOLoginURL.getURL();
		}
			
		User user = loginService.login(iv, key, data);
		
//		User user = new User();
//		user.setPass(true);
//		user.setLogin_id("846");
//		user.setName("Heikki Lokki");
//		user.refreshSession();
		
		model.addAttribute("user", user);
		
		List<GrantedAuthority> grantedAuths = new ArrayList<GrantedAuthority>();
		grantedAuths.add(new SimpleGrantedAuthority("USER"));
		Authentication authentication = new UsernamePasswordAuthenticationToken(
				user.getName(), user.getEmail(), grantedAuths);
		SecurityContextHolder.getContext()
				.setAuthentication(authentication);

		if (user.accessStatus() == 0) {
			return "redirect:/";
		}

		return "redirect:" + SSOLoginURL.getURL();
	}

	/**
	 * This value should be set from a bean and disabled for production.
	 */
	@Autowired
	private TestLoginCodeConfiguration testLoginCodeConfiguration;

	private static final boolean ALLOW_ONLY_LOCALHOST_TEST_LOGIN = true;

	/**
	 * Creates a fake user session for JS tests.
	 */
	@RequestMapping(value = "/testLogin/{code}", method = RequestMethod.GET)
	public String testLogin(HttpServletResponse response, Model model,
			@PathVariable String code, HttpServletRequest request) {
		if (testLoginCodeConfiguration.isCorrectCode(code)
				&& (!ALLOW_ONLY_LOCALHOST_TEST_LOGIN || request.getRemoteAddr()
						.equals("127.0.0.1"))) {
			User user = new User();
			user.setPass(true);
			user.setLogin_id("846");
			user.setName("Heikki Lokki");
			model.addAttribute("user", user);

			List<GrantedAuthority> grantedAuths = new ArrayList<GrantedAuthority>();
			grantedAuths.add(new SimpleGrantedAuthority("USER"));
			Authentication authentication = new UsernamePasswordAuthenticationToken(
					user.getName(), user.getEmail(), grantedAuths);
			SecurityContextHolder.getContext()
					.setAuthentication(authentication);

			return "redirect:/";
		} else {
			response.setStatus(403);
			return "/status/403";
		}
	}

	/**
	 * Creates a fake admin session for JS tests.
	 */
	@RequestMapping(value = "/testAdminLogin/{code}", method = RequestMethod.GET)
	public String testAdminLogin(HttpServletResponse response, Model model,
			@PathVariable String code, HttpServletRequest request) {
		if (testLoginCodeConfiguration.isCorrectCode(code)
				&& (!ALLOW_ONLY_LOCALHOST_TEST_LOGIN || request.getRemoteAddr()
						.equals("127.0.0.1"))) {
			User user = new User();
			user.setPass(true);
			user.setLogin_id("846");
			user.setName("Heikki Lokki");
			model.addAttribute("user", user);

			List<GrantedAuthority> grantedAuths = new ArrayList<GrantedAuthority>();
			grantedAuths.add(new SimpleGrantedAuthority("USER"));
			grantedAuths.add(new SimpleGrantedAuthority("ADMIN"));
			Authentication authentication = new UsernamePasswordAuthenticationToken(
					user.getName(), user.getEmail(), grantedAuths);
			SecurityContextHolder.getContext()
					.setAuthentication(authentication);

			return "redirect:/";
		} else {
			response.setStatus(403);
			return "/status/403";
		}
	}

	@Override
	public void commence(HttpServletRequest arg0, HttpServletResponse arg1,
			AuthenticationException arg2) throws IOException, ServletException {
		// TODO Auto-generated method stub

	}
}
