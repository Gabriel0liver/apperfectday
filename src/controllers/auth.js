const bcrypt = require('bcrypt');
const User = require('../models/User');


exports.register = async (req, res) => {
 const hashedPassword = await bcrypt.hash(req.body.password, 12)
 const user = await User.create({...req.body, password: hashedPassword});
 req.session.userId = user.id;
 return res.status(201).json(user)
}

exports.login = async (req,res) => {
 const user = await User.findOne({email : req.body.email});
 if(!user) {
  return res.status(404).json({message: "El correo  no existe."});
 }
  const IsPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
  if(! IsPasswordCorrect){
   return res.status(401).json({message: "contraseña falsa intentalo de nuevo."});
  }
  req.session.userId = user.id;
  res.json({message: "Estas logeado con exito"});
 }

 exports.logout = (req, res) => {
  delete req.session.userId;
  res.json({message: "se ha hecho logout con exito"})
 }

 exports.loginRequired = async (req, res, next) => {
  if(!req.session || !req.session.userId){
    return res.status(403).json({message: "tienes que estar logeado para poder acceder"});
  }
  req.user = await User.findById(req.session.userId);
  if(! req.user) {
   return res.status(403).json({message: "este id de usuario no existe"})
  }
  next();
 }

 exports.profile = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.json({user: user});
 }


