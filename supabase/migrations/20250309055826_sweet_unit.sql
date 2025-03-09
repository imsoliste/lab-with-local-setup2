/*
  # Lab Tests Database Schema

  1. Tables
    - labs: Lab information and details
    - tests: Test catalog and specifications
    - lab_test_prices: Pricing for tests at different labs
    - test_categories: Standardized test categories

  2. Security
    - RLS policies for data access
    - Admin-only write access
    - Public read access for tests and labs
*/

-- Create test categories table
CREATE TABLE IF NOT EXISTS test_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Create labs table
CREATE TABLE IF NOT EXISTS labs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    rating numeric(3,2) CHECK (rating >= 0 AND rating <= 5),
    accredited boolean DEFAULT false,
    home_collection_available boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create tests table
CREATE TABLE IF NOT EXISTS tests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category_id uuid REFERENCES test_categories(id),
    parameters jsonb NOT NULL DEFAULT '[]',
    preparation_instructions text,
    report_time_hours integer NOT NULL DEFAULT 24,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create lab test prices table
CREATE TABLE IF NOT EXISTS lab_test_prices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
    test_id uuid REFERENCES tests(id) ON DELETE CASCADE,
    price numeric(10,2) NOT NULL CHECK (price >= 0),
    discounted_price numeric(10,2) CHECK (discounted_price >= 0),
    home_collection_fee numeric(10,2) DEFAULT 0 CHECK (home_collection_fee >= 0),
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(lab_id, test_id)
);

-- Create price history table
CREATE TABLE IF NOT EXISTS lab_test_price_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_test_price_id uuid REFERENCES lab_test_prices(id) ON DELETE CASCADE,
    old_price numeric(10,2),
    new_price numeric(10,2),
    changed_at timestamptz DEFAULT now(),
    changed_by uuid REFERENCES auth.users(id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_labs_city ON labs(city);
CREATE INDEX IF NOT EXISTS idx_tests_category ON tests(category_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_lab ON lab_test_prices(lab_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_test ON lab_test_prices(test_id);
CREATE INDEX IF NOT EXISTS idx_tests_search ON tests USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Enable RLS
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_price_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to labs"
    ON labs FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow admin write access to labs"
    ON labs FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow public read access to tests"
    ON tests FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow admin write access to tests"
    ON tests FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow public read access to lab test prices"
    ON lab_test_prices FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow admin write access to lab test prices"
    ON lab_test_prices FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create functions
CREATE OR REPLACE FUNCTION search_tests(search_query text)
RETURNS TABLE (
    id uuid,
    name text,
    description text,
    category_name text,
    parameters jsonb,
    preparation_instructions text,
    report_time_hours integer,
    min_price numeric,
    max_price numeric,
    lab_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.description,
        tc.name as category_name,
        t.parameters,
        t.preparation_instructions,
        t.report_time_hours,
        MIN(ltp.discounted_price) as min_price,
        MAX(ltp.price) as max_price,
        COUNT(DISTINCT ltp.lab_id) as lab_count
    FROM tests t
    LEFT JOIN test_categories tc ON t.category_id = tc.id
    LEFT JOIN lab_test_prices ltp ON t.id = ltp.test_id
    WHERE 
        to_tsvector('english', t.name || ' ' || COALESCE(t.description, '')) @@ 
        plainto_tsquery('english', search_query)
    GROUP BY t.id, t.name, t.description, tc.name, t.parameters, t.preparation_instructions, t.report_time_hours;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_labs_updated_at
    BEFORE UPDATE ON labs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tests_updated_at
    BEFORE UPDATE ON tests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_test_prices_updated_at
    BEFORE UPDATE ON lab_test_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO test_categories (name, description) VALUES
    ('Blood Tests', 'Complete blood count and related tests'),
    ('Diabetes', 'Blood sugar and diabetes monitoring tests'),
    ('Thyroid', 'Thyroid function and hormone tests'),
    ('Vitamin Tests', 'Various vitamin level tests'),
    ('Liver Function', 'Liver health and function tests'),
    ('Kidney Function', 'Kidney health and function tests'),
    ('Cardiac Tests', 'Heart health and function tests'),
    ('Hormone Tests', 'Various hormone level tests'),
    ('Allergy Tests', 'Allergy and sensitivity tests'),
    ('Cancer Screening', 'Various cancer marker tests')
ON CONFLICT (name) DO NOTHING;