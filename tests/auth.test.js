import request from "supertest";
import app from "../server.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import prisma from "../utils/prismaClient.js";
import bcrypt from "bcryptjs";

let userCookie = "";

beforeAll(async () => {
  console.log("Setting up authentication test environment...");

  //  Delete existing test users
  await prisma.user.deleteMany();

  //  Create a new user with a hashed password
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
      name: "Test User",
      email: "testuser@example.com",
      password: hashedPassword,
      role: "user",
    },
  });

  await prisma.$disconnect(); //  Ensure DB writes before login
  await new Promise((resolve) => setTimeout(resolve, 500)); //  Small delay before login
});

describe("Authentication Tests", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
      role: "user",
    });

    console.log("Register Response:", res.body);

    expect([200, 201]).toContain(res.status);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should login the user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    console.log("Login Response Body:", res.body);
    console.log("Cookies:", res.headers["set-cookie"]);

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();

    //  Extract session cookie correctly
    userCookie = res.headers["set-cookie"]?.[0]?.split(";")[0] || "";
    console.log("Extracted Cookie:", userCookie);
    expect(userCookie).toContain("jwt=");
  });
});

afterAll(async () => {
  console.log("Cleaning up authentication test data...");
  await prisma.user.deleteMany();
  await prisma.$disconnect(); //  Close Prisma connection
});
