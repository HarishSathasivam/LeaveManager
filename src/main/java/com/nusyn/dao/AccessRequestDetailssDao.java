package com.nusyn.dao;

import org.springframework.data.repository.CrudRepository;

import com.nusyn.pojo.RequestDetails;
import com.nusyn.pojo.Users;
import com.nusyn.useClasses.Holidays;


public interface AccessRequestDetailssDao extends CrudRepository<RequestDetails , String>
{
	
	
}
