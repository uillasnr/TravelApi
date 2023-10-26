import { prismaClient as prisma } from "../../database/prisma";

class ControllerTrip {
  async store(request, response) {
    try {
      const {
        name, location, startDate, endDate, pricePerDay, description,
        highlihts, maxGuests, countryCode, recommended, categoryId,
      } = request.body;

      const baseUrl = "http://localhost:3001";

      // Processar a imagem de capa primeiro
      const coverImage = request.files.coverImage[0].filename;
      const coverImageUrl = `${baseUrl}/uploads/${coverImage}`;

      const imageUrls = [];

      // Percorra as imagens adicionais e crie URLs para cada uma delas
      for (let i = 0; i < 3; i++) {
        if (request.files[`imagesUrl_${i}`]) {
          const imageUrl = `${baseUrl}/uploads/${
            request.files[`imagesUrl_${i}`][0].filename
          }`;
          imageUrls.push(imageUrl);
        }
      }
      // Formate as datas para o formato ISO-8601
      const isoStartDate = new Date(startDate).toISOString();
      const isoEndDate = new Date(endDate).toISOString();

      // Converter os destaques em um array se não for um array
      const highlihtsArray = Array.isArray(highlihts)
        ? highlihts: JSON.parse(highlihts);

      const category = await prisma.category.findFirst({
        where: {
          name: categoryId,
        },
      });

      // Crie a viagem no banco de dados usando o Prisma
      const trip = await prisma.trip.create({
        data: {
          name,
          location,
          startDate: isoStartDate,
          endDate: isoEndDate,
          pricePerDay,
          description,
          coverImage: coverImageUrl,
          imagesUrl: imageUrls,
          highlihts: highlihtsArray,
          maxGuests: parseInt(maxGuests),
          countryCode,
          recommended: recommended === "true",
          category: {
            connect: {
              id: category.id,
            },
          },
        },
      });

      console.log(trip);

      return response.status(201).json(trip);
    } catch (error) {
      console.error("Error creating trip:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while creating the trip." });
    }
  }

  //  pesquisa trips
  async findByName(request, response) {
    try {
      const { text, startDate, budget } = request.query;
      console.log("uillas teste",text, startDate, budget );
      if (!text) {
        return response
          .status(400)
          .json({ error: "A search query is required." });
      }

      //  critério de pesquisa com a cláusula OR
      let searchCriteria = {
        OR: [
          { name: { contains: text, mode: "insensitive" } },
          { description: { contains: text, mode: "insensitive" } },
          { location: { contains: text, mode: "insensitive" } },
        ],
      };

      // opcional
      // Adicione a cláusula de pesquisa para startDate, se fornecida e for uma data válida
      if (startDate !== "undefined" && startDate !== "null") {
        searchCriteria = {
          ...searchCriteria,
          AND: [
            ...(searchCriteria.AND || []),
            {
              startDate: {
                gte: new Date(startDate).toISOString(),
              },
            },
          ],
        };
      }

      console.log("startDate:", startDate);
      // opcional
      if (budget) {
        searchCriteria = {
          ...searchCriteria,
          AND: [
            ...(searchCriteria.AND || []),
            {
              pricePerDay: {
                lte: Number(budget),
              },
            },
          ],
        };
      }

      //  consulta com os critérios de pesquisa
      const trips = await prisma.trip.findMany({
        where: searchCriteria,
      });
      console.log(trips);
      return response.json(trips);
    } catch (error) {
      console.error("Error searching trips:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while searching trips." });
    }
  }

  async getTripsInDestiny(request, response) {
    try {
      // Consulta no banco de dados para obter as viagens no Brasil
      const tripsInDestiny = await prisma.trip.findMany({
        where: {
          countryCode: 'BR', 
        },
      });
  
      return response.json(tripsInDestiny);
    } catch (error) {
      console.error("Error retrieving trips in Brazil:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while retrieving trips in Brazil." });
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
      return response
        .status(500)
        .json({ error: "An error occurred while retrieving the trip." });
    }
  }

  // Essa rota retorna todos as Trips
  async index(request, response) {
    try {
      const trips = await prisma.trip.findMany(); // Usar o método findMany para buscar todos os registros

      return response.json(trips);
    } catch (error) {
      console.error("Error retrieving trips:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while retrieving trips." });
    }
  }

  async delete(request, response) {
    try {
      const { Id } = request.params;

      // Verifica se a viagem existe
      const trip = await prisma.trip.findUnique({
        where: {
          id: String(Id),
        },
      });

      if (!trip) {
        return response.status(404).json({ error: "Trip not found" });
      }

      // Exclui registros relacionados na tabela TripReservation
      await prisma.tripReservation.deleteMany({
        where: {
          tripId: String(Id),
        },
      });

      await prisma.trip.delete({
        where: {
          id: String(Id),
        },
      });

      return response.status(204).send();
    } catch (error) {
      console.error("Error deleting trip:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while deleting the trip." });
    }
  }
}

export default new ControllerTrip();
