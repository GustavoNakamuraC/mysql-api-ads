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
app.get('/', async function (req: Request, res: Response) {
    let i = 0;

    const posts = [
        { title: 'Título do Post 1', description: 'Uma breve descrição sobre o conteúdo do post. Este post fala sobre...', link: '#' },
        { title: 'Título do Post 2', description: 'Uma breve descrição sobre o conteúdo do post. Este post fala sobre...', link: '#' },
        { title: 'Título do Post 3', description: 'Uma breve descrição sobre o conteúdo do post. Este post fala sobre...', link: '#' },
        { title: 'Título do Post 4', description: 'Uma breve descrição sobre o conteúdo do post. Este post fala sobre...', link: '#' }
    ];

    return res.render('users/index',{
        posts: posts
    })
})

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

app.post('/users/save', async function (req: Request, res: Response) {
    const body = req.body;
    const { password, confirmPassword, role, active } = req.body;

    if(password != confirmPassword){
        console.log(password, confirmPassword);
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

app.listen(3000, () => console.log("http://localhost:3000"));