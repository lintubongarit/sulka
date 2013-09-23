package edu.helsinki.sulka.services;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.commons.codec.binary.Base64;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
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
	
	
	private static RestTemplate restTemplate = null;
	protected RestTemplate getRestTemplate() {
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
	
	protected final String DEFAULT_HTTP_PARAMS = "format=json";
	protected URI getURIForPath(String path) {
		return getURIForPath(path, DEFAULT_HTTP_PARAMS);
	}
	
	protected URI getURIForPath(String path, String httpParams) {
		String uri = this.urlBase + path;
		if (httpParams != null) {
			uri += "?" + httpParams;
		}
		try {
			return new URI(uri);
		} catch (URISyntaxException e) {
			e.printStackTrace();
			throw new Error(e);
		}
	}
}
