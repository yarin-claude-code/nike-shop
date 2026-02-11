-- Migration 002: Remove model_3d_url column
-- Reason: Project uses standard product images, not 3D models (per CLAUDE.md)
-- The column was never populated and is not needed.

ALTER TABLE products DROP COLUMN IF EXISTS model_3d_url;

-- Drop the old comment referencing 3D models
COMMENT ON TABLE products IS 'Shoe products';
