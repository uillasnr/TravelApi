
import { prismaClient as prisma } from "../../database/prisma";

class TripReservationController {
    async store(request, response) {
        try {
            const { tripId, userId, startDate, endDate, totalPaid } = request.body;

            // Verifica se já existe uma reserva entre as datas informadas para a viagem
            const reservationsBetweenDates = await prisma.tripReservation.findMany({
                where: {
                    tripId,
                    startDate: {
                        lte: new Date(endDate)
                    },
                    endDate: {
                        gte: new Date(startDate)
                    }
                }
            });

            // Se já existe uma reserva, retorna um erro
            if (reservationsBetweenDates.length > 0) {
                return response.status(400).json({
                    error: "A reserva já existe entre as datas informadas"
                });
            }

            // Caso contrário, cria a reserva
            const newReservation = await prisma.tripReservation.create({
                data: {
                    trip: { connect: { id: tripId } },
                    user: { connect: { id: userId } },
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    totalPaid
                }
            });

            // Retorna a reserva criada
            return response.status(200).json({
                reservation: newReservation
            });
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            return response.status(500).json({ error: 'Ocorreu um erro ao criar a reserva.' });
        }
    }

    // Essa rota retorna todos as Trips
    async index(request, response) {
        try {
            const tripReservation = await prisma.tripReservation.findMany(); 

            return response.json(tripReservation);
        } catch (error) {
            console.error("Error retrieving trips:", error);
            return response.status(500).json({ error: "An error occurred while retrieving trips." });
        }
    }
}

export default new TripReservationController();


