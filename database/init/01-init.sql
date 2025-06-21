-- Initialize COREVQC Database

-- Create default organization
INSERT INTO organizations (id, name, slug, address, email, settings) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'COREVQC Demo',
    'corevqc-demo',
    '123 Construction Ave, Builder City, BC 12345',
    'admin@corevqc-demo.com',
    '{"features": ["quality_control", "inspections", "ncr_management"], "limits": {"projects": 100, "users": 50}}'
);

-- Create default admin user
INSERT INTO users (id, organization_id, email, password, first_name, last_name, role, email_verified) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin@corevqc.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewwZgAE3xqQ9jOxW', -- password: admin123
    'System',
    'Administrator',
    'admin',
    true
);

-- Create sample project
INSERT INTO projects (id, organization_id, name, description, project_number, status, start_date, end_date, client_name, project_manager_id, created_by) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Downtown Office Complex',
    'Construction of a 25-story office complex in downtown area',
    'PRJ-2024-001',
    'active',
    '2024-01-15',
    '2024-12-31',
    'Downtown Development Corp',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001'
);

-- Add admin to project
INSERT INTO project_members (project_id, user_id, role) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'manager'
);

-- Create sample quality checkpoints
INSERT INTO quality_checkpoints (project_id, name, description, category, criteria, pass_threshold, is_mandatory, order_index, created_by) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'Foundation Inspection',
    'Inspection of foundation concrete and reinforcement',
    'structural',
    '[{"item": "Concrete strength test", "required": true}, {"item": "Reinforcement placement", "required": true}, {"item": "Surface finish", "required": false}]',
    90,
    true,
    1,
    '00000000-0000-0000-0000-000000000001'
),
(
    '00000000-0000-0000-0000-000000000001',
    'Electrical Rough-in',
    'Inspection of electrical rough-in work',
    'electrical',
    '[{"item": "Conduit installation", "required": true}, {"item": "Wire pulling", "required": true}, {"item": "Box installation", "required": true}]',
    85,
    true,
    2,
    '00000000-0000-0000-0000-000000000001'
);
