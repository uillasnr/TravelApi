import { prismaClient as prisma } from "../../database/prisma";

class UserController {
    async store(request, response) {
        try {
            const { name, email, password, admin } = request.body;

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password, 
                    admin    
                },
            });

            console.log(user);

            return response.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            return response.status(500).json({ error: 'An error occurred while creating the user.' });
        }
    }
}

export default new UserController();
