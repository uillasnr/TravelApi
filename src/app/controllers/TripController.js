// Importações
import { prismaClient as prisma } from "../../database/prisma";
import multer from 'multer';
import multerConfig from "../config/multer"; 

// Controlador para manipular as viagens
class TripController {
    async store(request, response) {
        try {
            const {
                name, location, startDate, endDate, pricePerDay, description,
                highlihts, maxGuests, countryCode, recommended
            } = request.body;

            // Configuração do multer para lidar com o upload das imagens
            const upload = multer(multerConfig).fields([
                { name: 'coverImage', maxCount: 1 },
                { name: 'imagesUrl', maxCount: 2 }
            ]);

            // Executa o middleware de upload
            upload(request, response, async error => {
                if (error) {
                    console.error('Error uploading images:', error);
                    return response.status(500).json({ error: 'An error occurred while uploading images.' });
                }

                // Caminhos dos arquivos de imagem enviados
                const coverImagePaths = request.files['coverImage'].map(file => file.path);
                const imagesUrlPaths = request.files['imagesUrl'].map(file => file.path);

                // Criação da viagem no banco de dados
                const trip = await prisma.trip.create({
                    data: {
                        name,
                        location,
                        startDate,
                        endDate,
                        pricePerDay,
                        description,
                        coverImage: coverImagePaths[0], // Usando apenas o primeiro arquivo de imagem para a capa
                        imagesUrl: imagesUrlPaths,
                        highlihts,
                        maxGuests,
                        countryCode,
                        recommended
                    },
                });

                console.log(trip);

                return response.status(201).json(trip);
            });
        } catch (error) {
            console.error('Error creating trip:', error);
            return response.status(500).json({ error: 'An error occurred while creating the trip.' });
        }
    }
    
    // Listagem de todas as viagens
    async index(request, response) {
        try {
            const trips = await prisma.trip.findMany();
            return response.json(trips);
        } catch (error) {
            console.error("Error retrieving trips:", error);
            return response.status(500).json({ error: "An error occurred while retrieving trips." });
        }
    }
}

export default new TripController();
