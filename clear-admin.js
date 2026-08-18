const { createClient } = require('@libsql/client');

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    await client.execute("DELETE FROM AdminUser");
    console.log("AdminUser table cleared.");
  } catch (error) {
    console.error("Error clearing AdminUser:", error);
  }
}

main();
