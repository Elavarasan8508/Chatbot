import { useEffect, useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { UserDetailsApi } from "../services/Api";
import { logout, isAuthenticated } from "../services/Auth";
import axios from "axios";
import "./Dashboard.css";

export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", email: "", localId: "" });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatWindowRef = useRef(null);

    // ✅ Check authentication on load
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
            return;
        }

        UserDetailsApi()
            .then((response) => {
                const userData = response.data.users[0];
                setUser({
                    name: userData.displayName,
                    email: userData.email,
                    localId: userData.localId,
                });
                setMessages([
                    {
                        sender: "MindSync",
                        text: `Hey ${userData.displayName || "there"}! I'm MindSync, your AI support buddy. What's on your mind?`,
                        timestamp: new Date().toLocaleTimeString(),
                    },
                ]);
            })
            .catch((error) => {
                console.error("❌ Error fetching user details:", error);
            });
    }, [navigate]);

    // ✅ Auto-scroll to latest message
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const logoutUser = () => {
        logout();
        navigate("/login");
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = {
            sender: "You",
            text: input,
            timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:5000/chat", {
                email: user.email,
                message: input,
            });

            setMessages((prev) => [
                ...prev,
                {
                    sender: "MindSync",
                    text: response.data.answer,
                    timestamp: new Date().toLocaleTimeString(),
                },
            ]);
        } catch (error) {
            console.error("❌ Chatbot error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "MindSync",
                    text: "Oops! Something went wrong. Please try again later.",
                    timestamp: new Date().toLocaleTimeString(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <NavBar logoutUser={logoutUser} />
            <main className="chat-container">
                <h1 className="chat-title">MindSync - AI Support</h1>
                <div className="chat-box" ref={chatWindowRef}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.sender === "You" ? "user-message" : "bot-message"}`}
                        >
                            <p className="message-text">{msg.text}</p>
                            <span className="message-time">{msg.timestamp}</span>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="typing-indicator">MindSync is typing...</div>
                    )}
                </div>
                <div className="chat-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="chat-input"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage} className="send-button">
                        →
                    </button>
                </div>
            </main>
        </div>
    );
}
