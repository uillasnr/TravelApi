import { prismaClient as prisma } from "../../database/prisma";
import * as Yup from 'yup';

// global para armazenar a reserva
let globalReservation = null;

class TripReservationController {

    async store(request, response) {

        try {
            const schema = Yup.object().shape({
                tripId: Yup.string().required(),
                startDate: Yup.date(),
                endDate: Yup.date(),
                guests: Yup.string().required(),
                totalPaid: Yup.string().required(),
            });

            await schema.validate(request.body, { abortEarly: false });

            const { tripId, startDate, endDate, totalPaid } = request.body;
            const userId = request.user.id;
            const guests = parseInt(request.body.guests, 10); // Converte a string para um número inteiro

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

            // Busque todas as informações da trip e do user
            const trip = await prisma.trip.findUnique({
                where: {
                    id: tripId,
                },
            });

            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

            // Crie um objeto com todas as informações
            const newReservation = {
                trip,
                user,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                guests: guests,
                totalPaid
            };

            // Atribua a nova reserva à variável global
            globalReservation = newReservation;

            // Retorna as informações da reserva como um objeto, sem criar no banco de dados
            return response.status(200).json({
                reservation: newReservation
            });

        } catch (error) {
            // Trate os erros de validação do Yup
             if (error instanceof Yup.ValidationError) {
                return response.status(400).json({ error: "Validation error", messages: error.errors });
            } 

            console.error('Error creating reservation:', error);
            return response.status(500).json({ error: 'An error occurred while creating the reservation.' });
        }
    }

// Verifique se os dados da reserva foram confirmados anteriormente
    async Confirmation(request, response) {
        try {
            if (!globalReservation) {
                return response.status(400).json({ error: "Reservation details not confirmed" });
            }

            // Exiba os detalhes da reserva temporária
            return response.status(200).json({ reservation: globalReservation });

        } catch (error) {
            console.error('Error fetching booking details:', error);
            return response.status(500).json({ error: 'An error occurred while fetching reservation details.' });
        }
    }

    // Este método permite que um usuário veja sua própria reserva com base no seu ID user
    async show(request, response) {

        try {
            // Agora você pode acessar as informações do usuário diretamente do objeto de solicitação
            const user = request.user;

            // Você pode usar o ID do usuário diretamente
            const userId = user.id;

            // Busque a reserva do usuário pelo ID do usuário
            const reservation = await prisma.tripReservation.findMany({
                where: {
                    userId: userId
                },
                include: {
                    trip: true // Inclua os dados da viagem
                }
            });

            if (!reservation) {
                return response.status(404).json({ error: "Reservation not found" });
            }

            // Retorna a reserva do usuário
            return response.json(reservation);

        } catch (error) {
            console.error('Error getting reservation:', error);
            return response.status(500).json({ error: 'An error occurred while obtaining the reservation.' });
        }
    }

    async delete(request, response) {
        try {
            // Obtenha o ID da reserva que você deseja excluir 
            const reservationId = request.params.reservationId; 

            // Verifique se a reserva existe
            const existingReservation = await prisma.tripReservation.findUnique({
                where: {
                    id: reservationId,
                },
            });

            if (!existingReservation) {
                return response.status(404).json({ error: "Reservation not found" });
            }

            // Verifique se o usuário que está tentando excluir a reserva é o proprietário da reserva
            await prisma.tripReservation.delete({
                where: {
                    id: reservationId,
                },
            });

            return response.status(204).send();

        } catch (error) {
            console.error('Error deleting reservation:', error);
            return response.status(500).json({ error: 'An error occurred while deleting the reservation.' });
        }
    }
    
    // Essa rota retorna todos as Trips admin
    async index(request, response) {
        try {
            const tripReservation = await prisma.tripReservation.findMany({
                include: {
                    trip: true, // Inclui os dados da viagem
                    user: true  // Inclui os dados do usuário
                },
                include: {
                    trip: { select: { name: true, location: true, coverImage: true, countryCode: true, } },// Inclui apenas os campos 
                    user: { select: { name: true, email: true } }  // Inclui apenas os campos 
                }
            });

            return response.json(tripReservation);
        } catch (error) {
            console.error("Error retrieving trips:", error);
            return response.status(500).json({ error: "An error occurred while retrieving trips." });
        }
    }
}

export default new TripReservationController();