import React, { useEffect, useState } from 'react';

function NoteList() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingNote, setEditingNote] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/notes/')
            .then(response => response.json())
            .then(data => setNotes(data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newNote = { title, content };

        if (editingNote) {
            fetch(`http://127.0.0.1:8000/api/notes/${editingNote.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            })
            .then(response => response.json())
            .then(updatedNote => {
                setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
                setEditingNote(null);
            });
        } else {
            fetch('http://127.0.0.1:8000/api/notes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            })
            .then(response => response.json())
            .then(data => {
                setNotes([...notes, data]);
            });
        }

        setTitle('');
        setContent('');
    };

    const handleEdit = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditingNote(note);
    };

    const handleDelete = (id) => {
        fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
            method: 'DELETE',
        })
        .then(() => {
            setNotes(notes.filter(note => note.id !== id));
        });
    };

    return (
        <div style={{ marginBottom: '40px' }}>
            <h1>Notes</h1>
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
                    backgroundColor: editingNote ? '#ffc107' : '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                }}>
                    {editingNote ? 'Update Note' : 'Add Note'}
                </button>
            </form>
            <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                {notes.map(note => (
                    <li key={note.id} style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '5px',
                        padding: '20px',
                        marginBottom: '10px',
                        position: 'relative'
                    }}>
                        <h2>{note.title}</h2>
                        <p>{note.content}</p>
                        <button onClick={() => handleEdit(note)} style={{
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
                        <button onClick={() => handleDelete(note.id)} style={{
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

export default NoteList;
