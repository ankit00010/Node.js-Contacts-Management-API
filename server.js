const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

const connectDB = require('./Config/dbConnection');

dotenv.config();
connectDB();
const app = express();

const port = process.env.PORT || 5000; // Use port 5000 as a default


app.use(express.json());

app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use(errorHandler);
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
