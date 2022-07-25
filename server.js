// Referente as variáveis de ambiente para não mostrar senha aqui.
require('dotenv').config();

// Importação do Express
const express = require('express');
// Criação do objeto App com express.
const app = express();

// Importação do mongoose
// Mongoose serve para estruturar os dados (Schema) para serem salvos
// no MongoDB.
// obs: Mongoose ja substitui o driver oficial do MongoDB.
const mongoose = require('mongoose');

// Conexão ao banco de dados do MongoDB.
// é bom conectar como promise, pra nada executar enquanto o BD não conectar.
mongoose.connect(process.env.CONNECTIONSTRING)
   .then( () => {
// serve para não escutar nada antes do BD conectar. esse sinal será captado no final.
      app.emit('Conectado');
   })
   .catch(e => console.log(e));


// Cria e configura a session
// Sessões servem para identificar o navegador de um cliente
// salvar um cookie com um id no pc do cliente.
const session = require('express-session');

// Connect-mongo serve para dizer que as sessões serão salvas dentro do Mongo.
// Sem ele, as sessões seriam salvas na memória do servidor, e o servidor iria ficar sem memória.
const mongoStore = require('connect-mongo');

// flash Messages, para aparecer 1x na tela do usuário assim que você ler, é perfeito para mandar msg de erros, feedback.
// essas mensagens são salvas na sessão.
const flash = require('connect-flash');

// Rotas são as rotas da aplicação, home, inicial, contato.
const routes = require('./routes');

// Path é apenas para trabalhar com caminhos.
const path = require('path');

// Helmet é recomendação do pessoal do express para segurança. Ler docs.
const helmet = require('helmet');

// São os CSRF Tokens para os formulários, para previnir Injections nos Forms.
// CSRF Coss site request Forgery
const csrf = require('csurf');




//associação via desestruturação
// Sâo os middlewares que exportamos para cá. São executados na Rota.
const {middlewareGlobal, checkCSRFError, csrfMiddleware} = require('./src/middlewares/middleware');

// Express vai ativar o Helmet.
app.use(helmet());




// isso vai servir pro envio do form pegando os dados da url enviado via POST.
// Serve para postar forms pra dentro da application.
// também poderiamos usar o app.use(express.json());
app.use(express.json());
app.use(
   express.urlencoded(
      {
         extended: true,
      }
   )
);

// Arquivos estáticos, que não vao mudar o caminho.
// Ex: imagens, css, .js, bundle.js. Devem ser acessados diretamente.
app.use(express.static(path.resolve(__dirname, 'public')));


// As configurações de Sessão.
const sessionOptions = session({
   secret: 'faosdfj3209fs7q834nf+238)(42',
   store: mongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING}),
   resave: false,
   saveUninitialized: false,
   cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
   }
});

// Ativa o sessionOptions.
app.use(sessionOptions);

// Ativa O flash.
app.use(flash());

// Configuração de Views. 
// Views são os arquivos que nós renderizamos na Tela.
app.set('views', path.resolve(__dirname, 'src', 'views'));

// View engine é o motor usado para renderizar o HTML, no caso, EJS.
// EJS é muito similar a HTML.
app.set('view engine', 'ejs');

// Ativa o csrf.
app.use(csrf());


//usar os middlewares
app.use(middlewareGlobal);
app.use(checkCSRFError);
app.use(csrfMiddleware);

// Ativamos as rotas
app.use(routes);

// depois do ? é tudo queryStrings, elas são separadas por &.
// /profiles/1?campanha=googleads&nomecampanha=vendas
// http://facebook.com/profiles/12345
// http://facebook.com/profiles/rafaeltoppis



// express tem que escutar uma porta.
// Colocamos ele rodando na porta 3000,
// Ele vai esperar o app emitir "Conectado" e assim que emitir
// vai startar o servidor.
app.on('Conectado', () => {
   app.listen(3000, () => {
      console.log('Acessar http://localhost:3000')
      console.log('Servidor executando na porta 3000');
   });
})


