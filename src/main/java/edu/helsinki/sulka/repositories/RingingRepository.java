package edu.helsinki.sulka.repositories;

import org.springframework.data.repository.CrudRepository;

import edu.helsinki.sulka.models.DbRowRingings;


public interface RingingRepository extends CrudRepository<DbRowRingings, Long>{
}