package edu.helsinki.sulka.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import edu.helsinki.sulka.models.DatabaseRow;


public interface RingingRepository extends CrudRepository<DatabaseRow, Long>{
	List<DatabaseRow> findByUserId(String userId);
}