package edu.helsinki.sulka.models;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="Ringings")
public class RingingDatabaseRow extends LocalDatabaseRow {
	private static final long serialVersionUID = 1L;
}
