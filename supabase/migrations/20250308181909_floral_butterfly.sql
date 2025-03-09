/*
  # Add offers management

  1. New Tables
    - `offers`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `discount_percentage` (integer)
      - `start_date` (date)
      - `end_date` (date)
      - `active` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on offers table
    - Add policies for admin access
    - Add policies for public read access
*/

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  discount_percentage integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active offers
CREATE POLICY "Anyone can view active offers"
  ON offers
  FOR SELECT
  TO public
  USING (active = true AND current_date BETWEEN start_date AND end_date);

-- Allow admins full access
CREATE POLICY "Admins can manage offers"
  ON offers
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');