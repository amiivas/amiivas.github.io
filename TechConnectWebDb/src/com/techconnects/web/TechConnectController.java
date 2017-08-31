package com.techconnects.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TechConnectController {
	
	
	private static Logger logger = Logger.getLogger(TechConnectController.class);
	
	
	/*@Autowired
	private MQToolDao mqDao;*/
	
	/**
	 * @param mqDao the mqDao to set
	 */
	/*public void setMqDao(MQToolDao mqDao) {
		this.mqDao = mqDao;
	}*/
	
	
	
	/**
	 * Method for ajax call for getting queue names for user selected queue manager
	 * @param request
	 * @return QueueManagerDTO
	 */
	@RequestMapping(value = "/getQueueManager.htm", method=RequestMethod.POST)
	@ResponseBody
	
	public String getQueueManager(HttpServletRequest request) {
		
		logger.info("MQController.getQueueManager()");
		
		
		return "";
		
	}
	
	
	
	
	
	@RequestMapping(value = "/test.htm", method=RequestMethod.GET)
	@ResponseBody
	public String purgeMessages(HttpServletRequest request, HttpServletResponse response) {
		
		logger.info("MQController.purgeMessages()");
		
		return "";
		
	}
	
}
	
	
