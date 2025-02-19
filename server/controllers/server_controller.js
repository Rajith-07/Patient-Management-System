const mysql2 = require("mysql2");

// Create MySQL Connection Pool
const con = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Render Login Page
exports.login = (req, res) => {
  res.render("login");
};

// Render Signup Page
exports.signup = (req, res) => {
  res.render("signup");
};

// Handle Signup
exports.signup_complete= (req, res) => {
  con.getConnection((err,connection) =>
  {
    const { firstName, lastName, email, phone, username, password, confirmPassword } = req.body;
    const role ='patient';
    if (password !== confirmPassword) {
      return res.send(`
        <script>
          alert('Password doest match !');
          window.location.href = '/signup';
        </script>
      `);
    }
  
    
    const sql = `
      INSERT INTO users (fname, last_name, email, phone, username, password,role)
      VALUES (?, ?, ?, ?, ?, ?,?)
    `;
  
    connection.query(sql, [firstName, lastName, email, phone, username, password,role], (err, result) => {
    connection.release();
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send("An error occurred while saving your data.");
      }
      console.log("Data inserted successfully:", result);
      res.send(`
        <script>
          alert('Now login !');
          window.location.href = '/';
        </script>
      `);;
    });
  })

};
exports.login_complete = (req, res) => {
  con.getConnection((err,connection)=>
  {
    const { role, username, password } = req.body;
  
    const query = `SELECT * FROM Users WHERE username = ? AND password = ? AND role = ?`;
  
    con.query(query, [username, password, role], (err, results) => {
      connection.release();
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Internal server error');
      }
  
      if (results.length > 0) {
        res.render('dashboard'); 
      } else {
        res.send(`
          <script>
            alert('Invalid username, password, or role or signup first.');
            window.location.href = '/';
          </script>
        `);
      }
    });
  })
  
};
