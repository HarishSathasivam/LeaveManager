package com.nusyn.pojo;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Entity
public class RequestDetails {

	@Id
    @Column(name = "Id")
    private String id;
    
    @Column(name = "requestId")
    private String requestId;

    @Column(name = "requestdate")
    private String requestdate;

    @Column(name = "sender")
    private String sender;

    @Column(name = "receiver")
    private String receiver;

    @Column(name = "command")
    private String command;

    @Column(name = "leaveDates")
    private String leaveDates;
    
    @OneToMany(mappedBy = "requestDetails", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RequestStatus> requestStatus = new HashSet<>();
    
    @OneToMany(mappedBy = "senderDetails", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RequestStatus> senderRequestStatus = new HashSet<>();
    
    @OneToMany(mappedBy = "chatDetails", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ChatDetails> chatDetails = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-reference")
    private Users users;

    public RequestDetails(String id, String requestId,String requestdate, String responsedate, String sender, String receiver,
                          String command, String status, String leaveDates) {
        this.id = id;
        this.requestId = requestId;
        this.requestdate = requestdate;
        this.sender = sender;
        this.receiver = receiver;
        this.command = command;
        this.leaveDates = leaveDates;
    }

    public RequestDetails() {
    }

    // Getters and setters...

    @Override
    public String toString() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{}";
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRequestdate() {
        return requestdate;
    }

    public void setRequestdate(String requestdate) {
        this.requestdate = requestdate;
    }

  

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }


    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public String getLeaveDates() {
        return leaveDates;
    }

    public void setLeaveDates(String leaveDates) {
        this.leaveDates = leaveDates;
    }

	public String getRequestId() {
		return requestId;
	}

	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}

	public Set<RequestStatus> getRequestStatus() {
		return requestStatus;
	}

	public void setRequestStatus(Set<RequestStatus> requestStatus) {
		this.requestStatus = requestStatus;
	}

	public Set<RequestStatus> getSenderRequestStatus() {
		return senderRequestStatus;
	}

	public void setSenderRequestStatus(Set<RequestStatus> senderRequestStatus) {
		this.senderRequestStatus = senderRequestStatus;
	}

	public Set<ChatDetails> getChatDetails() {
		return chatDetails;
	}

	public void setChatDetails(Set<ChatDetails> chatDetails) {
		this.chatDetails = chatDetails;
	}
    
    
    
}

