import { query } from "./_generated/server";
import { v, ConvexError } from "convex/values";

export function isHostPassword(password: string): boolean {
  const expected = process.env.HOST_PASSWORD;
  return !!expected && password === expected;
}

// Call at the top of every host-only function.
export function requireHost(password: string): void {
  if (!isHostPassword(password)) throw new ConvexError("Wrong host password");
}

export const checkHostPassword = query({
  args: { password: v.string() },
  handler: async (_ctx, args) => isHostPassword(args.password),
});
