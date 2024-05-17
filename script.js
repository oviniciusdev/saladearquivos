// módulo express 
const express = require('express');
// fileupload
app.use(fileupload());

// Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// Css
app.use('/css', express.static('./css'));

// imagem
app.use('/imagens', express.static('./imagens'));

// express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Manipulação de dados rota
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const cors = require('cors');

// módulo fileupload
const fileupload = require('express-fileupload');

// módulo express-handlebars
const { engine } = require('express-handlebars');

// módulo mysql
const mysql = require('mysql2');

// file systems
const fs = require('fs');

// app
const app = express();


// conexão
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projeto2'
});

//teste conexão
conexao.connect(function(erro) {
    if(erro) throw erro;
    console.log('Conectado ao banco de dados');
});

//Rota Principal
app.get('/', function(req, res){
    let sql = 'SELECT * FROM produtos';

    // Executar comando sql
    conexao.query(sql, function(erro, retorno){
        res.render('formulario', {produtos:retorno});
    });

});

//Rota de Cadastro
app.post('/registrar', function(req, res){
    let nome = req.body.nome;
    let imagem = req.files.imagem.name;

    let sql = `INSERT INTO produtos(nome, imagem) VALUES('${nome}','${imagem}')`;
    conexao.query(sql, function(erro, retorno){
        
        if(erro) throw erro;
        
        req.files.imagem.mv(__dirname + '/imagens/'+req.files.imagem.name);
        console.log(retorno);
        
    });
    res.redirect('/');
});

//rota para remover
app.get('/excluir/:codigo&:imagem', function(req, res){
    let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;
    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;
        
        fs.unlink(__dirname+'/imagens/'+req.params.imagem, (erro_imagem)=>{
            console.log("Erro ao remover imagem")
        });
    });
    res.redirect('/');
});
// rota para baixar
app.use(cors());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get("/download", (req, res) =>{
    res.download(__dirname + "/imagens");
})



//rota para editar
app.get('/formularioEditar/:codigo', function(req,res){
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;
    conexao.query(sql, function(erro,retorno){
        if(erro) throw erro;
        res.render('formularioEditar', {produto:retorno[0]});
    });
});


// Servidor
app.listen(8080);
