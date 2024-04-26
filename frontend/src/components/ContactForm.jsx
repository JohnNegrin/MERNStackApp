import React, { useState } from 'react';
// Import Bootstrap CSS if not already done globally
import 'bootstrap/dist/css/bootstrap.min.css';

function ContactForm() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            setError('Both subject and message are required.');
            return;
        }
        setLoading(true);
        setError('');
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subject, message }),
        });
        if (response.ok) {
            alert('Message sent successfully');
            setSubject('');
            setMessage('');
        } else {
            setError('Failed to send message. Please try again later.');
        }
        setLoading(false);
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit} noValidate>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Subject:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="Enter subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message:</label>
                    <textarea
                        className="form-control"
                        id="message"
                        rows="4"
                        placeholder="Type your message here"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
}

export default ContactForm;

