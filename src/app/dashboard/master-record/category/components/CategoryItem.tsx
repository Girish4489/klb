'use client';
import { CustomButton } from '@dashboard/master-record/category/components/CustomButton';
import { openModal } from '@dashboard/master-record/category/components/modals';
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ICategory, IDimensionTypes, IDimensions, IStyle, IStyleProcess } from '@models/klm';
import React from 'react';

interface CategoryItemProps {
  category: ICategory;
  setIdsState: (
    catId?: string,
    styleProcessId?: string,
    styleId?: string,
    dimensionTypeId?: string,
    dimensionId?: string,
  ) => void;
  DelCategory: (id: string) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
  DelProcess: (
    id: string,
    styleProcessId: string,
  ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
  DelStyle: (
    id: string,
    styleProcessId: string,
    styleId: string,
  ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
  DelDimensionType: (
    id: string,
    dimensionTypeId: string,
  ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
  DelDimension: (
    id: string,
    dimensionTypeId: string,
    dimensionId: string,
  ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  setIdsState,
  DelCategory,
  DelProcess,
  DelStyle,
  DelDimensionType,
  DelDimension,
}) => {
  return (
    <span className="w-full">
      <div className="rounded-box border-base-300 bg-base-200 w-full border">
        <div className="flex w-full flex-row justify-between p-2 max-sm:w-full max-sm:max-w-full max-sm:flex-wrap max-sm:gap-2 max-sm:p-0">
          <div className="rounded-box border-base-200 bg-base-300 flex w-full flex-col items-center gap-2 border p-2 max-sm:flex-col max-sm:items-start max-sm:p-2">
            <div className="flex w-full flex-row px-2">
              <span className="w-wax flex grow flex-row items-center gap-2 max-sm:w-full">
                <div className="badge badge-success badge-md flex flex-row flex-wrap gap-1 rounded-lg font-bold max-sm:flex-col">
                  Name:
                  <span>{category.categoryName}</span>
                </div>
                <div className="badge badge-warning badge-md flex flex-row flex-wrap gap-1 rounded-lg font-bold max-sm:flex-col">
                  Description:
                  <span>{category.description}</span>
                </div>
              </span>
              <div className="ml-1 flex flex-row items-center justify-center gap-2 max-sm:mb-2 max-sm:mr-2 max-sm:w-fit max-sm:flex-row max-sm:justify-end max-sm:pr-2">
                <CustomButton
                  className="btn-secondary btn-sm tooltip tooltip-left px-1"
                  tooltip="Edit Category"
                  onClickAction={() => {
                    setIdsState(category._id.toString());
                    openModal('editCategory');
                  }}
                >
                  <PencilSquareIcon className="text-secondary-content h-6 w-6" />
                </CustomButton>
                <button
                  className="btn btn-error btn-sm tooltip tooltip-left px-1"
                  data-tip="Delete Category"
                  onClick={DelCategory(category._id.toString())}
                >
                  <TrashIcon className="text-error-content h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="mx-2 flex w-full flex-col gap-1 max-sm:m-0">
              {/* Styles */}
              <details className="collapse-arrow border-base-100 bg-base-200 collapse border shadow-sm">
                <summary className="collapse-title text-xl font-medium">
                  <div className="flex flex-row items-center justify-between gap-2">
                    <p className="label-text w-max">Styles</p>
                    <CustomButton
                      className="btn btn-primary btn-sm tooltip tooltip-left px-1 max-sm:p-2"
                      tooltip="Add Process"
                      onClickAction={() => {
                        setIdsState(category._id.toString(), '', '', '', '');
                        openModal('addProcess');
                      }}
                    >
                      <PlusCircleIcon className="text-primary-content h-6 w-6 max-sm:hidden" />
                      <span className="hidden max-sm:flex">Add</span>
                    </CustomButton>
                  </div>
                </summary>
                <div className="collapse-content bg-base-100 flex flex-col gap-1 pt-2">
                  <p className="label label-text-alt w-max">Style Process:</p>
                  {category.styleProcess?.map((styleProcess: IStyleProcess, styleProcessIndex: number) => (
                    <div key={styleProcessIndex}>
                      <details className="collapse-arrow border-base-300 bg-base-200 collapse border-2">
                        <summary className="collapse-title text-xl font-medium">
                          <div className="flex flex-row items-center justify-between">
                            <p className="label label-text">{styleProcess.styleProcessName}</p>
                            <span className="mr-2 flex flex-row gap-1">
                              <CustomButton
                                className="btn btn-primary btn-sm tooltip tooltip-left px-1"
                                tooltip="Add Style"
                                onClickAction={() => {
                                  setIdsState(category._id.toString(), styleProcess._id.toString(), '', '', '');
                                  openModal('addStyle');
                                }}
                              >
                                <PlusCircleIcon className="text-primary-content h-6 w-6" />
                              </CustomButton>
                              <CustomButton
                                className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                tooltip="Edit Process"
                                onClickAction={() => {
                                  setIdsState(category._id.toString(), styleProcess._id.toString());
                                  openModal('editProcess');
                                }}
                              >
                                <PencilSquareIcon className="text-secondary-content h-6 w-6" />
                              </CustomButton>
                              <button
                                className="btn btn-error btn-sm tooltip tooltip-left px-1"
                                data-tip="Delete Process"
                                onClick={DelProcess(category._id.toString(), styleProcess._id.toString())}
                              >
                                <TrashIcon className="text-error-content h-6 w-6" />
                              </button>
                            </span>
                          </div>
                        </summary>
                        <div className="collapse-content transform transition-all">
                          <div className="rounded-box bg-base-300 m-1 flex max-h-56 flex-col gap-2 overflow-auto p-2">
                            <p className="label label-text-alt w-max">Styles:</p>
                            {styleProcess.styles.map((style: IStyle, styleIndex: number) => (
                              <div key={styleIndex} className="flex flex-row items-center justify-between">
                                <p className="label label-text">{style.styleName}</p>
                                <span className="mr-2 flex flex-row gap-1">
                                  <CustomButton
                                    className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                    tooltip="Edit Style"
                                    onClickAction={() => {
                                      setIdsState(
                                        category._id.toString(),
                                        styleProcess._id.toString(),
                                        style._id.toString(),
                                      );
                                      openModal('editStyle');
                                    }}
                                  >
                                    <PencilSquareIcon className="text-secondary-content h-6 w-6" />
                                  </CustomButton>
                                  <button
                                    className="btn btn-error btn-sm tooltip tooltip-left px-1"
                                    data-tip="Delete Style"
                                    onClick={DelStyle(
                                      category._id.toString(),
                                      styleProcess._id.toString(),
                                      style._id.toString(),
                                    )}
                                  >
                                    <TrashIcon className="text-error-content h-6 w-6" />
                                  </button>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </details>
              {/* Dimensions */}
              <details className="collapse-arrow border-base-100 bg-base-200 collapse border shadow-sm">
                <summary className="collapse-title text-xl font-medium">
                  <div className="flex flex-row items-center justify-between gap-2">
                    <p className="label-text w-max">Dimensions</p>
                    <CustomButton
                      className="btn btn-primary btn-sm tooltip tooltip-left px-1 max-sm:p-2"
                      tooltip="Add Dimension Type"
                      onClickAction={() => {
                        setIdsState(category._id.toString(), '', '', '', '');
                        openModal('addDimensionTypes');
                      }}
                    >
                      <PlusCircleIcon className="text-primary-content h-6 w-6 max-sm:hidden" />
                      <span className="hidden max-sm:flex">Add</span>
                    </CustomButton>
                  </div>
                </summary>
                <div className="collapse-content bg-base-100 flex flex-col gap-1 pt-2">
                  <p className="label label-text-alt w-max">Dimension Types:</p>
                  {category.dimensionTypes?.map((DimensionType: IDimensionTypes, typIndex: number) => (
                    <div key={typIndex}>
                      <details className="collapse-arrow border-base-300 bg-base-200 collapse border-2">
                        <summary className="collapse-title text-xl font-medium">
                          <div className="flex flex-row items-center justify-between">
                            <p className="label label-text">{DimensionType.dimensionTypeName}</p>
                            <span className="mr-2 flex flex-row gap-1">
                              <CustomButton
                                className="btn btn-primary btn-sm tooltip tooltip-left px-1"
                                tooltip="Add Dimension"
                                onClickAction={() => {
                                  setIdsState(category._id.toString(), '', '', DimensionType._id.toString(), '');
                                  openModal('addDimension');
                                }}
                              >
                                <PlusCircleIcon className="text-primary-content h-6 w-6" />
                              </CustomButton>
                              <CustomButton
                                className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                tooltip="Edit Type"
                                onClickAction={() => {
                                  setIdsState(category._id.toString(), '', '', DimensionType._id.toString());
                                  openModal('editDimensionType');
                                }}
                              >
                                <PencilSquareIcon className="text-secondary-content h-6 w-6" />
                              </CustomButton>
                              <button
                                className="btn btn-error btn-sm tooltip tooltip-left px-1"
                                data-tip="Delete Type"
                                onClick={DelDimensionType(category._id.toString(), DimensionType._id.toString())}
                              >
                                <TrashIcon className="text-error-content h-6 w-6" />
                              </button>
                            </span>
                          </div>
                        </summary>
                        <div className="collapse-content transform transition-all">
                          <div className="rounded-box bg-base-300 m-1 flex max-h-56 flex-col gap-2 overflow-auto p-2">
                            <p className="label label-text-alt w-max">Dimensions:</p>
                            {DimensionType.dimensions?.map((dimension: IDimensions, dimensionIndex: number) => (
                              <div key={dimensionIndex} className="flex flex-row items-center justify-between">
                                <p className="label label-text">{dimension.dimensionName}</p>
                                <span className="mr-2 flex flex-row gap-1">
                                  <CustomButton
                                    className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                    tooltip="Edit Dimension"
                                    onClickAction={() => {
                                      setIdsState(
                                        category._id.toString(),
                                        '',
                                        '',
                                        DimensionType._id.toString(),
                                        dimension._id.toString(),
                                      );
                                      openModal('editDimension');
                                    }}
                                  >
                                    <PencilSquareIcon className="text-secondary-content h-6 w-6" />
                                  </CustomButton>
                                  <button
                                    className="btn btn-error btn-sm tooltip tooltip-left px-1"
                                    data-tip="Delete Dimension"
                                    onClick={DelDimension(
                                      category._id.toString(),
                                      DimensionType._id.toString(),
                                      dimension._id.toString(),
                                    )}
                                  >
                                    <TrashIcon className="text-error-content h-6 w-6" />
                                  </button>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </span>
  );
};

export default CategoryItem;
