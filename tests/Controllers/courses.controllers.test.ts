import { createCourse, updateCourse, deleteCourse } from '../../src/controllers/coursesControllers';
import Course from '../../src/models/Course';
import { BadRequestError, NotFoundError } from '../../src/errors';
import { StatusCodes } from 'http-status-codes';

// Mock the Course model
jest.mock('../../src/models/Course');

describe('Courses Controller', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { userId: 'mockUserId', name: 'mockUser', role: 'admin' }, // Mock req.user for createCourse
    };
    mockRes = {
      status: jest.fn().mockReturnThis(), // Allows chaining .status().json()
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Clear all mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create a new course successfully', async () => {
      const courseData = {
        title: 'New Course Title',
        description: 'This is a new course description.',
        price: 99.99,
        category: '60d5ecf4f3e1c20015a4b7a1', // Example category ID
      };
      mockReq.body = courseData;

      // Mock Course.findOne to return null (course does not exist)
      (Course.findOne as jest.Mock).mockResolvedValue(null);
      // Mock Course.create to return the newly created course
      (Course.create as jest.Mock).mockResolvedValue({
        _id: 'mockCourseId123',
        ...courseData,
        instructor: mockReq.user.userId,
      });

      await createCourse(mockReq, mockRes, mockNext);

      expect(Course.findOne).toHaveBeenCalledWith({ title: courseData.title.trim() });
      expect(Course.create).toHaveBeenCalledWith({
        ...courseData,
        instructor: mockReq.user.userId,
      });
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        msg: 'Course created',
        data: expect.objectContaining({ _id: 'mockCourseId123', title: courseData.title }),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if course title already exists', async () => {
      const courseData = { title: 'Existing Course', description: '...', price: 50, category: 'cat1' };
      mockReq.body = courseData;

      // Mock Course.findOne to return an existing course
      (Course.findOne as jest.Mock).mockResolvedValue(courseData);

      await createCourse(mockReq, mockRes, mockNext);

      expect(Course.findOne).toHaveBeenCalledWith({ title: courseData.title.trim() });
      expect(Course.create).not.toHaveBeenCalled(); // Should not attempt to create
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(mockNext.mock.calls[0][0].message).toBe('Course already exists');
    });

    it('should call next with error if an unexpected error occurs', async () => {
      mockReq.body = { title: 'Test Course', description: '...', price: 10, category: 'cat1' };
      const mockError = new Error('Database connection failed');
      (Course.findOne as jest.Mock).mockRejectedValue(mockError);

      await createCourse(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateCourse', () => {
    it('should update an existing course successfully', async () => {
      const courseId = 'mockCourseId123';
      const updateData = { title: 'Updated Course Title', price: 120.50 };
      mockReq.params.id = courseId;
      mockReq.body = updateData;

      (Course.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: courseId, ...updateData });

      await updateCourse(mockReq, mockRes, mockNext);

      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
        courseId,
        updateData,
        { new: true, runValidators: true }
      );
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        msg: 'Course updated',
        updatedCourse: expect.objectContaining({ _id: courseId, title: updateData.title }),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if title is missing or empty', async () => {
      const courseId = 'mockCourseId123';
      mockReq.params.id = courseId;

      // Test with empty title string
      mockReq.body = { title: '' };
      await updateCourse(mockReq, mockRes, mockNext);
      expect(Course.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(mockNext.mock.calls[0][0].message).toBe('Please provide valid course name');

      // Clear mock and test with title as only spaces
      mockNext.mockClear();
      mockReq.body = { title: '   ' };
      await updateCourse(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(mockNext.mock.calls[0][0].message).toBe('Please provide valid course name');

      // Clear mock and test with no title field in body
      mockNext.mockClear();
      mockReq.body = { description: 'some description' };
      await updateCourse(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(mockNext.mock.calls[0][0].message).toBe('Please provide valid course name');
    });

    it('should throw NotFoundError if course is not found', async () => {
      const courseId = 'nonExistentCourseId';
      mockReq.params.id = courseId;
      mockReq.body = { title: 'Valid Title' };

      (Course.findByIdAndUpdate as jest.Mock).mockResolvedValue(null); // Simulate not found

      await updateCourse(mockReq, mockRes, mockNext);

      expect(Course.findByIdAndUpdate).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(mockNext.mock.calls[0][0].message).toBe('Course not found');
    });

    it('should call next with error if an unexpected error occurs', async () => {
      mockReq.params.id = 'courseId123';
      mockReq.body = { title: 'Valid Title' };
      const mockError = new Error('Network error');
      (Course.findByIdAndUpdate as jest.Mock).mockRejectedValue(mockError);

      await updateCourse(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course successfully', async () => {
      const courseId = 'mockCourseId123';
      mockReq.params.id = courseId;

      (Course.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: courseId, title: 'Deleted Course' });

      await deleteCourse(mockReq, mockRes, mockNext);

      expect(Course.findByIdAndDelete).toHaveBeenCalledWith(courseId);
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        msg: 'Course deleted successfully',
        data: expect.objectContaining({ _id: courseId }),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if course to delete is not found', async () => {
      const courseId = 'nonExistentCourseId';
      mockReq.params.id = courseId;

      (Course.findByIdAndDelete as jest.Mock).mockResolvedValue(null); // Simulate not found

      await deleteCourse(mockReq, mockRes, mockNext);

      expect(Course.findByIdAndDelete).toHaveBeenCalledWith(courseId);
      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(mockNext.mock.calls[0][0].message).toBe(`No course found with id : ${courseId}`);
    });

    it('should call next with error if an unexpected error occurs', async () => {
      mockReq.params.id = 'courseId123';
      const mockError = new Error('Database error');
      (Course.findByIdAndDelete as jest.Mock).mockRejectedValue(mockError);

      await deleteCourse(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
