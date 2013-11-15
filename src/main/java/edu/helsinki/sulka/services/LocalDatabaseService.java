package edu.helsinki.sulka.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.LocalDatabaseRow;
import edu.helsinki.sulka.models.UserSettings;
import edu.helsinki.sulka.repositories.LocalDatabaseRowRepository;
import edu.helsinki.sulka.repositories.RecoveriesRepository;
import edu.helsinki.sulka.repositories.RingingsRepository;
import edu.helsinki.sulka.repositories.UserSettingsRepository;


/**
 * Autowireable service that handles storing of user-inputted rows
 */
@Service
public class LocalDatabaseService {

	@Autowired
	private RingingsRepository ringingsRepository;
	
	@Autowired
	private RecoveriesRepository recoveriesRepository;
	
	public enum Table {
		RINGINGS,
		RECOVERIES
	}
	
	private LocalDatabaseRowRepository getRepository(Table t) {
		switch (t) {
		case RINGINGS:
			return ringingsRepository;
		case RECOVERIES:
		default:
			return recoveriesRepository;
		}
	}

	@Autowired
	private UserSettingsRepository userSettingsRepository;
	
	public List<LocalDatabaseRow> getRowsByUserId(Table table, String userId) {
		return getRepository(table).findByUserId(userId);
	}
	
	public LocalDatabaseRow addRow(Table table, LocalDatabaseRow row) {
		return getRepository(table).save(row);
	}
	
	public void removeRow(Table table, LocalDatabaseRow ringingRow) {
		getRepository(table).delete(ringingRow);
	}

	public LocalDatabaseRow getRow(Table table, long rowId) {
		return getRepository(table).findById(rowId);
	}
	
	public UserSettings getSettings(String userId) {
		UserSettings settings = userSettingsRepository.findOne(userId);
		if(settings == null){
			settings = new UserSettings();
			settings.setUserId(userId);
			settings.setColumns("");
		}
		return settings;
	}

	public void saveSettings(UserSettings userSettings) {
		userSettingsRepository.save(userSettings);
	}
}
