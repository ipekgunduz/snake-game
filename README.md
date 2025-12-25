Snake Game - Mobile Application Development Final Project

Developer: İpek Gündüz
Custom Pixel Art: İnci Duru Boyraz
Tech Stack: React Native (Expo)

1. Project Overview

Snake Game is a modern reimagining of the classic arcade experience. The app demonstrates core React Native concepts including state management, persistent storage, and hardware integration.

2. Key Features

5 Functional Screens: Home, Game, GameOver, Leaderboard, and Settings.
Dynamic Speed Control: Integrated multi-touch support; 1 finger to boost, 2 fingers to slow down.
Persistent Data Management: High scores (ranked) and game history are saved locally using AsyncStorage.
Audio & Haptics: Zero-latency sound effects for eating food and haptic feedback.
Custom Graphics: Unique Pixel Art assets (Snake head, body, tail, food, wall, background, game icon) specially designed for this project, giving it a distinct character.

3. Tech Stack & Architecture

Navigation: React Navigation (Stack) for seamless screen transitions.
Media Management: Audio preloading using expo-av to ensure instant sound triggers.
Performance: Optimized use of useState and useRef hooks to manage the game loop.

4. Setup & Run Instructions

To run this project locally, follow these steps:

Install Dependencies: npm install
Start the Project: npx expo start --tunnel
Run on Device: Scan the QR code using the Expo Go app.

5. Git Version Control
The development process is documented through a timeline of 25 commits.

6. Academic Integrity Statement
This project was developed by me and the custom pixel art assets were created specifically for this project by my friend, İnci Duru Boyraz.
