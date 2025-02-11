const express = require("express");
const Cors = require("cors");
const identify = require("./routes/identify");
const { ErrorHandler } = require("./middleware/errorHandling");

const app = express();

const PORT = process.env.PORT || 3030;

app.use(Cors());
app.use(express.json());

app.use("/identify", identify);

app.get("/", (_, res) => {
  res.send("BiteSpeed Assignment");
});

app.use(ErrorHandler);//application level error handler

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
