package edu.helsinki.sulka.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import edu.helsinki.sulka.models.RecoveryDatabaseRow;

public interface RecoveriesRepository extends CrudRepository<RecoveryDatabaseRow, Long>{
	List<RecoveryDatabaseRow> findByUserId(String userId);
}
