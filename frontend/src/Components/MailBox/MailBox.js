import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Search, 
  Send, 
  User, 
  Users, 
  Building, 
  ArrowLeft,
  Inbox,
  SendHorizonal,
  Trash,
  Eye,
  Mail,
  MailOpen
} from 'lucide-react';

// Set auth token for all requests
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

const Mailbox = ({studentData}) => {
  // Get token from local storage
  const token = sessionStorage.getItem('token');
  setAuthToken(token);
  
  // User type state - get from session storage
  const [userType, setUserType] = useState(sessionStorage.getItem('role'));
  
  // Message states
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [mailboxView, setMailboxView] = useState('inbox'); // 'inbox', 'sent', 'trash'
  const [currentMessage, setCurrentMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Compose message states
  const [isComposing, setIsComposing] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    toType: 'admin' // Default recipient for students
  });
  
  // Load messages from API based on current view
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const role = sessionStorage.getItem('role');
        const email = role=="student"|role=="company"?studentData.email:sessionStorage.getItem('adminemail') ;
        console.log(email)
        console.log(role)
        if (!email || !role) {
          console.error("Missing user information");
          setLoading(false);
          return;
        }
        
        let endpoint = `/api/messages/inbox?email=${email}&role=${role}`;
        
        if (mailboxView === 'sent') {
          endpoint = `/api/messages/sent?email=${email}&role=${role}`;
        } else if (mailboxView === 'trash') {
          endpoint = `/api/messages/trash?email=${email}&role=${role}`;
        }
        
        const res = await axios.get(endpoint);
        setMessages(res.data);
        
        // Count unread messages if viewing inbox
        if (mailboxView === 'inbox') {
          const unread = res.data.filter(msg => !msg.read).length;
          setUnreadCount(unread);
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    if (token) {
      fetchMessages();
    }
  }, [token, mailboxView]);
  
  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const role = sessionStorage.getItem('role'); // Get role from sessionStorage
        const email = role=="student"|role=="company"?studentData.email:sessionStorage.getItem('adminemail') ; // Get email from sessionStorage
        if (!role) {
          console.error("Role is missing"); 
          return;
        }
    
        const res = await axios.get(`/api/messages/recipients?role=${role}&email=${email}`);
        
        // Make sure we have an array
        if (res.data && Array.isArray(res.data)) {
          setRecipients(res.data);
        } else {
          console.error("Invalid recipients data format:", res.data);
          setRecipients([]); // Set to empty array if invalid data
        }
      } catch (err) {
        console.error("Error fetching recipients:", err);
        setRecipients([]); // Set to empty array on error
      }
    };
  
    if (token && isComposing) {
      fetchRecipients();
    }
  }, [token, isComposing]);
  
  
  // Handle message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    try {
      const role =  sessionStorage.getItem('role') ;
      const email = role=="student"|role=="company"?studentData.email:sessionStorage.getItem('adminemail');
      
      if (!email || !role) {
        alert('User information is missing');
        return;
      }
      
      await axios.post('/api/messages', {
        email, // Include user's email
        role,  // Include user's role
        to: newMessage.to,
        toType: newMessage.toType,
        subject: newMessage.subject,
        content: newMessage.content
      });
      
      // Fetch updated inbox
      const res = await axios.get(`/api/messages/inbox?email=${email}&role=${role}`);
      setMessages(res.data);
      
      // Reset form
      setNewMessage({
        to: '',
        subject: '',
        content: '',
        toType: 'admin'
      });
      
      // Exit compose mode
      setIsComposing(false);
      
      // Switch to sent items view
      setMailboxView('sent');
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    }
  };
  
  // Handle marking a message as read
  const handleMarkAsRead = async (id) => {
    try {
      const role = sessionStorage.getItem('role');
      const email = role=="student"|role=="company"?studentData.email:sessionStorage.getItem('adminemail') ;
      
      if (!email || !role) {
        console.error("Missing user information");
        return;
      }
      
      await axios.put(`/api/messages/${id}/read`, { email, role });
      
      // Update message in state
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, read: true } : msg
      ));
      
      // Update unread count
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle viewing a message
  const handleViewMessage = async (message) => {
    setCurrentMessage(message);
    
    // Mark as read if not already
    if (!message.read) {
      await handleMarkAsRead(message._id);
    }
  };
  
  // Handle deleting a message
  const handleDeleteMessage = async (id) => {
    try {
      const role = sessionStorage.getItem('role');
      const email = role=="student"|role=="company"?studentData.email:sessionStorage.getItem('adminemail') ;
      
      if (!email || !role) {
        console.error("Missing user information");
        return;
      }
      
      await axios.delete(`/api/messages/${id}?email=${email}&role=${role}`);
      
      // Remove from current messages
      setMessages(messages.filter(msg => msg._id !== id));
      
      // Close message view if currently viewing the deleted message
      if (currentMessage && currentMessage._id === id) {
        setCurrentMessage(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete message');
    }
  };
  
  // Filter messages based on search term
  const filteredMessages = messages
    .filter(msg => 
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.content && msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString();
  };
  
  // Render message view
  const MessageView = () => (
    <div className="message-container p-4 bg-light rounded shadow">
      <div className="message-header d-flex align-items-center mb-4">
        <button className="btn btn-link text-decoration-none d-flex align-items-center" onClick={() => setCurrentMessage(null)}>
          <ArrowLeft size={18} />
          <span className="ms-2">Back</span>
        </button>
        
        <div className="ms-auto">
          <button className="btn btn-outline-danger ms-2" onClick={() => handleDeleteMessage(currentMessage._id)}>
            <Trash size={18} />
          </button>
        </div>
      </div>
      
      <div className="message-content">
        <h3 className="mb-3">{currentMessage.subject}</h3>
        
        <div className="d-flex mb-4">
          <div className="me-3">
            {currentMessage.fromType === 'admin' && 
              <Users size={24} className="text-purple" />
            }
            {currentMessage.fromType === 'student' && 
              <User size={24} className="text-info" />
            }
            {currentMessage.fromType === 'company' && 
              <Building size={24} className="text-success" />
            }
          </div>
          
          <div>
            <div className="fw-bold">{currentMessage.from}</div>
            <div className="text-muted small">
              To: {currentMessage.to} | {new Date(currentMessage.date).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="message-body p-3 bg-white rounded border">
          <p style={{ whiteSpace: 'pre-wrap' }}>{currentMessage.content}</p>
        </div>
        
        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => {
            setIsComposing(true);
            setCurrentMessage(null);
            setNewMessage({
              to: currentMessage.from,
              toType: currentMessage.fromType,
              subject: `Re: ${currentMessage.subject}`,
              content: `\n\n-------- Original Message --------\nFrom: ${currentMessage.from}\nDate: ${new Date(currentMessage.date).toLocaleString()}\nSubject: ${currentMessage.subject}\n\n${currentMessage.content}`
            });
          }}>
            <Send size={18} className="me-2" />
            Reply
          </button>
        </div>
      </div>
    </div>
  );
  
  // Inside the ComposeForm component, modify the recipients mapping part



  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card shadow">
            <div className="card-header bg-white py-3">
              <h3 className="mb-0 fw-bold">{userType.charAt(0).toUpperCase() + userType.slice(1)} Mailbox</h3>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <button 
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${mailboxView === 'inbox' ? 'active' : ''}`}
                  onClick={() => {
                    setMailboxView('inbox');
                    setCurrentMessage(null);
                  }}
                >
                  <div className="d-flex align-items-center">
                    <Inbox size={18} className="me-3" />
                    <span>Inbox</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="badge bg-primary rounded-pill">{unreadCount}</span>
                  )}
                </button>
                <button 
                  className={`list-group-item list-group-item-action d-flex align-items-center ${mailboxView === 'sent' ? 'active' : ''}`}
                  onClick={() => {
                    setMailboxView('sent');
                    setCurrentMessage(null);
                  }}
                >
                  <SendHorizonal size={18} className="me-3" />
                  <span>Sent</span>
                </button>
                <button 
                  className={`list-group-item list-group-item-action d-flex align-items-center ${mailboxView === 'trash' ? 'active' : ''}`}
                  onClick={() => {
                    setMailboxView('trash');
                    setCurrentMessage(null);
                  }}
                >
                  <Trash size={18} className="me-3" />
                  <span>Trash</span>
                </button>
              </div>
            </div>
            <div className="card-footer bg-white py-3">
              <button 
                className="btn btn-primary d-flex align-items-center w-100 justify-content-center" 
                onClick={() => {
                  setIsComposing(true);
                  setCurrentMessage(null);
                  setNewMessage({
                    to: '',
                    subject: '',
                    content: '',
                    toType: 'admin'
                  });
                }}
              >
                <Plus size={18} className="me-2" />
                <span>Compose New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="card shadow">
            {isComposing ? (
              <ComposeForm 
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              setIsComposing={setIsComposing}
              currentMessage={currentMessage}
              recipients={recipients}
            />
            ) : currentMessage ? (
              <MessageView />
            ) : (
              <>
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h3 className="mb-0 fw-bold">
                    {mailboxView === 'inbox' ? 'Inbox' : mailboxView === 'sent' ? 'Sent Items' : 'Trash'}
                  </h3>
                  <div className="d-flex position-relative w-50">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted" size={18} />
                  </div>
                </div>

                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{width: '40px'}}></th>
                          <th 
                            style={{cursor: 'pointer', width: '25%'}} 
                            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              {mailboxView === 'sent' ? 'To' : 'From'}
                              <div className="d-flex flex-column">
                                <ChevronUp size={16} className={sortDirection === 'asc' ? 'text-primary' : 'text-muted'} />
                                <ChevronDown size={16} className={sortDirection === 'desc' ? 'text-primary' : 'text-muted'} style={{marginTop: '-5px'}} />
                              </div>
                            </div>
                          </th>
                          <th 
                            style={{cursor: 'pointer'}} 
                            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              Subject
                              <div className="d-flex flex-column">
                                <ChevronUp size={16} className={sortDirection === 'asc' ? 'text-primary' : 'text-muted'} />
                                <ChevronDown size={16} className={sortDirection === 'desc' ? 'text-primary' : 'text-muted'} style={{marginTop: '-5px'}} />
                              </div>
                            </div>
                          </th>
                          <th 
                            style={{cursor: 'pointer', width: '15%'}} 
                            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              Date
                              <div className="d-flex flex-column">
                                <ChevronUp size={16} className={sortDirection === 'asc' ? 'text-primary' : 'text-muted'} />
                                <ChevronDown size={16} className={sortDirection === 'desc' ? 'text-primary' : 'text-muted'} style={{marginTop: '-5px'}} />
                              </div>
                            </div>
                          </th>
                          <th style={{width: '40px'}}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMessages.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-4 text-muted fst-italic">
                              No messages in your {mailboxView === 'inbox' ? 'inbox' : mailboxView === 'sent' ? 'sent items' : 'trash'}
                            </td>
                          </tr>
                        ) : (
                          filteredMessages.map((message) => (
                            <tr 
                              key={message._id} 
                              className={message.read || mailboxView === 'sent' ? '' : 'table-primary'}
                              onClick={() => handleViewMessage(message)}
                              style={{cursor: 'pointer'}}
                            >
                              <td className="text-center">
                                {mailboxView === 'inbox' && (
                                  message.read ? <MailOpen size={18} className="text-muted" /> : <Mail size={18} className="text-primary" />
                                )}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {mailboxView === 'sent' ? (
                                    // Show recipient icon for sent messages
                                    <>
                                      {message.toType === 'admin' && 
                                        <Users size={16} className="text-purple me-2" />
                                      }
                                      {message.toType === 'student' && 
                                        <User size={16} className="text-info me-2" />
                                      }
                                      {message.toType === 'company' && 
                                        <Building size={16} className="text-success me-2" />
                                      }
                                      <span className={message.read ? '' : 'fw-bold'}>
                                        {message.to}
                                      </span>
                                    </>
                                  ) : (
                                    // Show sender icon for inbox messages
                                    <>
                                      {message.fromType === 'admin' && 
                                        <Users size={16} className="text-purple me-2" />
                                      }
                                      {message.fromType === 'student' && 
                                        <User size={16} className="text-info me-2" />
                                      }
                                      {message.fromType === 'company' && 
                                        <Building size={16} className="text-success me-2" />
                                      }
                                      <span className={message.read || mailboxView === 'sent' ? '' : 'fw-bold'}>
                                        {message.from}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className={message.read || mailboxView === 'sent' ? '' : 'fw-bold'}>
                                <div className="text-truncate" style={{maxWidth: '400px'}}>
                                  {message.subject}
                                </div>
                              </td>
                              <td className="text-muted">
                                {formatDate(message.date)}
                              </td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMessage(message._id);
                                  }}
                                >
                                  <Trash size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ComposeForm = ({ newMessage, setNewMessage, handleSendMessage, setIsComposing, currentMessage, recipients }) => {
  // Defensive check for recipients array
  const recipientsList = Array.isArray(recipients) ? recipients : [];
  
  return (
    <div className="compose-container p-4 bg-light rounded shadow">
      <div className="compose-header d-flex align-items-center mb-4">
        <button className="btn btn-link text-decoration-none d-flex align-items-center" onClick={() => {
          setIsComposing(false);
          // Reset form if cancelling
          if (!currentMessage) {
            setNewMessage({
              to: '',
              subject: '',
              content: '',
              toType: 'admin'
            });
          }
        }}>
          <ArrowLeft size={18} />
          <span className="ms-2">Back</span>
        </button>
        <h3 className="mb-0 ms-3">Compose New Message</h3>
      </div>
      
      <form onSubmit={handleSendMessage} className="compose-form">
        <div className="mb-3">
          <label className="form-label">To (Recipient Type):</label>
          <select 
            value={newMessage.toType}
            onChange={(e) => setNewMessage({...newMessage, toType: e.target.value, to: ''})}
            className="form-select"
          >
            {/* Safely get unique user types */}
            {recipientsList.length > 0 ? (
              [...new Set(recipientsList.map(r => r.userType))].map(userType => (
                <option key={userType} value={userType}>
                  {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </option>
              ))
            ) : (
              // Fallback options if no recipients are loaded
              ['admin', 'student', 'company'].map(userType => (
                <option key={userType} value={userType}>
                  {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </option>
              ))
            )}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Recipient:</label>
          <select 
            value={newMessage.to}
            onChange={(e) => setNewMessage({...newMessage, to: e.target.value})}
            className="form-select"
            required
          >
            <option value="">Select Recipient</option>
            {recipientsList
              .filter(r => r.userType === newMessage.toType)
              .map(recipient => (
                <option key={recipient._id || recipient.email} value={recipient.email}>
                  {recipient.name} ({recipient.email})
                </option>
              ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Subject:</label>
          <input 
            type="text" 
            value={newMessage.subject}
            onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
            className="form-control"
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Message:</label>
          <textarea 
            value={newMessage.content}
            onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
            className="form-control"
            required
            rows={10}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary d-flex align-items-center">
            <Send size={18} />
            <span className="ms-2">Send Message</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Mailbox;