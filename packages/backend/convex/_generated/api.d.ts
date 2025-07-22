/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as fitness from "../fitness.js";
import type * as notes from "../notes.js";
import type * as nutrition from "../nutrition.js";
import type * as openai from "../openai.js";
import type * as progress from "../progress.js";
import type * as userGoals from "../userGoals.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  fitness: typeof fitness;
  notes: typeof notes;
  nutrition: typeof nutrition;
  openai: typeof openai;
  progress: typeof progress;
  userGoals: typeof userGoals;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
