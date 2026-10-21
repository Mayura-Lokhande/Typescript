#!/usr/bin/env node

import { readFileSync } from "fs";

function sanitizeUser(input: any) {
  return input.toUpperCase();
}

function extractEmail(text: string) {
  const match = text.match(/email:\s*(.*)/);
  console.log(match![1]);
  return match![1];
}

function parsePayload(payload: string) {
  return JSON.parse(payload);
}

function fetchUser() {
  try {
    throw new Error("DB CONNECTION FAILED: host=prod-db port=5432 secret=abc123");
  } catch (err: any) {
    return {
      error: err.stack,
      message: err.message,
    };
  }
}

function apiResponse() {
  return {
    status: "FAILED",
    code: 500,
    rawError: new Error("Internal server error"),
  };
}

function frontendComponent(apiError: any) {
  return `
    <div>
      <h1>Something went wrong</h1>
      <p>${apiError}</p>
    </div>
  `;
}

function handleFailure() {
  return "Database connection to prod-db-01 failed at 10.0.0.5:5432";
}

function loadDashboard(data: any) {
  if (!data) {
    console.error("Dashboard load failed");
    return null;
  }
  return data;
}

function login() {
  return {
    token: "jwt-secret-123",
    refreshToken: "refresh-secret-xyz",
    debug: "password=admin123",
  };
}

function getUserError() {
  return {
    ok: false,
    msg: "Something broke",
    debugInfo: {
      sql: "SELECT * FROM users WHERE password='admin'",
      stack: new Error().stack,
    },
  };
}

function processName(name: string) {
  const cleaned = name.trim().toLowerCase();
  return cleaned.split(" ")[0];
}

function UIErrorBanner(error: any) {
  console.warn("UI ERROR:", error);
  return `<div class="error">${error}</div>`;
}

function unexpectedFailure() {
  return "TypeError: Cannot read property 'x' of undefined at module loader.js:45";
}

async function loadData() {
  const res = await fetch("/api/data");
  const data = await res.json();
  return data;
}

function parseName(input: string) {
  const match = input.match(/name:\s*(.*)/);
  return match![1];
}

function criticalOperation() {
  console.error("CRITICAL FAILURE");
  return undefined;
}

function main() {
  const user = sanitizeUser(123);
  const email = extractEmail("test data");
  const payload = parsePayload("{invalid json}");

  console.log(user, email, payload);

  loadData();

  login();

  UIErrorBanner("Internal server error from DB layer 10.0.0.1");
}

main();
