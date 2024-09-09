package com.nusyn.pojo;

import java.util.Date;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Entity
public class RequestStatus {

	@Id
    @Column(name = "Id")
    private String id;
    

    @Column(name = "receiverName")
    private String receiverName;

    @Column(name = "responsedate")
    private String responsedate;

    @Column(name = "requestReceived")
    private boolean requestReceived;

    @Column(name = "seen")
    private boolean seen;

    @Column(name = "status")
    private boolean status;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id")
    @JsonBackReference("request-reference")
    private RequestDetails requestDetails;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id")
    @JsonBackReference("sender-reference")
    private RequestDetails senderDetails;

  
	public RequestStatus(String id, String receiverName, String responsedate, boolean requestReceived, boolean seen,
			boolean status, RequestDetails requestDetails) {
		super();
		this.id = id;
		this.receiverName = receiverName;
		this.responsedate = responsedate;
		this.requestReceived = requestReceived;
		this.seen = seen;
		this.status = status;
		this.requestDetails = requestDetails;
	}
	


	public RequestStatus() {
		super();
	}





	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	public String getReceiverName() {
		return receiverName;
	}


	public void setReceiverName(String receiverName) {
		this.receiverName = receiverName;
	}


	public String getResponsedate() {
		return responsedate;
	}


	public void setResponsedate(String responsedate) {
		this.responsedate = responsedate;
	}


	public boolean isRequestReceived() {
		return requestReceived;
	}


	public void setRequestReceived(boolean requestReceived) {
		this.requestReceived = requestReceived;
	}


	public boolean isSeen() {
		return seen;
	}


	public void setSeen(boolean seen) {
		this.seen = seen;
	}


	public boolean getStatus() {
		return status;
	}


	public void setStatus(boolean status) {
		this.status = status;
	}


	public RequestDetails getRequestDetails() {
		return requestDetails;
	}


	public void setRequestDetails(RequestDetails requestDetails) {
		this.requestDetails = requestDetails;
	}
	
	
	
    
    
	public RequestDetails getSenderDetails() {
		return senderDetails;
	}



	public void setSenderDetails(RequestDetails senderDetails) {
		this.senderDetails = senderDetails;
	}



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
    

   
    
}

