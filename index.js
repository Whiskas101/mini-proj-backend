const Express = require('express');
const cors = require('cors');
const app = Express();

const PORT = 8000;

const homeRoute = require('./routes/home')
const userRoute = require('./routes/user')

app.use(cors());
app.use(Express.json());

app.listen(PORT, () => {
    console.log(`Serving on port : ${PORT}`);
})

app.use('/home', homeRoute);

app.use('/user', userRoute);
