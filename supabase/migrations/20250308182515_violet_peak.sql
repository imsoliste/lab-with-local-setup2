/*
  # Fix lab tests and bookings schema

  1. Changes
    - Add foreign key constraints to bookings table
    - Update test_id and lab_id to use UUID type
    - Add missing indexes for performance
*/

-- Update bookings table
ALTER TABLE bookings
  ALTER COLUMN test_id TYPE uuid USING test_id::uuid,
  ALTER COLUMN lab_id TYPE uuid USING lab_id::uuid,
  ADD CONSTRAINT bookings_test_id_fkey FOREIGN KEY (test_id) REFERENCES tests(id),
  ADD CONSTRAINT bookings_lab_id_fkey FOREIGN KEY (lab_id) REFERENCES labs(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_test_id ON bookings(test_id);
CREATE INDEX IF NOT EXISTS idx_bookings_lab_id ON bookings(lab_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_test_id ON lab_test_prices(test_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_lab_id ON lab_test_prices(lab_id);