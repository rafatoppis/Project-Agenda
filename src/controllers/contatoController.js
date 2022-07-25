const Contact = require('../models/ContatoModel');


exports.index = (req, res) => {
   res.render('contato', {
      contact: {}
   })
};

exports.register = async function(req, res) {
   try{
      const contact = new Contact(req.body);
      await contact.register();
      
   
      if (contact.errors.length > 0){
         req.flash("errors", contact.errors);
         req.session.save(() => res.redirect('back'));
         return;
      }

      req.flash('success', 'Contact Created!!');
      console.log(contact)
      req.session.save(() => res.redirect(`/contato/index/${contact.contact._id}`));
      return;
   } catch(e) {
      //console.log(e);
      return res.render('404');
   }
};

exports.editIndex = async function(req, res) {
   if(!req.params.id) return res.render('404');
   const contact = await Contact.buscaPorId(req.params.id);
   if(!contact) return res.render('404');

   res.render('contato',{
      contact: contact,
   })
}