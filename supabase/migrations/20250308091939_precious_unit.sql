/*
  # Fix Database Schema and Policies

  1. Tables
    - Drop existing tables and recreate with proper structure
    - Add proper constraints and relationships
    - Enable RLS on all tables

  2. Policies
    - Remove conflicting policies
    - Add clean policies for each table
    - Set up proper access control
*/

-- Drop existing tables (if any)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS lab_test_prices CASCADE;
DROP TABLE IF EXISTS tests CASCADE;
DROP TABLE IF EXISTS labs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  rating numeric(2,1) DEFAULT 0.0,
  accredited boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  parameters text[] DEFAULT '{}',
  preparation_instructions text,
  report_time_hours integer DEFAULT 24,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lab_test_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id uuid REFERENCES labs(id),
  test_id uuid REFERENCES tests(id),
  price numeric(10,2) NOT NULL,
  home_collection_available boolean DEFAULT true,
  home_collection_fee numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, test_id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  test_id uuid REFERENCES tests(id),
  lab_id uuid REFERENCES labs(id),
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending',
  amount numeric(10,2) NOT NULL,
  home_collection boolean DEFAULT false,
  address text,
  additional_tests text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  gateway_payment_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
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

-- Create policies for labs table
CREATE POLICY "Anyone can view labs" 
  ON labs 
  FOR SELECT 
  TO public 
  USING (true);

-- Create policies for tests table
CREATE POLICY "Anyone can view tests" 
  ON tests 
  FOR SELECT 
  TO public 
  USING (true);

-- Create policies for lab_test_prices table
CREATE POLICY "Anyone can view lab test prices" 
  ON lab_test_prices 
  FOR SELECT 
  TO public 
  USING (true);

-- Create policies for bookings table
CREATE POLICY "Users can view own bookings" 
  ON bookings 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" 
  ON bookings 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" 
  ON bookings 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create policies for payments table
CREATE POLICY "Users can view own payments" 
  ON payments 
  FOR SELECT 
  TO authenticated 
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments" 
  ON payments 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_test_id_idx ON bookings(test_id);
CREATE INDEX IF NOT EXISTS bookings_lab_id_idx ON bookings(lab_id);
CREATE INDEX IF NOT EXISTS payments_booking_id_idx ON payments(booking_id);
CREATE INDEX IF NOT EXISTS lab_test_prices_lab_id_idx ON lab_test_prices(lab_id);
CREATE INDEX IF NOT EXISTS lab_test_prices_test_id_idx ON lab_test_prices(test_id);