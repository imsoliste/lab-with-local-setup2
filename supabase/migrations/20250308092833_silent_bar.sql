/*
  # Safe Policy Creation Migration

  1. Purpose
    - Safely create policies by checking existence first
    - Prevent duplicate policy errors
    - Maintain proper access control

  2. Implementation
    - Use PL/pgSQL DO blocks to check policy existence
    - Only create policies if they don't exist
    - Maintain all necessary security policies
*/

-- Function to safely create policies
CREATE OR REPLACE FUNCTION create_policy_if_not_exists(
  policy_name text,
  table_name text,
  command text,
  roles text[],
  using_expr text DEFAULT NULL,
  check_expr text DEFAULT NULL,
  permissive text DEFAULT 'PERMISSIVE'
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = table_name 
    AND policyname = policy_name
  ) THEN
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR %s TO %s %s %s %s',
      policy_name,
      table_name,
      command,
      array_to_string(roles, ','),
      CASE WHEN permissive = 'PERMISSIVE' THEN '' ELSE 'AS ' || permissive END,
      CASE WHEN using_expr IS NOT NULL THEN 'USING (' || using_expr || ')' ELSE '' END,
      CASE WHEN check_expr IS NOT NULL THEN 'WITH CHECK (' || check_expr || ')' ELSE '' END
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on all tables
DO $$
BEGIN
  ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS labs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS tests ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS lab_test_prices ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
END $$;

-- Create policies for users table
SELECT create_policy_if_not_exists(
  'Users can read own data',
  'users',
  'SELECT',
  ARRAY['authenticated'],
  'auth.uid() = id'
);

SELECT create_policy_if_not_exists(
  'Users can update own data',
  'users',
  'UPDATE',
  ARRAY['authenticated'],
  'auth.uid() = id'
);

-- Create policies for labs table
SELECT create_policy_if_not_exists(
  'Anyone can view labs',
  'labs',
  'SELECT',
  ARRAY['public'],
  'true'
);

-- Create policies for tests table
SELECT create_policy_if_not_exists(
  'Anyone can view tests',
  'tests',
  'SELECT',
  ARRAY['public'],
  'true'
);

-- Create policies for lab_test_prices table
SELECT create_policy_if_not_exists(
  'Anyone can view lab test prices',
  'lab_test_prices',
  'SELECT',
  ARRAY['public'],
  'true'
);

-- Create policies for bookings table
SELECT create_policy_if_not_exists(
  'Users can view own bookings',
  'bookings',
  'SELECT',
  ARRAY['authenticated'],
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can create bookings',
  'bookings',
  'INSERT',
  ARRAY['authenticated'],
  NULL,
  'auth.uid() = user_id'
);

SELECT create_policy_if_not_exists(
  'Users can update own bookings',
  'bookings',
  'UPDATE',
  ARRAY['authenticated'],
  'auth.uid() = user_id'
);

-- Create policies for payments table
SELECT create_policy_if_not_exists(
  'Users can view own payments',
  'payments',
  'SELECT',
  ARRAY['authenticated'],
  'booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid())'
);

SELECT create_policy_if_not_exists(
  'Users can create payments',
  'payments',
  'INSERT',
  ARRAY['authenticated'],
  NULL,
  'booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid())'
);

-- Create indexes for better performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'bookings_user_id_idx') THEN
    CREATE INDEX bookings_user_id_idx ON bookings(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'bookings_test_id_idx') THEN
    CREATE INDEX bookings_test_id_idx ON bookings(test_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'bookings_lab_id_idx') THEN
    CREATE INDEX bookings_lab_id_idx ON bookings(lab_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'payments_booking_id_idx') THEN
    CREATE INDEX payments_booking_id_idx ON payments(booking_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'lab_test_prices_lab_id_idx') THEN
    CREATE INDEX lab_test_prices_lab_id_idx ON lab_test_prices(lab_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'lab_test_prices_test_id_idx') THEN
    CREATE INDEX lab_test_prices_test_id_idx ON lab_test_prices(test_id);
  END IF;
END $$;