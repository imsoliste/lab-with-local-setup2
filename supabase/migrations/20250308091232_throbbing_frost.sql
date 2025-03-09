/*
  # Fix Database Schema

  1. Drop existing tables and policies
  2. Create new schema with proper relationships
  3. Add correct policies and constraints

  IMPORTANT: This migration drops and recreates all tables to ensure a clean state
*/

-- First, drop all existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS lab_test_prices CASCADE;
DROP TABLE IF EXISTS tests CASCADE;
DROP TABLE IF EXISTS labs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables with proper relationships and constraints

-- Users table (extends auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  phone text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Labs table
CREATE TABLE labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  rating numeric(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5.0),
  accredited boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

-- Tests table
CREATE TABLE tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  parameters text[] DEFAULT '{}',
  preparation_instructions text,
  report_time_hours integer DEFAULT 24,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

-- Lab test prices table (junction table with additional attributes)
CREATE TABLE lab_test_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id uuid NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL CHECK (price > 0),
  discounted_price numeric(10,2) CHECK (discounted_price > 0),
  home_collection_available boolean DEFAULT true,
  home_collection_fee numeric(10,2) DEFAULT 0 CHECK (home_collection_fee >= 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, test_id)
);

ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;

-- Bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id uuid NOT NULL REFERENCES tests(id),
  lab_id uuid NOT NULL REFERENCES labs(id),
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  home_collection boolean DEFAULT false,
  address text,
  additional_tests uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  gateway_payment_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX idx_lab_test_prices_lab_id ON lab_test_prices(lab_id);
CREATE INDEX idx_lab_test_prices_test_id ON lab_test_prices(test_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_test_id ON bookings(test_id);
CREATE INDEX idx_bookings_lab_id ON bookings(lab_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);

-- Add RLS policies

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Labs policies
CREATE POLICY "Anyone can view labs"
  ON labs
  FOR SELECT
  TO public
  USING (true);

-- Tests policies
CREATE POLICY "Anyone can view tests"
  ON tests
  FOR SELECT
  TO public
  USING (true);

-- Lab test prices policies
CREATE POLICY "Anyone can view lab test prices"
  ON lab_test_prices
  FOR SELECT
  TO public
  USING (true);

-- Bookings policies
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_id
    AND bookings.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_id
    AND bookings.user_id = auth.uid()
  ));

-- Admin policies (add these if you need admin access)
CREATE POLICY "Admins can do everything"
  ON bookings
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything with payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');