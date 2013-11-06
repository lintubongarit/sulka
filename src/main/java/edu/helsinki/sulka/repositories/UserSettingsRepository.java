package edu.helsinki.sulka.repositories;

import org.springframework.data.repository.CrudRepository;

import edu.helsinki.sulka.models.UserSettings;

public interface UserSettingsRepository extends CrudRepository<UserSettings, String> {
}
