package edu.helsinki.sulka.authentication;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) throws IOException, ServletException {
        //response.sendError( HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    	response.sendError( HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}
