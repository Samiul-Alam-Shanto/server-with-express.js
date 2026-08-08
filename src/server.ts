import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import "dotenv/config";
const app: Application = express();
const port = 5000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: `postgresql://neondb_owner:${process.env.CONNECTION_PASSWORD}@ep-shiny-grass-ayo4dz4e-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`,
});

app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello World!");
  res.status(200).json({
    message: "Express Server",
    author: "Shanto",
  });
});
app.post("/", async (req: Request, res: Response) => {
  //   console.log(req.body);
  const { name, email, password } = req.body;
  res.status(200).json({
    message: "Created",
    data: { name, email },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
