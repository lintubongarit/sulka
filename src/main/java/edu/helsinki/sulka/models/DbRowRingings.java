package edu.helsinki.sulka.models;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="Ringings")
public class DbRowRingings implements Serializable {
	
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private Long id;
	@Column(name = "userId")
	private String userId;
	@Column(name = "row")
	private String row;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getRow() {
		return row;
	}
	public void setRow(String row) {
		this.row = row;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	@Override
	public boolean equals(Object obj){
		if(obj instanceof DbRowRingings)
			return id == ((DbRowRingings)obj).id;
		return false;
	}
}
