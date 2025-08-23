import express, { Request, Response, NextFunction } from "express";
import { AuthorizePermissions } from "../middleware/role-authorize";
import { unauthorized } from "../middleware/unauthorized";
import { createCourse,updateCourse,deleteCourse } from "../controllers/coursesControllers";
import { createCourseSchema,updateCourseSchema,courseParamsSchema,courseQuerySchema} from "../Schemas/courses.schema";
import { validationBody,validationParams,validationQuery } from "../middleware/validation";
import { uploadSingleFileToCloudinary } from "../middleware/uploadMiddleware";
import { uploadSingleFile } from "../middleware/multerMiddleware";
import { uploadSingleToCloudinary } from "../middleware/cloudinaryMiddleware";

const router = express.Router()

router.post('/', unauthorized, AuthorizePermissions('admin'),uploadSingleFile('image'),validationBody(createCourseSchema),uploadSingleToCloudinary('courses'),createCourse)
router.put('/:id', unauthorized, AuthorizePermissions('admin'),validationParams(courseParamsSchema),validationBody(updateCourseSchema),updateCourse)
router.delete('/:id', unauthorized, AuthorizePermissions('admin'),validationParams(courseParamsSchema),deleteCourse)


export default router