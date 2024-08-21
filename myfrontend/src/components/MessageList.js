import React, { useEffect, useState } from 'react';

function MessageList() {
    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingMessage, setEditingMessage] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/messages/')
            .then(response => response.json())
            .then(data => setMessages(data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMessage = { title, content };

        if (editingMessage) {
            fetch(`http://127.0.0.1:8000/api/messages/${editingMessage.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMessage),
            })
            .then(response => response.json())
            .then(updatedMessage => {
                setMessages(messages.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg));
                setEditingMessage(null);
            });
        } else {
            fetch('http://127.0.0.1:8000/api/messages/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMessage),
            })
            .then(response => response.json())
            .then(data => {
                setMessages([...messages, data]);
            });
        }

        setTitle('');
        setContent('');
    };

    const handleEdit = (message) => {
        setTitle(message.title);
        setContent(message.content);
        setEditingMessage(message);
    };

    const handleDelete = (id) => {
        fetch(`http://127.0.0.1:8000/api/messages/${id}/`, {
            method: 'DELETE',
        })
        .then(() => {
            setMessages(messages.filter(message => message.id !== id));
        });
    };

    return (
        <div style={{ marginBottom: '40px' }}>
            <h1>Messages</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', height: '80px' }}
                />
                <button type="submit" style={{
                    padding: '10px 20px',
                    backgroundColor: editingMessage ? '#ffc107' : '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                }}>
                    {editingMessage ? 'Update Message' : 'Add Message'}
                </button>
            </form>
            <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                {messages.map(message => (
                    <li key={message.id} style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '5px',
                        padding: '20px',
                        marginBottom: '10px',
                        position: 'relative'
                    }}>
                        <h2>{message.title}</h2>
                        <p>{message.content}</p>
                        <button onClick={() => handleEdit(message)} style={{
                            position: 'absolute',
                            top: '20px',
                            right: '100px',
                            backgroundColor: '#ffc107',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            color: '#fff'
                        }}>
                            Edit
                        </button>
                        <button onClick={() => handleDelete(message.id)} style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            backgroundColor: '#dc3545',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            color: '#fff'
                        }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MessageList;
