package edu.helsinki.sulka.controllers;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import edu.helsinki.sulka.models.User;
import edu.helsinki.sulka.services.LintuvaaraAuthDecryptService;

/**
 * Handles requests for the login page and passing authentication variables to Tipu-API's Lintuvaara authentication decryptor service
 */
@Controller
@SessionAttributes("User")
public class LoginController {

	@Autowired
	private Logger logger;

	@Autowired
	private LintuvaaraAuthDecryptService authService;

	/**
	 * redirects authentication variables key, iv and data to Tipu-API's Lintuvaara authentication decryptor service
	 */
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String home(Model model, @RequestParam(value = "key") String key, @RequestParam(value = "iv") String iv, @RequestParam(value = "data") String data) {		
		//User user = authService.auth(key, iv, data);
		User user = authService.auth("G7Nx2EUkReBDcFECQbDPXXOkFB9o0yqH51HcxmyjxXQtAEJ47r+Z8MLfbAUX\nqPyoFCmLzPsHZ9zO51Wrd4InEb4m1QcWWJ0Yxt4/WfGOIEot4Q9oAbMQcHRG\nD41ZhiCQivUO111N3iaZFOQICVKtDqoR1Gcy2pXM5grdekoATTw=", 
"orP/vmSaczR9Qjw9L1GdQhTnn2VkzYt7T2wP7ubG3a84nRFtSQ7XW082xaM4\nR2Kun0X5qgTZy0RBENhDdnxZwzNLkaHJAya1qVxsKE9TvjE+xtxWfexolSUO\neQ50EFOhIgqC0v1drp5vAXHXgs1csNPRvCUO4C6OyU2tGzu8gHY=",
"by1gtHADfbCmyyfpNg7zpPU68m1kubLnl8mWyc6Qq/b0XPuL03Iy2SfmCt54\nfEvU2fYwaEwR+DtKcrht/pZ5Ap0qMrap4ZfEG9HZk6tNAdaQcP7uM2zlKlzo\n19D0lRwtwzZ7+SFb8spHqKznQeBA034HqXTBV+RWAiWIdl1DvdPJKOAX+i96\nvDt42FeVS9O1TxAKTccoEr+vIl8kaSyMUG2SiiFBmE61lQtIL8YEMAMWun2L\n8ETJMV5Hmcp00mYxRb+Ra7V+/R8gt3/gwZkNvRxIaYtZ3GgNTybyaNk2fHUu\nnNWTZx1W2sBddPOWjpwDxivf4nRmMKe31vK1UNzZEZ7EQmsIjcvQgWFkoj1h\n2T8=");
		model.addAttribute("accessStatus", user.accessStatus());
		return "login";
	}

}
