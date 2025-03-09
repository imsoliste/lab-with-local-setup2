/*
  # Insert Sample Data

  1. Sample Data
    - Insert sample labs
    - Insert sample tests
    - Insert sample lab test prices
    - Insert sample offers
*/

-- Sample labs
INSERT INTO labs (name, description, address, city, rating, accredited) VALUES
('Dr. Lal PathLabs', 'Leading diagnostic chain in India', '123 Main Street', 'Delhi', 4.5, true),
('SRL Diagnostics', 'Comprehensive diagnostic services', '456 Park Road', 'Mumbai', 4.3, true),
('Thyrocare', 'Specialized thyroid testing', '789 Lake View', 'Bangalore', 4.4, true);

-- Sample tests
INSERT INTO tests (name, description, category, parameters, preparation_instructions, report_time_hours) VALUES
('Complete Blood Count', 'Basic blood test for overall health', 'Blood Tests', 
  ARRAY['RBC', 'WBC', 'Hemoglobin', 'Platelets'],
  'Fasting for 8-10 hours required', 24),
('Thyroid Profile', 'Comprehensive thyroid function test', 'Thyroid',
  ARRAY['T3', 'T4', 'TSH'],
  'No special preparation needed', 24),
('Lipid Profile', 'Cholesterol and triglycerides test', 'Heart',
  ARRAY['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'],
  'Fasting for 12 hours required', 24);

-- Sample lab test prices
INSERT INTO lab_test_prices (lab_id, test_id, price, discounted_price, home_collection_available, home_collection_fee)
SELECT 
  l.id,
  t.id,
  599,
  499,
  true,
  100
FROM labs l
CROSS JOIN tests t;

-- Sample offers
INSERT INTO offers (title, description, discount_percentage, start_date, end_date, active) VALUES
('Summer Health Check', 'Get 20% off on all health packages', 20, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true),
('Senior Citizen Offer', 'Special 15% discount for senior citizens', 15, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', true);