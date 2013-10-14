package edu.helsinki.sulka.interceptors;

import static org.junit.Assert.assertFalse;

import org.junit.Test;

public class AuthenticationInterceptorTest {

	@Test
	public void testGetUseFakeSession() {
		assertFalse("AuthenticationInterceptor is not configured to use fake session",
				AuthenticationInterceptor.getUseFakeSession());
	}

}
