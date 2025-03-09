/*
  # Insert Initial Data

  1. Sample Data
    - Insert sample labs
    - Insert sample tests
    - Insert sample lab test prices
*/

-- Insert sample labs
INSERT INTO labs (name, address, city, rating, accredited) VALUES
  ('Pathkind Labs', '123 Healthcare Street, Malviya Nagar', 'Jaipur', 4.2, true),
  ('Dr. Lal PathLabs', '456 Medical Avenue, Vaishali Nagar', 'Jaipur', 4.5, true),
  ('SRL Diagnostics', '789 Health Plaza, Mansarovar', 'Jaipur', 4.3, true),
  ('Metropolis', '321 Wellness Road, Civil Lines', 'Jaipur', 4.4, true);

-- Insert sample tests
INSERT INTO tests (name, description, category, parameters, preparation_instructions, report_time_hours) VALUES
  (
    'Complete Blood Count (CBC)',
    'Measures red blood cells, white blood cells, platelets, and hemoglobin',
    'Blood Tests',
    ARRAY['RBC Count', 'WBC Count', 'Hemoglobin', 'Platelets', 'Hematocrit'],
    'Fasting for 8-10 hours recommended',
    24
  ),
  (
    'Thyroid Profile',
    'Measures thyroid hormones (T3, T4) and thyroid-stimulating hormone (TSH)',
    'Thyroid',
    ARRAY['T3', 'T4', 'TSH'],
    'No special preparation required',
    24
  ),
  (
    'Lipid Profile',
    'Measures cholesterol, triglycerides, HDL, and LDL',
    'Heart',
    ARRAY['Total Cholesterol', 'Triglycerides', 'HDL', 'LDL'],
    'Fasting for 12 hours required',
    24
  ),
  (
    'Vitamin D Test',
    'Measures the level of vitamin D in your blood',
    'Vitamin Tests',
    ARRAY['Vitamin D (25-OH)'],
    'No special preparation required',
    36
  );

-- Insert sample lab test prices
INSERT INTO lab_test_prices (lab_id, test_id, price, discounted_price, home_collection_available, home_collection_fee)
SELECT 
  l.id as lab_id,
  t.id as test_id,
  CASE t.name
    WHEN 'Complete Blood Count (CBC)' THEN 399
    WHEN 'Thyroid Profile' THEN 599
    WHEN 'Lipid Profile' THEN 499
    WHEN 'Vitamin D Test' THEN 899
  END as price,
  CASE t.name
    WHEN 'Complete Blood Count (CBC)' THEN 359
    WHEN 'Thyroid Profile' THEN 539
    WHEN 'Lipid Profile' THEN 449
    WHEN 'Vitamin D Test' THEN 809
  END as discounted_price,
  true as home_collection_available,
  100 as home_collection_fee
FROM labs l
CROSS JOIN tests t;