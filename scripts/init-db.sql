-- Create additional database for HAPI FHIR
CREATE DATABASE hapi_fhir;
CREATE USER hapi WITH PASSWORD 'hapi_password';
GRANT ALL PRIVILEGES ON DATABASE hapi_fhir TO hapi;

-- Create tables for LumeraKai
\c lumerakai_health;

CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    transcript TEXT NOT NULL,
    analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinical_alerts (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scheduling_optimizations (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    original_date DATE,
    optimized_date DATE,
    reason TEXT,
    applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
