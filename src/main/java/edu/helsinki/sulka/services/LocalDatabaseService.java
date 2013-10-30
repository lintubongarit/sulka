package edu.helsinki.sulka.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.DatabaseRow;
import edu.helsinki.sulka.repositories.RingingRepository;


/**
 * Autowireable service that handles storing of user-inputted rows
 */
@Service
public class LocalDatabaseService {

	@Autowired
	private RingingRepository ringingRepository;
	
	public DatabaseRow addRinging(DatabaseRow ringingRow){	
		return ringingRepository.save(ringingRow);
	}

	public List<DatabaseRow> getRingings(String userId) {
		return (List<DatabaseRow>) ringingRepository.findByUserId(userId);
	}
}
