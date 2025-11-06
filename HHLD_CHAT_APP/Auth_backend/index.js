import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js';
import usersRouter from './routes/users.route.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();
// above dotenv loads environment variables from .env file into process.env
const PORT = process.env.PORT || 5000; 
// use the port specified in the environment variable PORT, or default to port 5000

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({
 credentials: true,
 origin: [`${process.env.BE_HOST}:3000`, `${process.env.BE_HOST}:3001`, `${process.env.BE_HOST}:3002`]
}));

app.use('/auth', authRouter); // Use the auth router for routes starting with /auth
app.use('/users', usersRouter); // Use the users router for routes starting with /users

// Define a route
app.get('/', (req, res) => {
  res.send('Congratulations HHLD Folks!');
});

// Start the server
app.listen(PORT, () => {
    connectToMongoDB();
  console.log(`Server is listening at ${process.env.BE_HOST}:${PORT}`);
});
