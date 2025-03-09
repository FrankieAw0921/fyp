/*
  # Fix Profiles Table RLS Policy

  1. Changes
    - Add INSERT policy for profiles table to allow users to create their own profile during signup

  2. Security
    - Users can only insert their own profile (matching their auth.uid)
*/

-- Add INSERT policy for profiles
