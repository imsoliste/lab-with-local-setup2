/*
  # Initial Database Schema

  1. New Tables
    - `users`
      - User accounts and profiles
    - `labs`
      - Lab information and details
    - `tests`
      - Available medical tests
    - `lab_test_prices`
      - Test pricing for each lab
    - `bookings`
      - Test booking records
    - `payments`
      - Payment transactions
    - `test_results`
      - Test results and reports

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Set up authentication rules
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'user'::text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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

-- Labs table
CREATE TABLE IF NOT EXISTS labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  rating numeric(2,1) DEFAULT 0.0,
  accredited boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view labs"
  ON labs
  FOR SELECT
  TO public
  USING (true);

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  parameters text[] DEFAULT '{}'::text[],
  preparation_instructions text,
  report_time_hours integer DEFAULT 24,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tests"
  ON tests
  FOR SELECT
  TO public
  USING (true);

-- Lab test prices table
CREATE TABLE IF NOT EXISTS lab_test_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id uuid REFERENCES labs(id),
  test_id uuid REFERENCES tests(id),
  price numeric(10,2) NOT NULL,
  discounted_price numeric(10,2),
  home_collection_available boolean DEFAULT true,
  home_collection_fee numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prices"
  ON lab_test_prices
  FOR SELECT
  TO public
  USING (true);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  test_id uuid REFERENCES tests(id),
  lab_id uuid REFERENCES labs(id),
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending'::text,
  amount numeric(10,2) NOT NULL,
  home_collection boolean DEFAULT false,
  address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

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

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending'::text,
  payment_method text,
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (booking_id IN (
    SELECT id FROM bookings WHERE user_id = auth.uid()
  ));

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  result_data jsonb NOT NULL,
  status text DEFAULT 'pending'::text,
  report_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (booking_id IN (
    SELECT id FROM bookings WHERE user_id = auth.uid()
  ));