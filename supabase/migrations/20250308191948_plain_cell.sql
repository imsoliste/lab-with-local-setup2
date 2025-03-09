/*
  # Add offers management system
  
  1. New Tables
    - `offers` table for managing special offers and discounts
      - `id` (uuid, primary key)
      - `title` (text) - Offer title
      - `description` (text) - Offer description
      - `image_url` (text) - URL for offer image
      - `discount_percentage` (integer) - Discount percentage
      - `start_date` (date) - Offer start date
      - `end_date` (date) - Offer end date
      - `active` (boolean) - Whether offer is currently active
      - `created_at` (timestamptz) - Creation timestamp
      
  2. Security
    - Enable RLS on offers table
    - Add policies for:
      - Public read access for active offers
      - Admin write access
*/

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  discount_percentage integer NOT NULL DEFAULT 0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view active offers" ON offers
  FOR SELECT
  TO public
  USING (
    active = true AND
    start_date <= CURRENT_DATE AND
    end_date >= CURRENT_DATE
  );

CREATE POLICY "Admins can manage offers" ON offers
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');