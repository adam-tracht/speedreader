-- Migration: Usage Tracking & Paywall
-- Description: Track word usage per user per month and manage subscription tiers

-- User Usage Table
-- Tracks words read per user per month for paywall enforcement
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- First day of the month (e.g., '2026-02-01')
  words_read INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- User Tiers Table
-- Manages subscription tier and Stripe customer info
CREATE TABLE IF NOT EXISTS user_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_month ON user_usage(month);
CREATE INDEX IF NOT EXISTS idx_user_tiers_user_id ON user_tiers(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_user_usage_updated_at
  BEFORE UPDATE ON user_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tiers_updated_at
  BEFORE UPDATE ON user_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_usage
CREATE POLICY "Users can view their own usage"
  ON user_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON user_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON user_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_tiers
CREATE POLICY "Users can view their own tier"
  ON user_tiers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tier"
  ON user_tiers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tier"
  ON user_tiers FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to get or create monthly usage record
CREATE OR REPLACE FUNCTION get_or_create_monthly_usage(p_user_id UUID, p_month DATE)
RETURNS UUID AS $$
DECLARE
  v_usage_id UUID;
BEGIN
  -- Try to get existing record
  SELECT id INTO v_usage_id
  FROM user_usage
  WHERE user_id = p_user_id AND month = p_month;

  -- If not found, create new record
  IF v_usage_id IS NULL THEN
    INSERT INTO user_usage (user_id, month, words_read)
    VALUES (p_user_id, p_month, 0)
    RETURNING id INTO v_usage_id;
  END IF;

  RETURN v_usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment words read (upsert operation)
CREATE OR REPLACE FUNCTION increment_words_read(p_user_id UUID, p_word_count INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_usage (user_id, month, words_read)
  VALUES (p_user_id, DATE_TRUNC('month', CURRENT_DATE), p_word_count)
  ON CONFLICT (user_id, month)
  DO UPDATE SET
    words_read = user_usage.words_read + EXCLUDED.words_read,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_or_create_monthly_usage TO authenticated;
GRANT EXECUTE ON FUNCTION increment_words_read TO authenticated;
