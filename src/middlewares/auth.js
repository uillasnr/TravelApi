import Jwt from "jsonwebtoken";

exports.verifyToken = (request, response, next) => {
    const token = request.headers.authorization;

    if (!token) {
        return response.status(401).json({
            message: "No token provided"
        });
    }

    try {
        const newToken = token.replace("Bearer ", "");
        const decodedToken = Jwt.verify(newToken, process.env.TOKEN_KEY);

        // Adicione as informações do usuário decodificadas ao objeto de solicitação
        request.user = decodedToken;


        next();
    } catch (err) {
        return response.status(401).json({
            message: "Invalid Token"
        });
    }
}
