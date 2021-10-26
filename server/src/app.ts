import express from "express";
import index from './routes/index';
import {connect} from 'mongoose';

// init express
const app = express();
const port = 8080;
app.use(express.json())

app.use('/', index);

connect('mongodb://localhost:27017/test',{ useUnifiedTopology: true, useNewUrlParser: true });

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});


export default app;