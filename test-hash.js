const bcrypt = require('bcryptjs');

const hash = "$2b$10$0w6vAcvGRSCHYVmE.aOoxOxNEyzlMpcjyUIC2H3ocuMf8AzGNBiry";
const testPasswords = ["admin", "admin123", "password", "password123"];

async function main() {
  for (const pw of testPasswords) {
    const isMatch = await bcrypt.compare(pw, hash);
    if (isMatch) {
      console.log("MATCH:", pw);
      return;
    }
  }
  console.log("NO MATCH");
}
main();
