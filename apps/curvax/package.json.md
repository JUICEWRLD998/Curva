# Quick Fix: Running Two Instances

## The Port Conflict Issue

When you try to run `npm run dev` twice, the second instance fails because port 5173 is already in use by the first instance.

## Solution: Add a Second Dev Script

Add this to `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently -k \"vite\" \"wait-on tcp:5173 && cross-env VITE_DEV_SERVER_URL=http://localhost:5173 electron .\"",
    "dev:peer2": "concurrently -k \"vite --port 5174\" \"wait-on tcp:5174 && cross-env VITE_DEV_SERVER_URL=http://localhost:5174 electron .\""
  }
}
```

## Usage

**Terminal 1 (Peer A)**:
```bash
npm run dev
```

**Terminal 2 (Peer B)**:
```bash
npm run dev:peer2
```

Now both instances run on different Vite ports (5173 and 5174) but connect to the same P2P swarm!

