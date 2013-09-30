package edu.helsinki.sulka.services;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import org.apache.commons.codec.binary.Base64;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Autowireable Service that should be used for communicating to the API.
 */
@Service
public class APIService {
	private String username;
	private String password;
	private String urlBase;
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getUsername() {
		return this.username;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public void setUrlBase(String urlBase) {
		this.urlBase = urlBase;
	}
	
	public String getUrlBase() {
		return this.urlBase;
	}
	
	
	private RestTemplate restTemplate = null;
	
	/**
	 * @return the RestTemplate object that should be used to communicate to the API.
	 */
	public RestTemplate getRestTemplate() {
		if (restTemplate == null) {
			restTemplate = new RestTemplate();
			ClientHttpRequestInterceptor interceptor = new APIAuthInterceptor(username, password);
			restTemplate.getInterceptors().add(interceptor);
			restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
		}
		return restTemplate;
	}
	
	class APIAuthInterceptor implements ClientHttpRequestInterceptor {
		private final String authString;
		
		APIAuthInterceptor(String password, String username) {
			String authString = "";
			try {
				authString = "Basic " + new String(Base64.encodeBase64((password + ":" + username).getBytes("UTF-8")), "UTF-8");
			} catch (UnsupportedEncodingException e) {
				; // Ignore
			}
			this.authString = authString;
		}
		
		@Override
		public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
			request.getHeaders().set("Authorization", this.authString);
    		return execution.execute(request, body);
		}
	}
	
	/**
	 * @return a full URI for the path without URL parameters.
	 */
	public String getURLForPath(String path) {
		return this.urlBase.concat(path);
	}
}
