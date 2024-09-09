package com.nusyn.dao;

import org.springframework.data.repository.CrudRepository;

import com.nusyn.pojo.Users;


public interface AccessUserDao extends CrudRepository<Users , String>
{
}
