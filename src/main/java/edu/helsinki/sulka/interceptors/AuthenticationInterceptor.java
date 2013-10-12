package edu.helsinki.sulka.interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import edu.helsinki.sulka.models.User;

public class AuthenticationInterceptor implements HandlerInterceptor

{
	@Autowired
	private Logger logger;
	
	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object arg2) throws Exception {

		HttpSession session = request.getSession(false);

		if (session == null) {
			response.setStatus(403);
			return false;
		}
		
		User user = (User) session.getAttribute("user");
		if (user != null && user.accessStatus() == 0) {
			user.refreshSession();
			return true;
		}

		session.removeAttribute("user");
		response.setStatus(403);
		return false;
	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1,
			Object arg2, ModelAndView arg3) throws Exception {
		// Ignore
	}

	@Override
	public void afterCompletion(HttpServletRequest arg0,
			HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		// Ignore
	}

}
