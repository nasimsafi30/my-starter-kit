const p = require("postgres");
const b = require("bcryptjs");
const DB = "postgresql://neondb_owner:npg_GE3h9fKgBTPs@ep-nameless-field-av9f5jd5-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
    const sql = p(DB, { ssl: "require" });
    
    try {
        console.log("Connected to Neon!");
        
        const tables = await sql` + "`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`" + `;
        console.log("Tables:", tables.map(t => t.tablename).join(", ") || "NONE");
        
        let users = await sql` + "`SELECT email, role FROM users`" + `;
        console.log("Users found:", users.length);
        
        await sql` + "`DELETE FROM users WHERE email = 'admin@example.com'`" + `;
        
        const hash = await b.hash("admin123!", 12);
        await sql` + "`INSERT INTO users (name, email, \"passwordHash\", role, \"isActive\", \"emailVerified\") VALUES ('Admin', 'admin@example.com', ${hash}, 'admin', true, NOW())`" + `;
        
        users = await sql` + "`SELECT email, role FROM users`" + `;
        console.log("Users after:", users.length);
        users.forEach(u => console.log(" - " + u.email + " (" + u.role + ")"));
        
        const test = await b.compare("admin123!", hash);
        console.log("Password works:", test);
        console.log("");
        console.log("READY! Login: admin@example.com / admin123!");
        
    } catch (err) {
        console.error("ERROR:", err.message);
    } finally {
        await sql.end();
    }
}

main();