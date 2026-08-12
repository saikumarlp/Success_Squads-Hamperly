const bcrypt = require('bcryptjs');

const hash = '$2a$10$ExfMwKpQVa9otuYYthVNz.Iz3sNymNp/ZJ19Z8cnPWjdMJt9xdFTq';
const passwords = [
  'password',
  'Password',
  'Password@123',
  'Anusha@1234',
  'admin',
  'admin123',
  'john123',
  'john@123',
  'Password123',
  'password123',
  '12345678',
  '123456789',
  'welcome123'
];

async function check() {
  console.log('Checking passwords against priya hash:', hash);
  for (const p of passwords) {
    const match = await bcrypt.compare(p, hash);
    if (match) {
      console.log(`MATCH FOUND: "${p}"`);
      return;
    }
  }
  console.log('No matches found in list.');
}

check();
