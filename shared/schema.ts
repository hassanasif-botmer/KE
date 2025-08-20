import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const energyReadings = pgTable("energy_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  consumption: real("consumption").notNull(), // kWh
  cost: real("cost").notNull(), // PKR
});

export const temperatureReadings = pgTable("temperature_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  temperature: real("temperature").notNull(), // Celsius
  humidity: real("humidity"), // Optional humidity percentage
});

export const billingSlabs = pgTable("billing_slabs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slabNumber: integer("slab_number").notNull(),
  minUnits: integer("min_units").notNull(),
  maxUnits: integer("max_units"), // null for unlimited
  ratePerKwh: real("rate_per_kwh").notNull(),
});

export const insertEnergyReadingSchema = createInsertSchema(energyReadings).omit({
  id: true,
  timestamp: true,
});

export const insertTemperatureReadingSchema = createInsertSchema(temperatureReadings).omit({
  id: true,
  timestamp: true,
});

export const insertBillingSlabSchema = createInsertSchema(billingSlabs).omit({
  id: true,
});

export type InsertEnergyReading = z.infer<typeof insertEnergyReadingSchema>;
export type EnergyReading = typeof energyReadings.$inferSelect;

export type InsertTemperatureReading = z.infer<typeof insertTemperatureReadingSchema>;
export type TemperatureReading = typeof temperatureReadings.$inferSelect;

export type InsertBillingSlab = z.infer<typeof insertBillingSlabSchema>;
export type BillingSlab = typeof billingSlabs.$inferSelect;
