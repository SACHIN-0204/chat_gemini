import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";

function ChatWindow() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const { prompt, setPrompt, setReply, currThreadId, setPrevChats } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const getReply = async () => {
        const message = prompt.trim();
        if (!message || loading) return;

        setLoading(true);
        setPrompt("");
        setPrevChats((chats) => [...chats, { role: "user", content: message }]);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("http://localhost:3000/api/chat", options);
            const res = await response.json();
            console.log(res);
            setPrevChats((chats) => [...chats, { role: "assistant", content: res.reply }]);
            setReply(res.reply);
        } catch (err) {
            console.log(err);
            setReply(null);
        }
        setLoading(false);
    };

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
               <span>ChatGemini <i className="fa-solid fa-chevron-down"></i></span>
               <div className="userIconDiv" onClick={handleProfileClick}>
                <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                {user?.username && (
                    <span style={{ marginLeft: "8px", fontSize: "14px", fontWeight: 600 }}>
                        {user.username}
                    </span>
                )}
               </div>
            </div>

            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem" style={{ fontWeight: 600 }}>
                        {user?.username ? `Signed in as ${user.username}` : "Signed in"}
                    </div>
                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i>Setting
                    </div>
                    <div className="dropDownItem">
                        <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan
                    </div>
                    <div className="dropDownItem" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i>Log Out
                    </div>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask Anything"
                       value={prompt}
                       onChange={(e) => setPrompt(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <button id="submit" type="button" onClick={getReply} aria-label="Send message">
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                <p className="info">
                    ChatGemini can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;