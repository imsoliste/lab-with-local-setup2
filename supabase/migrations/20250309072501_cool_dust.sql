/*
  # Initialize Sample Data

  This migration adds sample data for:
  1. Test categories
  2. Tests
  3. Labs
  4. Lab test prices
*/

-- Insert test categories
INSERT INTO test_categories (name, description) VALUES
  ('Blood Tests', 'Basic and comprehensive blood analysis'),
  ('Diabetes', 'Tests for diabetes monitoring and diagnosis'),
  ('Thyroid', 'Thyroid function tests'),
  ('Vitamin', 'Vitamin deficiency tests'),
  ('Liver Function', 'Tests for liver health assessment'),
  ('Kidney Function', 'Tests for kidney health assessment'),
  ('Heart', 'Cardiac health tests'),
  ('Hormone', 'Hormone level tests');

-- Insert tests
INSERT INTO tests (name, description, category_id, parameters, preparation_instructions, report_time_hours) 
SELECT 
  'Complete Blood Count',
  'Comprehensive blood test that checks RBC, WBC, platelets, and hemoglobin levels',
  id,
  ARRAY['RBC Count', 'WBC Count', 'Hemoglobin', 'Platelets'],
  'Fasting for 8-10 hours recommended',
  24
FROM test_categories WHERE name = 'Blood Tests';

INSERT INTO tests (name, description, category_id, parameters, preparation_instructions, report_time_hours)
SELECT 
  'Thyroid Profile',
  'Measures thyroid hormones (T3, T4) and thyroid-stimulating hormone (TSH)',
  id,
  ARRAY['T3', 'T4', 'TSH'],
  'No special preparation required',
  24
FROM test_categories WHERE name = 'Thyroid';

-- Insert labs
INSERT INTO labs (name, address, city, rating, accredited) VALUES
  ('Pathkind Labs', 'Malviya Nagar', 'Jaipur', 4.2, true),
  ('Dr. Lal PathLabs', 'Vaishali Nagar', 'Jaipur', 4.5, true),
  ('SRL Diagnostics', 'Raja Park', 'Jaipur', 4.3, true);

-- Insert lab test prices
INSERT INTO lab_test_prices (lab_id, test_id, price, discounted_price, home_collection_available, home_collection_fee)
SELECT 
  l.id,
  t.id,
  499,
  449,
  true,
  100
FROM labs l, tests t
WHERE l.name = 'Pathkind Labs' AND t.name = 'Complete Blood Count';

INSERT INTO lab_test_prices (lab_id, test_id, price, discounted_price, home_collection_available, home_collection_fee)
SELECT 
  l.id,
  t.id,
  599,
  539,
  true,
  100
FROM labs l, tests t
WHERE l.name = 'Dr. Lal PathLabs' AND t.name = 'Thyroid Profile';