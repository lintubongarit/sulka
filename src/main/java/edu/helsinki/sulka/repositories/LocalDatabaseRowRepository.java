package edu.helsinki.sulka.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import edu.helsinki.sulka.models.LocalDatabaseRow;
import edu.helsinki.sulka.models.LocalDatabaseRow.RowType;

public interface LocalDatabaseRowRepository extends CrudRepository<LocalDatabaseRow, Long> {
	List<LocalDatabaseRow> findByRowTypeAndUserId(RowType type, String userId);
	LocalDatabaseRow findByRowTypeAndId(RowType type, long id);
}
