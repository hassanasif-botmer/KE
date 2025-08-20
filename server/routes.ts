import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertEnergyReadingSchema, insertTemperatureReadingSchema } from "@shared/schema";

// Session middleware
function setupSession(app: Express) {
  app.use(session({
    secret: 'energy-monitoring-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));
}

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  setupSession(app);

  // Authentication endpoints
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const isValid = await storage.authenticateUser(email, password);
      
      if (isValid) {
        (req.session as any).isAuthenticated = true;
        (req.session as any).userEmail = email;
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ success: true, message: 'Logout successful' });
    });
  });

  app.get('/api/auth/status', (req, res) => {
    const isAuthenticated = !!(req.session as any)?.isAuthenticated;
    const userEmail = (req.session as any)?.userEmail;
    res.json({ 
      isAuthenticated, 
      userEmail: isAuthenticated ? userEmail : null 
    });
  });

  // Energy endpoints
  app.get("/api/energy/readings", requireAuth, async (req, res) => {
    try {
      const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
      const readings = await storage.getEnergyReadings(hours);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch energy readings" });
    }
  });

  app.post("/api/energy/readings", requireAuth, async (req, res) => {
    try {
      const data = insertEnergyReadingSchema.parse(req.body);
      const reading = await storage.createEnergyReading(data);
      res.json(reading);
    } catch (error) {
      res.status(400).json({ message: "Invalid energy reading data" });
    }
  });

  app.get("/api/energy/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getEnergyStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch energy stats" });
    }
  });

  // Temperature endpoints
  app.get("/api/temperature/readings", requireAuth, async (req, res) => {
    try {
      const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
      const readings = await storage.getTemperatureReadings(hours);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch temperature readings" });
    }
  });

  app.post("/api/temperature/readings", requireAuth, async (req, res) => {
    try {
      const data = insertTemperatureReadingSchema.parse(req.body);
      const reading = await storage.createTemperatureReading(data);
      res.json(reading);
    } catch (error) {
      res.status(400).json({ message: "Invalid temperature reading data" });
    }
  });

  app.get("/api/temperature/current", requireAuth, async (req, res) => {
    try {
      const temperature = await storage.getCurrentTemperature();
      res.json({ temperature });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current temperature" });
    }
  });

  app.get("/api/temperature/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getTemperatureStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch temperature stats" });
    }
  });

  // Billing endpoints
  app.get("/api/billing/slabs", requireAuth, async (req, res) => {
    try {
      const slabs = await storage.getBillingSlabs();
      res.json(slabs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch billing slabs" });
    }
  });

  app.get("/api/billing/calculate", requireAuth, async (req, res) => {
    try {
      const units = req.query.units ? parseFloat(req.query.units as string) : 0;
      const bill = await storage.calculateBill(units);
      res.json(bill);
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate bill" });
    }
  });

  app.get("/api/billing/predict", requireAuth, async (req, res) => {
    try {
      const currentUnits = req.query.units ? parseFloat(req.query.units as string) : 0;
      const prediction = await storage.predictNextSlabCrossing(currentUnits);
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ message: "Failed to predict next slab crossing" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
