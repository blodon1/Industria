const {pg} = require('../config/pg.config');

const home = (req,res)=>{

    pg.connect((err, client, release) => {
        if (err) {
          return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT NOW()', (err, result) => {
          release()
          if (err) {
            return console.error('Error executing query', err.stack)
          }
          console.log(result.rows)
          res.send({mensaje:'Hola desde el backend',fecha:result.rows[0].now});
        })
      })
   
}


const img = (req,res)=>{
  pg.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('select perfilimagen as i,contenttype as t from public.imagen where id = 4;', (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows)
      res.render('index.html',{img:result.rows[0]})
    })
  })
}


module.exports ={
    home,
    img
}