/*
  # Seed Data for Initial Setup

  1. Test Categories
  2. Tests
  3. Labs
  4. Lab Test Prices
  5. Sample Offers
*/

-- Insert test categories
INSERT INTO test_categories (name, description) VALUES
  ('Blood Tests', 'Comprehensive blood analysis'),
  ('Diabetes', 'Tests related to diabetes monitoring'),
  ('Thyroid', 'Thyroid function tests'),
  ('Vitamin Tests', 'Various vitamin level tests'),
  ('Liver Function', 'Tests for liver health assessment'),
  ('Kidney Function', 'Tests for kidney health assessment'),
  ('Heart', 'Cardiac health tests'),
  ('Hormone Tests', 'Various hormone level tests'),
  ('Allergy Tests', 'Tests for allergies'),
  ('Cancer Screening', 'Cancer marker tests');

-- Insert labs
INSERT INTO labs (name, description, address, city, rating, accredited, home_collection_available) VALUES
  ('Pathkind Labs', 'NABL Accredited Lab', 'Malviya Nagar', 'Jaipur', 4.2, true, true),
  ('Dr. Lal PathLabs', 'Leading Diagnostic Chain', 'Vaishali Nagar', 'Jaipur', 4.5, true, true),
  ('SRL Diagnostics', 'Multi-specialty Lab', 'Mansarovar', 'Jaipur', 4.3, true, true),
  ('Thyrocare', 'Specialized Testing', 'Jawahar Circle', 'Jaipur', 4.4, true, true),
  ('Metropolis', 'Advanced Diagnostics', 'Civil Lines', 'Jaipur', 4.3, true, true);

-- Insert tests (sample for blood tests category)
WITH blood_category AS (SELECT id FROM test_categories WHERE name = 'Blood Tests' LIMIT 1)
INSERT INTO tests (name, description, category_id, parameters, preparation_instructions, report_time_hours) VALUES
  (
    'Complete Blood Count (CBC)',
    'Comprehensive blood test that checks for RBC, WBC, platelets, and hemoglobin levels',
    (SELECT id FROM blood_category),
    '["RBC Count", "WBC Count", "Hemoglobin", "Platelets", "Hematocrit"]',
    'Fasting for 8-10 hours recommended',
    24
  );

-- Insert lab test prices (for CBC test)
WITH cbc_test AS (SELECT id FROM tests WHERE name = 'Complete Blood Count (CBC)' LIMIT 1)
INSERT INTO lab_test_prices (lab_id, test_id, price, discounted_price, home_collection_fee) 
SELECT 
  l.id,
  (SELECT id FROM cbc_test),
  599,
  399,
  100
FROM labs l
WHERE l.name = 'Pathkind Labs';

-- Insert sample offers
INSERT INTO offers (title, description, discount_percentage, start_date, end_date, active) VALUES
  ('Summer Health Package', 'Complete health checkup at special price', 20, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true),
  ('Senior Citizen Discount', 'Special discount for senior citizens', 15, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', true);