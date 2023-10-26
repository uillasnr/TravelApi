
import { Router } from "express";
import multerConfig from "../src/app/config/multer";
import multer from 'multer';

import TripController from "./app/controllers/TripController";
import TripReservation from "./app/controllers/TripReservationController";
import UserController from "./app/controllers/UserController";
import AuthController from "./app/controllers/Auth.controller";

import { verifyToken } from "../src/middlewares/auth"
import PaymentController from "./app/controllers/PaymentControlle";
import CategoryController from "./app/controllers/CategoryController";

const router = Router();
const upload = multer(multerConfig);

// Rota para criação de usuário
router.post('/user', UserController.store);
router.post("/login", AuthController.store)


// Rota para criação de viagem
router.post('/Trips-criar', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'imagesUrl_0', maxCount: 1 },
    { name: 'imagesUrl_1', maxCount: 1 },
    { name: 'imagesUrl_2', maxCount: 1 }
]), TripController.store);

router.get('/Trips', TripController.index); // Listar todas as viagens
router.get('/Trips/:Id', TripController.show); // Detalhes de uma viagem por ID
router.delete('/Trips/:Id', TripController.delete); // Excluir uma viagem por ID
// Rota para pesquisa de viagens por nome, data de início e orçamento
router.get('/Busca', TripController.findByName);
router.get('/Destino', TripController.getTripsInDestiny); //obter as viagens com base no destino





// Rota para reserva de viagem
router.post('/TripReservation', verifyToken, TripReservation.store);
router.get('/Confirmation', verifyToken, TripReservation.Confirmation); // Confirmação de reserva
router.get('/viagens', verifyToken, TripReservation.show); // Visualizar reservas do usuário
router.get('/todasTrips', verifyToken, TripReservation.index); // Listar todas as reservas de viagens
router.delete('/Reservation/:reservationId', verifyToken, TripReservation.delete); // Excluir reserva

// Rota para pagamento
router.post('/Payment', verifyToken, PaymentController.Payment);

// Rota para gerenciar categorias
router.post("/criar-category", CategoryController.store); // Criar categoria
router.get("/category", CategoryController.index); // Listar categorias
router.put("/category/:id", upload.fields([{ name: 'coverImage', maxCount: 1 }]), CategoryController.update); // Atualizar categoria
router.get("/category/:categoryId", CategoryController.getTripsByCategory);

export default router;