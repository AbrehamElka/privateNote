const express = require("express"); 
const PORT = process.env.PORT || 8000;
const userRouter = require("./routers/userRouter");
const app = express();




app.use(express.json())



app.get('/', (req, res) => {
    res.send('Home page');
});

app.use('/api', userRouter);

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/`);
})
