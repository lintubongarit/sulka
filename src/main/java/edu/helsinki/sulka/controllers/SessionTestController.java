package edu.helsinki.sulka.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

@Controller
@SessionAttributes("thought")
public class SessionTestController {
	
	@RequestMapping(value="/session")
	public ModelAndView sessionTest(){
		return new ModelAndView("sessiontest");
	}
	
	@RequestMapping(value="/remember", method = RequestMethod.POST)	
	public ModelAndView rememberThought(@RequestParam(defaultValue = "jep") String thoughtParam ) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("thought", thoughtParam);
		modelAndView.setViewName("sessiontest");
		return modelAndView;
	}
	
	@RequestMapping(value="/rememberme")	
	public ModelAndView rememberThoughtMe() {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("thought", "testi");
		modelAndView.setViewName("sessiontest");
		return modelAndView;
	}

}
