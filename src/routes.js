import { Router } from "express"
import TripController from "./app/controllers/TripController"
import TripReservation from "./app/controllers/TripReservationController"
import UserController from "./app/controllers/UserController"

const router = Router()
router.post('/user', UserController.store)

router.post('/Trips', TripController.store)
router.get('/Trips', TripController.index)

router.post('/TripReservation', TripReservation.store)
router.get('/TripReservation', TripReservation.index)

export default router