package edu.helsinki.sulka.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import edu.helsinki.sulka.models.LocalDatabaseRow;
import edu.helsinki.sulka.models.RingingDatabaseRow;


public interface RingingsRepository extends CrudRepository<RingingDatabaseRow, Long>, LocalDatabaseRowRepository {
	List<LocalDatabaseRow> findByUserId(String userId);
	LocalDatabaseRow findById(Long rowId);
}
