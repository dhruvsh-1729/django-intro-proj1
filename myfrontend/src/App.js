import React from 'react';
import MessageList from './components/MessageList';
import NoteList from './components/NoteList';

function App() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <MessageList />
            <NoteList />
        </div>
    );
}

export default App;
