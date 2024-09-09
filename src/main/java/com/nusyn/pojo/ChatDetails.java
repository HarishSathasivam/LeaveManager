package com.nusyn.pojo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class ChatDetails {
	
	@Id
	@Column(name = "id")
	private String id;
	
	@Column(name = "sender")
	private String sender;
	
	@Column(name = "receiver")
	private String[] receiver;
	
	@Column(name = "text")
	private String text;
	
	@Column(name = "time")
	private String time;
	
	@Column(name = "requestId")
	private String requestId;
	
	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requestId_chatDetails")
    @JsonBackReference("chat-reference")
    private RequestDetails chatDetails;

	public ChatDetails(String id, String sender, String[] receiver, String text, String time, String requestId
			) {
		super();
		this.id = id;
		this.sender = sender;
		this.receiver = receiver;
		this.text = text;
		this.time = time;
		this.requestId = requestId;
	}

	public ChatDetails() {
		super();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String[] getReceiver() {
		return receiver;
	}

	public void setReceiver(String[] receiver) {
		this.receiver = receiver;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getRequestId() {
		return requestId;
	}

	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}

	public RequestDetails getChatDetails() {
		return chatDetails;
	}

	public void setChatDetails(RequestDetails chatDetails) {
		this.chatDetails = chatDetails;
	}
	
	
	
	
	
	
	

}
