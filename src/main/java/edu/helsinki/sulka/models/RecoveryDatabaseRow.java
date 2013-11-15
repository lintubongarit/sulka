package edu.helsinki.sulka.models;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="Recoveries")
public class RecoveryDatabaseRow extends LocalDatabaseRow {
	private static final long serialVersionUID = 1L;
}