import express from "express";
import Stream from 'stream';
import conf from "./database/mongoose.js";
import helmet from "helmet";
import cors from 'cors';
import Router from "./routes/api.js";
import morgan from "morgan";
import path, { dirname }  from 'path';
import { fileURLToPath } from 'url';
import * as http from 'http';
import { createLogger, transports, format } from 'winston';
const { combine, timestamp, prettyPrint, colorize, errors,  } = format;
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// app.use(helmet())

// Function to serve all static files
// inside public directory.

app.use(cors())

app.use(express.json())
app.use(morgan('dev'))

app.use(express.static('public')); 
app.use('/images', express.static('images'));
// app.use(`/images`, express.static(path.join(__dirname, `uploads`)));
conf();




const port = 4500


app.use(express.urlencoded({ extended: true }));


/*********************** For Local Logger ***********************/



  var server = http.createServer(app);
  


// const whitelist =[
//   'http://localhost:3000',
//   'https://admissionjockey.in',
// ]
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   credentials: true,
// }


app.use(Router);

  server.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);

})
