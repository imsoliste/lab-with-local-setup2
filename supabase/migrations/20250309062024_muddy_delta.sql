/*
  # Security Policies

  1. RLS Policies
    - Public read access for test categories, tests, labs, and offers
    - User-specific access for bookings, payments, and test results
    - Admin access for all operations
*/

-- Test Categories
CREATE POLICY "Test categories are viewable by all"
  ON test_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify test categories"
  ON test_categories
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Tests
CREATE POLICY "Tests are viewable by all"
  ON tests
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify tests"
  ON tests
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Labs
CREATE POLICY "Labs are viewable by all"
  ON labs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify labs"
  ON labs
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Lab Test Prices
CREATE POLICY "Lab test prices are viewable by all"
  ON lab_test_prices
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify lab test prices"
  ON lab_test_prices
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Bookings
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Payments
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Test Results
CREATE POLICY "Users can read own test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Only admins can modify test results"
  ON test_results
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Offers
CREATE POLICY "Offers are viewable by all"
  ON offers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify offers"
  ON offers
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());