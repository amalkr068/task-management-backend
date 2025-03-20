import request from "supertest";
import app from "../server.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import prisma from "../utils/prismaClient.js";
import bcrypt from "bcryptjs";

let taskId = "";
let userCookie = "";

describe("Task Management Tests", () => {
  beforeAll(async () => {
    console.log("Setting up test environment...");

    //  Delete all test users & tasks to prevent duplicates
    await prisma.task.deleteMany();
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

    //  Login the test user
    const loginRes = await request(app).post("/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    console.log("Login Response Body:", loginRes.body);
    console.log("Set-Cookie Header:", loginRes.headers["set-cookie"]);

    expect(loginRes.status).toBe(200);
    expect(loginRes.headers["set-cookie"]).toBeDefined();

    //  Extract session cookie correctly
    userCookie = loginRes.headers["set-cookie"]?.[0]?.split(";")[0] || "";
    console.log("Extracted Cookie:", userCookie);

    if (!userCookie) throw new Error("User authentication failed.");
  });

  it("should create a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Cookie", userCookie)
      .send({
        title: "New Task",
        description: "This is a test task",
      });

    console.log("Task Creation Response:", res.body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id"); //  Use `id` instead of `_id`

    taskId = res.body.id;
    console.log("Task ID:", taskId);
    expect(taskId).not.toBe("");
  });

  it("should get user-specific tasks", async () => {
    const res = await request(app).get("/tasks").set("Cookie", userCookie);

    console.log("Fetched Tasks Response:", res.body);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update a task", async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Cookie", userCookie)
      .send({ title: "Updated Task", status: "In Progress" });

    console.log("Update Response:", res.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Updated Task");
  });

  it("should delete a task", async () => {
    const res = await request(app).delete(`/tasks/${taskId}`).set("Cookie", userCookie);

    console.log("Delete Response:", res.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  afterAll(async () => {
    console.log("Cleaning up test data...");

    try {
      await prisma.task.deleteMany();
    } catch (err) {
      console.warn("No tasks to delete or Prisma model issue:", err);
    }

    await prisma.user.deleteMany();
    await prisma.$disconnect(); //  Close Prisma connection
    app.close(); //  Ensure Express server shuts down
  });
});
