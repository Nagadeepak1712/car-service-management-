import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', carModel: '', serviceType: '', date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ name: '', email: '', carModel: '', serviceType: '', date: '' });
        fetchBookings();
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="app-container">
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Bala Auto Service</h1>
          <p>Experience the future of automotive care with unparalleled precision and luxury.</p>
        </div>
      </div>
      
      <div className="main-content">
        <div className="glass-panel booking-section">
          <h2>Schedule Service</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="input-group">
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="text" name="carModel" placeholder="Vehicle Make & Model" value={formData.carModel} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <select name="serviceType" value={formData.serviceType} onChange={handleChange} required>
                <option value="" disabled>Select Service Type</option>
                <option value="General Maintenance">General Maintenance</option>
                <option value="Oil Change">Premium Oil Change</option>
                <option value="Tire Replacement">Tire Replacement & Balancing</option>
                <option value="Engine Diagnostics">Advanced Diagnostics</option>
              </select>
            </div>
            <div className="input-group">
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>

        <div className="bookings-list-section">
          <h2>Recent Appointments</h2>
          <div className="bookings-grid">
            {bookings.length === 0 ? (
              <p className="no-bookings">No appointments yet.</p>
            ) : (
              bookings.map((booking, index) => (
                <div key={index} className="glass-card booking-card">
                  <div className="card-header">
                    <h3>{booking.carModel}</h3>
                    <span className={`status-badge ${booking.status?.toLowerCase() || 'pending'}`}>
                      {booking.status || 'Pending'}
                    </span>
                  </div>
                  <div className="card-body">
                    <p><strong>Client:</strong> {booking.name}</p>
                    <p><strong>Service:</strong> {booking.serviceType}</p>
                    <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
