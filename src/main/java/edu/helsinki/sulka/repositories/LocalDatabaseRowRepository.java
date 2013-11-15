package edu.helsinki.sulka.repositories;

import java.util.List;

import edu.helsinki.sulka.models.LocalDatabaseRow;

public interface LocalDatabaseRowRepository {
	List<LocalDatabaseRow> findByUserId(String userId);
	LocalDatabaseRow findById(Long rowId);
	LocalDatabaseRow save(LocalDatabaseRow entity);
	void delete(LocalDatabaseRow entity);
}
