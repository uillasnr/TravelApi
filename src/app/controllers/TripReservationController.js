
import { prismaClient as prisma } from "../../database/prisma";



class TripReservationController {
    async store(request, response) {
        try {
            const { tripId,userId, startDate, endDate } = request.body;

            // Verifica se já existe uma reserva entre as datas informadas para a viagem
            const reservationsBetweenDates = await prisma.tripReservation.findMany({
                where: {
                    tripId,
                    startDate: {
                        lte: new Date(startDate)
                    },
                    endDate: {
                        gte: new Date(endDate)
                    }
                }
            });

            // Se já existe uma reserva, retorna um erro
            if (reservationsBetweenDates.length > 0) {
                return response.status(400).json({
                    error: "A reserva já existe entre as datas informadas"
                });
            }

            // Caso contrário, busca o usuário que fez a reserva
            const reservationUser = await prisma.user.findUnique({
                where: {
                    id: userId // Supondo que o ID do usuário seja passado na requisição
                }
            });

            // Retorna a reserva e o usuário que fez a reserva
            return response.status(200).json({
                reservation: reservationsBetweenDates,
                user: reservationUser
            });
        } catch (error) {
            console.error('Erro ao verificar reserva:', error);
            return response.status(500).json({ error: 'Ocorreu um erro ao verificar a reserva.' });
        }

    }

     // Essa rota retorna todos as Trips
     async index(request, response) {
        try {
            const tripReservation = await prisma.tripReservation.findMany(); // Usar o método findMany para buscar todos os registros

            return response.json(tripReservation);
        } catch (error) {
            console.error("Error retrieving trips:", error);
            return response.status(500).json({ error: "An error occurred while retrieving trips." });
        }
    }
}

export default new TripReservationController();


