
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ssnLogo from './assets/ssnLogo.png';
import { db } from "./firebase"; // Assuming this imports the initialized Firestore instance
import { collection, getDocs } from "firebase/firestore"; // Corrected import
import "./ViewEvents.css";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchType, setSearchType] = useState("category");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventsFromFirebase = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs
          .filter(doc => doc.data().status === "published")
          .map(doc => ({
            id: doc.id,
            title: doc.data().title || "No Title",
            agenda: doc.data().agenda || "No Agenda",
            category: doc.data().category || "No Category",
            eventDate: doc.data().eventDate || "No Date",
            venue: doc.data().venue || "No Venue",
            format: doc.data().format || "N/A",
            paymentOptions: doc.data().paymentOptions || "N/A",
            ticketPrice: doc.data().ticketPrice || "N/A",
            registrationLink: doc.data().registrationLink || "/register"
          }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsFromFirebase();
  }, []);

  const topThreeEvents = [...events]
    .filter(event => new Date(event.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 3);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents([]);
      return;
    }

    const filtered = events.filter((event) => {
      const target = searchType === "venue" 
        ? event.venue?.toLowerCase() 
        : event.category?.toLowerCase();
      return target?.includes(searchQuery.toLowerCase());
    });
    setFilteredEvents(filtered);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      setFilteredEvents([]);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "No Date") return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRegisterClick = (event) => {
    window.location.href = `/register?event=${encodeURIComponent(event.title)}`;
  };

  return (
    <div className="app">
      <header className="header">
        <img src={ssnLogo} alt="SSN Logo" className="logo" />
        <nav className="nav-links">
          <a href="/">Home</a>
        </nav>
      </header>

      <div className="container events-container">
        <div className="carousel-container">
          {loading ? (
            <div className="carousel-card">
              <p>Loading events...</p>
            </div>
          ) : (
            <Slider {...sliderSettings}>
              {topThreeEvents.length > 0 ? (
                topThreeEvents.map((event, index) => (
                  <div key={index} className="carousel-card">
                    <h2>{event.title}</h2>
                    <p className="date">{formatDate(event.eventDate)}</p>
                    <p className="description">{event.agenda}</p>
                  </div>
                ))
              ) : (
                <div className="carousel-card">
                  <p className="error">⚠ No upcoming published events available.</p>
                </div>
              )}
            </Slider>
          )}
        </div>

        <div className="search-container">
          <select onChange={(e) => setSearchType(e.target.value)} value={searchType}>
            <option value="category">Search by Category</option>
            <option value="venue">Search by Venue</option>
          </select>
          <input
            type="text"
            placeholder={`Enter ${searchType === "venue" ? "Venue" : "Category"}`}
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="card-container">
          {loading ? (
            <div className="card">
              <p>Loading events...</p>
            </div>
          ) : (filteredEvents.length > 0 ? filteredEvents : events).length > 0 ? (
            (filteredEvents.length > 0 ? filteredEvents : events).map((event, index) => (
              <div key={index} className="card" onClick={() => setSelectedEvent(event)}>
                <h2>{event.title}</h2>
                <p><strong>Category:</strong> {event.category}</p>
                <p><strong>Date:</strong> {formatDate(event.eventDate)}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Agenda:</strong> {event.agenda.length > 100 ? `${event.agenda.substring(0, 100)}...` : event.agenda}</p>
              </div>
            ))
          ) : (
            <div className="card">
              <p className="error">No published events found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {selectedEvent && (
        <div className="event-modal" onClick={(e) => {
          if (e.target.className === "event-modal") setSelectedEvent(null);
        }}>
          <div className="modal-content">
            <h2>{selectedEvent.title}</h2>
            <p><strong>Category:</strong> {selectedEvent.category}</p>
            <p><strong>Date:</strong> {formatDate(selectedEvent.eventDate)}</p>
            <p><strong>Venue:</strong> {selectedEvent.venue}</p>
            <p><strong>Agenda:</strong> {selectedEvent.agenda}</p>
            <p><strong>Format:</strong> {selectedEvent.format}</p>
            <p><strong>Payment Options:</strong> {selectedEvent.paymentOptions}</p>
            <p><strong>Ticket Price:</strong> {selectedEvent.ticketPrice !== "N/A" ? `₹${selectedEvent.ticketPrice}` : "Free"}</p>
            <div className="modal-buttons">
              <button className="register-btn" onClick={() => handleRegisterClick(selectedEvent)}>Register</button>
              <button className="close-btn" onClick={() => setSelectedEvent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">© 2025 SSN Events. All rights reserved.</footer>
    </div>
  );
};

export default ViewEvents;
