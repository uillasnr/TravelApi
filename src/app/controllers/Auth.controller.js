import { prismaClient as prisma } from "../../database/prisma";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

class AuthController {
    async store(request, response) {
        try {
            const { email, password } = request.body;

            // Verifica se o email e a senha foram fornecidos no corpo da requisição
            if (!(email && password)) {
                return response.status(400).json({ error: "Usuário e senha obrigatórios" });
            }

            // Procura um usuário com o email fornecido no banco de dados
            const user = await prisma.user.findFirst({
                where: {
                    email
                }
            });

            // Verifica se o usuário foi encontrado
            if (!user) {
                return response.status(400).json({ error: "Usuário não encontrado" });
            }

            // Compara a senha fornecida com a senha armazenada no banco de dados
            if (user && bcrypt.compareSync(password, user.password)) {
                // Gera um token JWT com informações do usuário e uma chave secreta
                const token = Jwt.sign(
                    {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        admin: user.admin
                    },
                    process.env.Token_key,
                    { expiresIn: "1D" }
                );

                // Retorna o usuário (sem a senha) e o token na resposta
                return response.status(200).json({ user: { id: user.id, name: user.name, email: user.email, admin: user.admin }, token });
            } else {
                // Retorna um erro se a senha estiver incorreta
                return response.status(401).json({ error: "Senha incorreta" });
            }

        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}

export default new AuthController();
