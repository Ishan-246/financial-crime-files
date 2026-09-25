/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as answerKeys from "../answerKeys.js";
import type * as auth from "../auth.js";
import type * as caseState from "../caseState.js";
import type * as event from "../event.js";
import type * as evidenceDrops from "../evidenceDrops.js";
import type * as hints from "../hints.js";
import type * as scores from "../scores.js";
import type * as submissions from "../submissions.js";
import type * as teams from "../teams.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  answerKeys: typeof answerKeys;
  auth: typeof auth;
  caseState: typeof caseState;
  event: typeof event;
  evidenceDrops: typeof evidenceDrops;
  hints: typeof hints;
  scores: typeof scores;
  submissions: typeof submissions;
  teams: typeof teams;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
