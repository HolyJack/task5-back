import express, { Express } from "express";
import randomUserApiGenerator, { addErrorsToUser } from "./RandomUsers";
import cors from "cors";

const app: Express = express();
const port = 3000;

app.use(
  cors({
    origin: ["https://task5-react-front.vercel.app", "http://localhost:5173"],
    methods: ["GET"],
  }),
);
app.use(express.json());

app.get("/api/users", (req, res) => {
  const local = req.query.local as string;
  const seed = req.query.seed ? +req.query.seed : 0;
  const errors = req.query.errors ? +req.query.errors : 0;
  const page = req.query.page ? +req.query.page : 0;
  const randomUserApi = randomUserApiGenerator({
    local,
    seed,
    page,
  });
  let users = randomUserApi.getMany();
  if (errors) users = users.map((user) => addErrorsToUser(user, local, errors));
  res.send(users);
});

app.listen(port, () => console.log(`This app is listening on port ${port}`));
