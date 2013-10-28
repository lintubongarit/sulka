package edu.helsinki.sulka.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.DbRowRingings;
import edu.helsinki.sulka.repositories.RingingRepository;


/**
 * Autowireable service that handles storing of user-inputted rows
 */
@Service
public class LocalDatabaseService {

	@Autowired
	private RingingRepository ringingRepository;
	
	public void addRinging(DbRowRingings ringingRow){	
		ringingRepository.save(ringingRow);
	}

	public List<DbRowRingings> getRingings(String userId) {
		return (List<DbRowRingings>) ringingRepository.findByUserId(userId);
	}
}
