/**
 * Preview/dev orchestrator.
 *
 * Runs the cal Convex backend (`convex dev`, watch mode) and the Vite dev
 * server as one managed process tree, so the app has a live backend on port
 * 3210 for the whole preview session. `convex dev --once` alone is not enough:
 * it deploys the functions and then shuts the backend down.
 *
 * If either child dies, the other is torn down and this process exits with its
 * exit code so the platform restart logic sees the failure.
 */
import { spawn } from "node:child_process";

let shuttingDown = false;
const procs = new Map();

function start(name, args) {
  const child = spawn("bun", args, {
    stdio: ["ignore", "inherit", "inherit"],
    env: process.env,
  });
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.error(`[dev] ${name} exited (code=${code} signal=${signal}) — shutting down`);
    for (const p of procs.values()) {
      if (!p.killed) p.kill("SIGTERM");
    }
    process.exit(code ?? 1);
  });
  procs.set(name, child);
}

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const p of procs.values()) {
    if (!p.killed) p.kill("SIGTERM");
  }
  setTimeout(() => process.exit(0), 500);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start("convex", ["run", "convex:watch"]);
start("vite", ["run", "dev"]);
