import Category from '../../src/models/Category';
import { createCategory, updateCategory, deleteCategory } from '../../src/controllers/categoryController';
import { BadRequestError, NotFoundError } from '../../src/errors';
import { StatusCodes } from 'http-status-codes';

jest.mock('../../src/models/Category');

describe('Category Controller', () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { userId: 'mockUserId', name: 'mockName', role: 'admin' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a new category successfully', async () => {
      const categoryData = { name: 'New Category' };
      req.body = categoryData;

      const createdCategory = { _id: 'mockCategoryId', ...categoryData };
      (Category.findOne as jest.Mock).mockResolvedValue(null);
      (Category.create as jest.Mock).mockResolvedValue(createdCategory);

      await createCategory(req, res, next);

      expect(Category.findOne).toHaveBeenCalledWith({ name: categoryData.name.trim() });
      expect(Category.create).toHaveBeenCalledWith(categoryData);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        msg: 'Category created',
        category: createdCategory
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if category name already exists', async () => {
      const categoryData = { name: 'Existing Category' };
      req.body = categoryData;

      (Category.findOne as jest.Mock).mockResolvedValue(categoryData);

      await createCategory(req, res, next);

      expect(Category.findOne).toHaveBeenCalledWith({ name: categoryData.name.trim() });
      expect(Category.create).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(next.mock.calls[0][0].message).toBe('Category already exists');
    });

    it('should call next with error on unexpected failure', async () => {
      const categoryData = { name: 'Test Category' };
      req.body = categoryData;
      const mockError = new Error('Database error');
      (Category.findOne as jest.Mock).mockRejectedValue(mockError);

      await createCategory(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      const categoryId = 'mockCategoryId';
      const updateData = { name: 'Updated Category Name' };
      req.params.id = categoryId;
      req.body = updateData;

      const updatedCategory = { _id: categoryId, ...updateData };
      (Category.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedCategory);

      await updateCategory(req, res, next);

      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        categoryId,
        updateData,
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        msg: 'Category updated',
        category: updatedCategory
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if name is missing or empty', async () => {
      req.params.id = 'mockCategoryId';
      req.body = { name: ' ' };

      await expect(updateCategory(req, res, next)).rejects.toThrow(
        new BadRequestError('Please provide a new name for the category')
      );

      expect(Category.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with NotFoundError if category is not found', async () => {
      const categoryId = 'nonExistentId';
      req.params.id = categoryId;
      req.body = { name: 'Valid Name' };

      (Category.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateCategory(req, res, next);

      expect(Category.findByIdAndUpdate).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(next.mock.calls[0][0].message).toBe(`No category with id: ${categoryId}`);
    });

    it('should call next with error on unexpected failure', async () => {
      const categoryId = 'mockCategoryId';
      req.params.id = categoryId;
      req.body = { name: 'Valid Name' };
      const mockError = new Error('Database error');
      (Category.findByIdAndUpdate as jest.Mock).mockRejectedValue(mockError);

      await updateCategory(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      const categoryId = 'mockCategoryId';
      req.params.id = categoryId;

      const deletedCategory = { _id: categoryId, name: 'Deleted Category' };
      (Category.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedCategory);

      await deleteCategory(req, res, next);

      expect(Category.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        msg: 'category deleted',
        data: deletedCategory
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with NotFoundError if category to delete is not found', async () => {
      const categoryId = 'nonExistentId';
      req.params.id = categoryId;

      (Category.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteCategory(req, res, next);

      expect(Category.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(next.mock.calls[0][0].message).toBe(`No category with id :${categoryId}`);
    });

    it('should call next with error on unexpected failure', async () => {
      const categoryId = 'mockCategoryId';
      req.params.id = categoryId;
      const mockError = new Error('Database error');
      (Category.findByIdAndDelete as jest.Mock).mockRejectedValue(mockError);

      await deleteCategory(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
