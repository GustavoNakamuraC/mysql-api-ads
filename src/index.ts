import express, {Request, response, Response} from "express";
import mysql from "mysql2/promise";

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const connection = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mudar123",
    database: "unicesumar"
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Usuários
app.get('/users', async function (req: Request, res: Response){
    
    return res.render('users/userTables');
});


// Categories
app.get('/categories', async function (req: Request, res: Response) {
    const [rows] = await connection.query("SELECT * FROM categories");
    return res.render('categories/index', {
        categories: rows
    });
});

app.get('/categories/form', async function (req:Request, res: Response) {
    return res.render('categories/form')
});

app.post('/categories/save', async function (req:Request, res:Response) {
    const body = req.body;
    const insertQuery = "INSERT INTO categories (name) VALUES (?)";
    await connection.query(insertQuery, [body.name]);
});

app.listen(3000, () => console.log("http://localhost:3000"));