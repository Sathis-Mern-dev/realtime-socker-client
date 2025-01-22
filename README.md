# Collaborative Drawing Application

This is a real-time collaborative drawing application built using React, WebSockets, and a local state management approach. Multiple users can draw on the same canvas and see each other's drawings in real time. The app stores drawing events locally and updates the canvas dynamically.

## Features
- **Real-time Drawing**: Users can draw on the canvas in real time, and their actions will be reflected on other users' canvases.
- **Multiple Users**: All connected users can see a combined drawing, with their own and others' drawings displayed.
- **Drawing Persistence**: Drawings are stored locally using React's `useState`, and the canvas updates whenever the state changes.
- **Canvas Reset**: Users can clear the canvas, and the reset will be reflected on all connected users' canvases.

## Installation

### 1. Clone the repository

    ```bash
    git clone https://github.com/your-username/realtime-socker-client.git
    cd realtime-socker-client

### 2. Install Dependencies
    ```bash
    npm install

### 3. Run the client
    ```bash
    npm start
    


