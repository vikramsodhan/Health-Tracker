// use this module to connect to the database specified
// in DATABASE_URL environment variable
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://qmhjjvbobislut:296744d793ff9f01b689a6a5dd593b89fc63f4e5659dcc67a9565d5eb6dfbf4f@ec2-52-22-135-159.compute-1.amazonaws.com:5432/ddmnarisnlpo56',
  ssl: {
    rejectUnauthorized: false
  }
});

// the table is test_users; will change when we actually do the task

const getUsers = (request, response) => {
  pool.query('SELECT * FROM test_users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM test_users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = async (request, response) => {
  // user name is allowed to be case senstive
  var userName = request.body.user_name;
  // email is not allowed to be case senstive
  var userEmail = request.body.user_email.toLowerCase();

  var userPassword = request.body.pwd;
  // before add to database we also need to verify the input
  // to see if user are in the database or not

  // check email first
  var check = await pool.query('SELECT * FROM test_users WHERE email = $1', [userEmail]);
  if (check.rows.length){
    console.log('find existing email')
    response.status(400).send('Email already used for registration');
    response.end();
    return false;
  }
  // check username
  check = await pool.query('SELECT * FROM test_users WHERE name = $1', [userName]);
  if (check.rows.length){
    console.log('find existing user name')
    response.status(400).send('User name already used for registration');
    response.end();
    return false;
  }

  // now we can safely add new user

  pool.query('INSERT INTO test_users (name, email, password) VALUES ($1, $2, $3) RETURNING id', [userName, userEmail, userPassword], (error, results) => {
    if (error) {
      throw error
    }
    // redirect to login page after 3 seconds
    response.status(201).send(`User added with ID: ${results.rows[0].id}
    <script>
      setTimeout(function () {
        window.location.href = "/login.html";
      }, 3000);
    </script>
      `);


  })
}

const changeUname = async (request, response) => {
  var userName = request.body.user_name;
  var prevUsername = request.session.username;

  // check username
  check = await pool.query('SELECT * FROM test_users WHERE name = $1', [userName]);
  if (check.rows.length){
    console.log('find existing user name')
    response.status(400).send('User name already used for registration');
    response.end();
    return false;
  }

  //now change username
  pool.query(
    'UPDATE test_users SET name = $1 where name = $2', [userName, prevUsername],
    (error, results) => {
      if (error){
        throw error
      }
      response.status(200).send('username changed, please log in again')
    }
  )

}

const changePw = async (request, response) => {
  var newPw = request.body.pwd;
  var currPw = request.body.curr_pwd;
  var userName = request.session.username;

  // check if current user's password matches what was typed into the form
  check = await pool.query('SELECT * FROM test_users WHERE name = $1 AND password = $2', [userName, currPw]);
  if (check.rows.length){
    // now change password
    pool.query(
      'UPDATE test_users SET password = $1 WHERE name = $2', [newPw, userName],
      (error, results) => {
        if (error){
          throw error
        }
        response.status(200).send('password changed, please log in again')
      }
    )
  }
  else{
    console.log('current password entered is incorrect')
    response.status(400).send('current password entered is incorrect');
    response.end();
    return false;
  }

  
}

const changeEmail = async (request, response) => {
  var email = request.body.user_email;
  var userName = request.session.username;

  // check email
  var check = await pool.query('SELECT * FROM test_users WHERE email = $1', [email]);
  if (check.rows.length){
    console.log('find existing email')
    response.status(400).send('Email already used for registration');
    response.end();
    return false;
  }

  // change email
  pool.query(
    'UPDATE test_users SET email = $1 WHERE name = $2', [email, userName],
    (error, results) => {
      if (error){
        throw error
      }
      response.status(200).send('email changed')
    }
  )


}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query( 
    'UPDATE test_users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM test_users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUname,
  changePw,
  changeEmail,
}