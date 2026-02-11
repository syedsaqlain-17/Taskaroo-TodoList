# Taskaroo 📝
> **"Write it. Tick it. Win it."** ✅

Taskaroo is a high-performance, branded To-Do application built with **React Native CLI** and **TypeScript**. It features a specialized sorting algorithm designed for maximum productivity.

## 🚀 Key Features
- **User Authentication**: Secure Login & Registration via Firebase Auth.
- **Smart Sorting Algorithm**: Intelligently organizes tasks based on:
  1. **Status**: Completed tasks automatically drop to the bottom.
  2. **Priority**: Tasks are weighted by High, Medium, and Low levels.
  3. **Deadline**: Tie-breakers are decided by the closest due date.
- **Cool Mint UI**: A creative, visually appealing design with priority-coded task borders.
- **Real-time Sync**: Powered by Google Firebase Firestore.

## 🛠️ Tech Stack
- **Frontend**: React Native CLI, TypeScript
- **Backend**: Firebase (Auth & Firestore)
- **State Management**: React Hooks (useState, useEffect)

## 📦 Installation & Setup
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Ensure your Android emulator is running.
4. Run `npx react-native run-android`.