import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid"; 
import api from "./api.js";
import blacklogo from "./assets/blacklogo.png";

function Sidebar() {

    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, isSidebarOpen, setIsSidebarOpen} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
        //   const response = await fetch("http://localhost:3000/api/thread");
          const res = await api.get("/thread");
        //   const res = await response.json();
          const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
        //   console.log(filteredData);
          setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        } 
    }

    useEffect(() => {
        getAllThreads();
    }, []);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setIsSidebarOpen(false);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        setIsSidebarOpen(false);

        try {

            // const response = await fetch(`http://localhost:3000/api/thread/${newThreadId}`);
            const res = await api.get(`/thread/${newThreadId}`);
            // const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {

            // const response = await fetch(`http://localhost:3000/api/thread/${threadId}`, {method: "DELETE"});
            const res = await api.delete(`/thread/${threadId}`, {method: "DELETE"});
            // const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId))

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }

    }

    return (
        <>
        {isSidebarOpen && (
            <div className="sidebarOverlay" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        <section className={isSidebarOpen ? "sidebar open" : "sidebar"}>
            <div className="sidebarTop">
                <button onClick={createNewChat}>
                    <img src={blacklogo} alt="gemini log" className="logo"></img>
                    <span className="fa-solid fa-pen-to-square"></span>
                </button>
                <i
                    className="fa-solid fa-xmark closeSidebar"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close sidebar"
                ></i>
            </div>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} onClick={(e) => changeThread(thread.threadId)}
                         className={thread.threadId === currThreadId ? "highlighted": " " }
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();  //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            >

                            </i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>By Sachin Vishwakarma &hearts;</p>
            </div>

        </section>
        </>
    )
}


export default Sidebar;