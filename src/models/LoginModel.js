const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
   email: { type: String, required: true },
   password: { type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
   constructor(body){
      this.body = body;
      this.errors = [];
      this.user = null;
   }

   async login(){
      this.valida();
      if (this.errors.length > 0) return;
      this.user = await LoginModel.findOne({email: this.body.email});
      
      if(!this.user) {
         this.errors.push('User don\'t exist');
         return; 
      }

      if(!bcryptjs.compareSync(this.body.password, this.user.password)){
         this.errors.push('Invalid Password');
         // zera o usuário.
         this.user = null;
         return;
      }
   }

   // metódo async para retornar promises
   async register(){
      this.valida();

      // checar se há algum erro
      if (this.errors.length > 0) return;

      // seta o usuário na var, e cria.
      // sempre que usar aysnc/await tem que usar try/catch.

      await this.userExists();

      // checar novamente, caso usuário exista, ele atualiza os erros.
      if (this.errors.length > 0) return;

      //encriptando a senha
      const salt = bcryptjs.genSaltSync();
      console.log(salt)
      this.body.password = bcryptjs.hashSync(this.body.password, salt);

         //add no banco do mongoDB
      this.user = await LoginModel.create(this.body);
   }

   async userExists(){
      this.user = await LoginModel.findOne({email: this.body.email});
      if (this.user) this.errors.push('User already exists.');
      
   }

   valida(){
      this.cleanUp();

      // Email tem que ser válida
      // senha ter entre 3 e 50 caracteres.
      if(!validator.isEmail(this.body.email)) this.errors.push('Mail not valid.');

      if(this.body.password.length < 5 || this.body.password.length >= 50) this.errors.push('Invalid Password, must contain between 5 or 50 characters.')

   }

   cleanUp(){
      for (const key in this.body){
        if (typeof this.body[key] !== 'string'){
         this.body[key] = ''; //converte para um string vazia
        }
      }
      // garantir só os campos necessários
      // Seta o valor de this.body   
      // faz isso pra não pegar o csrfToken
      this.body = {
      email: this.body.email,
      password: this.body.password
      }
   }
}

module.exports = Login;

//  RESPONSÁVEL POR CRIAR, VALIDAR DADOS É O MODEL.