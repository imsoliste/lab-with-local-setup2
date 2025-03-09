/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - phone (text, unique)
      - name (text)
      - created_at (timestamp)
      - role (text)
    
    - bookings
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - test_id (text)
      - lab_id (text)
      - booking_date (date)
      - booking_time (text)
      - status (text)
      - amount (numeric)
      - payment_id (text)
      - created_at (timestamp)
    
    - payments
      - id (uuid, primary key)
      - booking_id (uuid, references bookings)
      - amount (numeric)
      - status (text)
      - gateway_payment_id (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  test_id text NOT NULL,
  lab_id text NOT NULL,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending',
  amount numeric(10,2) NOT NULL,
  payment_id text,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
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

-- Create policies for bookings table
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for payments table
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (booking_id IN (
    SELECT id FROM bookings WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (booking_id IN (
    SELECT id FROM bookings WHERE user_id = auth.uid()
  ));

-- Create admin policies
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update all bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can read all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');