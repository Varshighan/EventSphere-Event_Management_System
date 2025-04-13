
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { auth, db } from "./firebase"; // Adjust path to your Firebase config
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
// import "./EventOrganizerSignIn.css";

// const EventOrganizerSignIn = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     username: "",
//     password: "",
//     confirmPassword: "",
//     department: "",
//     designation: "",
//     organization: "ssn",
//     otherOrganization: "",
//     agenda: "", // Added agenda field
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
//     if (!emailRegex.test(formData.email)) {
//       alert("Please enter a valid email address!");
//       return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     try {
//       // Check for duplicate username in Firestore
//       const usernameQuery = query(
//         collection(db, "users"),
//         where("username", "==", formData.username)
//       );
//       const usernameSnapshot = await getDocs(usernameQuery);
//       if (!usernameSnapshot.empty) {
//         alert("This username is already taken!");
//         return;
//       }

//       // Create user with Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );
//       const user = userCredential.user;
//       const orgId = user.uid; // Use Firebase UID as org_id

//       await updateProfile(user, {
//         displayName: formData.username,
//       });

//       // Store user data in Firestore
//       await setDoc(doc(db, "users", orgId), {
//         name: formData.name,
//         email: formData.email,
//         username: formData.username,
//         department: formData.department,
//         designation: formData.designation,
//         organization: formData.organization === "other" ? formData.otherOrganization : formData.organization,
//         agenda: formData.agenda, // Added agenda to Firestore data
//         org_id: orgId,
//         createdAt: new Date(),
//       });

//       navigate("/eventorganizer"); // Redirect to dashboard
//     } catch (error) {
//       console.error("Error during sign-up:", error.message);
//       alert(`Sign-up failed: ${error.message}`);
//     }
//   };

//   return (
//     <div className="signin-container">
//       <div className="wrapper">
//         <form onSubmit={handleSubmit}>
//           <h1>EVENT ORGANIZER SIGN-IN</h1>

//           {/* Name Input */}
//           <div className="input-box">
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               required
//               value={formData.name}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Email Input */}
//           <div className="input-box">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               required
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Username Input */}
//           <div className="input-box">
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               required
//               value={formData.username}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Password Input */}
//           <div className="input-box">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Password"
//               required
//               value={formData.password}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Confirm Password */}
//           <div className="input-box">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               required
//               value={formData.confirmPassword}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Show Password Toggle */}
//           <div className="show-password">
//             <label>
//               <input
//                 type="checkbox"
//                 checked={showPassword}
//                 onChange={() => setShowPassword(!showPassword)}
//               />{" "}
//               Show Password
//             </label>
//           </div>

//           {/* Department Input */}
//           <div className="input-box">
//             <input
//               type="text"
//               name="department"
//               placeholder="Department"
//               required
//               value={formData.department}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Designation Input */}
//           <div className="input-box">
//             <input
//               type="text"
//               name="designation"
//               placeholder="Designation"
//               required
//               value={formData.designation}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Agenda Input */}
//           <div className="input-box">
//             <input
//               type="text"
//               name="agenda"
//               placeholder="Agenda"
//               required
//               value={formData.agenda}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Organization Selection */}
//           <div className="input-box select-box">
//             <select
//               name="organization"
//               value={formData.organization}
//               onChange={handleChange}
//               required
//             >
//               <option value="ssn">SSN</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           {/* Conditional Other Organization Input */}
//           {formData.organization === "other" && (
//             <div className="input-box">
//               <input
//                 type="text"
//                 name="otherOrganization"
//                 placeholder="Organization Name"
//                 required={formData.organization === "other"}
//                 value={formData.otherOrganization}
//                 onChange={handleChange}
//               />
//             </div>
//           )}

//           {/* Submit Button */}
//           <button type="submit" className="signin-button">
//             Sign Up
//           </button>

//           {/* Login Link */}
//           <div className="login-link">
//             <p>
//               Already have an account? <Link to="/login">Login</Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EventOrganizerSignIn;

