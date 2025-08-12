import mysql from 'mysql2/promise';

console.log("[MYSQL_PASSWORD]", process.env.MYSQL_PASSWORD);


const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping(); // Sends a ping to confirm the connection
    console.log('✅ MySQL pool connected successfully');
    connection.release(); // Return connection to the pool
  } catch (err) {
    console.error('❌ MySQL pool connection failed:', err);
  }
})();

export default pool;
