-- Priority Home Monitor (PHM) Database Schema
-- Revision 4 | April 2026
-- PostgreSQL 16

-- Create ENUM types for lead classification
CREATE TYPE lead_type AS ENUM ('referral', 'consultation', 'contact');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'enrolled', 'closed');

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type lead_type NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    provider_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    condition_interest VARCHAR(255),
    message TEXT,
    source_page VARCHAR(255),
    status lead_status NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance optimization
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_type ON leads(type);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);

-- Add comments for documentation
COMMENT ON TABLE leads IS 'Stores all patient and provider leads from the PHM website';
COMMENT ON COLUMN leads.type IS 'Type of lead: referral, consultation, or contact form';
COMMENT ON COLUMN leads.status IS 'Current status of the lead in the enrollment pipeline';
COMMENT ON COLUMN leads.source_page IS 'URL or page identifier where the lead originated';
