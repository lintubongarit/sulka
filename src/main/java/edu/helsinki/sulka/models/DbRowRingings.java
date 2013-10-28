package edu.helsinki.sulka.models;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class DbRowRingings implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private Long id;
	
	public DbRowRingings(){
	}
	
	public DbRowRingings(Long id, String row){
		this.id = id;
		this.row = row;
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column(name = "row")
	private String row;

	public String getRow() {
		return row;
	}

	public void setRow(String row) {
		this.row = row;
	}
	
	
	

}
