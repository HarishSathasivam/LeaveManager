package com.nusyn.service;



import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import com.nusyn.dao.AccessChatDao;
import com.nusyn.dao.AccessRequestDetailssDao;
import com.nusyn.dao.AccessRequestStatusDao;
import com.nusyn.dao.AccessUserDao;
import com.nusyn.pojo.ChatDetails;
import com.nusyn.pojo.RequestDetails;
import com.nusyn.pojo.RequestStatus;
import com.nusyn.pojo.Users;
import com.nusyn.useClasses.Holidays;






@Service
public class AccessServiceImpl 	implements AccessService {

	
	
	@Autowired
	AccessUserDao accessUserDao;
	
	@Autowired
	AccessRequestDetailssDao accessRequestDetailsDao;
	
	@Autowired
	AccessRequestStatusDao accessRequestStatusDao;
	
	@Autowired
	AccessChatDao accessChatDao;

	@Override
	public Users saveUsers(Users user, boolean createNewUser, RequestDetails requestDetails,RequestStatus requestStatus,String senderId) {
	    try {
	        if (createNewUser) {
	            accessUserDao.save(user);
	        } else {
	            if (user != null && requestDetails != null ) {
	                try {
	                    if (user.getRequestDetails() == null) {
	                        user.setRequestDetails(new HashSet<>());
	                    }
	                    requestDetails.setUsers(user);	                    
	                    accessRequestDetailsDao.save(requestDetails);
	             
	                    if(requestStatus != null) {
	                    	
	                    	RequestDetails senderRequestDetails = accessRequestDetailsDao.findById(senderId).get();
	                    	requestStatus.setSenderDetails(senderRequestDetails);
	                    	requestStatus.setRequestDetails(requestDetails); 	                    	
		                    accessRequestStatusDao.save(requestStatus);
	                    }
	                   	                   	                    
	                    
	                    return user;

	                } catch (Exception exp) {
	                    System.out.println("Failed to save Request to DB: " + exp.toString());
	                }
	            }
	        }

	        return user;
	    } catch (DataIntegrityViolationException e) {
	        System.out.println("Error: " + e.getMessage());
	        throw new DuplicateKeyException("Duplicate key value: " + e.getMessage());
	    }
	}

	


	

	@Override
	public Users findById(String id) {
	    try {
	    	
	        Optional<Users> userOptional = accessUserDao.findById(id);
	        
	        if (userOptional.isPresent()) {
	            Users user = userOptional.get();

	            return user;
	        } else {
	            System.out.println("User not found with ID: " + id);
	            return null; // or throw an exception or handle it as per your requirement
	        }
	    } catch (Exception e) {
	        System.out.println("Error occurred while fetching user with ID: " + id);
	        e.printStackTrace();
	        return null; // or throw a custom exception
	    }
	}


	
	
	@Override
	public List<Users> getAllUsers() 
	{
		
		try
		{
			List<Users> userPojos = new ArrayList<Users>();
			accessUserDao.findAll().forEach(user -> userPojos.add(user));
						 			
			if(userPojos != null)
			{
				return userPojos;
			}
		}catch(Exception exp)
		{
			System.out.println("failed to get All users  "+exp.toString());
			
		}
		return null;
		
		
		
	}



	@Override
	public Users getUserById(String id) {
		
		try {
			
			
			 Users foundUser = accessUserDao.findById(id).orElse(null);
	        if (foundUser == null) {
	            return null;
	        }
			
			return foundUser;
			
		}catch(Exception err) {
			System.out.println("failed to featch user by id from DB "+err);
		}
		
		return null;
	}



	@Override
	public RequestDetails saveRequestDetails(RequestDetails requestDetails) {
		try {
			accessRequestDetailsDao.save(requestDetails); 
            return requestDetails;
        } catch (DataIntegrityViolationException e) {
            System.out.println("failed save RequestDetailss in DB : " + e.getMessage());
            throw new DuplicateKeyException("Duplicate key value: " + e.getMessage());
        }
	}






