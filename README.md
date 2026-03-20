# 🐛 Animal Crossing Tracker

A simple and visual web app to track the bugs and fish you've caught during your **Animal Crossing speedruns** — now with **real-time co-op mode**!

---

## ✨ Features

- Track bugs and fish across multiple games:
  - GameCube
  - Wild World
  - City Folk
  - New Leaf
  - New Horizons
- Click icons to mark creatures as caught
- Live counter with percentage completion
- Optional sound effects
- Toggle creature names display
- Progress saved automatically (localStorage)

### 🤝 Co-op Mode (NEW)

- Create or join a private room using a code
- Real-time synchronization between players
- Actions (catch, uncatch, reset) are shared instantly
- Progress is separated per game and category
- Automatic room cleanup after inactivity

Perfect for **co-op speedruns** or racing with friends!

---

## 🌐 Live Version

👉 https://hey-ed.github.io/Animal-Crossing-Trackers/

---

## 🚀 How to Use

### Solo Mode

1. Select your game and category (Bugs or Fish)
2. Click on creatures as you catch them
3. Track your progress in real time

### Co-op Mode

1. Click **Create** to generate a room code
2. Share the code with your friends
3. Other players click **Join** and enter the code
4. Play together — everything syncs instantly!

---

## 🔄 Reset Progress

Use the **Reset** button to clear your current run.

- In solo: resets only your local progress
- In co-op: resets the room for all players

---

## 🧠 Notes

- Progress is stored locally in solo mode
- Each game and category has separate progress tracking
- In co-op mode, data is synced using Firebase Realtime Database
- Rooms are automatically deleted after a period of inactivity

---

## ⚠️ Cache Notice

If updates don’t appear immediately, try refreshing the page.

---

## 💫 Future Updates

### 🆕 New Content
- Add support for **Doubutsu no Mori (N64)** and **Doubutsu no Mori e+**
- Add **Sea Creatures** tracking (New Leaf & New Horizons)
- Add **Fossils** tracking across all games
- Add **Art / Paintings (Redd)** tracking

### 🎨 UI Improvements
- Improved overall interface and visual polish
- Optional themes (per game or global)

### 📱 Mobile Support
- Responsive design for mobile devices
- Improved touch interactions

---
![AC Tracker Demo](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDk2MG9zdXV1b2FsZmcwZjI3bmIxYTYzc2ExYW1jZWo3NGFuMmhkdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aSE0E1z4TJqAo/giphy.gif)
