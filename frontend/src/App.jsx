import './App.css'
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from 'react';
import { v1 as uuidv1 } from "uuid";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register.jsx';
import Login from './pages/Login.jsx';
import AuthProvider, { AuthContext } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    isSidebarOpen, setIsSidebarOpen
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="app">
                  <MyContext.Provider value={providerValues}>
                    <Sidebar />
                    <ChatWindow />
                  </MyContext.Provider>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
