import { prismaClient as prisma } from "../../database/prisma";
//import bodyParser from 'body-parser';
import rawBody from 'raw-body';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16"
});

class PaymentControlle {
    async Payment(request, response) {
        try {
            const { tripId, startDate, endDate, totalPaid } = request.body;

            // Consulta ao banco de dados para obter as informações da viagem com base na tripId
            const trip = await prisma.trip.findUnique({
                where: {
                    id: tripId,
                },
            });

            // Efetue o pagamento usando o Stripe
            const session = await stripe.checkout.sessions.create({
                success_url: "http://localhost:3000/",
                line_items: [
                    {
                        price_data: {
                            currency: "brl",
                            unit_amount: totalPaid * 100,
                            product_data: {
                                name: trip.name,
                                description: trip.description,
                                images: [trip.coverImage],
                            },
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
            });

            // Retorne a URL de redirecionamento para o cliente
            return response.status(200).json({ session: session.id });

        } catch (error) {
            console.error('Error processing payment:', error);
            return response.status(500).json({ error: 'Error occurred while processing the payment.' });
        }
    }



    async stripeWebhookHandler(request, response) {
        const rawBody = require('raw-body');
       // Certifique-se de que o corpo bruto da solicitação seja tratado corretamente
       const buffer = await rawBody(request);
        const sig = request.headers['stripe-signature'];
        // console.log(buffer)

        // Aqui você deve verificar a notificação ou webhook do Stripe para confirmar o pagamento bem-sucedido.
        // Se o pagamento for confirmado com sucesso, crie a reserva no banco de dados.

        // Exemplo de como você pode verificar a notificação do Stripe:
        const event = stripe.webhooks.constructEvent(
            buffer,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET_KEY
        );

        console.log("Essssssssssssssssssssssssssssssssssssssssssssssste eo evento foguete ", event);
        // const sig = request.headers['stripe-signature'];
        // const body = request.rawBody; // Certifique-se de que o corpo bruto da solicitação seja tratado corretamente

        //  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);




        // Verifique se o pagamento foi processado com sucesso
         if (event.type === 'checkout.session.completed') {
            // Obtenha os dados da reserva a partir do evento
            const session = event.data.object;
            const tripId = session.metadata.tripId;
            const userId = session.metadata.userId;
            const guests = session.metadata.guests;
            const startDate = new Date(session.metadata.startDate);
            const endDate = new Date(session.metadata.endDate);
            const totalPaid = session.amount_total / 100;

            // Crie a reserva no banco de dados
            try {
                const newReservation = await prisma.tripReservation.create({
                    data: {
                        trip: { connect: { id: tripId } },
                        user: { connect: { id: userId } },
                        startDate,
                        endDate,
                        guests,
                        totalPaid,
                    },
                });
                console.log(response)
                // Retorne uma resposta JSON com o status 200 e a reserva criada
                return response.status(200).json({ reservation: newReservation });
            } catch (error) {
                // Retorne uma resposta JSON com o status 500 e o erro detalhado
                return response.status(500).json({ error });
            }
        } else {
            // Retorne uma resposta JSON com o status 200
            return response.status(200).json({ message: 'Payment processed.' });
        } 
    }

}

export default new PaymentControlle();


/* try {
    const sig = request.headers['stripe-signature'];
    const body = request.rawBody; // Certifique-se de que o corpo bruto da solicitação seja tratado corretamente

    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      await prisma.tripReservation.create({
        data: {
          tripId: session.metadata.tripId,
          userId: session.metadata.userId,
          startDate: new Date(session.metadata.startDate),
          endDate: new Date(session.metadata.endDate),
          totalPaid: Number(session.metadata.totalPaid),
          guests: Number(session.metadata.guests),
        },
      });
    }

    response.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro no tratamento do webhook do Stripe:', error);
    response.status(500).json({ error: 'Erro ocorreu ao lidar com o webhook do Stripe.' });
  }
}
 */

/* import { prismaClient as prisma } from "../../database/prisma";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16"
});

class PaymentControlle {
    async Payment(request, response) {
        try {
            const { tripId, startDate, endDate, totalPaid } = request.body;

            // Consulta ao banco de dados para obter as informações da viagem com base na tripId
            const trip = await prisma.trip.findUnique({
                where: {
                    id: tripId,
                },
            });

            // Efetue o pagamento usando o Stripe
            const session = await stripe.checkout.sessions.create({
                success_url: "http://localhost:3000/",
                line_items: [
                    {
                        price_data: {
                            currency: "brl",
                            unit_amount: totalPaid * 100,
                            product_data: {
                                name: trip.name,
                                description: trip.description,
                                images: [trip.coverImage],
                            },
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
            });

            // Após o pagamento ser bem-sucedido, crie a reserva no banco de dados
            const userId = request.user.id; 
            const guests = parseInt(request.body.guests, 10);

            const newReservation = await prisma.tripReservation.create({
                data: {
                    trip: { connect: { id: tripId } },
                    user: { connect: { id: userId } },
                    startDate: new Date(startDate), 
                    endDate: new Date(endDate), 
                    guests: guests,
                    totalPaid
                },
            });

            return response.status(200).json({ session: session.id, reservation: newReservation });
        } catch (error) {
            console.error('Error processing payment:', error);
            return response.status(500).json({ error: 'Error occurred while processing the payment.' });
        }
    }
}

export default new PaymentControlle(); */