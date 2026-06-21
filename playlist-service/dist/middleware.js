import jwt from "jsonwebtoken";
export const isAuth = (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(403).json({
                message: "Please Login",
            });
            return;
        }
        const decodedData = jwt.verify(token, process.env.JWT_SEC);
        req.user = decodedData._id;
        next();
    }
    catch (error) {
        res.status(500).json({
            message: "Invalid Token",
        });
        return;
    }
};
import multer from "multer";
const storage = multer.memoryStorage();
export const uploadFile = multer({
    storage,
}).single("file");
