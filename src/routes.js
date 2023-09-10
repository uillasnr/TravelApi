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
const upload = multer(multerConfig);; // Talvez precise usar 'upload' em vez de '(multerConfig)' aqui

// Rota para criação de usuário
router.post('/user', UserController.store);
router.post("/login", AuthController.store)
<<<<<<< HEAD

//router.post("/Trips-criar", TripController.store);

=======

router.post('/Trips', TripController.store); //so o admin pode 
>>>>>>> f085c87735b45057f4c6e2e70b95e15b1f3fad71
// Rota para criação de viagem
router.post('/Trips-criar', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'imagesUrl', maxCount: 3 }
]), TripController.store);
//console.log("Dados recebidos no back-end:", multer)





// Rota para listagem de viagens
router.get('/Trips', TripController.index); //todas as viagens

<<<<<<< HEAD
router.get('/Trips/:Id', TripController.show);
=======
router.get('/Trips/:id', TripController.show);
>>>>>>> f085c87735b45057f4c6e2e70b95e15b1f3fad71






// Rota para reserva de viagem
router.post('/TripReservation', verifyToken, TripReservation.store);

// Defina a rota e o middleware
router.get('/Confirmation', verifyToken, TripReservation.Confirmation);
<<<<<<< HEAD
=======




/* router.post('/Reservation', verifyToken, TripReservation.Reservation);//criara areserva */
router.post('/Payment', verifyToken, PaymentControlle.Payment);





// Este método permite que um usuário veja sua própria reserva com base no seu ID user
router.get('/viagens', verifyToken, TripReservation.show);

router.delete('/Reservation/:reservationId', verifyToken, TripReservation.delete);





// Rota para listar tidas as  reservas de viagens admin
router.get('/todasTrips', verifyToken, TripReservation.index);
>>>>>>> f085c87735b45057f4c6e2e70b95e15b1f3fad71




/* router.post('/Reservation', verifyToken, TripReservation.Reservation);//criara areserva */
router.post('/Payment', verifyToken, PaymentControlle.Payment);





// Este método permite que um usuário veja sua própria reserva com base no seu ID user
router.get('/viagens', verifyToken, TripReservation.show);

router.delete('/Reservation/:reservationId', verifyToken, TripReservation.delete);





// Rota para listar tidas as  reservas de viagens admin
router.get('/todasTrips', verifyToken, TripReservation.index);

export default router;