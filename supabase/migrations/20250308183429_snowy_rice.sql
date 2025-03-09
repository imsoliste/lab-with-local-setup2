/*
  # Add offers table and admin authentication

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
    - Enable RLS on `offers` table
    - Add policies for public read access
    - Add policies for admin write access
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
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Public can read active offers
CREATE POLICY "Anyone can view active offers"
  ON offers
  FOR SELECT
  TO public
  USING (active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

-- Admins can manage offers
CREATE POLICY "Admins can manage offers"
  ON offers
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create storage bucket for offer images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('offers', 'offers', true)
ON CONFLICT DO NOTHING;