package edu.helsinki.sulka.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.RecoveryDatabaseRow;
import edu.helsinki.sulka.models.RingingDatabaseRow;
import edu.helsinki.sulka.models.UserSettings;
import edu.helsinki.sulka.repositories.RecoveriesRepository;
import edu.helsinki.sulka.repositories.RingingRepository;
import edu.helsinki.sulka.repositories.UserSettingsRepository;


/**
 * Autowireable service that handles storing of user-inputted rows
 */
@Service
public class LocalDatabaseService {

	@Autowired
	private RingingRepository ringingRepository;
	
	@Autowired
	private RecoveriesRepository recoveryRepository;
	
	@Autowired
	private UserSettingsRepository userSettingsRepository;

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

	public UserSettings getSettings(String userId, String viewMode) {
		UserSettings settings = userSettingsRepository.findByUserIdAndViewMode(userId, viewMode);
		if(settings == null){
			settings = new UserSettings();
			settings.setUserId(userId);
			settings.setColumns("");
			settings.setViewMode(viewMode);
			settings.setFilters("");
		}
		return settings;
	}

	public void saveSettings(UserSettings userSettings) {
		userSettingsRepository.save(userSettings);
	}
}
