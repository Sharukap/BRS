const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

//Listen at port 5000
const app = express();
const port = process.env.PORT || 5000;

//CORS middleware
app.use(cors());
app.use(express.json());

//MongoDB connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//Routes

const userRouter = require('./routes/user');
const bookRouter = require('./routes/book');
const authorRouter = require('./routes/author');
const categoryRouter = require('./routes/category');
const libraryRouter = require('./routes/library');
const reviewRouter = require('./routes/review');
const publisherRouter = require('./routes/publisher');

app.use('/user',userRouter);
app.use('/book',bookRouter);
app.use('/author',authorRouter);
app.use('/category',categoryRouter);
app.use('/library',libraryRouter);
app.use('/review',reviewRouter);
app.use('/publisher',publisherRouter);

//Run server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});