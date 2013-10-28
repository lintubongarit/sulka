package edu.helsinki.sulka.services;

import java.util.List;
import java.util.logging.Logger;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.DbRowRingings;

/**
 * Autowireable service that handles storing of user-inputted rows
 */
@Service
public class LocalDatabaseService {

	private SessionFactory sessionFactory;
	
	public void setSessionFactory(SessionFactory sessionFactory){
		this.sessionFactory = sessionFactory;
	}
	
	public void addRinging(DbRowRingings ringingRow){
		Session session = sessionFactory.openSession();
		session.beginTransaction();
		session.save(ringingRow);
		session.getTransaction().commit();
		session.close();
	}

	public List<DbRowRingings> getRows(int userId) {
		Session session = sessionFactory.openSession();
		session.beginTransaction();
		Query q = session.createQuery("from DbRowRingings");
		List<DbRowRingings> results = q.list();
		session.close();
		return results;
	}
	

}
