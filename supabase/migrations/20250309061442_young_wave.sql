/*
  # Initial Database Schema

  1. Tables
    - test_categories
    - tests
    - labs
    - lab_test_prices
    - users
    - bookings
    - payments
    - test_results
    - offers

  2. Security
    - Enable RLS on all tables
    - Add policies for user and admin access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Test Categories
CREATE TABLE test_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Tests
CREATE TABLE tests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES test_categories(id),
  parameters jsonb NOT NULL DEFAULT '[]',
  preparation_instructions text,
  report_time_hours integer NOT NULL DEFAULT 24,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX tests_category_id_idx ON tests(category_id);

-- Labs
CREATE TABLE labs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  rating numeric(3,2),
  accredited boolean DEFAULT false,
  home_collection_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX labs_city_idx ON labs(city);

-- Lab Test Prices
CREATE TABLE lab_test_prices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id uuid REFERENCES labs(id),
  test_id uuid REFERENCES tests(id),
  price numeric(10,2) NOT NULL,
  discounted_price numeric(10,2),
  home_collection_fee numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, test_id)
);

CREATE INDEX lab_test_prices_lab_id_idx ON lab_test_prices(lab_id);
CREATE INDEX lab_test_prices_test_id_idx ON lab_test_prices(test_id);

-- Users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone text UNIQUE NOT NULL,
  email text UNIQUE,
  name text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Bookings
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  test_id uuid REFERENCES tests(id),
  lab_id uuid REFERENCES labs(id),
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending',
  amount numeric(10,2) NOT NULL,
  home_collection boolean DEFAULT true,
  address text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX bookings_user_id_idx ON bookings(user_id);
CREATE INDEX bookings_test_id_idx ON bookings(test_id);
CREATE INDEX bookings_lab_id_idx ON bookings(lab_id);

-- Payments
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id),
  amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX payments_booking_id_idx ON payments(booking_id);

-- Test Results
CREATE TABLE test_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id),
  result_data jsonb NOT NULL DEFAULT '{}',
  status text DEFAULT 'pending',
  report_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX test_results_booking_id_idx ON test_results(booking_id);

-- Offers
CREATE TABLE offers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  image_url text,
  discount_percentage integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  active boolean DEFAULT true,
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
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Create admin role check function
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- Test Categories
CREATE POLICY "Test categories are viewable by all"
  ON test_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify test categories"
  ON test_categories
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Tests
CREATE POLICY "Tests are viewable by all"
  ON tests
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify tests"
  ON tests
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Labs
CREATE POLICY "Labs are viewable by all"
  ON labs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify labs"
  ON labs
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Lab Test Prices
CREATE POLICY "Lab test prices are viewable by all"
  ON lab_test_prices
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify lab test prices"
  ON lab_test_prices
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Bookings
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
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Payments
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Test Results
CREATE POLICY "Users can read own test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Only admins can modify test results"
  ON test_results
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Offers
CREATE POLICY "Offers are viewable by all"
  ON offers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify offers"
  ON offers
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create search function
CREATE OR REPLACE FUNCTION search_tests(search_query text)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  category_id uuid,
  parameters jsonb,
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
    OR c.name ILIKE '%' || search_query || '%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial admin user
INSERT INTO users (id, phone, role, name, email)
VALUES 
  ('00000000-0000-0000-0000-000000000000', '7339799364', 'admin', 'Admin User', 'admin@medlabcompare.com')
ON CONFLICT (id) DO UPDATE
SET role = 'admin';