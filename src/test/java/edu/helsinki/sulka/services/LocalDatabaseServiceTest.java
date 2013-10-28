package edu.helsinki.sulka.services;

import static org.junit.Assert.*;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.service.ServiceRegistryBuilder;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import edu.helsinki.sulka.models.DbRowRingings;

public class LocalDatabaseServiceTest {
	
	private SessionFactory sessionFactory;
	private ServiceRegistry serviceRegistry;
	
	private static final int USER_ID = 846;
	
	private LocalDatabaseService localDatabaseService;

	@Before
	public void setUp(){
		localDatabaseService = new LocalDatabaseService();
		Configuration configuration = new Configuration();
		configuration.addAnnotatedClass(edu.helsinki.sulka.models.DbRowRingings.class);
		configuration.setProperty("hibernate.dialect", "org.hibernate.dialect.H2Dialect");
		configuration.setProperty("hibernate.connection.driver_class", "org.h2.Driver");
		configuration.setProperty("hibernate.connection.url", "jdbc:h2:mem");
		configuration.setProperty("hibernate.hbm2ddl.auto", "create");
		serviceRegistry = new ServiceRegistryBuilder().applySettings(configuration.getProperties()).buildServiceRegistry();
		sessionFactory = configuration.buildSessionFactory(serviceRegistry);
		
		localDatabaseService = new LocalDatabaseService();
		localDatabaseService.setSessionFactory(sessionFactory);
		
	}
	
	@After
	public void tearDown(){
		sessionFactory.close();
	}
	
	@Test
	public void testNewDatabaseIsEmpty() {
		List<DbRowRingings> rows = localDatabaseService.getRows(USER_ID);
		assertTrue(rows.isEmpty());
	}
	

}