// import React, { useEffect, useState } from 'react';
// import { db, storage } from "./firebase";
// import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import './EventOrganizer.css';
// import ssnLogo from './assets/ssnLogo.png';
// import ssnCampus from './assets/ssn_campus.jpeg';
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from 'react-router-dom';

// const EventOrganizer = () => {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('create');
//   const [showBanner, setShowBanner] = useState(true);
//   const [newEvent, setNewEvent] = useState({
//     title: '', category: '', description: '', eventDate: '', venue: '',
//     onlineLink: '', format: 'in-person', ticketPrice: '',
//     paymentOptions: '', agenda: '', speakers: '', organizerDetails: '',
//     contactInfo: '', specialInstructions: '', socialLinks: '', sponsors: '',
//     status: '' // Removed image and registrationLink
//   });

//   const [requestedEvents, setRequestedEvents] = useState([]);
//   const [approvedEvents, setApprovedEvents] = useState([]);
//   const [publishedEvents, setPublishedEvents] = useState([]);
//   const [allEvents, setAllEvents] = useState([]);

//   useEffect(() => {
//     document.body.style.background = "#ffffff";
//     const handleScroll = () => setShowBanner(window.scrollY <= 100);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     if (currentUser) {
//       fetchEvents();
//     }
//   }, [currentUser, activeTab]);

//   const fetchEvents = async () => {
//     const q = query(collection(db, "events"), where("createdBy", "==", currentUser.displayName));
//     const querySnapshot = await getDocs(q);
//     const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setAllEvents(events);
//     setRequestedEvents(events.filter(e => e.status === ""));
//     setApprovedEvents(events.filter(e => e.status === "approved"));
//     setPublishedEvents(events.filter(e => e.status === "published"));
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target; // Removed file handling since image is gone
//     setNewEvent({ ...newEvent, [name]: value });
//   };

//   const createEvent = async () => {
//     const { title, category, eventDate, venue } = newEvent; // Removed registrationLink from validation
//     if (!title || !category || !eventDate || !venue) {
//       alert("Please fill in all mandatory fields.");
//       return;
//     }

//     try {
//       const docRef = await addDoc(collection(db, "events"), {
//         ...newEvent,
//         createdBy: currentUser?.displayName || "unknown",
//         status: ""
//       });

//       alert("Event submitted successfully! Event ID: " + docRef.id);
//       setNewEvent({
//         title: '', category: '', description: '', eventDate: '', venue: '',
//         onlineLink: '', format: 'in-person', ticketPrice: '',
//         paymentOptions: '', agenda: '', speakers: '', organizerDetails: '',
//         contactInfo: '', specialInstructions: '', socialLinks: '', sponsors: '',
//         status: '' // Reset form without image or registrationLink
//       });
//       setActiveTab("requested");
//     } catch (error) {
//       console.error("Error adding document: ", error);
//       alert("Error submitting event. Please try again.");
//     }
//   };

//   const publishEvent = async (eventId) => {
//     const eventRef = doc(db, "events", eventId);
//     await updateDoc(eventRef, { status: "published" });
//     fetchEvents();
//   };

//   return (
//     <div className="event-organizer-container">
//       <nav className="navbar">
//         <div className="navbar-left">
//           <img src={ssnLogo} alt="SSN College Logo" className="ssn-logo" />
//         </div>
//         <div className="navbar-right">
//           <span className="user-info">Welcome, {currentUser?.displayName || "Guest"}</span>
//           <a href="#" className="nav-link">Home</a>
//           <a href="#" className="nav-link">About SSN</a>
//           <a href="#" className="nav-link">Events</a>
//           <input type="text" placeholder="Search..." className="search-bar" />
//           <button className="logout-button" onClick={handleLogout}>Logout</button>
//         </div>
//       </nav>

