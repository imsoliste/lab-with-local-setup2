/*
  # Sample Data Migration

  1. Test Categories
    - Creates basic test categories like Blood Tests, Thyroid, etc.
  
  2. Tests
    - Creates sample tests with descriptions and parameters
  
  3. Labs
    - Creates sample diagnostic labs with ratings and locations
  
  4. Lab Test Prices
    - Sets up pricing for tests at different labs
    - Configures home collection options
*/

-- Insert test categories
INSERT INTO test_categories (id, name, description) VALUES
  ('cat_blood', 'Blood Tests', 'Complete blood examination and analysis'),
  ('cat_thyroid', 'Thyroid', 'Thyroid function and hormone tests'),
  ('cat_diabetes', 'Diabetes', 'Blood sugar and diabetes monitoring tests'),
  ('cat_vitamin', 'Vitamin Tests', 'Essential vitamin level tests'),
  ('cat_cardiac', 'Cardiac', 'Heart health and cholesterol tests');

-- Insert tests
INSERT INTO tests (id, name, description, category_id, parameters, preparation_instructions, report_time_hours) VALUES
  (
    'test_cbc',
    'Complete Blood Count (CBC)',
    'Measures different components and features of your blood including red cells, white cells, and platelets',
    'cat_blood',
    ARRAY['RBC', 'WBC', 'Hemoglobin', 'Platelets', 'Hematocrit'],
    '8-10 hours fasting required',
    24
  ),
  (
    'test_thyroid',
    'Thyroid Profile',
    'Comprehensive thyroid function test measuring T3, T4, and TSH levels',
    'cat_thyroid',
    ARRAY['T3', 'T4', 'TSH'],
    'No special preparation required',
    24
  ),
  (
    'test_diabetes',
    'Diabetes Profile',
    'Complete diabetes screening with FBS, PPBS, and HbA1c',
    'cat_diabetes',
    ARRAY['Fasting Blood Sugar', 'Post Prandial Blood Sugar', 'HbA1c'],
    '12 hours fasting required',
    24
  ),
  (
    'test_vitd',
    'Vitamin D Total',
    'Measures 25-hydroxy vitamin D levels',
    'cat_vitamin',
    ARRAY['25-OH Vitamin D'],
    'No special preparation required',
    48
  ),
  (
    'test_lipid',
    'Lipid Profile',
    'Measures cholesterol and triglycerides levels',
    'cat_cardiac',
    ARRAY['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides', 'VLDL'],
    '12 hours fasting required',
    24
  );

-- Insert labs
INSERT INTO labs (id, name, description, address, city, rating, accredited) VALUES
  (
    'lab_pathkind',
    'Pathkind Labs',
    'Leading diagnostic center with state-of-the-art facilities',
    'Plot 12, Sector 18',
    'Delhi',
    4.5,
    true
  ),
  (
    'lab_lal',
    'Dr. Lal PathLabs',
    'Trusted name in diagnostics with nationwide presence',
    '45 MG Road',
    'Bangalore',
    4.7,
    true
  ),
  (
    'lab_metropolis',
    'Metropolis Healthcare',
    'Advanced diagnostic solutions with global standards',
    'Civil Lines',
    'Mumbai',
    4.6,
    true
  );

-- Insert lab test prices
INSERT INTO lab_test_prices (lab_id, test_id, price, discounted_price, home_collection_available, home_collection_fee) VALUES
  -- CBC Test Prices
  ('lab_pathkind', 'test_cbc', 600, 499, true, 100),
  ('lab_lal', 'test_cbc', 650, 549, true, 50),
  ('lab_metropolis', 'test_cbc', 700, 599, true, 0),

  -- Thyroid Test Prices
  ('lab_pathkind', 'test_thyroid', 1200, 999, true, 100),
  ('lab_lal', 'test_thyroid', 1300, 1099, true, 50),
  ('lab_metropolis', 'test_thyroid', 1400, 1199, true, 0),

  -- Diabetes Test Prices
  ('lab_pathkind', 'test_diabetes', 800, 699, true, 100),
  ('lab_lal', 'test_diabetes', 900, 799, true, 50),
  ('lab_metropolis', 'test_diabetes', 1000, 899, true, 0),

  -- Vitamin D Test Prices
  ('lab_pathkind', 'test_vitd', 1800, 1499, true, 100),
  ('lab_lal', 'test_vitd', 1900, 1599, true, 50),
  ('lab_metropolis', 'test_vitd', 2000, 1699, true, 0),

  -- Lipid Profile Prices
  ('lab_pathkind', 'test_lipid', 700, 599, true, 100),
  ('lab_lal', 'test_lipid', 800, 699, true, 50),
  ('lab_metropolis', 'test_lipid', 900, 799, true, 0);

-- Create admin user
INSERT INTO users (id, phone, email, name, role) VALUES
  ('admin_user', '+919876543210', 'admin@medlab.com', 'Admin User', 'admin');