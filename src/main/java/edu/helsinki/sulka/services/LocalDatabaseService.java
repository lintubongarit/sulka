package edu.helsinki.sulka.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.RecoveryDatabaseRow;
import edu.helsinki.sulka.models.RingingDatabaseRow;
import edu.helsinki.sulka.repositories.RecoveriesRepository;
import edu.helsinki.sulka.repositories.RingingRepository;


/**
 * Autowireable service that handles storing of user-inputted rows
 */
@Service
public class LocalDatabaseService {

	@Autowired
	private RingingRepository ringingRepository;
	
	@Autowired
	private RecoveriesRepository recoveryRepository;

	public List<RingingDatabaseRow> getRingings(String userId) {
		return (List<RingingDatabaseRow>) ringingRepository.findByUserId(userId);
	}
	
	public List<RecoveryDatabaseRow> getRecoveries(String userId) {
		return (List<RecoveryDatabaseRow>) recoveryRepository.findByUserId(userId);
	}
	
	public RingingDatabaseRow addRinging(RingingDatabaseRow ringingRow){	
		return ringingRepository.save(ringingRow);
	}
	
	public RecoveryDatabaseRow addRecovery(RecoveryDatabaseRow recoveryRow) {
		return recoveryRepository.save(recoveryRow);
	}

	public void removeRinging(RingingDatabaseRow ringingRow) {
		ringingRepository.delete(ringingRow);
	}

	public void removeRecovery(RecoveryDatabaseRow recoveryRow) {
		recoveryRepository.delete(recoveryRow);
		
	}
}
