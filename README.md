# 🐛 Animal Crossing Tracker

A simple and visual web app to track the bugs, fish and sea creatures you've caught during your **Animal Crossing speedruns** — now with **real-time multiplayer modes** and **mobile support**!

---

## ✨ Features

- Track bugs, fish and sea creatures across all mainline games:
  - Doubutsu no Mori (N64)
  - GameCube
  - Doubutsu no Mori e+
  - Wild World
  - City Folk
  - New Leaf
  - New Horizons
- Click icons to mark creatures as caught
- Live counter with percentage completion
- **Bugs & Fish** combined grid for full-game tracking
- **Sea Creatures** grid for New Leaf and New Horizons
- 🎉 Celebration animation (confetti + rainbow flash) when a grid is completed
- Optional sound effects
- Toggle creature names display
- Progress saved automatically (localStorage)

### 🤝 Co-op Mode

- Create or join a private room using a code
- Real-time synchronization between players
- Actions (catch, uncatch, reset) are shared instantly
- Progress is separated per game and category
- Automatic room cleanup after 24h of inactivity

### 🏁 Race Mode

- Enter a nickname and create or join a race room
- Each player has their **own independent grid**
- A **live scoreboard** shows every player's progress in real time
- Each player is assigned a unique color on the scoreboard
- In Bugs & Fish mode, bugs and fish are tracked separately per player
- Resetting only affects your own progress

Perfect for **competitive speedruns** or racing with friends!

---

## 🌐 Live Version

👉 https://actrackertool.aidegare.fr/
👉 https://hey-ed.github.io/Animal-Crossing-Trackers/

---

## 🚀 How to Use

### Solo Mode

1. Select your game and category (Bugs, Fish, Sea Creatures, or Bugs & Fish)
2. Click on creatures as you catch them
3. Track your progress in real time

### Co-op Mode

1. Click **Multiplayer** → select **🤝 Co-op**
2. Click **Create** to generate a room code
3. Share the code with your friends
4. Other players click **Join** and enter the code
5. Play together — everything syncs instantly!

### Race Mode

1. Click **Multiplayer** → select **🏁 Race**
2. Enter your nickname
3. Click **Create** to generate a room code, or **Join** with an existing code
4. Each player tracks their own progress independently
5. Watch the scoreboard update in real time!

---

## 📱 Mobile

The app is fully usable on mobile with a dedicated interface:
- Fixed bottom navigation bar for quick access to game, category and settings
- Slide-up drawers for game/category selection and multiplayer
- Adaptive grid that fills the screen automatically

---

## 🔄 Reset Progress

Use the **Reset** button to clear your current run.

- In solo: resets only your local progress
- In co-op: resets the room for all players
- In race: resets only your own progress

---

## 🧠 Notes

- Progress is stored locally in solo mode
- Each game and category has separate progress tracking
- In multiplayer modes, data is synced using Firebase Realtime Database
- Rooms are automatically deleted after 24h of inactivity
- The **Bugs & Fish** grid uses optimized column layouts per game for a clean rectangular display

---

## ⚠️ Cache Notice

If updates don't appear immediately, try refreshing the page.

---

## 💫 Future Updates

### 🆕 New Content
- Add **Fossils** tracking across all games
- Add **Art / Paintings (Redd)** tracking

### 🎨 UI Improvements
- Improved overall interface and visual polish
- Optional themes (per game or global)

---
![AC Tracker Demo](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDk2MG9zdXV1b2FsZmcwZjI3bmIxYTYzc2ExYW1jZWo3NGFuMmhkdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aSE0E1z4TJqAo/giphy.gif)
