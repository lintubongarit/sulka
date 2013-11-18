package edu.helsinki.sulka.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.helsinki.sulka.models.LocalDatabaseRow;
import edu.helsinki.sulka.models.LocalDatabaseRow.RowType;
import edu.helsinki.sulka.models.UserSettings;
import edu.helsinki.sulka.repositories.LocalDatabaseRowRepository;
import edu.helsinki.sulka.repositories.UserSettingsRepository;


/**
 * Autowireable service that handles storing of user-inputted rows
 */
@Service
public class LocalDatabaseService {

	@Autowired
	private LocalDatabaseRowRepository localRowRepository;
	
	@Autowired
	private UserSettingsRepository userSettingsRepository;
	
	public List<LocalDatabaseRow> getRowsByUserId(RowType rowType, String userId) {
		return localRowRepository.findByRowTypeAndUserId(rowType, userId);
	}
	
	public LocalDatabaseRow addRow(LocalDatabaseRow row) {
		return localRowRepository.save(row);
	}
	
	public void removeRow(LocalDatabaseRow ringingRow) {
		localRowRepository.delete(ringingRow);
	}

	public LocalDatabaseRow getRow(RowType rowType, long rowId) {
		return localRowRepository.findByRowTypeAndId(rowType, rowId);
	}
	
	public LocalDatabaseRow getRowOfAnyType(long rowId) {
		return localRowRepository.findOne(rowId);
	}


	public UserSettings getSettings(String userId_viewMode) {
		UserSettings settings = userSettingsRepository.findOne(userId_viewMode);
		if(settings == null){
			settings = new UserSettings();
			settings.setUserId(userId_viewMode);
			settings.setColumns("");
			settings.setFilters("");
		}
		return settings;
	}

	public void saveSettings(UserSettings userSettings) {
		userSettingsRepository.save(userSettings);
	}
}
