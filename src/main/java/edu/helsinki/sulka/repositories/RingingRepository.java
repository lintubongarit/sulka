package edu.helsinki.sulka.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import edu.helsinki.sulka.models.RingingDatabaseRow;


public interface RingingRepository extends CrudRepository<RingingDatabaseRow, Long>{
	List<RingingDatabaseRow> findByUserId(String userId);
	RingingDatabaseRow findById(long id);
}