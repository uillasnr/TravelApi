import { prismaClient as prisma } from "../../database/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as Yup from 'yup';

class AuthController {
    async store(request, response) {

        try {
            const schema = Yup.object().shape({
                email: Yup.string().email().required(),
                password: Yup.string().required(),
            });

            // Valide os dados de entrada
            await schema.validate(request.body, { abortEarly: false });

            const { email, password } = request.body;

            // Procura um usuário com o email fornecido no banco de dados
            const user = await prisma.user.findFirst({
                where: {
                    email
                }
            });

            // Verifica se o usuário foi encontrado
            if (!user) {
                return response.status(400).json({ error: "User not found" });
            }

            // Compara a senha fornecida com a senha armazenada no banco de dados
            if (user && bcrypt.compareSync(password, user.password)) {
                // Gera um token JWT com informações do usuário e uma chave secreta
                const token = jwt.sign(
                    {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        admin: user.admin
                    },
                    process.env.TOKEN_KEY,
                    { expiresIn: "1D" }
                );

                return response.status(200).json({ 
                    user: { id: user.id, name: user.name, email: user.email, admin: user.admin }, token
                 });

            } else {
                return response.status(401).json({ error: "Incorrect password" });
            }

        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                return response.status(400).json({ error: "Validation error", messages: error.errors });
            }

            return response.status(500).json({ error: "Internal server error" });
        }
    }
}

export default new AuthController();
