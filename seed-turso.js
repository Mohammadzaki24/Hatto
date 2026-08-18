const { createClient } = require('@libsql/client');

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  try {
    const res = await client.execute({
      sql: "INSERT INTO AdminUser (id, email, passwordHash, updatedAt) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO NOTHING",
      args: ["admin-1", email, passwordHash, new Date().toISOString()]
    });
    
    // Also insert default SiteSettings
    await client.execute({
      sql: "INSERT INTO SiteSettings (id, footerDisclaimer, updatedAt) VALUES (1, 'As an Amazon Associate, we earn from qualifying purchases.', ?) ON CONFLICT(id) DO NOTHING",
      args: [new Date().toISOString()]
    });

    // Also insert default HomepageSettings
    await client.execute({
      sql: "INSERT INTO HomepageSettings (id, heroTitle, heroFontFamily, updatedAt) VALUES (1, 'Welcome to Hatto', 'font-inter', ?) ON CONFLICT(id) DO NOTHING",
      args: [new Date().toISOString()]
    });

    console.log("Admin user and default settings seeded successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

main();
