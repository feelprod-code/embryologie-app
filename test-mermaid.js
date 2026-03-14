const fs = require('fs');
let code = `graph TD\n  A[Rapprochement Côtes Mi-ligne]:::meso --> B(Suture de l'Angle de Louis J45):::meso\n  A --> C[Fermeture du Médiastin]:::meso\n  A ~~~ D\n  D[Redressement Axial]:::global --> E(Tension Dure-Mérienne):::ecto\n  E --> F[Modélisation du Desmocrâne]:::ecto`;
console.log(code);
