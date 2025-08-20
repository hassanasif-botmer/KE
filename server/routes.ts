import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEnergyReadingSchema, insertTemperatureReadingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Energy endpoints
  app.get("/api/energy/readings", async (req, res) => {
    try {
      const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
      const readings = await storage.getEnergyReadings(hours);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch energy readings" });
    }
  });

  app.post("/api/energy/readings", async (req, res) => {
    try {
      const data = insertEnergyReadingSchema.parse(req.body);
      const reading = await storage.createEnergyReading(data);
      res.json(reading);
    } catch (error) {
      res.status(400).json({ message: "Invalid energy reading data" });
    }
  });

  app.get("/api/energy/stats", async (req, res) => {
    try {
      const stats = await storage.getEnergyStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch energy stats" });
    }
  });

  // Temperature endpoints
  app.get("/api/temperature/readings", async (req, res) => {
    try {
      const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
      const readings = await storage.getTemperatureReadings(hours);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch temperature readings" });
    }
  });

  app.post("/api/temperature/readings", async (req, res) => {
    try {
      const data = insertTemperatureReadingSchema.parse(req.body);
      const reading = await storage.createTemperatureReading(data);
      res.json(reading);
    } catch (error) {
      res.status(400).json({ message: "Invalid temperature reading data" });
    }
  });

  app.get("/api/temperature/current", async (req, res) => {
    try {
      const temperature = await storage.getCurrentTemperature();
      res.json({ temperature });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current temperature" });
    }
  });

  app.get("/api/temperature/stats", async (req, res) => {
    try {
      const stats = await storage.getTemperatureStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch temperature stats" });
    }
  });

  // Billing endpoints
  app.get("/api/billing/slabs", async (req, res) => {
    try {
      const slabs = await storage.getBillingSlabs();
      res.json(slabs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch billing slabs" });
    }
  });

  app.get("/api/billing/calculate", async (req, res) => {
    try {
      const units = req.query.units ? parseFloat(req.query.units as string) : 0;
      const bill = await storage.calculateBill(units);
      res.json(bill);
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate bill" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
