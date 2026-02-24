const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function main() {
  console.log('🔄 Running Prisma migrations...');
  
  try {
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('✅ Migrations completed successfully!');
    console.log('🚀 Starting Next.js server...');
    
    // Start Next.js
    require('child_process').spawn('node', ['node_modules/next/dist/bin/next', 'start'], {
      stdio: 'inherit',
      shell: true
    });
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();