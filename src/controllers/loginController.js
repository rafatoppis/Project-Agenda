const Login = require('../models/LoginModel')

exports.index = (req ,res) =>{ 
   //console.log(req.session.user)
   if(req.session.user) return res.render('loged');
   res.render('login');
};

exports.register = async (req ,res) =>{
   try {
      // importamos a classe Login e jogamos nessa o body da requisição. 
      const login = new Login(req.body);
      await login.register();

      if (login.errors.length > 0) {
         console.log(login.errors)
         req.flash('errors', login.errors);

         //salvar a sessão para voltar pra página com o erro
         req.session.save(function() {
            //redireciona pra página do form.
            return res.redirect('/login/index');
         });
         return;
      }    

      req.flash('success', 'User Created Succesfully');

      //salvar a sessão para voltar pra página com o erro
      req.session.save(function() {
         //redireciona pra página do form.
         return res.redirect('/login/index');
      });

   } catch(e) {
      console.log(e)
      return res.render('404');
   }
   
};

exports.login = async (req ,res) =>{
   try {
      // importamos a classe Login e jogamos nessa o body da requisição. 
      const login = new Login(req.body);
      await login.login();

      if (login.errors.length > 0) {
         console.log(login.errors)
         req.flash('errors', login.errors);

         //salvar a sessão para voltar pra página com o erro
         req.session.save(function() {
            //redireciona pra página do form.
            return res.redirect('/login/index');
         });
         return;
      }   

      if (!login.user) {
         console.log(login.errors)
         req.flash('errors', login.errors);
         req.session.save(function() {
            return res.redirect('/login/index');
         });
         return;
      }    

      req.flash('success', 'User Logged in.');
      
      // Agora é necessário criar uma sessão, para que:
      // identificar o navegador como o nav do usuário.
      // manter a sessão aberta enquanto ele ta navegando.

      req.session.user = login.user;

      //salvar a sessão para voltar pra página com o erro
      req.session.save(function() {
         //redireciona pra página do form.
         return res.redirect('/login/index');
      });

   } catch(e) {
      console.log(e)
      return res.render('404');
   };
   
};

exports.logout = (req, res) =>{
   req.session.destroy();
   res.redirect('/');
}

// Aqui não tem validação de Dados,
// Validação de dados é feito no Model.