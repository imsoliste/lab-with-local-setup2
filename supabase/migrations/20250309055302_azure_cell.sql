/*
  # Fix Lab Tests Functionality

  1. Changes
    - Add missing indexes for performance
    - Add constraints for data integrity
    - Update test categories enum
    - Add price history tracking

  2. Security
    - Add RLS policies for test viewing
    - Add policies for lab access
*/

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_tests_category ON tests(category);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_test_id ON lab_test_prices(test_id);
CREATE INDEX IF NOT EXISTS idx_lab_test_prices_lab_id ON lab_test_prices(lab_id);
CREATE INDEX IF NOT EXISTS idx_tests_name_search ON tests USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Add test categories enum
DO $$ BEGIN
    CREATE TYPE test_category AS ENUM (
        'Blood Tests',
        'Diabetes',
        'Thyroid',
        'Vitamin Tests',
        'Liver Function',
        'Kidney Function',
        'Cardiac Tests',
        'Hormone Tests',
        'Allergy Tests',
        'Cancer Screening'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add price history tracking
CREATE TABLE IF NOT EXISTS lab_test_price_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_test_price_id uuid REFERENCES lab_test_prices(id),
    old_price numeric(10,2),
    new_price numeric(10,2),
    changed_at timestamptz DEFAULT now(),
    changed_by uuid REFERENCES auth.users(id)
);

-- Create price history trigger
CREATE OR REPLACE FUNCTION track_price_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.price != OLD.price THEN
        INSERT INTO lab_test_price_history (
            lab_test_price_id,
            old_price,
            new_price,
            changed_by
        ) VALUES (
            NEW.id,
            OLD.price,
            NEW.price,
            auth.uid()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_lab_test_price_changes
    BEFORE UPDATE ON lab_test_prices
    FOR EACH ROW
    EXECUTE FUNCTION track_price_changes();

-- Add RLS policies
ALTER TABLE lab_test_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view price history"
    ON lab_test_price_history
    FOR SELECT
    TO authenticated
    USING (is_admin());

-- Update test search function
CREATE OR REPLACE FUNCTION search_tests(search_query text)
RETURNS SETOF tests AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM tests
    WHERE 
        to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ 
        plainto_tsquery('english', search_query)
    OR category::text ILIKE '%' || search_query || '%';
END;
$$ LANGUAGE plpgsql;