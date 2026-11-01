# IPL Auction Battle

A private real-time cricket auction game for up to 10 friends. Each participant manages their own team.

## Run on Windows
1. Install Node.js 18 or newer.
2. Extract this ZIP.
3. Open the extracted `ipl_build` folder in Command Prompt or VS Code.
4. Run `npm install` once.
5. Run `npm start`.
6. Open `http://localhost:3000`.
7. The host creates a room; friends join with the room code or invite link.

## Included
- Private rooms for up to 10 participants; each participant is their own team.
- ₹120 Cr purse per team, 20-second live auction timer, live bidding, sold/unsold tracking.
- 80-player auction pool with role, country and base price. Player photos are looked up from Wikipedia when available; an initial-based fallback is shown otherwise.
- Upcoming queue, current player, My Squad, All Squads and live purse overview.
- Tournament simulation from the purchased squads, with round-robin fixtures, standings, playoffs for four or more teams, champion, runner-up, Orange Cap and Purple Cap.
- Room state saved in `data/rooms.json`; a browser reconnects to its team using a private local token. If the server restarts during an auction, the auction pauses and the host can restart the remaining pool.

## Important game-data notes
This is a fan-made game, not an official IPL auction or live cricket statistics product. The pool contains player names and approximate game attributes used only to drive this simulation. The simulation is randomized and is not a real-world performance prediction. Player availability, current teams, official prices and career statistics are not guaranteed. Photos depend on Wikipedia's public summary service and may be unavailable.

## Hosting
The app needs a Node.js host that supports persistent disk storage and WebSockets/Socket.IO. Keep it on a **single server instance** because room persistence currently uses a local JSON file. A hosting provider with an ephemeral filesystem can lose saved rooms on redeploy/restart; use a persistent disk or migrate the storage layer to a managed database before relying on it for long-term hosted games. Set `PORT` through the host environment.

## Test checklist
Test with at least two separate browsers/devices: create/join, start auction, bid from both clients, wait for sold/unsold, verify both purses/squads, refresh and reconnect, restart the server and recover the room, complete the auction, then run the tournament. This package has syntax and local server smoke checks; a full multi-device long-duration game test still needs to be performed in your environment.

Fan-made private game. Not affiliated with BCCI, IPL or any franchise.
