package edu.helsinki.sulka.models;

import java.util.ArrayList;
import java.util.List;

public class Table {

	private List<Row> rows;
	
	public Table(){
		this.rows = new ArrayList<Row>();
	}
	
	public List<Row> getRows() {
		return this.rows;
	}

}
