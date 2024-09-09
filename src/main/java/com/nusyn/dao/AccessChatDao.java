package com.nusyn.dao;

import org.springframework.data.repository.CrudRepository;

import com.nusyn.pojo.ChatDetails;

public interface AccessChatDao extends CrudRepository<ChatDetails, String>
{
	
}
