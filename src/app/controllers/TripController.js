import { prismaClient as prisma } from "../../database/prisma";

class ControllerTrip {
    async store(request, response) {

        try {
            const { name, location, startDate, endDate, pricePerDay, description,
                highlihts, maxGuests, countryCode, recommended } = request.body;


            const coverImage = request.files.coverImage[0].filename;
            const imagesUrl = JSON.parse(request.body.imagesUrl);

            // URL base do seu servidor
            const baseUrl = 'http://localhost:3001';
            const coverImageUrl = `${baseUrl}/uploads/${coverImage}`;


            // Formate as datas para o formato ISO-8601
            const isoStartDate = new Date(startDate).toISOString();
            const isoEndDate = new Date(endDate).toISOString();


            const highlihtsArray = Array.isArray(highlihts) ? highlihts : JSON.parse(highlihts);

            const trip = await prisma.trip.create({
                data: {
                    name,
                    location,
                    startDate: isoStartDate,
                    endDate: isoEndDate,
                    pricePerDay,
                    description,
                    coverImage: coverImageUrl,
                    imagesUrl,
                    highlihts: highlihtsArray,
                    maxGuests: parseInt(maxGuests),
                    countryCode,
                    recommended: recommended === 'true',
                },
            });


            console.log(trip);

            return response.status(201).json(trip);
        } catch (error) {
            console.error('Error creating trip:', error);
            return response.status(500).json({ error: 'An error occurred while creating the trip.' });
        }

    }

    // Método para buscar uma viagem pelo ID
    async show(request, response) {
        try {
            const { Id } = request.params; // Captura o ID da viagem da URL

            const trip = await prisma.trip.findUnique({
                where: {
                    id: Id,
                },
            });

            if (!trip) {
                return response.status(404).json({ error: "Trip not found" });
            }

            return response.json(trip);
        } catch (error) {
            console.error("Error retrieving trip by ID:", error);
            return response.status(500).json({ error: "An error occurred while retrieving the trip." });
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

export default new ControllerTrip();