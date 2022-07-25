exports.middlewareGlobal = (req,res, next) => {
   // caputando os erros
   res.locals.errors = req.flash('errors');
   res.locals.success = req.flash('success');
   res.locals.user = req.session.user;
   next();
};



exports.checkCSRFError = (err, req, res, next) => {
   if(err) {
      return res.render('404')
   }
   next();
}

exports.csrfMiddleware = (req, res, next) =>{
   res.locals.csrfToken = req.csrfToken();
   next();
}

exports.loginRequired = (req, res, next) => {
   if (!req.session.user){
      req.flash("errors", 'You need to login first!');
      req.session.save(() => res.redirect('/login/index'));
      return;
   }
   next();
}