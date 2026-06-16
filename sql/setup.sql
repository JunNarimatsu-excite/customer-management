-- Processed customers table
CREATE TABLE IF NOT EXISTS processed_customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status_code VARCHAR(20) NOT NULL,
  status_name VARCHAR(100) NOT NULL
);

-- Status lookup table
CREATE TABLE IF NOT EXISTS customer_status_name (
  status_code VARCHAR(20) PRIMARY KEY,
  status_name VARCHAR(100) NOT NULL
);

INSERT INTO customer_status_name (status_code, status_name) VALUES
  ('ST01', '新規'),
  ('ST02', 'アクティブ'),
  ('ST03', '非アクティブ'),
  ('ST04', '退会')
ON CONFLICT (status_code) DO NOTHING;
