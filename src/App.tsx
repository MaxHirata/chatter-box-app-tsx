import './App.css'
import ChatContainer from './components/ChatContainer'
import ChatContextProvider from '../src/context/ChatContext';

function App() {
  return (
    <ChatContextProvider>
      <ChatContainer/>
    </ChatContextProvider>
  )
}

export default App
