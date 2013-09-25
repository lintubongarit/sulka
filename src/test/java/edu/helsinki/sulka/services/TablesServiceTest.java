package edu.helsinki.sulka.services;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import edu.helsinki.sulka.models.Table;

public class TablesServiceTest {

	private TablesService tablesService;
	
	@Before
	public void setUp(){
		this.tablesService = new TablesService();
	}

	@Test
	public void testGetTableWithNoParametersReturnsEmptyTable(){
		assertTrue(this.tablesService.getTable().getRows().isEmpty());
	}

}
