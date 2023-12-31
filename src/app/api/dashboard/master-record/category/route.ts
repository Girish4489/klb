import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { Category } from '@/models/klm';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    // check if the user is admin
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select(
      '-password -_id -__v -email -isVerified -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry -theme -profileImage',
    );
    if (!user?.isAdmin) throw new Error('Only admin can create a category');

    // access the category name and description from the request body
    const reqBody = await request.json();

    if (reqBody.type === 'editCategory') {
      // check if the category id is provided
      if (!reqBody.categoryId) throw new Error('Category id not provided');
      // check if the category name is provided
      if (!reqBody.categoryName) throw new Error('Category name not provided');
      // check if the description is provided
      // if (!reqBody.description) throw new Error('Description not provided');

      // check if the category name is already present in the database
      const category = await Category.findOne({ categoryName: reqBody.categoryName });
      if (category?.categoryName === reqBody.categoryName) throw new Error('Category name already exists');

      // update the category
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        { categoryName: reqBody.categoryName, description: reqBody.description },
        { new: true },
      );

      // return the response
      return NextResponse.json({
        message: 'Category updated successfully',
        success: true,
        updatedCategory,
      });
    }

    if (reqBody.type === 'editProcess') {
      // check if the style process id is invalid
      if (!reqBody.styleProcessId) throw new Error('Style process id is invalid');
      // check if the style process name is provided
      if (!reqBody.styleProcessName) throw new Error('Style process name not provided');

      // check if the style process name is already present in the database
      const styleProcess = await Category.findOne({
        _id: reqBody.categoryId,
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
      return NextResponse.json({
        message: 'Style process updated successfully',
        success: true,
        updatedStyleProcess,
      });
    }

    if (reqBody.type === 'editStyle') {
      // check if the style id is invalid
      if (!reqBody.styleId) throw new Error('Style id is invalid');
      // check if the style name is provided
      if (!reqBody.styleName) throw new Error('Style name not provided');

      // check if the style name is already present in the database
      const style = await Category.findOne({
        _id: reqBody.categoryId,
        'styleProcess._id': reqBody.styleProcessId,
        'styleProcess.styles.styleName': reqBody.styleName,
      });
      if (style) throw new Error('Style name already exists');
      // update the style
      const updatedStyle = await Category.findOneAndUpdate(
        {
          _id: reqBody.categoryId,
          'styleProcess._id': reqBody.styleProcessId,
          'styleProcess.styles._id': reqBody.styleId,
        },
        { $set: { 'styleProcess.$[process].styles.$[style].styleName': reqBody.styleName } },
        {
          new: true,
          arrayFilters: [{ 'process._id': reqBody.styleProcessId }, { 'style._id': reqBody.styleId }],
        },
      );

      // return the response
      return NextResponse.json({
        message: 'Style updated successfully',
        success: true,
        updatedStyle,
      });
    }

    if (reqBody.type === 'delStyle') {
      // check if the style id is invalid
      if (!reqBody.styleId) throw new Error('Style id is invalid');

      // delete the style
      const deletedStyle = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        {
          $pull: {
            [`styleProcess.${reqBody.styleProcessIndex}.styles`]: { _id: { $eq: reqBody.styleId } },
          },
        },
        { new: true },
      );

      // return the response
      return NextResponse.json({
        message: 'Style deleted successfully',
        success: true,
        deletedStyle,
      });
    }

    if (reqBody.type === 'delProcess') {
      // check if the style process id is invalid
      if (!reqBody.styleProcessId) throw new Error('Style process id is invalid');

      // delete the style process
      const deletedStyleProcess = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        { $pull: { styleProcess: { _id: { $eq: reqBody.styleProcessId } } } },
        { new: true },
      );

      // return the response
      return NextResponse.json({
        message: 'Style process deleted successfully',
        success: true,
        deletedStyleProcess,
      });
    }

    if (reqBody.type === 'delCategory') {
      // check if the category id is provided
      if (!reqBody.categoryId) throw new Error('Category id not provided');

      // delete the category
      const deletedCategory = await Category.findOneAndDelete({ _id: reqBody.categoryId });

      // return the response
      return NextResponse.json({
        message: 'Category deleted successfully',
        success: true,
        deletedCategory,
      });
    }

    if (reqBody.type === 'addStyle') {
      // check if the style name is provided
      if (!reqBody.styleName) throw new Error('Style name not provided');

      // check if the style name is already present in the database
      const style = await Category.findOne({
        _id: reqBody.categoryId,
        [`styleProcess.${reqBody.styleProcessIndex}.styles.styleName`]: reqBody.styleName,
      });
      if (style) throw new Error('Style name already exists');

      // create a new style
      const newStyle = {
        styleName: reqBody.styleName,
      };
      // save the new style
      const savedStyle = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        { $push: { [`styleProcess.${reqBody.styleProcessIndex}.styles`]: newStyle } },
        { new: true },
      );

      // return the response
      return NextResponse.json({
        message: 'Style added successfully',
        success: true,
        savedStyle,
      });
    }

    if (reqBody.type === 'addProcess') {
      // check if the style process name is provided
      if (!reqBody.styleProcessName) throw new Error('Style process name not provided');

      // check if the style process name is already present in the database
      const styleProcess = await Category.findOne({
        _id: reqBody.categoryId,
        'styleProcess.styleProcessName': reqBody.styleProcessName,
      });
      if (styleProcess) throw new Error('Style process name already exists');
      //
      // create a new style process
      const newStyleProcess = {
        styleProcessName: reqBody.styleProcessName,
        styles: [],
      };
      // save the new style process
      const savedStyleProcess = await Category.findOneAndUpdate(
        { _id: reqBody.categoryId },
        { $push: { styleProcess: newStyleProcess } },
        { new: true },
      );

      // return the response
      return NextResponse.json({
        message: 'Style process added successfully',
        success: true,
        savedStyleProcess,
      });
    }

    if (reqBody.type === 'addCategory') {
      // check if the category name is provided
      if (!reqBody.categoryName) throw new Error('Category name not provided');
      // check if the description is provided
      if (!reqBody.description) throw new Error('Description not provided');

      // check if the category name is already present in the database
      const category = await Category.findOne({ categoryName: reqBody.categoryName });
      if (category?.categoryName === reqBody.categoryName) throw new Error('Category name already exists');

      // create a new category
      const newCategory = new Category({
        categoryName: reqBody.categoryName,
        description: reqBody.description,
      });
      // save the new category
      const savedCategory = await newCategory.save();
      // return the response
      return NextResponse.json({
        message: 'Category created successfully',
        success: true,
        savedCategory,
      });
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
