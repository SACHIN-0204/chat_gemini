import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect  } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {

    const {prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, pervChats, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); //set default false value

    const getReply = async() => {
        setLoading(true);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {

            const response = await fetch("http://localhost:3000/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);

    }

    useEffect(() => {
       if(prompt && reply) {
        setPrevChats(pervChats => (
            [...pervChats, {
                role: "user",
                content: prompt
            },{
                role: "assitant",
                content: reply
            }]
        ))
       }

       setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
               <span>ChatGemini <i className="fa-solid fa-chevron-down"></i></span>
               <div className="userIconDiv" onClick={handleProfileClick}>
                <span className="userIcon"><i className="fa-solid fa-user"></i></span>
               </div>
            </div>

            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i>Setting
                    </div>
                    <div className="dropDownItem">
                        <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan
                    </div>
                    <div className="dropDownItem">
                        <i className="fa-solid fa-right-from-bracket"></i>Log Out
                    </div>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>

            </ScaleLoader>


            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask Anything"
                       value={prompt}
                       onChange={(e) => setPrompt(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
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