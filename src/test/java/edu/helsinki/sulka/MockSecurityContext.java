package edu.helsinki.sulka;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;

/**
 *	This class can be used to create mock security contexts for testing.
 */
public class MockSecurityContext implements SecurityContext {
	private static final long serialVersionUID = 1L;
	private Authentication authentication;

    public MockSecurityContext(Authentication authentication) {
        this.authentication = authentication;
    }

    @Override
    public Authentication getAuthentication() {
        return this.authentication;
    }

    @Override
    public void setAuthentication(Authentication authentication) {
        this.authentication = authentication;
    }
}

