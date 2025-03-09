/*
  # Insert Sample Data

  1. Sample Data
    - Insert sample labs
    - Insert sample tests
    - Insert sample lab test prices
    - Insert sample offers
*/

-- Insert sample labs
INSERT INTO labs (name, description, address, city, rating, accredited) VALUES
('Pathkind Labs', 'Leading diagnostic center with state-of-the-art equipment', '123 Healthcare Street, Malviya Nagar', 'Jaipur', 4.2, true),
('Dr. Lal PathLabs', 'Trusted name in diagnostics for over 25 years', '456 Medical Avenue, Vaishali Nagar', 'Jaipur', 4.5, true),
('SRL Diagnostics', 'Quality diagnostic services with modern technology', '789 Health Road, Mansarovar', 'Jaipur', 4.3, true),
('Metropolis Healthcare', 'Comprehensive diagnostic solutions', '321 Wellness Lane, Civil Lines', 'Jaipur', 4.4, true);

-- Insert sample tests
INSERT INTO tests (name, description, category, parameters, preparation_instructions, report_time_hours) VALUES
('Complete Blood Count', 'Basic blood test that checks RBC, WBC, platelets, and hemoglobin levels', 'Blood Tests', 
  ARRAY['RBC Count', 'WBC Count', 'Hemoglobin', 'Platelets', 'Hematocrit'],
  'Fasting for 8-10 hours recommended', 24),
('Thyroid Profile', 'Comprehensive thyroid function test', 'Thyroid', 
  ARRAY['T3', 'T4', 'TSH'],
  'No special preparation required', 24),
('Lipid Profile', 'Cholesterol and triglycerides test', 'Heart', 
  ARRAY['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'],
  'Fasting for 12 hours required', 24),
('Vitamin D Test', 'Measures vitamin D levels in blood', 'Vitamin Tests', 
  ARRAY['25-hydroxy vitamin D'],
  'No special preparation required', 24),
('Diabetes Profile', 'Comprehensive diabetes screening', 'Diabetes', 
  ARRAY['Fasting Blood Sugar', 'Post Prandial Blood Sugar', 'HbA1c'],
  'Fasting for 8-10 hours required', 24);

-- Insert sample lab test prices
INSERT INTO lab_test_prices (lab_id, test_id, price, discounted_price, home_collection_available, home_collection_fee) 
SELECT 
  l.id,
  t.id,
  CASE 
    WHEN t.name = 'Complete Blood Count' THEN 399
    WHEN t.name = 'Thyroid Profile' THEN 599
    WHEN t.name = 'Lipid Profile' THEN 499
    WHEN t.name = 'Vitamin D Test' THEN 899
    ELSE 299
  END as price,
  CASE 
    WHEN t.name = 'Complete Blood Count' THEN 359
    WHEN t.name = 'Thyroid Profile' THEN 539
    WHEN t.name = 'Lipid Profile' THEN 449
    WHEN t.name = 'Vitamin D Test' THEN 809
    ELSE 269
  END as discounted_price,
  true,
  100
FROM labs l
CROSS JOIN tests t;

-- Insert sample offers
INSERT INTO offers (title, description, discount_percentage, start_date, end_date) VALUES
('Summer Health Check', 'Get 20% off on all health packages', 20, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days'),
('Senior Citizen Offer', 'Special 15% discount for senior citizens', 15, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days'),
('First Booking Discount', 'Get 10% off on your first test booking', 10, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days');

-- Create initial admin user
SELECT create_admin_user(
  'admin@medlabcompare.com',
  '9876543210',
  'Admin User'
);