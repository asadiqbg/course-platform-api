import express, { Request, Response, NextFunction } from "express";
import { AuthorizePermissions } from "../middleware/role-authorize";
import { unauthorized } from "../middleware/unauthorized";
import { createCourse,updateCourse,deleteCourse } from "../controllers/coursesControllers";
import { createCourseSchema,updateCourseSchema,courseParamsSchema,courseQuerySchema} from "../Schemas/courses.schema";
import { validationBody,validationParams,validationQuery } from "../middleware/validation";
import { uploadSingleFileToCloudinary } from "../middleware/uploadMiddleware";

const router = express.Router()

router.post('/', unauthorized, AuthorizePermissions('admin'),uploadSingleFileToCloudinary('image','courses'),validationBody(createCourseSchema),createCourse)
router.put('/:id', unauthorized, AuthorizePermissions('admin'),validationParams(courseParamsSchema),validationBody(updateCourseSchema),updateCourse)
router.delete('/:id', unauthorized, AuthorizePermissions('admin'),validationParams(courseParamsSchema),deleteCourse)


export default router