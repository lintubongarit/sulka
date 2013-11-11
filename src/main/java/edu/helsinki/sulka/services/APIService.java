package edu.helsinki.sulka.services;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
	
	private class APIAuthInterceptor implements ClientHttpRequestInterceptor {
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
	
	/**
	 * This class can be used to create cached values. Implementators must override refresh()!
	 */
	public static class CachedData<T> {
		/**
		 * This method must be overridden by the implementator. Return the data value to cache here.
		 * @return New data value.
		 */
		protected T refresh() {
			throw new Error("You must implement refresh()!");
		}
		
		private long lastUpdated = Long.MIN_VALUE;
		private long cacheTime = 0;
		private T cachedValue = null;
		
		/**
		 * @param cacheTime Milliseconds to cache values.
		 */
		CachedData(long cacheTime) {
			this.cacheTime = cacheTime;
		}
		
		/**
		 * Get the cached value. If nothing is cached, call refresh() and cache the new value.
		 * This is the method that should be called to get the stored value.
		 * @return Value from cache, or new value as returned by refresh() if nothing is cached
		 * or the cached value has expired.
		 */
		public synchronized T get() {
			if (this.getCachedValue() == null || this.getTimeout() <= new Date().getTime()) {
				this.cachedValue = refresh();
				this.lastUpdated = new Date().getTime();
			}
			return this.getCachedValue();
		}
		
		/**
		 * Set milliseconds to cache values.
		 * @param cacheTime the new cache timeout value
		 */
		public void setCacheTime(long cacheTime) {
			this.cacheTime = cacheTime;
		}
		
		/**
		 * @return current cache timeout value.
		 */
		public long getCacheTime() {
			return this.cacheTime;
		}
		
		/**
		 * Set current cached value.
		 * @param newValue New cached value
		 */
		public void setValue(T newValue) {
			this.cachedValue = newValue;
		}
		
		/**
		 * Get the currently cached value, if any. Use get() instead to get the value
		 * intelligently: this method never calls refresh()!
		 * @return Currently cached value (can be null).
		 */
		public T getCachedValue() {
			return this.cachedValue;
		}
		
		/**
		 * Get current cached data value's timeout. Equals to Long.MIN_VALUE if cache has never been updated.
		 * @return the epoch millisecond time when current cache value will expire.
		 */
		public long getTimeout() {
			return this.lastUpdated + this.cacheTime;
		}
	}
	
	/**
	 * This class can be used to create parametized cached values. Implementators must override refresh()!
	 */
	public static class ParametizedCachedData<TParam, TData> {
		/**
		 * This method must be overridden by the implementator. Return the data value to cache for
		 * parameter value here.
		 * @param param The parameter value to get data for.
		 * @return New data value.
		 */
		protected TData refresh(TParam param) {
			throw new Error("You must implement refresh()!");
		}
		
		private Map<TParam, Long> lastUpdated;
		private Map<TParam, TData> cachedValue;
		private long cacheTime = 0;
		
		/**
		 * @param cacheTime Milliseconds to cache values.
		 */
		ParametizedCachedData(long cacheTime) {
			this.cacheTime = cacheTime;
			this.lastUpdated = new HashMap<TParam, Long>();
			this.cachedValue = new HashMap<TParam, TData>();
		}
		
		/**
		 * @param cacheTime Milliseconds to cache values.
		 * @param size Expected number of values to be stored (preallocated to Map).
		 */
		ParametizedCachedData(long cacheTime, int size) {
			this.cacheTime = cacheTime;
			this.lastUpdated = new HashMap<TParam, Long>(size);
			this.cachedValue = new HashMap<TParam, TData>(size);
		}
		
		/**
		 * Get the cached value. If nothing is cached, call refresh() and cache the new value.
		 * This is the method that should be called to get the stored value.
		 * @param param The parameter to get data for.
		 * @return Value from cache, or new value as returned by refresh(param) if nothing is
		 * cached for param or the cached value for param has expired.
		 */
		public synchronized TData get(TParam param) {
			if (this.getCachedValue(param) == null || this.getTimeout(param) <= new Date().getTime()) {
				cachedValue.put(param, refresh(param));
				lastUpdated.put(param, new Date().getTime());
			}
			return this.getCachedValue(param);
		}
		
		/**
		 * Set milliseconds to cache values.
		 * @param cacheTime the new cache timeout value
		 */
		public void setCacheTime(long cacheTime) {
			this.cacheTime = cacheTime;
		}
		
		/**
		 * @return current cache timeout value.
		 */
		public long getCacheTime() {
			return this.cacheTime;
		}
		
		/**
		 * Set current cached value.
		 * @param param The parameter value to store data for.
		 * @param newValue New cached value
		 */
		public void setValue(TParam param, TData newValue) {
			this.cachedValue.put(param,  newValue);
		}
		
		/**
		 * Get the currently cached value, if any. Use get() instead to get the value
		 * intelligently: this method never calls refresh()!
		 * @param param The parameter value to get data for.
		 * @return Currently cached value (can be null).
		 */
		public TData getCachedValue(TParam param) {
			return this.cachedValue.get(param);
		}
		
		/**
		 * Get current cached data value's timeout. Equals to Long.MIN_VALUE if cache has never been updated.
		 * @param param The parameter value to get cache timeout for.
		 * @return the epoch millisecond time when current cache value will expire.
		 */
		public long getTimeout(TParam param) {
			return this.lastUpdated.get(param) + this.cacheTime;
		}
	}
}
