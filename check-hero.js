const { createClient } = require('@libsql/client');

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const settings = await client.execute("SELECT * FROM HomepageSettings");
    console.log("HomepageSettings:", settings.rows);
    const heroImages = await client.execute("SELECT id, substr(url, 1, 50) as url_preview, length(url) as url_length, order, settingsId FROM HeroImage");
    console.log("HeroImages:", heroImages.rows);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
