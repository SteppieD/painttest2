-- Add contractor-focused charge rate fields to companies table
-- These rates include both labor and materials (labor is 30% of total charge)

-- Interior Charge Rates
ALTER TABLE companies ADD COLUMN IF NOT EXISTS wall_charge_rate DECIMAL(10,2) DEFAULT 1.50;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS ceiling_charge_rate DECIMAL(10,2) DEFAULT 1.25;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS baseboard_charge_rate DECIMAL(10,2) DEFAULT 2.50;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS crown_molding_charge_rate DECIMAL(10,2) DEFAULT 3.50;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS door_charge_rate DECIMAL(10,2) DEFAULT 150.00;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS window_charge_rate DECIMAL(10,2) DEFAULT 100.00;

-- Exterior Charge Rates
ALTER TABLE companies ADD COLUMN IF NOT EXISTS exterior_wall_charge_rate DECIMAL(10,2) DEFAULT 2.00;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS soffit_charge_rate DECIMAL(10,2) DEFAULT 1.75;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS fascia_charge_rate DECIMAL(10,2) DEFAULT 3.50;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS exterior_door_charge_rate DECIMAL(10,2) DEFAULT 200.00;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS exterior_window_charge_rate DECIMAL(10,2) DEFAULT 125.00;