import { type EnergyReading, type InsertEnergyReading, type TemperatureReading, type InsertTemperatureReading, type BillingSlab, type InsertBillingSlab } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Authentication
  authenticateUser(email: string, password: string): Promise<boolean>;
  
  // Energy readings
  getEnergyReadings(hours?: number): Promise<EnergyReading[]>;
  createEnergyReading(reading: InsertEnergyReading): Promise<EnergyReading>;
  getEnergyStats(): Promise<{
    totalUnitsThisMonth: number;
    todayUsage: number;
    estimatedBill: number;
  }>;

  // Temperature readings
  getTemperatureReadings(hours?: number): Promise<TemperatureReading[]>;
  createTemperatureReading(reading: InsertTemperatureReading): Promise<TemperatureReading>;
  getCurrentTemperature(): Promise<number>;
  getTemperatureStats(): Promise<{
    current: number;
    todayHigh: number;
    todayLow: number;
    average24h: number;
  }>;

  // Billing
  getBillingSlabs(): Promise<BillingSlab[]>;
  calculateBill(totalUnits: number): Promise<{
    slabBreakdown: Array<{
      slab: number;
      units: number;
      rate: number;
      amount: number;
    }>;
    totalEnergyCharges: number;
    taxes: number;
    totalBill: number;
  }>;
  predictNextSlabCrossing(currentUnits: number): Promise<{
    nextSlabThreshold: number;
    daysToNextSlab: number;
    averageDailyUsage: number;
    nextSlabRate: number;
    estimatedCostIncrease: number;
  }>;
}

export class MemStorage implements IStorage {
  private energyReadings: Map<string, EnergyReading>;
  private temperatureReadings: Map<string, TemperatureReading>;
  private billingSlabs: Map<string, BillingSlab>;

  constructor() {
    this.energyReadings = new Map();
    this.temperatureReadings = new Map();
    this.billingSlabs = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize billing slabs based on KE tariff structure
    const slabs = [
      { slabNumber: 1, minUnits: 0, maxUnits: 100, ratePerKwh: 22 },
      { slabNumber: 2, minUnits: 101, maxUnits: 200, ratePerKwh: 25 },
      { slabNumber: 3, minUnits: 201, maxUnits: 300, ratePerKwh: 28 },
      { slabNumber: 4, minUnits: 301, maxUnits: 400, ratePerKwh: 30 },
      { slabNumber: 5, minUnits: 401, maxUnits: 600, ratePerKwh: 32 },
      { slabNumber: 6, minUnits: 601, maxUnits: null, ratePerKwh: 35 },
    ];

    slabs.forEach(slab => {
      const id = randomUUID();
      this.billingSlabs.set(id, { ...slab, id });
    });

    // Generate some sample data for the last 24 hours
    this.generateSampleData();
  }

  private generateSampleData() {
    const now = new Date();
    
    // Generate energy readings for the last 24 hours (every hour)
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseConsumption = 3.0 + Math.sin(i / 24 * Math.PI * 2) * 1.5; // Simulate daily pattern
      const consumption = baseConsumption + (Math.random() - 0.5) * 0.5;
      const cost = consumption * 15; // Approximate cost
      
      const id = randomUUID();
      this.energyReadings.set(id, {
        id,
        timestamp,
        consumption: Math.max(0, consumption),
        cost,
      });
    }

    // Generate temperature readings for the last 24 hours (every 30 minutes)
    for (let i = 48; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000);
      const baseTemp = 27.5 + Math.sin((i / 48) * Math.PI * 2) * 2.5; // Daily temperature cycle
      const temperature = baseTemp + (Math.random() - 0.5) * 1.0;
      
