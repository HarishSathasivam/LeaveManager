package com.nusyn.service;

import java.util.List;

import org.apache.catalina.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.nusyn.pojo.ChatDetails;
import com.nusyn.pojo.RequestDetails;
import com.nusyn.pojo.RequestStatus;
import com.nusyn.pojo.Users;





@Repository
public interface AccessService {
	public Users saveUsers(Users user ,boolean createNewUser , RequestDetails requestDetails,RequestStatus requestStatus,String senderId);
	public Users findById(String id);
	public List<Users> getAllUsers();
	public Users getUserById(String id);
	
	public RequestDetails saveRequestDetails(RequestDetails requestDetails);
	public RequestDetails findRequestDetailsById(String id);
	public RequestStatus findRequestStatusById(String id);
	public RequestStatus saveRequestStatus(RequestStatus requestStatus);

	
	public ChatDetails saveChatDetails(ChatDetails chatDetails);

 
	
}
