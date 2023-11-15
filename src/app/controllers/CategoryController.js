import { prismaClient as prisma } from "../../database/prisma";
import * as Yup from 'yup';

class CategoryController {

  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
      });

      // Valide os dados de entrada
      await schema.validate(request.body, { abortEarly: false });

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

      return response.status(201).json(category);
    } catch (error) {
      // Trate os erros de validação do Yup
      if (error instanceof Yup.ValidationError) {
        return response.status(400).json({ error: "Erro de validação", messages: error.errors });
      }

      console.error("Error creating category:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while creating the category." });
    }
  }

  // Endpoint para obter todas as categorias
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

  //obter todas as viagens associadas a uma categoria específica
  async getTripsByCategory(request, response) {
    try {
      const { categoryId } = request.params;

      const existingCategory = await prisma.category.findUnique({
        where: {
          id: categoryId.toString(),
        },
      });

      if (!existingCategory) {
        return response.status(404).json({ error: "Category not found" });
      }

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

  //obter uma categoria com base no seu ID
  async getCategoryById(request, response) {
    try {
      const { id } = request.params;

      const category = await prisma.category.findUnique({
        where: {
          id: id,
        },
      });

      if (!category) {
        return response.status(404).json({ error: "Category not found" });
      }

      return response.json(category);
    } catch (error) {
      console.error("Error getting category by ID:", error);
      return response
        .status(500)
        .json({ error: "An error occurred while getting category by ID." });
    }
  }

  // update categoria existente
  async update(request, response) {
    try {
      const { id } = request.params;
      const { name } = request.body;

      const schema = Yup.object().shape({
        name: Yup.string().required(),
      });

      await schema.validate(request.body, { abortEarly: false });

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
      // Trate os erros de validação do Yup
      if (error instanceof Yup.ValidationError) {
        return response.status(400).json({ error: "Erro de validação", messages: error.errors });
      }

      console.error("Error updating category:", error);
      return response.status(500)
        .json({ error: "An error occurred while updating the category." });
    }
  }
}

export default new CategoryController();
