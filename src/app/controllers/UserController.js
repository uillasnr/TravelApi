import { prismaClient as prisma } from "../../database/prisma";
import bcrypt from "bcrypt";
import * as Yup from 'yup';

class UserController {
    async store(request, response) {

        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                email: Yup.string().email().required(),
                password: Yup.string().required().min(6),
                admin: Yup.boolean(),
            });

            await schema.validate(request.body, { abortEarly: false });

            const { name, email, password, admin } = request.body;

            // Verifique se o usuário já existe no banco de dados
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
            // Trate os erros de validação do Yup
            if (error instanceof Yup.ValidationError) {
                return response.status(400).json({ error: "Erro de validação", messages: error.errors });
            }

            console.error('Error creating user:', error);
            return response.status(500).json({ error: 'An error occurred while creating the user.' });
        }
    }
}

export default new UserController();
