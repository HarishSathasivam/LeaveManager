package com.nusyn.dao;

import org.springframework.data.repository.CrudRepository;

import com.nusyn.pojo.RequestStatus;
import com.nusyn.pojo.Users;


public interface AccessRequestStatusDao extends CrudRepository<RequestStatus , String>
{
}
