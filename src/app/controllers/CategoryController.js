import { prismaClient as prisma } from "../../database/prisma";

class CategoryController {
  async store(request, response) {
    try {
      const { name } = request.body;

      // URL base do seu servidor
      const baseUrl = "http://localhost:3001";

      // Processar a imagem de capa primeiro
      const coverImage = request.files.coverImage[0].filename;
      const coverImageUrl = `${baseUrl}/uploads/${coverImage}`;

      const category = await prisma.category.create({
        data: {
          name,
          coverImage: coverImageUrl,
        },
      });

      console.log(category);

      return response.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while creating the category." });
    }
  }

  async index(request, response) {
    try {
      const category = await prisma.category.findMany();

      return response.json(category);
    } catch (error) {
      console.error("Error retrieving category:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while retrieving category." });
    }
  }

  async getTripsByCategory(request, response) {
    try {
      const { categoryId } = request.params;
 
      // Verifica se a categoria com o ID especificado existe
      const existingCategory = await prisma.category.findUnique({
        where: {
          id: categoryId.toString(),
        },
      });
  
      if (!existingCategory) {
        return response.status(404).json({ error: "Category not found" });
      }
  
      // obter as viagens associadas a essa categoria
      const tripsInCategory = await prisma.trip.findMany({
        where: {
          categoryId: categoryId.toString(),
        },
      });
  
      return response.json(tripsInCategory);
    } catch (error) {
      console.error("Error getting trips by category:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while getting trips by category." });
    }
  }
  

  async update(request, response) {
    try {
      const { id } = request.params;
      const { name } = request.body;

      // Verifica se a categoria com o ID especificado existe
      const existingCategory = await prisma.category.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingCategory) {
        return response.status(404).json({ error: "Category not found" });
      }

      const baseUrl = "http://localhost:3001";

      // Atualize o nome e a imagem da categoria
      const updatedCategory = await prisma.category.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          coverImage: `${baseUrl}/uploads/${request.files.coverImage[0].filename}`,
        },
      });

      return response.json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while updating the category." });
    }
  }
}

export default new CategoryController();
