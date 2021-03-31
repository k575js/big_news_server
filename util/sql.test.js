const conn = require('./sql_base')

conn.query('select * from  users', (err, result) => {
    if (err) throw err
    console.log(result);
})