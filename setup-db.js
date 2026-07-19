const p = require('postgres');
const b = require('bcryptjs');

const DB_URL = 'postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function setup() {
    const sql = p(DB_URL, { 
        ssl: 'require',
        connect_timeout: 30 
    });
    
    try {
        console.log('1. Connecting to Neon...');
        
        // Test connection
        const test = await sqlSELECT NOW() as current_time;
        console.log('   Connected! Server time:', test[0].current_time);
        
        console.log('2. Creating tables...');
        
        // Create users table
        await sql
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT,
                email TEXT NOT NULL UNIQUE,
                "emailVerified" TIMESTAMPTZ,
                image TEXT,
                "passwordHash" TEXT,
                role TEXT DEFAULT 'user' NOT NULL,
                "isActive" BOOLEAN DEFAULT true NOT NULL,
                "twoFactorEnabled" BOOLEAN DEFAULT false NOT NULL,
                "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
                "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
            )
        ;
        console.log('   users table ready');
        
        // Create accounts table
        await sql
            CREATE TABLE IF NOT EXISTS accounts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                type TEXT NOT NULL,
                provider TEXT NOT NULL,
                "providerAccountId" TEXT NOT NULL,
                refresh_token TEXT,
                access_token TEXT,
                expires_at TIMESTAMPTZ,
                token_type TEXT,
                scope TEXT,
                id_token TEXT,
                session_state TEXT
            )
        ;
        console.log('   accounts table ready');
        
        // Create sessions table
        await sql
            CREATE TABLE IF NOT EXISTS sessions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "sessionToken" TEXT NOT NULL UNIQUE,
                "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                expires TIMESTAMPTZ NOT NULL
            )
        ;
        console.log('   sessions table ready');
        
        // Create verificationTokens table
        await sql
            CREATE TABLE IF NOT EXISTS "verificationTokens" (
                identifier TEXT NOT NULL,
                token TEXT NOT NULL UNIQUE,
                expires TIMESTAMPTZ NOT NULL
            )
        ;
        console.log('   verificationTokens table ready');
        
        // Create passwordResetTokens table
        await sql
            CREATE TABLE IF NOT EXISTS "passwordResetTokens" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                identifier TEXT NOT NULL,
                token TEXT NOT NULL UNIQUE,
                expires TIMESTAMPTZ NOT NULL
            )
        ;
        console.log('   passwordResetTokens table ready');
        
        // Create auditLogs table
        await sql
            CREATE TABLE IF NOT EXISTS "auditLogs" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "userId" UUID REFERENCES users(id) ON DELETE SET NULL,
                action TEXT NOT NULL,
                entity TEXT NOT NULL,
                "entityId" TEXT,
                details JSONB,
                "ipAddress" TEXT,
                "userAgent" TEXT,
                "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
            )
        ;
        console.log('   auditLogs table ready');
        
        // Create uploads table
        await sql
            CREATE TABLE IF NOT EXISTS uploads (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                url TEXT NOT NULL,
                key TEXT NOT NULL,
                name TEXT NOT NULL,
                size INTEGER NOT NULL,
                type TEXT NOT NULL,
                "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
            )
        ;
        console.log('   uploads table ready');
        
        console.log('3. Creating admin user...');
        
        // Delete old admin if exists
        await sqlDELETE FROM users WHERE email = 'admin@example.com';
        
        // Create new admin
        const hash = await b.hash('admin123!', 12);
        await sql
            INSERT INTO users (name, email, "passwordHash", role, "isActive", "emailVerified")
            VALUES ('Admin User', 'admin@example.com', {hash}, 'admin', true, NOW())
        ;
        
        console.log('   Admin user created!');
        
        // Create test user
        const userHash = await b.hash('user1234!', 12);
        await sql
            INSERT INTO users (name, email, "passwordHash", role, "isActive")
            VALUES ('Test User', 'user@example.com', {userHash}, 'user', true)
        ;
        console.log('   Test user created!');
        
        console.log('');
        console.log('========================================');
        console.log('  SETUP COMPLETE!');
        console.log('========================================');
        console.log('');
        console.log('Tables created:');
        console.log('  - users');
        console.log('  - accounts');
        console.log('  - sessions');
        console.log('  - verificationTokens');
        console.log('  - passwordResetTokens');
        console.log('  - auditLogs');
        console.log('  - uploads');
        console.log('');
        console.log('Login credentials:');
        console.log('  Admin: admin@example.com / admin123!');
        console.log('  User:  user@example.com / user1234!');
        console.log('');
        
    } catch (err) {
        console.error('ERROR:', err.message);
        console.error('Details:', err);
    } finally {
        await sql.end();
        process.exit(0);
    }
}

setup();