	@Override
	public RequestDetails findRequestDetailsById(String id) {
		try {
	        Optional<RequestDetails> requestOptional = accessRequestDetailsDao.findById(id);
	        
	        if (requestOptional.isPresent()) {
	        	RequestDetails requestDetails = requestOptional.get();
	            return requestDetails;
	        } else {
	            System.out.println("requestDetails not found with ID: " + id);
	            return null; // or throw an exception or handle it as per your requirement
	        }
	    } catch (Exception e) {
	        System.out.println("Error occurred while fetching requestDetails with ID: " + id);
	        e.printStackTrace();
	        return null; // or throw a custom exception
	    }
		
	}






	@Override
	public RequestStatus findRequestStatusById(String id) {
		try {
	        Optional<RequestStatus> statusOptional = accessRequestStatusDao.findById(id);
	        
	        if (statusOptional.isPresent()) {
	        	RequestStatus requestStatus = statusOptional.get();
	        	
	            return requestStatus;
	            
	        } else {
	            System.out.println("requestStatus not found with ID: " + id);
	            return null; // or throw an exception or handle it as per your requirement
	        }
	    } catch (Exception e) {
	        System.out.println("Error occurred while fetching requestStatus with ID: " + id);
	        e.printStackTrace();
	        return null; // or throw a custom exception
	    }
		
	}






	@Override
	public RequestStatus saveRequestStatus(RequestStatus requestStatus) {
		try {

			
			accessRequestStatusDao.save(requestStatus); 
            return requestStatus;
        } catch (DataIntegrityViolationException e) {
            System.out.println("failed save requestStatus in DB : " + e.getMessage());
            throw new DuplicateKeyException("Duplicate key value: " + e.getMessage());
        }
	}


	@Override
	public ChatDetails saveChatDetails(ChatDetails chatDetails) {
		
		try {
			
			System.out.println("chatDetailrequestID  = "+chatDetails.getRequestId());
			
			 
			 
			 for (String receiver : chatDetails.getReceiver()) {				 
	             String receiverId =receiver.substring(0, receiver.indexOf('@'));
				 Optional<Users> chatReceiver = accessUserDao.findById(receiverId);
				 if(chatReceiver.isPresent()){
					 Users foundReceiver = chatReceiver.get();
					 Set<RequestDetails> requestDetails = foundReceiver.getRequestDetails();
				    for (RequestDetails requestDetail : requestDetails ) {					    	
				    	if(requestDetail.getRequestId().equals(chatDetails.getRequestId()) ){
				    		UUID receiverUUID = UUID.randomUUID();
							chatDetails.setId(receiverUUID.toString());
				    		chatDetails.setChatDetails(requestDetail); 
				    		accessChatDao.save(chatDetails); 					    		
				    		System.out.println("SuccessFully receiver>>>>> got msg and saved in DB  : " +requestDetail.getId()+requestDetail.getSender());					    		
				    	}
				    }
				 }

			 }
			 
			
			 
			 String senderId =chatDetails.getSender().substring(0, chatDetails.getSender().indexOf('@'));			 
			 Optional<Users> chatSender = accessUserDao.findById(senderId);			
			 if(chatSender.isPresent()){
				 Users foundSender = chatSender.get();
				 Set<RequestDetails> senderRequestDetails = foundSender.getRequestDetails();
			    for (RequestDetails senderRequestDetail : senderRequestDetails ) {					    	
			    	if(senderRequestDetail.getRequestId().equals(chatDetails.getRequestId()) ){					    		
			    		 UUID senderUUID = UUID.randomUUID();
						 chatDetails.setId(senderUUID.toString());
						 chatDetails.setChatDetails(senderRequestDetail);

						 accessChatDao.save(chatDetails); 					    		
			    		System.out.println("SuccessFully saver>>>>> got msg and saved in DB  : " +senderRequestDetail.getId()+senderRequestDetail.getSender());					    		
			    	}
			    }
			 }
			
       	    
			
            return chatDetails;
        } catch (DataIntegrityViolationException e) {
            System.out.println("failed save chatDetails in DB : " + e.getMessage());
            throw new DuplicateKeyException("Duplicate key value: " + e.getMessage());
        }
	}
	
	
}
