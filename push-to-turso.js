const fs = require('fs');
const { createClient } = require('@libsql/client');

async function main() {
  const sql = fs.readFileSync('baseline.sql', 'utf16le');
  
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log("Connecting to Turso...");
  
  try {
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of statements) {
      console.log(`Executing: ${stmt.substring(0, 50)}...`);
      await client.execute(stmt);
    }
    console.log("Database schema pushed successfully!");
  } catch (error) {
    console.error("Error executing SQL:", error);
  }
}

main();
