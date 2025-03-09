/*
  # Add test improvements
  
  1. Changes
    - Add indexes for improved query performance
    - Add location-based fields to labs table
    - Add rating and review fields
    
  2. New Fields
    - Labs table:
      - `latitude` (numeric) - Lab location latitude
      - `longitude` (numeric) - Lab location longitude
      - `avg_rating` (numeric) - Average rating
      - `total_ratings` (integer) - Total number of ratings
*/

-- Add location and rating fields to labs
ALTER TABLE labs ADD COLUMN IF NOT EXISTS latitude numeric(10,8);
ALTER TABLE labs ADD COLUMN IF NOT EXISTS longitude numeric(11,8);
ALTER TABLE labs ADD COLUMN IF NOT EXISTS avg_rating numeric(3,2) DEFAULT 0;
ALTER TABLE labs ADD COLUMN IF NOT EXISTS total_ratings integer DEFAULT 0;

-- Add indexes for improved performance
CREATE INDEX IF NOT EXISTS idx_labs_location ON labs (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_labs_rating ON labs (avg_rating DESC);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_test ON lab_test_prices (test_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_lab ON lab_test_prices (lab_id);
CREATE INDEX IF NOT EXISTS idx_tests_category ON tests (category);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date);