const Class = require("../models/Class");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createClass = async (req, res) => {
  const { className, students, time } = req.body;
  if (!className || !students || !time) {
    throw new CustomError.BadRequestError(
      "ClassName, students and time fields are required!"
    );
  }
  req.body.teacher = req.user.userId;
  const classInfo = await Class.create(req.body);
  res.status(StatusCodes.CREATED).json({ status: "Success", class: classInfo });
};

const getAllClasses = async (req, res) => {
  const classes = await Class.find()
    .populate({
      path: "students",
      select: "_id name",
    })
    .populate({ path: "teacher", select: "_id name" });

  if (!classes) {
    throw new CustomError.NotFoundError("No classes found!");
  }
  res
    .status(StatusCodes.OK)
    .json({ status: "Success!", classes, count: classes.length });
};

const getSingleClass = async (req, res) => {
  const { id: classId } = req.params;
  const singleClass = await Class.findOne({ _id: classId })
    .populate({
      path: "students",
      select: "_id name",
    })
    .populate({ path: "teacher", select: "_id name" });

  if (!singleClass) {
    throw new CustomError.NotFoundError(
      `Couldn't find class with id ${classId}`
    );
  }

  if (
    singleClass.students.some(
      (item) => item._id.toString() === req.user.userId
    ) ||
    singleClass.teacher._id.toString() === req.user.userId
  ) {
    return res
      .status(StatusCodes.OK)
      .json({ status: "Success!", class: singleClass });
  }

  throw new CustomError.UnauthorizedError(
    "Unauthorized to access this resource!"
  );
};

const updateClass = async (req, res) => {
  const { className, students, time } = req.body;
  const { id: classId } = req.params;

  const updateClass = await Class.findOne({ _id: classId });

  if (!updateClass) {
    throw new CustomError.NotFoundError(
      `Couldn't find class with id ${classId}`
    );
  }

  if (updateClass.teacher.toString() !== req.user.userId) {
    throw new CustomError.UnauthorizedError(
      "Unauthorized to access this resource!"
    );
  }

  if (!className || !students) {
    throw new CustomError.BadRequestError(
      "ClassName, students and time fields are required!"
    );
  }

  updateClass.className = className;
  updateClass.students = students;
  updateClass.time = time;
  await updateClass.save();

  res.status(StatusCodes.OK).json({ status: "Success", class: updateClass });
};

const deleteClass = async (req, res) => {
  const { id: classId } = req.params;

  const deleteClass = await Class.findOne({ _id: classId });

  if (!deleteClass) {
    throw new CustomError.NotFoundError(
      `Couldn't find class with id ${classId}`
    );
  }

  if (deleteClass.teacher.toString() !== req.user.userId) {
    throw new CustomError.UnauthorizedError(
      "Unauthorized to accesss this resource!"
    );
  }

  await deleteClass.remove();
  res
    .status(StatusCodes.OK)
    .json({ status: "Success!", msg: "Class removed!" });
};

const showMyClassesTeacher = async (req, res) => {
  const myClassesTeacher = await Class.find({ teacher: req.user.userId })
    .populate({
      path: "teacher",
      select: "_id name",
    })
    .populate({ path: "students", select: "_id name" });

  if (myClassesTeacher) {
    return res.status(StatusCodes.OK).json({
      status: "Success!",
      myClasses: myClassesTeacher,
      count: myClassesTeacher.length,
    });
  }

  throw new CustomError.NotFoundError("You don't have any classes yet!");
};

const showMyClassesStudent = async (req, res) => {
  const allClasses = await Class.find();

  const item = allClasses.filter((doc) =>
    doc.students.filter((item) => item.toString === req.user.userId)
  );

  const item2 = item.map((item) => item.students.toString());

  const myClassesStudent = await Class.find({ students: item2[0] })
    .populate({
      path: "teacher",
      select: "_id name",
    })
    .populate({ path: "students", select: "_id name" });

  if (myClassesStudent.length < 1) {
    throw new CustomError.NotFoundError("You don't have any classes yet!");
  }

  res.status(StatusCodes.OK).json({
    status: "Success!",
    myClasses: myClassesStudent,
    count: myClassesStudent.length,
  });
};

module.exports = {
  createClass,
  getAllClasses,
  getSingleClass,
  updateClass,
  deleteClass,
  showMyClassesTeacher,
  showMyClassesStudent,
};
