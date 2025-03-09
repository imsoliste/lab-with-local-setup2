/*
  # Insert Sample Data

  1. Test Categories
    - Blood Tests
    - Diabetes
    - Thyroid
    - Heart
    - Liver
    - Kidney

  2. Tests
    - Complete Blood Count
    - Thyroid Profile
    - Diabetes Profile
    - Lipid Profile
    - Liver Function Test
    - Kidney Function Test

  3. Labs
    - Pathkind Labs
    - Dr. Lal PathLabs
    - SRL Diagnostics
    - Metropolis Healthcare

  4. Lab Test Prices
    - Prices for each test at different labs
    - Home collection options
    - Discounts
*/

-- Insert test categories
INSERT INTO test_categories (name, description) VALUES
  ('Blood Tests', 'Basic and comprehensive blood tests'),
  ('Diabetes', 'Tests for diabetes monitoring and diagnosis'),
  ('Thyroid', 'Thyroid function tests'),
  ('Heart', 'Cardiac health tests'),
  ('Liver', 'Liver function tests'),
  ('Kidney', 'Kidney function tests');

-- Insert tests
INSERT INTO tests (name, description, category_id, parameters, preparation_instructions, report_time_hours) VALUES
  (
    'Complete Blood Count',
    'Measures RBC, WBC, platelets, and hemoglobin levels',
    (SELECT id FROM test_categories WHERE name = 'Blood Tests'),
    ARRAY['RBC Count', 'WBC Count', 'Hemoglobin', 'Platelets'],
    'Fasting for 8-10 hours recommended',
    24
  ),
  (
    'Thyroid Profile',
    'Measures thyroid hormones (T3, T4) and TSH',
    (SELECT id FROM test_categories WHERE name = 'Thyroid'),
    ARRAY['T3', 'T4', 'TSH'],
    'No special preparation required',
    24
  ),
  (
    'Diabetes Profile',
    'Complete diabetes screening with FBS, PPBS, and HbA1c',
    (SELECT id FROM test_categories WHERE name = 'Diabetes'),
    ARRAY['Fasting Blood Sugar', 'Post Prandial Blood Sugar', 'HbA1c'],
    'Fasting for 8-10 hours required',
    24
  ),
  (
    'Lipid Profile',
    'Measures cholesterol, triglycerides, HDL, and LDL',
    (SELECT id FROM test_categories WHERE name = 'Heart'),
    ARRAY['Total Cholesterol', 'Triglycerides', 'HDL', 'LDL'],
    'Fasting for 12 hours required',
    24
  );

-- Insert labs
INSERT INTO labs (name, description, address, city, rating, accredited) VALUES
  (
    'Pathkind Labs',
    'Leading diagnostic chain with NABL accreditation',
    'Plot No. 8, Sector 18',
    'Jaipur',
    4.5,
    true
  ),
  (
    'Dr. Lal PathLabs',
    'Trusted name in diagnostics since 1949',
    'C-12, MI Road',
    'Jaipur',
    4.7,
    true
  ),
  (
    'SRL Diagnostics',
    'Quality diagnostics with modern technology',
    'E-4, Malviya Nagar',
    'Jaipur',
    4.3,
    true
  ),
  (
    'Metropolis Healthcare',
    'Advanced diagnostic solutions',
    'F-2, Vaishali Nagar',
    'Jaipur',
    4.4,
    true
  );

-- Insert lab test prices
INSERT INTO lab_test_prices (lab_id, test_id, price, discounted_price, home_collection_available, home_collection_fee) 
SELECT 
  l.id as lab_id,
  t.id as test_id,
  CASE 
    WHEN t.name = 'Complete Blood Count' THEN 599
    WHEN t.name = 'Thyroid Profile' THEN 1200
    WHEN t.name = 'Diabetes Profile' THEN 899
    WHEN t.name = 'Lipid Profile' THEN 699
  END as price,
  CASE 
    WHEN t.name = 'Complete Blood Count' THEN 399
    WHEN t.name = 'Thyroid Profile' THEN 899
    WHEN t.name = 'Diabetes Profile' THEN 699
    WHEN t.name = 'Lipid Profile' THEN 499
  END as discounted_price,
  true as home_collection_available,
  100 as home_collection_fee
FROM labs l
CROSS JOIN tests t;