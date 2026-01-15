"use client";

import { setUsername, getUsername, clearAuth } from "./storage";

// Usuario simple hardcodeado
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123pass";

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    setUsername(username);
    return true;
  }
  return false;
}

export function logout(): void {
  clearAuth();
}

export function isAuthenticated(): boolean {
  return getUsername() === ADMIN_USERNAME;
}

export function getCurrentUsername(): string | null {
  return getUsername();
}
