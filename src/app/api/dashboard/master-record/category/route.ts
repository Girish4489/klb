// /src/app/api/dashboard/master-record/category/route.ts
import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { Category } from '@/models/klm';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const handleResponse = (message: string, success: boolean, data?: any): NextResponse => {
      return NextResponse.json({
        message,
        success,
        data,
      });
    };

    // delete
    const handleDeleteCategory = async (reqBody: any): Promise<any> => {
      if (!reqBody.categoryId) throw new Error('Category id not provided');

      // delete the category
      const deletedCategory = await Category.findOneAndDelete({ _id: reqBody.categoryId });

      // return the response
      return handleResponse('Category deleted successfully', true, deletedCategory);
    };

    const handleDeleteProcess = async (reqBody: any): Promise<any> => {
      if (!reqBody.styleProcessId) throw new Error('Style process id is invalid');

      // delete the style process
      const deletedStyleProcess = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        { $pull: { styleProcess: { _id: { $eq: reqBody.styleProcessId } } } },
        { new: true },
      );

      // return the response
      return handleResponse('Style process deleted successfully', true, deletedStyleProcess);
    };

    const handleDeleteStyle = async (reqBody: any): Promise<any> => {
      if (!reqBody.styleProcessId) throw new Error('Style process id is invalid');
      if (!reqBody.styleId) throw new Error('Style id is invalid');
      // delete the style
      const deletedStyle = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId, 'styleProcess._id': reqBody.styleProcessId },
        { $pull: { 'styleProcess.$.styles': { _id: reqBody.styleId } } },
        { new: true },
      );

      // return the response
      return handleResponse('Style deleted successfully', true, deletedStyle);
    };

    const handleDeleteTypeDimension = async function (reqBody: any): Promise<any> {
      if (!reqBody.dimensionTypeId) throw new Error('Dimension type id is invalid');

      // delete the dimension type
      const deletedDimensionType = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        { $pull: { dimension: { _id: { $eq: reqBody.dimensionTypeId } } } },
        { new: true },
      );

      // return the response
      return handleResponse('Dimension type deleted successfully', true, deletedDimensionType);
    };

    const handleDeleteDimension = async function (reqBody: any): Promise<any> {
      if (!reqBody.dimensionTypeId) throw new Error('Dimension type id is invalid');
      if (!reqBody.dimensionId) throw new Error('Dimension id is invalid');

      // delete the dimension
      const deletedDimension = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId, 'dimension._id': reqBody.dimensionTypeId },
        { $pull: { 'dimension.$.dimensionTypes': { _id: reqBody.dimensionId } } },
        { new: true },
      );

      // return the response
      return handleResponse('Dimension deleted successfully', true, deletedDimension);
    };

    // edit
    const handleEditCategory = async function (reqBody: any): Promise<any> {
      if (!reqBody.categoryId) throw new Error('Category id not provided');
      if (!reqBody.categoryName) throw new Error('Category name not provided');
      if (!reqBody.description) throw new Error('Description not provided');

      // check if the category name is already present in the database
      const category = await Category.findOne({ categoryName: reqBody.categoryName });
      if (category?.categoryName === reqBody.categoryName) throw new Error('Category name already exists');

      // update the category
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        { $set: { categoryName: reqBody.categoryName, description: reqBody.description } },
        { new: true },
      );

      // return the response
      return handleResponse('Category updated successfully', true, updatedCategory);
    };

    const handleEditProcess = async function (reqBody: any): Promise<any> {
      if (!reqBody.styleProcessId) throw new Error('Style process id is invalid');
      if (!reqBody.styleProcessName) throw new Error('Style process name not provided');

      // check if the style process name is already present in the database
      const styleProcess = await Category.findOne({
        _id: reqBody.categoryId,
        'styleProcess._id': reqBody.styleProcessId,
        'styleProcess.styleProcessName': reqBody.styleProcessName,
      });
      if (styleProcess) throw new Error('Style process name already exists');

      // update the style process
      const updatedStyleProcess = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId, 'styleProcess._id': reqBody.styleProcessId },
        { $set: { 'styleProcess.$.styleProcessName': reqBody.styleProcessName } },
        { new: true },
      );

      // return the response
      return handleResponse('Style process updated successfully', true, updatedStyleProcess);
    };

    const handleEditStyle = async function (reqBody: any): Promise<any> {
      if (!reqBody.styleProcessId) throw new Error('Style process id is invalid');
      if (!reqBody.styleId) throw new Error('Style id is invalid');
      if (!reqBody.styleName) throw new Error('Style name not provided');

      // check if the style name is already present in the database
      const style = await Category.findOne({
        _id: reqBody.categoryId,
        styleProcess: {
          $elemMatch: {
            _id: reqBody.styleProcessId,
            'styles.styleName': reqBody.styleName,
          },
        },
      });
      if (style) throw new Error('Style name already exists');

      // update the style
      const updatedStyle = await Category.findOneAndUpdate(
        {
          _id: reqBody.categoryId,
          'styleProcess._id': reqBody.styleProcessId,
          'styleProcess.styles._id': reqBody.styleId,
        },
        { $set: { 'styleProcess.$.styles.$[style].styleName': reqBody.styleName } },
        { new: true, arrayFilters: [{ 'style._id': reqBody.styleId }] },
      );

      // return the response
      return handleResponse('Style updated successfully', true, updatedStyle);
    };

    const handleEditTypeDimension = async function (reqBody: any): Promise<any> {
      if (!reqBody.dimensionTypeId) throw new Error('Dimension type id is invalid');
      if (!reqBody.dimensionTypeName) throw new Error('Dimension type name not provided');

      // check if the dimension type name is already present in the database
      const dimensionType = await Category.findOne({
        _id: reqBody.categoryId,
        'dimension._id': reqBody.dimensionTypeId,
        'dimension.dimensionTypeName': reqBody.dimensionTypeName,
      });
      if (dimensionType) throw new Error('Dimension type name already exists');

      // update the dimension type
      const updatedDimensionType = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId, 'dimension._id': reqBody.dimensionTypeId },
        { $set: { 'dimension.$.dimensionTypeName': reqBody.dimensionTypeName } },
        { new: true },
      );

      // return the response
      return handleResponse('Dimension type updated successfully', true, updatedDimensionType);
    };

    const handleEditDimension = async function (reqBody: any): Promise<any> {
      if (!reqBody.dimensionId) throw new Error('Dimension id is invalid');
      if (!reqBody.dimensionName) throw new Error('Dimension name not provided');

      // check if the dimension name is already present in the database
      const dimension = await Category.findOne({
        _id: reqBody.categoryId,
        dimension: {
          $elemMatch: {
            _id: reqBody.dimensionTypeId,
            'dimensionTypes.dimensionName': reqBody.dimensionName,
          },
        },
      });
      if (dimension) throw new Error('Dimension name already exists');

      // update the dimension
      const updatedDimension = await Category.findOneAndUpdate(
        {
          _id: reqBody.categoryId,
          'dimension._id': reqBody.dimensionTypeId,
          'dimension.dimensionTypes._id': reqBody.dimensionId,
        },
        { $set: { 'dimension.$[dimension].dimensionTypes.$[type].dimensionName': reqBody.dimensionName } },
        {
          new: true,
          arrayFilters: [{ 'dimension._id': reqBody.dimensionTypeId }, { 'type._id': reqBody.dimensionId }],
        },
      );

      // return the response
      return handleResponse('Dimension updated successfully', true, updatedDimension);
    };

    // add
    const handleAddCategory = async function (reqBody: any): Promise<any> {
      if (!reqBody.categoryName) throw new Error('Category name not provided');
      if (!reqBody.description) throw new Error('Description not provided');

      // check if the category name is already present in the database
      const existingCategory = await Category.findOne({ categoryName: reqBody.categoryName });
      if (existingCategory) throw new Error('Category name already exists');

      // create a new category
      const newCategory = new Category({
        categoryName: reqBody.categoryName,
        description: reqBody.description,
      });

      // save the new category
      const savedCategory = await newCategory.save();

      // return the response
      return handleResponse('Category created successfully', true, savedCategory);
    };

    const handleAddProcess = async function (reqBody: any): Promise<any> {
      if (!reqBody.styleProcessName) throw new Error('Style process name not provided');

      // check if the style process name is already present in the database
      const styleProcess = await Category.findOne({
        _id: reqBody.categoryId,
        'styleProcess.styleProcessName': reqBody.styleProcessName,
      });
      if (styleProcess) throw new Error('Style process name already exists');

      // create a new style process
      const newStyleProcess = {
        styleProcessName: reqBody.styleProcessName,
        styles: [],
      };

      // save the new style process
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        { $push: { styleProcess: newStyleProcess } },
        { new: true },
      );

      const savedStyleProcess = updatedCategory?.styleProcess?.find(
        (process) => process.styleProcessName === reqBody.styleProcessName,
      );

      // return the response
      return handleResponse('Style process added successfully', true, savedStyleProcess);
    };

    const handleAddStyle = async (reqBody: any): Promise<any> => {
      if (!reqBody.styleName) throw new Error('Style name not provided');

      // check if the style name is already present in the database
      const existingStyle = await Category.findOne({
        _id: reqBody.categoryId,
        styleProcess: {
          $elemMatch: {
            _id: reqBody.styleProcessId,
            'styles.styleName': reqBody.styleName,
          },
        },
        'styleProcess._id': reqBody.styleProcessId,
        'styleProcess.styles.styleName': reqBody.styleName,
      });

      if (existingStyle) throw new Error('Style name already exists');

      // create a new style
      const newStyle = {
        styleName: reqBody.styleName,
      };

      // save the new style
      const updatedStyle = (await Category.findOneAndUpdate(
        {
          _id: reqBody.categoryId,
          'styleProcess._id': reqBody.styleProcessId,
        },
        { $push: { 'styleProcess.$.styles': newStyle } },
        { new: true },
      )) as { styleProcess: { _id: string; styles: { styleName: string }[] }[] };

      const savedStyle = (updatedStyle?.styleProcess || [])
        .find((process) => process._id.toString() === reqBody.styleProcessId)
        ?.styles?.find((style) => style.styleName === reqBody.styleName);

      // return the response
      return handleResponse('Style added successfully', true, savedStyle);
    };

    const handleAddTypeDimension = async function (reqBody: any): Promise<any> {
      if (!reqBody.dimensionTypeName) throw new Error('Dimension type name not provided');

      // check if the dimension type name is already present in the database
      const dimensionType = await Category.findOne({
        _id: reqBody.categoryId,
        'dimension.dimensionTypeName': reqBody.dimensionTypeName,
      });
      if (dimensionType) throw new Error('Dimension type name already exists');

      // create a new dimension type
      const newDimensionType = {
        dimensionTypeName: reqBody.dimensionTypeName,
        dimensionTypes: [],
      };

      // save the new dimension type
      const updatedDimensionType = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        { $push: { dimension: newDimensionType } },
        { new: true },
      );

      const savedDimensionType = updatedDimensionType?.dimension?.find(
        (dimension) => dimension.dimensionTypeName === reqBody.dimensionTypeName,
      );

      // return the response
      return handleResponse('Dimension type added successfully', true, savedDimensionType);
    };

    const handleAddDimension = async function (reqBody: any): Promise<any> {
      if (!reqBody.dimensionTypeId) throw new Error('Dimension type id is invalid');
      if (!reqBody.dimensionName) throw new Error('Dimension name not provided');

      // check if the dimension name is already present in the database
      const dimension = await Category.findOne({
        _id: reqBody.categoryId,
        dimension: {
          $elemMatch: { _id: reqBody.dimensionTypeId, 'dimensionTypes.dimensionName': reqBody.dimensionName },
        },
      });

      if (dimension) throw new Error('Dimension name already exists');

      // create a new dimension
      const newDimension = {
        dimensionName: reqBody.dimensionName,
      };
      // save the new dimension
      const updatedDimension = (await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        { $push: { 'dimension.$[dimension].dimensionTypes': newDimension } },
        { new: true, arrayFilters: [{ 'dimension._id': reqBody.dimensionTypeId }] },
      )) as { dimension: { _id: string; dimensionTypes: { dimensionName: string }[] }[] };

      const savedDimension = (updatedDimension?.dimension || [])
        .find((dimension) => dimension._id.toString() === reqBody.dimensionTypeId)
        ?.dimensionTypes?.find((dimensionType) => dimensionType.dimensionName === reqBody.dimensionName);

      // return the response
      return handleResponse('Dimension added successfully', true, savedDimension);
    };

    const handleRequest = async (reqBody: any): Promise<any> => {
      switch (reqBody.type) {
        case 'addCategory':
          return handleAddCategory(reqBody);
        case 'editCategory':
          return handleEditCategory(reqBody);
        case 'delCategory':
          return handleDeleteCategory(reqBody);
        case 'addProcess':
          return handleAddProcess(reqBody);
        case 'editProcess':
          return handleEditProcess(reqBody);
        case 'delProcess':
          return handleDeleteProcess(reqBody);
        case 'addStyle':
          return handleAddStyle(reqBody);
        case 'editStyle':
          return handleEditStyle(reqBody);
        case 'delStyle':
          return handleDeleteStyle(reqBody);
        case 'addTypeDimension':
          return handleAddTypeDimension(reqBody);
        case 'editTypeDimension':
          return handleEditTypeDimension(reqBody);
        case 'delTypeDimension':
          return handleDeleteTypeDimension(reqBody);
        case 'delDimension':
          return handleDeleteDimension(reqBody);
        case 'addDimension':
          return handleAddDimension(reqBody);
        case 'editDimension':
          return handleEditDimension(reqBody);
        case 'delDimension':
          return handleDeleteDimension(reqBody);
        default:
          throw new Error('Invalid request type');
      }
    };

    const isAdmin = async () => {
      const userId = await getDataFromToken(request);
      const user = await User.findOne({ _id: userId }).select(
        '-password -_id -__v -email -isVerified -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
      );
      return user?.isAdmin;
    };

    if (await isAdmin()) {
      const reqBody = await request.json();
      const result = await handleRequest(reqBody);
      return result;
    } else {
      throw new Error('Only admin can create a category');
    }
  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const categories = await Category.find();
    return NextResponse.json({
      message: 'Categories fetched successfully',
      success: true,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message,
    });
  }
}
