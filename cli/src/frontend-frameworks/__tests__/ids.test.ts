// Copyright (c) 2026 Flisk Landscape contributors
// SPDX-License-Identifier: MIT
import { describe, expect, it } from "vitest";
import { FRONTEND_FRAMEWORK_IDS } from "../ids.js";
import { FRONTEND_FRAMEWORKS } from "../registry.js";

describe("FRONTEND_FRAMEWORK_IDS", () => {
  it("lists exactly the registered frontend frameworks", () => {
    expect([...FRONTEND_FRAMEWORK_IDS].sort()).toEqual(Object.keys(FRONTEND_FRAMEWORKS).sort());
  });
});
