/*
  # Initial Schema Setup

  1. New Tables
    - labs: Store lab information
    - tests: Store test information
    - lab_test_prices: Store test prices for each lab
    - bookings: Store test booking information
    - payments: Store payment information
    - test_results: Store test results
    - health_records: Store user health records

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
    - Set up foreign key relationships

  3. Changes
    - Initial schema creation
    - Basic data structure for medical lab testing platform
*/

-- Labs Table
CREATE TABLE IF NOT EXISTS labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  rating numeric(2,1) DEFAULT 0.0,
  accredited boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Labs are viewable by everyone" 
  ON labs FOR SELECT 
  USING (true);

-- Tests Table
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

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tests are viewable by everyone" 
  ON tests FOR SELECT 
  USING (true);

-- Lab Test Prices Table
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

ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lab test prices are viewable by everyone" 
  ON lab_test_prices FOR SELECT 
  USING (true);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  test_id uuid REFERENCES tests(id),
  lab_id uuid REFERENCES labs(id),
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text DEFAULT 'pending',
  amount numeric(10,2) NOT NULL,
  payment_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Users can view their own bookings'
  ) THEN
    CREATE POLICY "Users can view their own bookings" 
      ON bookings FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Users can create bookings'
  ) THEN
    CREATE POLICY "Users can create bookings" 
      ON bookings FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Users can update their own bookings'
  ) THEN
    CREATE POLICY "Users can update their own bookings" 
      ON bookings FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  gateway_payment_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" 
  ON payments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments" 
  ON payments FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

-- Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  user_id uuid NOT NULL,
  test_id uuid REFERENCES tests(id),
  lab_id uuid REFERENCES labs(id),
  test_date date NOT NULL,
  result_data jsonb NOT NULL,
  report_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own test results" 
  ON test_results FOR SELECT 
  USING (auth.uid() = user_id);

-- Health Records Table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  record_type text NOT NULL,
  record_date date NOT NULL,
  description text,
  attachments text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own health records" 
  ON health_records FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create health records" 
  ON health_records FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health records" 
  ON health_records FOR UPDATE 
  USING (auth.uid() = user_id);