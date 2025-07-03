-- Painter CRM Database Schema
-- For tracking painting contractor outreach and beta testing

-- Main painters table
CREATE TABLE IF NOT EXISTS painters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Business Information
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    website TEXT,
    -- Location
    city TEXT,
    state TEXT,
    zip_code TEXT,
    -- Business Details
    company_size TEXT CHECK(company_size IN ('solo', '2-5', '6-10', '11-20', '20+')),
    years_in_business INTEGER,
    specialty TEXT, -- residential, commercial, both
    current_quote_method TEXT,
    -- Status
    status TEXT DEFAULT 'lead' CHECK(status IN ('lead', 'contacted', 'interested', 'beta_testing', 'customer', 'not_interested', 'competitor')),
    source TEXT, -- facebook, paint_store, referral, etc.
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Outreach tracking
CREATE TABLE IF NOT EXISTS outreach (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    painter_id INTEGER NOT NULL,
    outreach_date DATE NOT NULL,
    method TEXT CHECK(method IN ('email', 'phone', 'in_person', 'facebook', 'linkedin', 'demo')),
    type TEXT CHECK(type IN ('initial', 'follow_up', 'demo', 'onboarding', 'check_in')),
    outcome TEXT CHECK(outcome IN ('no_response', 'interested', 'not_interested', 'scheduled_demo', 'started_trial', 'requested_info')),
    notes TEXT,
    next_action TEXT,
    next_action_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (painter_id) REFERENCES painters(id)
);

-- Beta testing feedback
CREATE TABLE IF NOT EXISTS beta_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    painter_id INTEGER NOT NULL,
    feedback_date DATE DEFAULT CURRENT_DATE,
    feedback_type TEXT CHECK(feedback_type IN ('bug', 'feature_request', 'general', 'praise', 'complaint')),
    category TEXT, -- UI, performance, features, etc.
    description TEXT NOT NULL,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'wont_fix')),
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (painter_id) REFERENCES painters(id)
);

-- Status history tracking
CREATE TABLE IF NOT EXISTS status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    painter_id INTEGER NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    FOREIGN KEY (painter_id) REFERENCES painters(id)
);

-- Usage metrics for beta testers
CREATE TABLE IF NOT EXISTS usage_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    painter_id INTEGER NOT NULL,
    metric_date DATE DEFAULT CURRENT_DATE,
    quotes_created INTEGER DEFAULT 0,
    avg_quote_time_minutes INTEGER,
    features_used TEXT, -- JSON array of features
    last_login DATE,
    total_revenue_quoted DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (painter_id) REFERENCES painters(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_painters_status ON painters(status);
CREATE INDEX IF NOT EXISTS idx_painters_city_state ON painters(city, state);
CREATE INDEX IF NOT EXISTS idx_outreach_painter ON outreach(painter_id);
CREATE INDEX IF NOT EXISTS idx_outreach_next_action ON outreach(next_action_date);
CREATE INDEX IF NOT EXISTS idx_feedback_painter ON beta_feedback(painter_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON beta_feedback(status);

-- Create triggers to update the updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_painters_timestamp 
AFTER UPDATE ON painters
BEGIN
    UPDATE painters SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create useful views
CREATE VIEW IF NOT EXISTS active_beta_testers AS
SELECT 
    p.*,
    COUNT(DISTINCT bf.id) as feedback_count,
    COUNT(DISTINCT o.id) as outreach_count
FROM painters p
LEFT JOIN beta_feedback bf ON p.id = bf.painter_id
LEFT JOIN outreach o ON p.id = o.painter_id
WHERE p.status = 'beta_testing'
GROUP BY p.id;

CREATE VIEW IF NOT EXISTS follow_up_needed AS
SELECT 
    p.*,
    o.next_action,
    o.next_action_date,
    o.notes as last_notes
FROM painters p
JOIN outreach o ON p.id = o.painter_id
WHERE o.next_action_date <= date('now', '+7 days')
AND o.id = (SELECT MAX(id) FROM outreach WHERE painter_id = p.id)
ORDER BY o.next_action_date;