//       {showBanner && (
//         <div className="image-banner">
//           <img src={ssnCampus} alt="SSN Campus" className="campus-image" />
//           <div className="banner-text">EVENT ORGANIZER DASHBOARD</div>
//         </div>
//       )}

//       <div className="dashboard-container">
//         <div className="sidebar">
//           <button className={activeTab === 'create' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => setActiveTab('create')}>Create Event</button>
//           <button className={activeTab === 'requested' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => setActiveTab('requested')}>Requested</button>
//           <button className={activeTab === 'approved' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => setActiveTab('approved')}>Approved</button>
//           <button className={activeTab === 'published' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => setActiveTab('published')}>Published</button>
//           <button className={activeTab === 'history' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => setActiveTab('history')}>Event History</button>
//         </div>

//         <div className="main-content">
//           {activeTab === 'create' && (
//             <div className="create-event">
//               <h2>Create New Event</h2>
//               <label>Event Title:<span className="required">*</span></label>
//               <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} placeholder="Enter event title" required />
//               <label>Category:<span className="required">*</span></label>
//               <select name="category" value={newEvent.category} onChange={handleInputChange} required>
//                 <option value="">Select Category</option>
//                 <option value="Workshop">Workshop</option>
//                 <option value="Seminar">Seminar</option>
//                 <option value="Conference">Conference</option>
//                 <option value="Cultural">Cultural</option>
//               </select>
//               <label>Date & Time:<span className="required">*</span></label>
//               <input type="datetime-local" name="eventDate" value={newEvent.eventDate} onChange={handleInputChange} required />
//               <label>Venue:<span className="required">*</span></label>
//               <input type="text" name="venue" value={newEvent.venue} onChange={handleInputChange} placeholder="Enter venue" required />
//               <label>Agenda:</label>
//               <input type="text" name="agenda" value={newEvent.agenda} onChange={handleInputChange} placeholder="Enter event agenda" />
//               <button className="create-button" onClick={createEvent}>Submit Event</button>
//             </div>
//           )}

//           {activeTab === 'requested' && (
//             <div className="event-requested">
//               <h2>Requested Events</h2>
//               {requestedEvents.map(event => (
//                 <div key={event.id} className="event-item">
//                   <p>{event.title} - {event.eventDate} (Pending approval)</p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {activeTab === 'approved' && (
//             <div className="event-approved">
//               <h2>Approved Events</h2>
//               {approvedEvents.map(event => (
//                 <div key={event.id} className="event-item">
//                   <p>{event.title} - {event.eventDate}</p>
//                   <button onClick={() => publishEvent(event.id)}>Publish</button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {activeTab === 'published' && (
//             <div className="event-published">
//               <h2>Published Events</h2>
//               {publishedEvents.map(event => (
//                 <div key={event.id} className="event-item">
//                   <p>{event.title} - {event.eventDate}</p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {activeTab === 'history' && (
//             <div className="event-history">
//               <h2>Event History</h2>
//               {allEvents.map(event => (
//                 <div key={event.id} className="event-item">
//                   <p>{event.title} - {event.eventDate} ({event.status || 'pending'})</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventOrganizer;

