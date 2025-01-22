import React, { useEffect, useRef, useState } from "react";

const Canvas = ({ socketRef, color, brushSize }) => {
  const canvasRef = useRef(null);
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Redraw all the previous drawings when the state changes
    const redrawCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Optional: clear canvas before redrawing
      drawings.forEach((drawing) => {
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.brushSize;
        ctx.beginPath();
        ctx.moveTo(drawing.startX, drawing.startY);
        ctx.lineTo(drawing.endX, drawing.endY);
        ctx.stroke();
      });
    };

    // Redraw canvas whenever the 'drawings' state changes
    redrawCanvas();
  }, [drawings]);

  useEffect(() => {
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "draw-event":
          // Add new drawing event to the state (local storage)
          setDrawings((prevDrawings) => [...prevDrawings, data]);
          break;
        case "reset-canvas":
          setDrawings([]); // Reset local drawings on canvas reset event
          break;
        case "user-connect":
        case "user-disconnect":
          console.log(data.message);
          break;
        default:
          console.error("Unknown event type:", data.type);
      }
    };
  }, [socketRef]);

  const handleDraw = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (event.type === "mousedown") {
      canvas.isDrawing = true;
      canvas.lastX = x;
      canvas.lastY = y;
    } else if (event.type === "mousemove" && canvas.isDrawing) {
      const startX = canvas.lastX;
      const startY = canvas.lastY;

      // Add new drawing event to local state
      setDrawings((prevDrawings) => [
        ...prevDrawings,
        { startX, startY, endX: x, endY: y, color, brushSize },
      ]);

      canvas.lastX = x;
      canvas.lastY = y;

      // Send the drawing event to the server to broadcast to others
      socketRef.current.send(
        JSON.stringify({
          type: "draw-event",
          startX,
          startY,
          endX: x,
          endY: y,
          color,
          brushSize,
        })
      );
    } else if (event.type === "mouseup" || event.type === "mouseleave") {
      canvas.isDrawing = false;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="600"
      style={{ border: "1px solid black", cursor: "crosshair" }}
      onMouseDown={handleDraw}
      onMouseMove={handleDraw}
      onMouseUp={handleDraw}
      onMouseLeave={handleDraw}
    ></canvas>
  );
};

export default Canvas;
