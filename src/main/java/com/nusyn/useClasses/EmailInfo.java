package com.nusyn.useClasses;

public class EmailInfo {
	
	String to ;
	String[] cc;
	String subject;
	String text;
	String from;
	
	
	
	public EmailInfo(String to, String[] cc, String subject, String text, String from) {
		super();
		this.to = to;
		this.cc = cc;
		this.subject = subject;
		this.text = text;
		this.from = from;
	}
	
	
	
	
	public EmailInfo() {
		super();
	}




	public String getTo() {
		return to;
	}
	public void setTo(String to) {
		this.to = to;
	}
	public String[] getCc() {
		return cc;
	}
	public void setCc(String[] cc) {
		this.cc = cc;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	

}


