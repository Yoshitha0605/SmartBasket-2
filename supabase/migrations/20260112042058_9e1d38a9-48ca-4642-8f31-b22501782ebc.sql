-- Fix 1: Drop the UPDATE policy on orders to make them immutable
-- Orders should not be modified after placement for security
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Fix 2: Add input validation constraints on profiles table
-- Add CHECK constraints for phone format, name length and format
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS phone_format,
  DROP CONSTRAINT IF EXISTS name_length,
  DROP CONSTRAINT IF EXISTS name_format;

-- Add phone format validation (10-15 digits with optional + - spaces)
ALTER TABLE public.profiles
  ADD CONSTRAINT phone_format 
  CHECK (phone IS NULL OR phone ~ '^[0-9+\-\s]{10,15}$');

-- Add name length validation (2-50 characters)
ALTER TABLE public.profiles
  ADD CONSTRAINT name_length 
  CHECK (name IS NULL OR (char_length(name) >= 2 AND char_length(name) <= 50));

-- Add name format validation (letters and spaces only)
ALTER TABLE public.profiles
  ADD CONSTRAINT name_format 
  CHECK (name IS NULL OR name ~ '^[a-zA-Z\s]+$');