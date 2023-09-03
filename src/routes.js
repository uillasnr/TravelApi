// Rotas e configuração geral
import { Router } from "express";
import multerConfig from "../src/app/config/multer";
import multer from 'multer';

import TripController from "./app/controllers/TripController";
import TripReservation from "./app/controllers/TripReservationController";
import UserController from "./app/controllers/UserController";
import AuthController from "./app/controllers/Auth.controller";


import { verifyToken } from "../src/middlewares/auth"
import PaymentControlle from "./app/controllers/PaymentControlle";

const router = Router();
//const upload = multer(multerConfig);; // Talvez precise usar 'upload' em vez de '(multerConfig)' aqui

// Rota para criação de usuário
router.post('/user', UserController.store);
router.post("/login", AuthController.store)

router.post('/Trips', TripController.store); //so o admin pode 
// Rota para criação de viagem
/*  router.post('/Trips', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'imagesUrl', maxCount: 2 }
]), TripController.store);  */

// Rota para listagem de viagens
router.get('/Trips', TripController.index); //todas as viagens

router.get('/Trips/:id', TripController.show);






// Rota para reserva de viagem
router.post('/TripReservation', verifyToken, TripReservation.store);

// Defina a rota e o middleware
router.get('/Confirmation', verifyToken, TripReservation.Confirmation);




/* router.post('/Reservation', verifyToken, TripReservation.Reservation);//criara areserva */
router.post('/Payment', verifyToken, PaymentControlle.Payment);





// Este método permite que um usuário veja sua própria reserva com base no seu ID user
router.get('/viagens', verifyToken, TripReservation.show);

router.delete('/Reservation/:reservationId', verifyToken, TripReservation.delete);





// Rota para listar tidas as  reservas de viagens admin
router.get('/todasTrips', verifyToken, TripReservation.index);

export default router;
