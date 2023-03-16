

// bcrypt est utilisé pour hasher le mot de passe des utilisateurs
const bcrypt = require('bcrypt')

// On récupère le model User ,créer avec le schéma mongoose
const User = require('../Models/user');

// On utilise le package jsonwebtoken pour attribuer un token à un utilisateur 
//au moment ou il se connecte
const jwt = require('jsonwebtoken');
//Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
// On sauvegarde un nouvel utilisateur et crypte son mot de passe avec 
//un hash généré par bcrypt
exports.signup = (req, res, next) => {
 console.log(req, res);
    // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur 
  bcrypt.hash(req.body.password, 10)
    // Récupération du hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BBD mongoDB
    .then(hash => {
      // Création du nouvel utilisateur avec le model mongoose
      const user = new User({
        email: req.body.email,
        password: hash
      });
      //enregistrement de l'utilisateur dans la base de données
      user.save()
        .then(() => res.status(201).json({
          message: 'Félicitation votre utilisateur est crée !'
        }))
        .catch(error => res.status(400).json({
          error
        })); // un catsh s'il existe déjà un utilisateur avec cette adresse email // bug serveur 
    })
    .catch(error => res.status(500).json({
      error
    }));

};

// Le Middleware pour la connexion d'un utilisateur  : si l'utilisateur existe dans la base MongoDB lors du login
//si oui = vérification de son mot de passe, s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur
// sinon il renvoie une erreur
exports.login = (req, res, next) => {
  // On doit trouver l'utilisateur dans la BDD qui correspond à l'adresse entrée par l'utilisateur
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      // Si on trouve pas l'utilisateur on va renvoyer un code 401 "non autorisé"
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }
      // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // Si false, c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            });
          }
          // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token
          res.status(200).json({ // Le serveur backend renvoie un token au frontend
            userId: user._id,
            // Permet de vérifier si la requête est authentifiée
            // on va pouvoir obtenir un token encodé pour cette authentification grâce à jsonwebtoken, on va créer des tokens et les vérifier
            token: jwt.sign( // Encode un nouveau token avec une chaine de développement temporaire
              {
                userId: user._id
              }, // Encodage de l'userdID nécéssaire dans le cas où une requête transmettrait un userId (ex: modification d'une sauce)
              'RANDOM_TOKEN_SECRET', // Nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour crypter notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production).
              // Nous définissons la durée de validité du token à 24 heures.
              // L'utilisateur devra donc se reconnecter au bout de 24 heures.
              {
                expiresIn: '24h'
              }
            )
            // On encode le userID pour la création de nouveaux objets, et cela permet d'appliquer le bon userID
            // aux objets et ne pas modifier les objets des autres
          });
        })
        .catch(error => res.status(500).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};
