package edu.helsinki.sulka;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;

import org.apache.commons.codec.binary.Base64;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.http.HttpHeaders;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.HttpContext;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {

	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

	public class ContextAwareHttpComponentsClientHttpRequestFactory extends
	HttpComponentsClientHttpRequestFactory {
		private HttpContext httpContext;

		public ContextAwareHttpComponentsClientHttpRequestFactory(HttpClient httpClient){
			super(httpClient);
		}

		protected HttpContext createHttpContext(HttpMethod httpMethod, URI uri) {
			//Ignoring the URI and method.
			return httpContext;
		}

		public void setHttpContext(HttpContext httpContext) {
			this.httpContext = httpContext;
		}
	}


	/**
	 * Simply selects the home view to render by returning its name.
	 */

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Locale locale, Model model) throws Exception {

		URL url = new URL("https://h92.it.helsinki.fi/tipu-api/species?format=json");

		String name = "bongarit-dev";
		String password = "devbongarit";

		String authString = name + ":" + password;
		byte[] authEncBytes = Base64.encodeBase64(authString.getBytes());
		String authStringEnc = new String(authEncBytes);

		URLConnection conn = url.openConnection();
		conn.setRequestProperty("Authorization", "Basic " + authStringEnc);

		BufferedReader br = new BufferedReader(
        new InputStreamReader(conn.getInputStream()));

		String json = "";
		String inputLine = "";

		while (true) {
			inputLine = br.readLine();
			if (inputLine == null)
				break;
			json += inputLine + "\n";
		}
		json = json.substring(22, json.length() - 3);
		model.addAttribute("json", json);

  		ObjectMapper mapper = new ObjectMapper();

		Species species[] = mapper.readValue(json, Species[].class);

		model.addAttribute("json", species);

		return "home";
	}

}
