import { Router } from 'express';
import {
    createBook,
    getBooksByTitle,
    getBooksByAuthor,
    getBooksByGenre,
    getAllBooks,
} from "../controllers/book.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.middlewares.js';

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(
    upload.fields([
        {
            name:"bookcover",
            maxCount:1
        }
    ]),
    createBook);
router.route("/title/:title").get(getBooksByTitle);
router.route("/genre/:genre").get(getBooksByGenre);
router.route("/author/:author").get(getBooksByAuthor);
router.route("/all").get(getAllBooks);

export default router