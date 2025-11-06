const x = require('./server');//whatever is imported is saved in the variable x
const express = require('express');// Import the Express library/package

const app = express();// Create an instance of an Express application
const port = 3000;

x();

//whneever upu open a slash route, this callback function will be called. slash is a route.
app.get('/', (req, res) => {
  res.send('Congratulations ! Your HHLD server is running.🎉');
});

//this is a callback function that will be called when the server starts listening on the specified port. as soon as we start the server, this callback is called. we can pass port into it.
app.listen(port, () => {
  console.log(`HHLD server is listening at http://localhost:${port}`);
});