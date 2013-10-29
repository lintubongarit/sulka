package edu.helsinki.sulka.repositories;

import junit.framework.Assert;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import edu.helsinki.sulka.models.DbRowRingings;
import edu.helsinki.sulka.repositories.RingingRepository;

@RunWith(SpringJUnit4ClassRunner.class)  
@ContextConfiguration({
	"file:src/main/webapp/WEB-INF/spring/root-context.xml",
	"file:src/main/webapp/WEB-INF/spring/database.xml",
	"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"
})
public class RingingRepositoryTest {

	 @Autowired  
	 private RingingRepository ringingRepository;
	
	 @Test  
    @Rollback(false)  
	public void testCreate() {  
		DbRowRingings p = new DbRowRingings();  
		p.setRow("asd");  
		  
		p = ringingRepository.save(p);  
		Assert.assertNotNull(p.getId());  
		System.out.println("Created Id: " + p.getId());  
    }     
	
}


