// Rotas e configuração geral
import { Router } from "express";
import multerConfig from "../src/app/config/multer";

import TripController from "./app/controllers/TripController";
import TripReservation from "./app/controllers/TripReservationController";
import UserController from "./app/controllers/UserController";

const router = Router();
const upload = (multerConfig); // Talvez precise usar 'upload' em vez de '(multerConfig)' aqui

// Rota para criação de usuário
router.post('/user', UserController.store);

// Rota para criação de viagem
router.post('/Trips', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'imagesUrl', maxCount: 2 }
]), TripController.store);

// Rota para listagem de viagens
router.get('/Trips', TripController.index);

// Rota para reserva de viagem
router.post('/TripReservation', TripReservation.store);

// Rota para listar reservas de viagens
router.get('/TripReservation', TripReservation.index);

export default router;
