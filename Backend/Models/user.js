// Création d'un model user avec mongoose, on importe donc mongoose
const mongoose = require('mongoose');
// importer le package lié à un vvalidateur unique d'un.e utilisateur 
const uniqueValidator = require('mongoose-unique-validator');// l'utilisateur peut pas s'enregister avec la meme adresse 
// implémenter des schémas de données stricts // gérer notre base de données MongoDB
//rendre l'application plus robuste 
// thing = schéma = création un schéma de données 

const userSchema = mongoose.Schema({
    //enregistrement email 
    email: {
        type: String,
        unique: true,
        required: [true, "Veuillez entrer votre adresse email"],
        unique: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez entrer une adresse email correcte"]
      },
      // enregistrement du mot de pass
      password: {
        type: String,
        required: [true, "Veuillez choisir un mot de passe"]
      }
    });


