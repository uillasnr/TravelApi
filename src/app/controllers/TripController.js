
import { prismaClient as prisma } from "../../database/prisma";

class TripController {
    async store(request, response) {

        try {
            const {
                name, location, startDate, endDate, pricePerDay, description,
                coverImage, imagesUrl, highlihts, maxGuests, countryCode,
                recommended
            } = request.body;

            const trip = await prisma.trip.create({
                data: {
                    name,
                    location,
                    startDate,
                    endDate,
                    pricePerDay,
                    description,
                    coverImage,
                    imagesUrl,
                    highlihts,
                    maxGuests,
                    countryCode,
                    recommended
                },
            });

            console.log(trip);

            return response.status(201).json(trip);
        } catch (error) {
            console.error('Error creating trip:', error);
            return response.status(500).json({ error: 'An error occurred while creating the trip.' });
        }

    }
    // Essa rota retorna todos as Trips
    async index(request, response) {
        try {
            const trips = await prisma.trip.findMany(); // Usar o método findMany para buscar todos os registros

            return response.json(trips);
        } catch (error) {
            console.error("Error retrieving trips:", error);
            return response.status(500).json({ error: "An error occurred while retrieving trips." });
        }
    }

}

export default new TripController();



/* import { prismaClient as prisma } from "../../database/prisma";
import * as yup from "yup";

class ControllerTrip {
    async store(request, response) {
        const tripSchema = yup.object().shape({
            name: yup.string().required(),
            location: yup.string().required(),
            startDate: yup.date().required(),
            endDate: yup.date().required(),
            pricePerDay: yup.number().required(),
            description: yup.string(),
            coverImage: yup.string(),
            imagesUrl: yup.array().of(yup.string()),
            highlights: yup.array().of(yup.string()),
            maxGuests: yup.number().required().positive().integer(),
        });

        try {
            await tripSchema.validate(request.body);

            const createdTrip = await prisma.trip.create({
                data: request.body,
            });

            return response.status(201).json(createdTrip);
        } catch (error) {
            console.error("Error storing trip:", error);
            return response.status(500).json({ error: "An error occurred while storing the trip." });
        }
    }
}

export default new ControllerTrip(); */
