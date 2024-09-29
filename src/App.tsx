import './App.css'
import ChatContainer from './components/ChatContainer'
import ChatContextProvider from './context/chatContext'

function App() {
  return (
    <ChatContextProvider>
      <ChatContainer/>
    </ChatContextProvider>
  )
}

export default App
