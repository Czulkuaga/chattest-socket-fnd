import './App.css';
import React from 'react';
import io from 'socket.io-client'

const socket = io('http://localhost:4000')

function App() {
  const [message, setMessage] = React.useState("")
  const [messages, setMessages] = React.useState([])

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submiting')
    socket.emit('sendMessage', message)
    let newMessage = {
      from: 'Me',
      body: message
    }
    setMessages([newMessage, ...messages])
    setMessage("")
  }

  React.useEffect(() => {
    // console.log('useEffect is working')
    const sendMessage = (message) => {
      setMessages([message, ...messages])
    }
    socket.on('reSendMessage', sendMessage)
    return () => {
      socket.off('reSendMessage', sendMessage)
    }
  }, [messages])

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={(e) => { handleSubmit(e) }}>
          <div>
            <input placeholder='mensaje' value={message} onChange={(e) => handleChange(e)} />
            <button type='submit'>Enviar</button>
          </div>
        </form>
        <div className='content-info-messsages'>
          {messages.map((message, index) => {
            return (
              <div key={index}>
                <p>{message.from}: {message.body}</p>
              </div>
            )
          })}
        </div>
      </header>
    </div>
  );
}

export default App;
