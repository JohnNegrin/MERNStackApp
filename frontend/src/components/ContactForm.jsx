import React, { useState } from 'react';

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
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label>
                Subject:
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required />
            </label>
            <label>
                Message:
                <textarea value={message} onChange={e => setMessage(e.target.value)} required />
            </label>
            <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
            </button>
        </form>
    );
}

export default ContactForm;

