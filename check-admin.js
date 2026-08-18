const { createClient } = require('@libsql/client');

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const res = await client.execute("SELECT email, passwordHash FROM AdminUser");
    console.log("Admin users in DB:", res.rows);
  } catch (error) {
    console.error("Error fetching admin:", error);
  }
}

main();
