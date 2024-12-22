/* eslint-disable @typescript-eslint/no-explicit-any */
// /src/app/api/dashboard/master-record/category/route.ts
import { connect } from '@/dbConfig/dbConfig';
import { UserTokenData } from '@helpers/getDataFromToken';
import { Category, ICategory, IDimensionTypes, IStyleProcess } from '@models/klm';
import User from '@models/userModel';
import handleError from '@utils/error/handleError';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const tokenData = await UserTokenData.create(request);
    const userId = tokenData.getId();

    const handleResponse = (message: string, success: boolean, data?: any): NextResponse => {
      return NextResponse.json({
        message,
        success,
        data,
      });
    };

    const handlers: { [key: string]: (reqBody: any) => Promise<any> } = {
      addCategory: async (reqBody: any) => {
        if (!reqBody.categoryName) throw new Error('Category name not provided');
        if (!reqBody.description) throw new Error('Description not provided');

        const existingCategory = await Category.findOne({ categoryName: reqBody.categoryName });
        if (existingCategory) throw new Error('Category name already exists');

        const newCategory: ICategory = new Category({
          categoryName: reqBody.categoryName,
          description: reqBody.description,
          styleProcess: [] as ICategory['styleProcess'] | IStyleProcess,
          dimensionTypes: [] as ICategory['dimensionTypes'] | IDimensionTypes[],
        });

        const savedCategory = await newCategory.save();
        return handleResponse('Category created successfully', true, savedCategory);
      },
      editCategory: async (reqBody: any) => {
        if (!reqBody.categoryId) throw new Error('Category id not provided');
        if (!reqBody.categoryName) throw new Error('Category name not provided');
        if (!reqBody.description) throw new Error('Description not provided');

        const category = await Category.findOne({ categoryName: reqBody.categoryName });
        if (category?.categoryName === reqBody.categoryName) throw new Error('Category name already exists');

        const updatedCategory = await Category.findOneAndUpdate(
          { _id: reqBody.categoryId },
          { $set: { categoryName: reqBody.categoryName, description: reqBody.description } },
          { new: true },
        );

        return handleResponse('Category updated successfully', true, updatedCategory);
      },
      delCategory: async (reqBody: any) => {
        if (!reqBody.categoryId) throw new Error('Category id not provided');

        const deletedCategory = await Category.findOneAndDelete({ _id: reqBody.categoryId });
        return handleResponse('Category deleted successfully', true, deletedCategory);
      },
      addProcess: async (reqBody: any) => {
        if (!reqBody.styleProcessName) throw new Error('Style process name not provided');

        const styleProcess = await Category.findOne({
          _id: reqBody.categoryId,
          'styleProcess.styleProcessName': reqBody.styleProcessName,
        });
        if (styleProcess) throw new Error('Style process name already exists');

        const newStyleProcess = {
          styleProcessName: reqBody.styleProcessName,
          styles: [],
        };

        const updatedCategory = await Category.findOneAndUpdate(
          { _id: reqBody.categoryId },
          { $push: { styleProcess: newStyleProcess } },
          { new: true },
        );

        const savedStyleProcess = updatedCategory?.styleProcess?.find(
          (process) => process.styleProcessName === reqBody.styleProcessName,
        );

        return handleResponse('Style process added successfully', true, savedStyleProcess);
      },
      editProcess: async (reqBody: any) => {
        if (!reqBody.styleProcessId) throw new Error('Style process id is invalid');
        if (!reqBody.styleProcessName) throw new Error('Style process name not provided');

        const styleProcess = await Category.findOne({
          _id: reqBody.categoryId,
          'styleProcess._id': reqBody.styleProcessId,
          'styleProcess.styleProcessName': reqBody.styleProcessName,
        });
        if (styleProcess) throw new Error('Style process name already exists');

        const updatedStyleProcess = await Category.findOneAndUpdate(
          { _id: reqBody.categoryId, 'styleProcess._id': reqBody.styleProcessId },
          { $set: { 'styleProcess.$.styleProcessName': reqBody.styleProcessName } },
          { new: true },
        );

        return handleResponse('Style process updated successfully', true, updatedStyleProcess);
      },
      delProcess: async (reqBody: any) => {
        if (!reqBody.styleProcessId) throw new Error('Style process id is invalid');

        const deletedStyleProcess = await Category.findOneAndUpdate(
          { _id: reqBody.categoryId },
          { $pull: { styleProcess: { _id: { $eq: reqBody.styleProcessId } } } },
          { new: true },
        );

        return handleResponse('Style process deleted successfully', true, deletedStyleProcess);
      },
      addStyle: async (reqBody: any) => {
        if (!reqBody.styleName) throw new Error('Style name not provided');
        if (!reqBody.styleProcessId) throw new Error('Style process id not provided');

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

        const newStyle = {
          styleName: reqBody.styleName,
        };

        const updatedStyle = await Category.findOneAndUpdate(
          {
            _id: reqBody.categoryId,
            'styleProcess._id': reqBody.styleProcessId,
          },
          { $push: { 'styleProcess.$.styles': newStyle } },
          { new: true },
        );

        const savedStyle = (updatedStyle?.styleProcess || [])
          .find((process) => process._id.toString() === reqBody.styleProcessId)
          ?.styles?.find((style) => style.styleName === reqBody.styleName);

        return handleResponse('Style added successfully', true, savedStyle);
      },
      editStyle: async (reqBody: any) => {
        if (!reqBody.styleProcessId) throw new Error('Style process id is invalid');
        if (!reqBody.styleId) throw new Error('Style id is invalid');
        if (!reqBody.styleName) throw new Error('Style name not provided');

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

        const updatedStyle = await Category.findOneAndUpdate(
          {
            _id: reqBody.categoryId,
            'styleProcess._id': reqBody.styleProcessId,
            'styleProcess.styles._id': reqBody.styleId,
          },
          { $set: { 'styleProcess.$.styles.$[style].styleName': reqBody.styleName } },
          { new: true, arrayFilters: [{ 'style._id': reqBody.styleId }] },
        );

        return handleResponse('Style updated successfully', true, updatedStyle);
      },
      delStyle: async (reqBody: any) => {
        if (!reqBody.styleProcessId) throw new Error('Style process id is invalid');
        if (!reqBody.styleId) throw new Error('Style id is invalid');

        const deletedStyle = await Category.findOneAndUpdate(
          { _id: reqBody.categoryId, 'styleProcess._id': reqBody.styleProcessId },
          { $pull: { 'styleProcess.$.styles': { _id: reqBody.styleId } } },
          { new: true },
        );

        return handleResponse('Style deleted successfully', true, deletedStyle);
      },
      addDimensionTypes: async (reqBody: any) => {
        if (!reqBody.dimensionTypeName) throw new Error('Dimension type name not provided');

        const dimensionTypes = await Category.findOne({
          _id: reqBody.categoryId,
          'dimensionTypes.dimensionTypeName': reqBody.dimensionTypeName,
        });
        if (dimensionTypes) throw new Error('Dimension type name already exists');

        const newDimensionType: IDimensionTypes = {
          dimensionTypeName: reqBody.dimensionTypeName,
          dimensions: [],
          _id: new mongoose.Types.ObjectId(),
        };

        const updatedDimensionType = await Category.findOneAndUpdate(
          { _id: reqBody.categoryId },
          { $push: { dimensionTypes: newDimensionType } },
          { new: true },
        );

        const savedDimensionType = updatedDimensionType?.dimensionTypes?.find(
          (type) => type.dimensionTypeName === reqBody.dimensionTypeName,
        );

        return handleResponse('Dimension type added successfully', true, savedDimensionType);
      },
      editDimensionType: async (reqBody: any) => {
        if (!reqBody.dimensionTypeId) throw new Error('Dimension type id is invalid');
        if (!reqBody.dimensionTypeName) throw new Error('Dimension type name not provided');

        const dimensionType = await Category.findOne({
          _id: reqBody.categoryId,
          'dimensionTypes._id': reqBody.dimensionTypeId,
          'dimensionTypes.dimensionTypeName': reqBody.dimensionTypeName,
        });
        if (dimensionType) throw new Error('Dimension type name already exists');

        const updatedDimensionType = await Category.findOneAndUpdate(
          { _id: reqBody.categoryId, 'dimensionTypes._id': reqBody.dimensionTypeId },
          { $set: { 'dimensionTypes.$.dimensionTypeName': reqBody.dimensionTypeName } },
          { new: true },
        );

        return handleResponse('Dimension type updated successfully', true, updatedDimensionType);
      },
      delDimensionType: async (reqBody: any) => {
        if (!reqBody.dimensionTypeId) throw new Error('Dimension type id is invalid');

        const deletedDimensionType = await Category.findOneAndUpdate(
          { _id: reqBody.categoryId },
          { $pull: { dimensionTypes: { _id: { $eq: reqBody.dimensionTypeId } } } },
          { new: true },
        );

        return handleResponse('Dimension type deleted successfully', true, deletedDimensionType);
      },
      addDimension: async (reqBody: any) => {
        if (!reqBody.dimensionTypeId) throw new Error('Dimension type id is invalid');
        if (!reqBody.dimensionName) throw new Error('Dimension name not provided');

        const existingDimension = await Category.findOne({
          _id: reqBody.categoryId,
          dimensionTypes: {
            $elemMatch: { _id: reqBody.dimensionTypeId, 'dimensions.dimensionName': reqBody.dimensionName },
          },
          'dimensionTypes._id': reqBody.dimensionTypeId,
          'dimensionTypes.dimensions.dimensionName': reqBody.dimensionName,
        });

        if (existingDimension) throw new Error('Dimension name already exists');

        const newDimension = {
          dimensionName: reqBody.dimensionName,
        };

        const updatedDimension = await Category.findOneAndUpdate(
          {
            _id: reqBody.categoryId,
            'dimensionTypes._id': reqBody.dimensionTypeId,
          },
          { $push: { 'dimensionTypes.$.dimensions': newDimension } },
          { new: true },
        );

        const savedDimension = (updatedDimension?.dimensionTypes || [])
          .find((dimensionType) => dimensionType._id.toString() === reqBody.dimensionTypeId)
          ?.dimensions?.find((dimension) => dimension.dimensionName === reqBody.dimensionName);

        return handleResponse('Dimension added successfully', true, savedDimension);
      },
      editDimension: async (reqBody: any) => {
        if (!reqBody.dimensionId) throw new Error('Dimension id is invalid');
        if (!reqBody.dimensionName) throw new Error('Dimension name not provided');

        const dimension = await Category.findOne({
          _id: reqBody.categoryId,
          dimensionTypes: {
            $elemMatch: {
              _id: reqBody.dimensionTypeId,
              'dimensionTypes.dimensionName': reqBody.dimensionName,
            },
          },
        });
        if (dimension) throw new Error('Dimension name already exists');

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

        return handleResponse('Dimension updated successfully', true, updatedDimension);
      },
      delDimension: async (reqBody: any) => {
        if (!reqBody.dimensionTypeId) throw new Error('Dimension type id is invalid');
        if (!reqBody.dimensionId) throw new Error('Dimension id is invalid');

        const deletedDimension = await Category.findOneAndUpdate(
          { _id: reqBody.categoryId, 'dimension._id': reqBody.dimensionTypeId },
          { $pull: { 'dimension.$.dimensionTypes': { _id: reqBody.dimensionId } } },
          { new: true },
        );

        return handleResponse('Dimension deleted successfully', true, deletedDimension);
      },
    };

    const isAdmin = async () => {
      const user = await User.findOne({ _id: userId }).select(
        '-password -_id -__v -email -isVerified -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
      );
      return user?.isAdmin;
    };

    if (await isAdmin()) {
      const reqBody = await request.json();
      const handler = handlers[reqBody.type];
      if (!handler) throw new Error('Invalid request type');
      return await handler(reqBody);
    } else {
      throw new Error('Only admin can create a category');
    }
  } catch (error) {
    return handleError.api(error);
  }
}

export async function GET(_request: NextRequest) {
  try {
    const categories = await Category.find();
    return NextResponse.json({
      message: 'Categories fetched successfully',
      success: true,
      categories,
    });
  } catch (error) {
    return handleError.api(error);
  }
}
