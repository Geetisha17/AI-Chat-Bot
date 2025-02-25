import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const navigate = useNavigate();

    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await res.json(); 

            setChat([...chat, { user: message, bot: data.reply }]); 
            setMessage("");
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate("/login");
                toast.error("You must be logged in to access this page");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    async function handleLogout() {
        try {
            await auth.signOut();
            navigate("/login");
            toast.success("Successfully logged out");
        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <div>
            <div>
                {chat.map((c, idx) => (
                    <div key={idx}>
                        <h3 style={{color:"white"}}>You:</h3> {c.user} <br />
                        <h3 style={{color:"white"}}>Bot:</h3> {c.bot}
                    </div>
                ))}
            </div>

            <textarea
                rows="2"
                cols="50"
                value={message}
                placeholder="Type your message here..."
                onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <button onClick={sendMessage}>Send</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
