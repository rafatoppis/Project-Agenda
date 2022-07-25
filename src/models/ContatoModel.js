const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
   name: { type: String, required: true },
   surname: { type: String, required: false, default: '' },
   email: { type: String, required: false, default: ''},
   phone: { type: String, required: false, default: ''},
   dateCreated: { type: Date, default: Date.now},
});

const ContactModel = mongoose.model('Contact', ContactSchema);

//module.exports = ContactModel;

function Contact(body) {
   this.body = body;
   this.errors = [];
   this.contact = null;
}

// Como não está atrelado no prototype, 
// não precisa ser instanciado
Contact.buscaPorId = async function(id){
   if (typeof id !== 'string') return;
   const user = await ContactModel.findById(id);
   return user;
}


Contact.prototype.register = async function() {
   this.valida();
   if(this.errors.length > 0) return;
   //Create the contact on DB.
   this.contact = await ContactModel.create(this.body);
}


Contact.prototype.valida = function() {
   this.cleanUp();

   if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Mail not valid.');
   if(!this.body.name) this.errors.push('Name is a must!');
   if(!this.body.email && !this.body.phone) {
      this.errors.push('Phone or Mail is required');
   };

}

Contact.prototype.cleanUp = function() {
   for (const key in this.body){
     if (typeof this.body[key] !== 'string'){
      this.body[key] = ''; //converte para um string vazia
     }
   }

 
   this.body = {
      name: this.body.name,
      surname: this.body.surname,
      email: this.body.email,
      phone: this.body.phone,
   }
}

module.exports = Contact;

//  RESPONSÁVEL POR CRIAR, VALIDAR DADOS É O MODEL