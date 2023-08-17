// Configuração do multer para o upload de imagens
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '..', '..', 'uploads')); // Alterado o caminho para salvar no diretório correto
    },
    filename: (req, file, cb) => {
        const uniqueFileName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueFileName);
    }
});

const upload = multer({ storage });

export default upload;
