-- Step 1: Add new enum values (these need to be committed separately)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'desenvolvedor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'redator';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'vendedor';