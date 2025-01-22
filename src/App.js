import React, { useState, useRef } from "react";
import Canvas from "./components/Canvas";
import Loader from "./components/Loader";

const App = () => {
  const [room, setRoom] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);

  const joinRoom = () => {
    if (!room) return alert("Please enter a room name!");
    setLoading(true);
    socketRef.current = new WebSocket("https://realtime-socket-server.onrender.com");

    socketRef.current.onopen = () => {
      setIsConnected(true);
      setLoading(false);
      socketRef.current.send(JSON.stringify({ type: "join-room", room }));
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
      setLoading(false);
      console.log("Disconnected from the server");
    };
  };

  const resetCanvas = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "reset-canvas" }));
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          disabled={isConnected}
        />
        <button onClick={joinRoom} disabled={isConnected}>
          Join Room
        </button>
      </div>

      <div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
        />
        <button onClick={resetCanvas}>Reset Canvas</button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        isConnected && (
          <Canvas socketRef={socketRef} color={color} brushSize={brushSize} />
        )
      )}
    </div>
  );
};

export default App;
