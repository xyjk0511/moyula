-- 【摸鱼站：多用户与信息补全增强脚本】
-- 执行此脚本以支持用户名、头像及新用户引导流程

-- 1. 安全升级 settings 表
DO $$ 
BEGIN 
    -- 如果表已存在但缺失列，一一添加
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='user_id') THEN
        CREATE TABLE IF NOT EXISTS settings (
            user_id UUID PRIMARY KEY REFERENCES auth.users NOT NULL,
            username TEXT,
            avatar_url TEXT,
            salary_per_hour NUMERIC NOT NULL DEFAULT 45.0,
            is_dark_mode BOOLEAN NOT NULL DEFAULT false,
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    ELSE
        -- 确保列存在
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='username') THEN
            ALTER TABLE settings ADD COLUMN username TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='avatar_url') THEN
            ALTER TABLE settings ADD COLUMN avatar_url TEXT;
        END IF;
    END IF;
END $$;

-- 2. 安全升级 records 表
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='records' AND column_name='user_id') THEN
        ALTER TABLE records ADD COLUMN user_id UUID REFERENCES auth.users;
    END IF;
END $$;

-- 3. 安全升级 badges 表
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='badges' AND column_name='user_id') THEN
        ALTER TABLE badges ADD COLUMN user_id UUID REFERENCES auth.users;
    END IF;
END $$;

-- 4. 清理无效数据并强制非空约束
DELETE FROM settings WHERE user_id IS NULL;
DELETE FROM records WHERE user_id IS NULL;
DELETE FROM badges WHERE user_id IS NULL;

-- 设置 user_id 为必填
ALTER TABLE settings ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE records ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE badges ALTER COLUMN user_id SET NOT NULL;

-- 5. 配置唯一约束
ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_pkey CASCADE;
ALTER TABLE settings ADD PRIMARY KEY (user_id);

ALTER TABLE badges DROP CONSTRAINT IF EXISTS badges_user_name_key;
ALTER TABLE badges ADD CONSTRAINT badges_user_name_key UNIQUE (user_id, name);

-- 6. 开启 RLS 与 策略
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own settings" ON settings;
CREATE POLICY "Users can only access their own settings" ON settings FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only access their own records" ON records;
CREATE POLICY "Users can only access their own records" ON records FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only access their own badges" ON badges;
CREATE POLICY "Users can only access their own badges" ON badges FOR ALL USING (auth.uid() = user_id);
