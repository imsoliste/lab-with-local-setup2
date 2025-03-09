/*
  # Add Admin Features

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
    - Add policies for admin access
    - Add policies for public read access

  3. Changes
    - Add `admin` role to users table
    - Add storage bucket for offer images
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

-- Policies for offers
CREATE POLICY "Admins can manage offers"
  ON offers
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can view active offers"
  ON offers
  FOR SELECT
  TO public
  USING (active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

-- Create storage bucket for offer images
INSERT INTO storage.buckets (id, name)
VALUES ('offers', 'offers')
ON CONFLICT DO NOTHING;

-- Storage policies for offers bucket
CREATE POLICY "Admins can manage offer images"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'offers' AND auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (bucket_id = 'offers' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can view offer images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'offers');

-- Add admin role to users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role text DEFAULT 'user';
  END IF;
END $$;