/*
  # Fix Test Table Policies

  1. Changes
    - Drop existing public read policy
    - Create new policies for test table access

  2. Security
    - Enable RLS on tests table if not already enabled
    - Add policy for public read access with a unique name
    - Add policy for authenticated users to read all tests
*/

-- First, enable RLS if not already enabled
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access" ON tests;

-- Create new policies with unique names
CREATE POLICY "Anyone can view tests" 
  ON tests
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Authenticated users can view all tests" 
  ON tests
  FOR SELECT 
  TO authenticated
  USING (true);