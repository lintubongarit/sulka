package edu.helsinki.sulka.models;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class UserTest {

	private User user;

	@Before
	public void setUp(){
		this.user = new User();
	}
	
	@Test
	public void testAccessStatusIsOKIfPassIsTrueAndHasntExpired(){
		user.setPass(true);
		user.setExpires_at(System.currentTimeMillis() / 1000 + 60);
		assertTrue("Access status is OK if pass = true and expires_at is in the future", user.accessStatus() == 0);
	}
	
	@Test
	public void testAccessStatusIsExpiredIfPassIsTrueAndHasExpired(){
		user.setPass(true);
		user.setExpires_at(System.currentTimeMillis() / 1000 - 60);
		assertTrue("Access status is expired if pass = true and expires_at is in the past", user.accessStatus() == 1);
	}
	
	@Test
	public void testAccessStatusIsFailIfPassIsNotTrueAndHasExpired(){
		user.setPass(false);
		user.setExpires_at(System.currentTimeMillis() / 1000 - 60);
		assertTrue("Access status is expired if pass = true and expires_at is in the past", user.accessStatus() == 2);
	}

}
