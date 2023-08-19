const Express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = Express();

const PORT = 8000;

const home_route = require('./routes/home')

app.use(cors());
app.use(Express.json());

app.listen(PORT,()=>{
    console.log(`Serving on port : ${PORT}`);
})

app.use('/api/', home_route);