import React, { useEffect, useState } from 'react';
import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import './EventOrganizer.css';
import ssnLogo from './assets/ssnLogo.png';
import ssnCampus from './assets/ssn_campus.jpeg';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const EventOrganizer = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  const [showBanner, setShowBanner] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: '',
    eventDate: '',
    venue: '',
    agenda: '',
    status: '' // Only fields present in the form
  });

  const [requestedEvents, setRequestedEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [publishedEvents, setPublishedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    document.body.style.background = "#ffffff";
    const handleScroll = () => setShowBanner(window.scrollY <= 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchEvents();
    }
  }, [currentUser, activeTab]);

  const fetchEvents = async () => {
    const q = query(collection(db, "events"), where("createdBy", "==", currentUser.displayName));
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAllEvents(events);
    setRequestedEvents(events.filter(e => e.status === ""));
    setApprovedEvents(events.filter(e => e.status === "approved"));
    setPublishedEvents(events.filter(e => e.status === "published"));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const createEvent = async () => {
    const { title, category, eventDate, venue } = newEvent;
    if (!title || !category || !eventDate || !venue) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "events"), {
        ...newEvent,
        createdBy: currentUser?.displayName || "unknown",
        email: currentUser?.email || "unknown", // Adding user's email
        status: ""
      });

      alert("Event submitted successfully! Event ID: " + docRef.id);
      setNewEvent({
        title: '',
        category: '',
        eventDate: '',
        venue: '',
        agenda: '',
        status: '' // Reset form with only form fields
      });
      setActiveTab("requested");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error submitting event. Please try again.");
    }
  };

  const publishEvent = async (eventId) => {
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, { status: "published" });
    fetchEvents();
  };

  return (
    <div className="event-organizer-container">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={ssnLogo} alt="SSN College Logo" className="ssn-logo" />
        </div>
        <div className="navbar-right">
          <span className="user-info">Welcome, {currentUser?.displayName || "Guest"}</span>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/viewevents" className="nav-link">Events</Link>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {showBanner && (
        <div className="image-banner">
          <img src={ssnCampus} alt="SSN Campus" className="campus-image" />
          <div className="banner-text">EVENT ORGANIZER DASHBOARD</div>
        </div>
      )}

      <div className="dashboard-container">
        <div className="sidebar">
          <button className={activeTab === 'create' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => setActiveTab('create')}>Create Event</button>
          <button className={activeTab === 'requested' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => setActiveTab('requested')}>Requested</button>
          <button className={activeTab === 'approved' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => setActiveTab('approved')}>Approved</button>
          <button className={activeTab === 'published' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => setActiveTab('published')}>Published</button>
          <button className={activeTab === 'history' ? 'sidebar-btn active' : 'sidebar-btn'} onClick={() => setActiveTab('history')}>Event History</button>
        </div>

        <div className="main-content">
          {activeTab === 'create' && (
            <div className="create-event">
              <h2>Create New Event</h2>
              <label>Event Title:<span className="required">*</span></label>
              <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} placeholder="Enter event title" required />
              <label>Category:<span className="required">*</span></label>
              <select name="category" value={newEvent.category} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
                <option value="Cultural">Cultural</option>
              </select>
              <label>Date & Time:<span className="required">*</span></label>
              <input type="datetime-local" name="eventDate" value={newEvent.eventDate} onChange={handleInputChange} required />
              <label>Venue:<span className="required">*</span></label>
              <input type="text" name="venue" value={newEvent.venue} onChange={handleInputChange} placeholder="Enter venue" required />
              <label>Agenda:</label>
              <input type="text" name="agenda" value={newEvent.agenda} onChange={handleInputChange} placeholder="Enter event agenda" />
              <button className="create-button" onClick={createEvent}>Submit Event</button>
            </div>
          )}

          {activeTab === 'requested' && (
            <div className="event-requested">
              <h2>Requested Events</h2>
              {requestedEvents.map(event => (
                <div key={event.id} className="event-item">
                  <p>{event.title} - {event.eventDate} (Pending approval)</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'approved' && (
            <div className="event-approved">
              <h2>Approved Events</h2>
              {approvedEvents.map(event => (
                <div key={event.id} className="event-item">
                  <p>{event.title} - {event.eventDate}</p>
                  <button onClick={() => publishEvent(event.id)}>Publish</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'published' && (
            <div className="event-published">
              <h2>Published Events</h2>
              {publishedEvents.map(event => (
                <div key={event.id} className="event-item">
                  <p>{event.title} - {event.eventDate}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="event-history">
              <h2>Event History</h2>
              {allEvents.map(event => (
                <div key={event.id} className="event-item">
                  <p>{event.title} - {event.eventDate} ({event.status || 'pending'})</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventOrganizer;