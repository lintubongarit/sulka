package edu.helsinki.sulka.models;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class TableTest {

	private Table table;
	
	@Before
	public void setUp(){
		this.table = new Table();
	}

	@Test
	public void testThereAreNoRowsAfterInit(){
		assertTrue(this.table.getRows().isEmpty());
	}
	
}
