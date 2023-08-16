import { Router } from "express"
import controllerTrip from "../src/app/controllers/controllerTrip"


const router = Router()

router.post('/Trips', controllerTrip.store)
router.get('/Trips', controllerTrip.index)

export default router