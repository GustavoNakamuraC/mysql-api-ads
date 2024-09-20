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
    const [rows] = await connection.query("SELECT * FROM users");
    console.log(rows);
    return res.render('users/userTables',{
        users: rows
    });
});

app.get('/users/add', async function (req: Request, res: Response) {
    return res.render('users/register',{
        error: null
    });
});

app.post('/users/save', async function (req: Request, res: Response) {
    const body = req.body;
    const {password, confirmPassword} = req.body;

    if(password != confirmPassword){
        console.log(password, confirmPassword);
        return res.render('users/register', { 
            error: 'Erro na confirmação das senhas.' 
        });
    }else{
        let {active} = req.body;
        
        if (active === 'on')
            active = 1;
        else
            active = 0;

        const insertQuery = 'INSERT INTO users (name, email, password, role, active) VALUES (?,?,?,?,?)';
        await connection.query(insertQuery, [body.name, body.email, body.password, body.role, body.active])
        res.redirect('/users');
    }
    
});

app.listen(3000, () => console.log("http://localhost:3000"));