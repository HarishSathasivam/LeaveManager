package com.nusyn.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.nusyn.dao.AccessUserDao;
import com.nusyn.model.JwtResponse;
import com.nusyn.pojo.Users;

@Service
public class JwtUserDetailsService implements UserDetailsService {

	
	@Autowired
	AccessUserDao accessUserDao;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		
        try {
            Optional<Users> findUser = accessUserDao.findById(email);
            if (findUser.isPresent()) {
	            Users user = findUser.get();	            
    			return new User(email,user.getPassword() ,
    					new ArrayList<>());	    		
            } else {
    			throw new UsernameNotFoundException("User not found with email: " + email);

            }

        } catch (Exception e) {
            System.out.println("Error while Login user: " + e);
        }
		return null;
        
        
        
		
	}

}