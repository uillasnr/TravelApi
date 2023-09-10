import { prismaClient as prisma } from "../../database/prisma";
import Jwt from "jsonwebtoken";

// global para armazenar a reserva
let globalReservation = null;

class TripReservationController {

    async store(request, response) {
        try {
            const { tripId, startDate, endDate, totalPaid } = request.body;
            const userId = request.user.id; // Agora o objeto 'user' está disponível devido ao middleware de autenticação.
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
            console.error('Erro ao criar reserva:', error);
            return response.status(500).json({ error: 'Ocorreu um erro ao criar a reserva.' });
        }
    }


    async Confirmation(request, response) {
        try {
            // Verifique se os dados da reserva foram confirmados anteriormente
            if (!globalReservation) {
                return response.status(400).json({ error: "Dados da reserva não confirmados" });
            }

            // Exiba os detalhes da reserva temporária
            return response.status(200).json({ reservation: globalReservation });

        } catch (error) {
            console.error('Erro ao buscar detalhes da reserva:', error);
            return response.status(500).json({ error: 'Ocorreu um erro ao buscar detalhes da reserva.' });
        }
    }

 /*    async Reservation(request, response) {

        try {
            const { tripId, startDate, endDate, totalPaid } = request.body;
            const userId = request.user.id; // Agora o objeto 'user' está disponível devido ao middleware de autenticação.
            const guests = parseInt(request.body.guests, 10); // Converte a string para um número inteiro


            const newReservation = await prisma.tripReservation.create({
                data: {
                    trip: { connect: { id: tripId } },
                    user: { connect: { id: userId } },
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    guests: guests,
                    totalPaid
                },
                include: {
                    trip: { select: { name: true, location: true, coverImage: true, countryCode: true, } },// Inclui apenas os campos 
                    user: { select: { name: true, email: true } }  // Inclui apenas os campos 

                }
            });

              // console.log(response)
            // Retorna a reserva criada
            return response.status(200).json({
                reservation: newReservation
            });

        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            return response.status(500).json({ error: 'Ocorreu um erro ao criar a reserva.' });
        }
    }
 */




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
                return response.status(404).json({ error: "Reserva não encontrada" });
            }

            // Retorna a reserva do usuário
            return response.json(reservation);

        } catch (error) {
            console.error('Erro ao obter reserva:', error);
            return response.status(500).json({ error: 'Ocorreu um erro ao obter a reserva.' });
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
                return response.status(404).json({ error: "Reserva não encontrada" });
            }

            // Verifique se o usuário que está tentando excluir a reserva é o proprietário da reserva

           
            await prisma.tripReservation.delete({
                where: {
                    id: reservationId,
                },
            });

            return response.status(204).send();

        } catch (error) {
            console.error('Erro ao excluir reserva:', error);
            return response.status(500).json({ error: 'Ocorreu um erro ao excluir a reserva.' });
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