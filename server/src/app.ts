import express from "express";
import index from './routes/index';

// init express
const app = express();
const port = 8080;
app.use(express.json())

app.use('/', index);

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

export default app;