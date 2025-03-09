/*
  # Initial Database Schema Setup

  1. New Tables
    - test_categories
      - id (uuid, primary key)
      - name (text, unique)
      - description (text)
      - created_at (timestamptz)

    - tests
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - category_id (uuid, foreign key)
      - parameters (text[])
      - preparation_instructions (text)
      - report_time_hours (integer)
      - created_at (timestamptz)

    - labs
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - address (text)
      - city (text)
      - rating (numeric)
      - accredited (boolean)
      - created_at (timestamptz)

    - lab_test_prices
      - id (uuid, primary key)
      - lab_id (uuid, foreign key)
      - test_id (uuid, foreign key)
      - price (numeric)
      - discounted_price (numeric)
      - home_collection_available (boolean)
      - home_collection_fee (numeric)
      - created_at (timestamptz)

    - users
      - id (uuid, primary key)
      - phone (text, unique)
      - email (text)
      - name (text)
      - role (text)
      - created_at (timestamptz)

    - bookings
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - test_id (uuid, foreign key)
      - lab_id (uuid, foreign key)
      - booking_date (date)
      - booking_time (text)
      - status (text)
      - amount (numeric)
      - home_collection (boolean)
      - address (text)
      - created_at (timestamptz)

    - payments
      - id (uuid, primary key)
      - booking_id (uuid, foreign key)
      - amount (numeric)
      - status (text)
      - payment_method (text)
      - transaction_id (text)
      - created_at (timestamptz)

    - test_results
      - id (uuid, primary key)
      - booking_id (uuid, foreign key)
      - result_data (jsonb)
      - status (text)
      - report_url (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin users

  3. Functions
    - search_tests: Full-text search function for tests
*/

-- Create test_categories table
CREATE TABLE IF NOT EXISTS test_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create tests table
CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES test_categories(id),
  parameters text[] DEFAULT '{}',
  preparation_instructions text,
  report_time_hours integer NOT NULL DEFAULT 24,
  created_at timestamptz DEFAULT now()
);

-- Create labs table
CREATE TABLE IF NOT EXISTS labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  rating numeric(3,2) CHECK (rating >= 0 AND rating <= 5),
  accredited boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create lab_test_prices table
CREATE TABLE IF NOT EXISTS lab_test_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  test_id uuid REFERENCES tests(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL CHECK (price > 0),
  discounted_price numeric(10,2) CHECK (discounted_price > 0),
  home_collection_available boolean DEFAULT true,
  home_collection_fee numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, test_id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  email text,
  name text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  test_id uuid REFERENCES tests(id),
  lab_id uuid REFERENCES labs(id),
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending',
  amount numeric(10,2) NOT NULL,
  home_collection boolean DEFAULT false,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  result_data jsonb DEFAULT '{}',
  status text DEFAULT 'pending',
  report_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE test_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Create policies for test_categories
CREATE POLICY "Test categories are viewable by everyone" ON test_categories
  FOR SELECT USING (true);

CREATE POLICY "Test categories are editable by admins" ON test_categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for tests
CREATE POLICY "Tests are viewable by everyone" ON tests
  FOR SELECT USING (true);

CREATE POLICY "Tests are editable by admins" ON tests
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for labs
CREATE POLICY "Labs are viewable by everyone" ON labs
  FOR SELECT USING (true);

CREATE POLICY "Labs are editable by admins" ON labs
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for lab_test_prices
CREATE POLICY "Lab test prices are viewable by everyone" ON lab_test_prices
  FOR SELECT USING (true);

CREATE POLICY "Lab test prices are editable by admins" ON lab_test_prices
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update all bookings" ON bookings
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update all payments" ON payments
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for test_results
CREATE POLICY "Users can view own test results" ON test_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all test results" ON test_results
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update all test results" ON test_results
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create search function
CREATE OR REPLACE FUNCTION search_tests(search_query text)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  category_id uuid,
  parameters text[],
  preparation_instructions text,
  report_time_hours integer,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.*
  FROM tests t
  LEFT JOIN test_categories c ON t.category_id = c.id
  WHERE 
    t.name ILIKE '%' || search_query || '%'
    OR t.description ILIKE '%' || search_query || '%'
    OR c.name ILIKE '%' || search_query || '%'
    OR search_query = ANY(t.parameters);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;