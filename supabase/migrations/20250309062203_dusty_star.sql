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
CREATE TABLE IF NOT EXISTS test_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Tests
CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES test_categories(id),
  parameters jsonb NOT NULL DEFAULT '[]',
  preparation_instructions text,
  report_time_hours integer NOT NULL DEFAULT 24,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tests_category_id_idx ON tests(category_id);

-- Labs
CREATE TABLE IF NOT EXISTS labs (
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

CREATE INDEX IF NOT EXISTS labs_city_idx ON labs(city);

-- Lab Test Prices
CREATE TABLE IF NOT EXISTS lab_test_prices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id uuid REFERENCES labs(id),
  test_id uuid REFERENCES tests(id),
  price numeric(10,2) NOT NULL,
  discounted_price numeric(10,2),
  home_collection_fee numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(lab_id, test_id)
);

CREATE INDEX IF NOT EXISTS lab_test_prices_lab_id_idx ON lab_test_prices(lab_id);
CREATE INDEX IF NOT EXISTS lab_test_prices_test_id_idx ON lab_test_prices(test_id);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone text UNIQUE NOT NULL,
  email text UNIQUE,
  name text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
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

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_test_id_idx ON bookings(test_id);
CREATE INDEX IF NOT EXISTS bookings_lab_id_idx ON bookings(lab_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id),
  amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_booking_id_idx ON payments(booking_id);

-- Test Results
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id),
  result_data jsonb NOT NULL DEFAULT '{}',
  status text DEFAULT 'pending',
  report_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS test_results_booking_id_idx ON test_results(booking_id);

-- Offers
CREATE TABLE IF NOT EXISTS offers (
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