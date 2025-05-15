const express = require("express");
const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Home page');
});

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/`);
})
