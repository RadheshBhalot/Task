import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();

import UserRouter from './routes/user.routes.js';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());
app.use('/user',UserRouter);

app.listen(3001,()=>{
    console.log("Server invoked at a link http://localhost:3001");
});