      const id = randomUUID();
      this.temperatureReadings.set(id, {
        id,
        timestamp,
        temperature: Math.round(temperature * 10) / 10,
        humidity: Math.round((45 + Math.random() * 20) * 10) / 10,
      });
    }
  }

  async getEnergyReadings(hours = 24): Promise<EnergyReading[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.energyReadings.values())
      .filter(reading => reading.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createEnergyReading(insertReading: InsertEnergyReading): Promise<EnergyReading> {
    const id = randomUUID();
    const reading: EnergyReading = {
      ...insertReading,
      id,
      timestamp: new Date(),
    };
    this.energyReadings.set(id, reading);
    return reading;
  }

  async getEnergyStats(): Promise<{
    totalUnitsThisMonth: number;
    todayUsage: number;
    estimatedBill: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const monthlyReadings = Array.from(this.energyReadings.values())
      .filter(reading => reading.timestamp >= startOfMonth);
    
    const todayReadings = Array.from(this.energyReadings.values())
      .filter(reading => reading.timestamp >= startOfDay);

    const totalUnitsThisMonth = monthlyReadings.reduce((sum, reading) => sum + reading.consumption, 0);
    const todayUsage = todayReadings.reduce((sum, reading) => sum + reading.consumption, 0);
    
    const billCalc = await this.calculateBill(totalUnitsThisMonth);
    
    return {
      totalUnitsThisMonth: Math.round(totalUnitsThisMonth),
      todayUsage: Math.round(todayUsage * 10) / 10,
      estimatedBill: billCalc.totalBill,
    };
  }

  async getTemperatureReadings(hours = 24): Promise<TemperatureReading[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.temperatureReadings.values())
      .filter(reading => reading.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createTemperatureReading(insertReading: InsertTemperatureReading): Promise<TemperatureReading> {
    const id = randomUUID();
    const reading: TemperatureReading = {
      ...insertReading,
      id,
      timestamp: new Date(),
      humidity: insertReading.humidity ?? null,
    };
    this.temperatureReadings.set(id, reading);
    return reading;
  }

  async getCurrentTemperature(): Promise<number> {
    const readings = await this.getTemperatureReadings(1);
    if (readings.length === 0) return 28.5;
    return readings[readings.length - 1].temperature;
  }

  async getTemperatureStats(): Promise<{
    current: number;
    todayHigh: number;
    todayLow: number;
    average24h: number;
  }> {
    const readings = await this.getTemperatureReadings(24);
    
    if (readings.length === 0) {
      return { current: 28.5, todayHigh: 30.1, todayLow: 26.2, average24h: 28.1 };
    }

    const temps = readings.map(r => r.temperature);
    const current = temps[temps.length - 1];
    const todayHigh = Math.max(...temps);
    const todayLow = Math.min(...temps);
    const average24h = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;

    return {
      current: Math.round(current * 10) / 10,
      todayHigh: Math.round(todayHigh * 10) / 10,
      todayLow: Math.round(todayLow * 10) / 10,
      average24h: Math.round(average24h * 10) / 10,
    };
  }

  async getBillingSlabs(): Promise<BillingSlab[]> {
    return Array.from(this.billingSlabs.values())
      .sort((a, b) => a.slabNumber - b.slabNumber);
  }

  async calculateBill(totalUnits: number): Promise<{
    slabBreakdown: Array<{
      slab: number;
      units: number;
      rate: number;
      amount: number;
    }>;
    totalEnergyCharges: number;
    taxes: number;
    totalBill: number;
  }> {
    const slabs = await this.getBillingSlabs();
    const slabBreakdown = [];
    let remainingUnits = totalUnits;
    let totalEnergyCharges = 0;

    for (const slab of slabs) {
      if (remainingUnits <= 0) break;

      const slabCapacity = slab.maxUnits ? slab.maxUnits - slab.minUnits + 1 : remainingUnits;
      const unitsInThisSlab = Math.min(remainingUnits, slabCapacity);
      const amount = unitsInThisSlab * slab.ratePerKwh;

      slabBreakdown.push({
        slab: slab.slabNumber,
        units: unitsInThisSlab,
        rate: slab.ratePerKwh,
        amount: Math.round(amount),
      });

      totalEnergyCharges += amount;
      remainingUnits -= unitsInThisSlab;
    }

    const taxes = Math.round(totalEnergyCharges * 0.177); // Approximate taxes (17.7%)
    const totalBill = Math.round(totalEnergyCharges + taxes);

    return {
      slabBreakdown,
      totalEnergyCharges: Math.round(totalEnergyCharges),
      taxes,
      totalBill,
    };
  }

  async predictNextSlabCrossing(currentUnits: number): Promise<{
    nextSlabThreshold: number;
    daysToNextSlab: number;
    averageDailyUsage: number;
    nextSlabRate: number;
    estimatedCostIncrease: number;
  }> {
    const slabs = await this.getBillingSlabs();
    
    // Find current slab
    let currentSlab = slabs[0];
    for (const slab of slabs) {
      if (slab.maxUnits === null || currentUnits <= slab.maxUnits) {
        currentSlab = slab;
        break;
      }
    }

    // Find next slab
    const nextSlabIndex = slabs.findIndex(s => s.slabNumber === currentSlab.slabNumber) + 1;
    const nextSlab = nextSlabIndex < slabs.length ? slabs[nextSlabIndex] : null;

    if (!nextSlab || currentSlab.maxUnits === null) {
      // Already in highest slab
      return {
        nextSlabThreshold: -1,
        daysToNextSlab: -1,
        averageDailyUsage: 0,
        nextSlabRate: currentSlab.ratePerKwh,
        estimatedCostIncrease: 0,
      };
    }

    // Calculate average daily usage from last 30 days
    const readings = await this.getEnergyReadings(24 * 30);
    const dailyUsage = readings.length > 0 
      ? readings.reduce((sum, r) => sum + r.consumption, 0) / Math.max(1, readings.length / 24)
      : 3.5; // Fallback average

    const unitsToNextSlab = currentSlab.maxUnits! - currentUnits;
    const daysToNextSlab = Math.ceil(unitsToNextSlab / dailyUsage);
    
    // Calculate cost increase when crossing to next slab
    const currentBill = await this.calculateBill(currentUnits);
    const nextSlabBill = await this.calculateBill(currentSlab.maxUnits! + 10); // 10 units into next slab
    const estimatedCostIncrease = (nextSlabBill.totalBill - currentBill.totalBill) / 10; // per unit increase

    return {
      nextSlabThreshold: currentSlab.maxUnits!,
      daysToNextSlab: Math.max(1, daysToNextSlab),
      averageDailyUsage: Math.round(dailyUsage * 10) / 10,
      nextSlabRate: nextSlab.ratePerKwh,
      estimatedCostIncrease: Math.round(estimatedCostIncrease),
    };
  }

  async authenticateUser(email: string, password: string): Promise<boolean> {
    // Static authentication for admin user
    return email === 'admin@gmail.com' && password === 'admin';
  }
}

export const storage = new MemStorage();
