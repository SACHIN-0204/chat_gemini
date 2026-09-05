import "./Chat.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { useState } from "react";

function Chat() {

    const {newChat, prevChats = [], reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {


          if(reply === null || !prevChats.length) return;

          const content = reply.split("");

          let idx = 0;

          const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(""));

            idx++;
            if(idx >= content.length) clearInterval(interval);
          }, 40);

          return () => clearInterval(interval);

    }, [prevChats, reply]);

    return (
        <>
        {newChat && <h1>Start a new Chat!</h1>}
            <div className="chats">

                    {
                          (reply !== null ? prevChats.slice(0, -1) : prevChats).map((chat, idx) =>
                    <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                        {
                            chat.role === "user" ? 
                            <p className="userMessage">{chat.content}</p> : 
                            <ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>
                        }
                    </div>
                )
               }

               {
                    reply !== null && latestReply !== null &&
                <div className="gptDiv" key={"typing"}>
                   <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
                </div>
               }

                {/* <div className="userDiv">
                    <p className="userMessage">User message</p>
                </div>
                <div className="gptDiv">
                    <p className="gptMessage">GPT message</p>
                </div> */}
            </div>
        </>
    )
}

export default Chat;