import { prismaClient as prisma } from "../../database/prisma"; // Alterar o nome da importação

class ControllerTrip {
    async store(request, response) {

        try {
            const {
                name, location, startDate, endDate, pricePerDay, description,
                highlihts, maxGuests, countryCode, recommended,    coverImage, imagesUrl
            } = request.body;

           // const coverImagePaths = request.files.coverImage[0].filename;
           // const imagesUrlPaths = request.files.imagesUrl.map(file => file.filename);

            // Agora você pode usar 'coverImage' e 'imagesUrl' ao criar a viagem no banco de dados.


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

export default new ControllerTrip();