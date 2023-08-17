import { prismaClient as prisma } from "../../database/prisma";
import bcrypt from "bcrypt"

class UserController {
    async store(request, response) {
        try {
            const { name, email, password, admin } = request.body;

            //função para verificar se o usuario existe no banco de dados
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (existingUser) {
                return response.status(400).json({ error: 'A user with the same email already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    admin
                },
            });

            return response.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            return response.status(500).json({ error: 'An error occurred while creating the user.' });
        }
    }
}

export default new UserController();
