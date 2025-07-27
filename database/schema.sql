-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(200) NOT NULL,
  preview_image_url TEXT,
  folder_path VARCHAR(200) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create couples table
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  groom_name VARCHAR(200) NOT NULL,
  bride_name VARCHAR(200) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  event_location VARCHAR(300) NOT NULL,
  event_address TEXT NOT NULL,
  template_id UUID REFERENCES templates(id),
  slug VARCHAR(300) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  payment_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guests table
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(300) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(couple_id, slug)
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL DEFAULT 50000,
  proof_image_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_couples_slug ON couples(slug);
CREATE INDEX idx_guests_couple_id ON guests(couple_id);
CREATE INDEX idx_guests_slug ON guests(couple_id, slug);
CREATE INDEX idx_payments_couple_id ON payments(couple_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Insert default templates
INSERT INTO templates (name, display_name, folder_path) VALUES
('elegant', 'Elegant Classic', '/templates/elegant'),
('modern', 'Modern Minimalist', '/templates/modern'),
('floral', 'Floral Garden', '/templates/floral');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for couples table
CREATE TRIGGER update_couples_updated_at BEFORE UPDATE ON couples
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

