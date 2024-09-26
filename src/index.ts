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
    const [rows] = await connection.query(
        "SELECT id, name, email, role, DATE_FORMAT(registerDate, '%d/%m/%Y') AS registerDate FROM users"
    );
    const registerDate = await connection.query("SELECT DATE_FORMAT(registerDate, '%d/%m/%Y') AS data_formatada FROM users;")
    return res.render('users/userTables',{
        users: rows
    });
});

app.get('/users/add', async function (req: Request, res: Response) {
    return res.render('users/register',{
        error: null
    });
});

app.post('/users', async function (req: Request, res: Response) {
    const body = req.body;
    const { password, confirmPassword, role, active } = req.body;

    if(password != confirmPassword){
        return res.render('users/register', { 
            error: 'Erro na confirmação das senhas.' 
        });
    }

    let isActive = active === 'on' ? 1 : 0;

    const insertQuery = 'INSERT INTO users (name, email, password, role, active) VALUES (?,?,?,?,?)';
    await connection.query(insertQuery, [body.name, body.email, body.password, body.role, isActive])
    res.redirect('/users');
    
});

app.post('/users/:id/delete', async function (req: Request, res: Response) {
    const id = req.params.id;
    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    await connection.query(deleteQuery, [id]);

    res.redirect('/users');
})

app.get('/login', async function(req: Request, res: Response) {
    return res.render('users/login', {
        error: null
    });
});

app.post('/login', async function(req: Request, res: Response) {
    const body = req.body;
    const verifyQuery = 'SELECT email, password FROM users WHERE email = ? AND password = ?';

    const [achou] = await connection.query(verifyQuery, [body.email, body.password]);

    if(Array.isArray(achou) && achou.length === 0){
        return res.render('users/login', { 
            error: 'Erro na confirmação das senhas.' 
        });
    }

    return res.redirect('/users');
})

app.get('/', async function (req: Request, res: Response) {  
    return res.render('users/index');
});


app.listen(3000, () => console.log("http://localhost:3000/users"));