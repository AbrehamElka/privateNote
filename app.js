const express = require("express"); 
const PORT = process.env.PORT || 8000;
const userRouter = require("./routers/userRouter");
const noteRouter = require("./routers/noteRouter");
const cookieParser = require("cookie-parser");
const app = express();




app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Home page');
});

app.use('/api', userRouter);
app.use('/api', noteRouter);

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}/`);
})
