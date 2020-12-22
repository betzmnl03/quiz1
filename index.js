const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride=require('method-override')
const logger = require('morgan');

//for static assests
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs'); 
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(logger('dev'));


const userRouter = require('./routes/user')
app.use('/user',userRouter);

const cluckRouter = require('./routes/cluck')
app.use('/',cluckRouter);

const ADDRESS = 'localhost';
const PORT = 3000;
app.listen(PORT, ADDRESS, () => {
  console.log(`Server listening on ${ADDRESS}:${PORT}`);
});