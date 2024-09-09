package com.nusyn.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nusyn.model.JwtResponse;
import com.nusyn.pojo.ChatDetails;
import com.nusyn.pojo.RequestDetails;
import com.nusyn.pojo.RequestStatus;
import com.nusyn.pojo.Users;
import com.nusyn.service.AccessService;
import com.nusyn.service.EmailService;
import com.nusyn.useClasses.EmailInfo;
import com.nusyn.useClasses.LeaveRequest;

@RestController
@CrossOrigin()
public class UserController {
		
	
	@Autowired
	AccessService accessService;
	
	@Autowired
	EmailService emailService;

	@RequestMapping({ "/hello" })
	public String hello() {
		return "Hello World";
	}
	
	@RequestMapping(value = "/signUp", method = RequestMethod.POST)
	public ResponseEntity<?> signUp(@RequestBody Users user)
			throws Exception {
		
			String id = user.getEmail().substring(0, user.getEmail().indexOf('@')); 
			
	        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
			String hashedPassword = passwordEncoder.encode(user.getPassword());
			 
	        user.setId(id); 
	        user.setPassword(hashedPassword);
	    
	        // Check if email already exists	       
	        try {
	            Users findUser = accessService.findById(user.getId());

	            if (findUser != null) {
	                // User already exists
	                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new JwtResponse(" already exists "+user.getUsername() +". Please try again later."));
	            } else {
	                // Save the new user
	            	RequestDetails requestDetails = null;
	            	Users savingUserResponse = accessService.saveUsers(user,true,requestDetails,null,null);
	                return ResponseEntity.ok(new JwtResponse("User saved successfully: " + savingUserResponse.getEmail()));
	            }
	        } catch (Exception e) {
	            System.out.println("Error while saving user: " + e);
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new JwtResponse("Failed to save user. Please try again later."));
	        }
	}
	
	
	 @PostMapping("/apply")
	    public String applyForLeave(@RequestBody EmailInfo emailInfo) {

	        try {
	        		            
	        	String to = emailInfo.getTo();
	            String from = emailInfo.getFrom();
	            String[] cc = emailInfo.getCc();	            
	        	String subject = "New Leave Request from "+emailInfo.getSubject();
	            String body = emailInfo.getText();

	            emailService.sendEmail(to,from, subject, body, cc);

	            return "Leave request submitted successfully.";

	        } catch (Exception error) {
	            return "Failed to send an email: " + error.getMessage();
	        }
	    }
	 
	 
	 
	 
	 
	 
	 @RequestMapping(value = "/saveRequest",method =RequestMethod.POST)
	 public String saveRequest(@RequestBody RequestDetails requestDetails){
		 
		 try {
		        ObjectMapper objectMapper = new ObjectMapper();		        
		        		                        
                String id =requestDetails.getSender().substring(0, requestDetails.getSender().indexOf('@'));
                
	            	            
				Users sender =  accessService.findById(id);
				
				UUID senderId = UUID.randomUUID();
				requestDetails.setId(senderId.toString());
				
				UUID requestId = UUID.randomUUID();				
                requestDetails.setRequestId(requestId.toString());

							                
			    Users savedSender = accessService.saveUsers(sender,false,requestDetails,null,null);
			    
			    
                try {
			    
	                List<String> receivers = objectMapper.readValue(requestDetails.getReceiver(), new TypeReference<List<String>>() {});
	                for (String receiver : receivers) {
	                		                    
	                    String receiverId =receiver.substring(0, receiver.indexOf('@'));
	    	            
	    				Users userToreceiver =  accessService.findById(receiverId);
	    				
	    				UUID reciverId = UUID.randomUUID();
	    				requestDetails.setId(reciverId.toString());
	    				
	    				RequestStatus requestStatus = new RequestStatus();
	    				
	    				UUID receiverID = UUID.randomUUID();
	    				requestStatus.setId(receiverID.toString());
	    				requestStatus.setReceiverName(userToreceiver.getUsername());
	    				requestStatus.setRequestReceived(false);
	    				
	    			    Users savedReceiver = accessService.saveUsers(userToreceiver,false,requestDetails,requestStatus,senderId.toString());           
	
	                }
                }catch(Exception exp) {
                	System.out.println("exp to get receiver  = "+exp);
                }
				
			 
		 }catch(Exception err) {
			 System.out.println("failed to save saveRequest "+err);
		 }
		 
		 
		 return null;
		 
	 }
	 
	 
	 @GetMapping("/getAllUsers")
	    public ResponseEntity<List<Users>> getAllUsers() {
		 
		 try {
			 
			 List<Users> users = accessService.getAllUsers();	       
		      return new ResponseEntity<>(users, HttpStatus.OK);
			 
		 }catch(Exception exp) {
			 System.out.println("err getAllUsers"+exp.toString());
		 }		 
		return null;	      
		 
	   }
	 
	 @GetMapping("/getUserById")
	 public String getUserById(@RequestParam String email) {
	     try {

	         String id = email.substring(0, email.indexOf('@')); 
	         Users newUser = accessService.findById(id);
	         
	         String StrNewUser = newUser.toString();


	         return StrNewUser;
	     } catch (Exception err) {
	         System.out.println("failed to find user by user id " + err);
	         return null;
	     }
	 }
	 
	 
	 @GetMapping("/updateRequestStatus")
	 public String updateRequestStatus(@RequestParam String id,@RequestParam String date,@RequestParam boolean received,
			 @RequestParam boolean seen,@RequestParam boolean status) {
	     try {

	    	 RequestStatus requestStatus = accessService.findRequestStatusById(id);
	    	 requestStatus.setRequestReceived(received);
	    	 requestStatus.setResponsedate(date);
	    	 requestStatus.setSeen(seen);
	    	 requestStatus.setStatus(status);
	    	 
	    	 accessService.saveRequestStatus(requestStatus);
	         
	     } catch (Exception err) {
	         return null;
	     }
		return "SuccessFully updated";
	 }

	 
	 @RequestMapping(value = "/saveChat",method =RequestMethod.POST)
	 public String saveChat(@RequestBody ChatDetails chatDetails){
		 
		 try {
			 
			  System.out.println("ChatDetails Reached chatDetails id "+chatDetails.getId() );
			
			 String senderChat =chatDetails.getSender().substring(0, chatDetails.getSender().indexOf('@'));	            
			 Users userToSenderChat =  accessService.findById(senderChat);	
			 			 
			 accessService.saveChatDetails(chatDetails);
			 
			 return chatDetails.getId();
		 }catch (Exception err) {
	         System.out.println("failed to save saveChat  by user id " + err);
	         return "failed to save saveChat  by user id"+err ;
	     }
		
		 
	 }

}
