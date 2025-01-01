'use client';
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ICategory, IDimensionTypes, IDimensions, IStyle, IStyleProcess } from '@models/klm';
import React from 'react';
import { CustomButton } from './CustomButton';
import { openModal } from './modals';

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
    <div className="rounded-box border-base-200 bg-base-300 flex w-full flex-col items-center gap-1 border p-2">
      <div className="flex w-full flex-row items-center justify-between p-1">
        <div className="flex grow flex-row items-center gap-2">
          <div className="badge badge-success badge-md h-fit">Name: {category.categoryName}</div>
          <div className="badge badge-warning badge-md h-fit">Description: {category.description}</div>
        </div>
        <div className="flex flex-row items-center justify-between gap-2">
          <CustomButton
            className="btn-secondary tooltip tooltip-left px-1"
            tooltip="Edit Category"
            onClickAction={() => {
              setIdsState(category._id.toString());
              openModal('editCategory');
            }}
          >
            <PencilSquareIcon className="h-5 w-5" />
          </CustomButton>
          <CustomButton
            className="btn-error tooltip tooltip-left px-1"
            tooltip="Delete Category"
            onClickAction={DelCategory(category._id.toString())}
          >
            <TrashIcon className="h-5 w-5" />
          </CustomButton>
        </div>
      </div>
      <div className="mx-2 flex w-full flex-col gap-1 max-sm:m-0">
        {/* Styles */}
        <details className="collapse-arrow border-base-100 bg-base-200 collapse border shadow-sm">
          <summary className="collapse-title font-medium text-xl">
            <div className="flex flex-row items-center justify-between gap-2">
              <p className="label-text">Styles</p>
              <CustomButton
                className="btn-primary btn-soft"
                tooltip="Add Process"
                onClickAction={() => {
                  setIdsState(category._id.toString(), '', '', '', '');
                  openModal('addProcess');
                }}
              >
                <PlusCircleIcon className="h-5 w-5" />
                Add
              </CustomButton>
            </div>
          </summary>
          <div className="collapse-content bg-base-100 flex flex-col gap-1 pt-2">
            <p className="label label-text-alt w-max">Style Process:</p>
            {category.styleProcess?.map((styleProcess: IStyleProcess, styleProcessIndex: number) => (
              <div key={styleProcessIndex}>
                <details className="collapse-arrow border-base-300 bg-base-200 collapse border-2">
                  <summary className="collapse-title font-medium text-xl">
                    <div className="flex flex-row items-center justify-between">
                      <p className="label label-text">{styleProcess.styleProcessName}</p>
                      <span className="mr-2 flex flex-row gap-1">
                        <CustomButton
                          className="btn-primary tooltip tooltip-left px-1"
                          tooltip="Add Style"
                          onClickAction={() => {
                            setIdsState(category._id.toString(), styleProcess._id.toString(), '', '', '');
                            openModal('addStyle');
                          }}
                        >
                          <PlusCircleIcon className="text-primary-content h-5 w-5" />
                        </CustomButton>
                        <CustomButton
                          className="btn-secondary tooltip tooltip-left px-1"
                          tooltip="Edit Process"
                          onClickAction={() => {
                            setIdsState(category._id.toString(), styleProcess._id.toString());
                            openModal('editProcess');
                          }}
                        >
                          <PencilSquareIcon className="text-secondary-content h-5 w-5" />
                        </CustomButton>
                        <CustomButton
                          className="btn-error tooltip tooltip-left px-1"
                          tooltip="Delete Process"
                          onClickAction={DelProcess(category._id.toString(), styleProcess._id.toString())}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </CustomButton>
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
                              className="btn-secondary tooltip tooltip-left px-1"
                              tooltip="Edit Style"
                              onClickAction={() => {
                                setIdsState(category._id.toString(), styleProcess._id.toString(), style._id.toString());
                                openModal('editStyle');
                              }}
                            >
                              <PencilSquareIcon className="text-secondary-content h-5 w-5" />
                            </CustomButton>
                            <CustomButton
                              className="btn-error tooltip tooltip-left px-1"
                              tooltip="Delete Style"
                              onClickAction={DelStyle(
                                category._id.toString(),
                                styleProcess._id.toString(),
                                style._id.toString(),
                              )}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </CustomButton>
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
          <summary className="collapse-title font-medium text-xl">
            <div className="flex flex-row items-center justify-between gap-2">
              <p className="label-text w-max">Dimensions</p>
              <CustomButton
                className="btn-primary btn-soft"
                tooltip="Add Dimension Type"
                onClickAction={() => {
                  setIdsState(category._id.toString(), '', '', '', '');
                  openModal('addDimensionTypes');
                }}
              >
                <PlusCircleIcon className="h-5 w-5" />
                Add
              </CustomButton>
            </div>
          </summary>
          <div className="collapse-content bg-base-100 flex flex-col gap-1 pt-2">
            <p className="label label-text-alt w-max">Dimension Types:</p>
            {category.dimensionTypes?.map((DimensionType: IDimensionTypes, typIndex: number) => (
              <div key={typIndex}>
                <details className="collapse-arrow border-base-300 bg-base-200 collapse border-2">
                  <summary className="collapse-title font-medium text-xl">
                    <div className="flex flex-row items-center justify-between">
                      <p className="label label-text">{DimensionType.dimensionTypeName}</p>
                      <span className="mr-2 flex flex-row gap-1">
                        <CustomButton
                          className="btn-primary tooltip tooltip-left px-1"
                          tooltip="Add Dimension"
                          onClickAction={() => {
                            setIdsState(category._id.toString(), '', '', DimensionType._id.toString(), '');
                            openModal('addDimension');
                          }}
                        >
                          <PlusCircleIcon className="text-primary-content h-5 w-5" />
                        </CustomButton>
                        <CustomButton
                          className="btn-secondary tooltip tooltip-left px-1"
                          tooltip="Edit Type"
                          onClickAction={() => {
                            setIdsState(category._id.toString(), '', '', DimensionType._id.toString());
                            openModal('editDimensionType');
                          }}
                        >
                          <PencilSquareIcon className="text-secondary-content h-5 w-5" />
                        </CustomButton>
                        <CustomButton
                          className="btn-error tooltip tooltip-left px-1"
                          tooltip="Delete Type"
                          onClickAction={DelDimensionType(category._id.toString(), DimensionType._id.toString())}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </CustomButton>
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
                              className="btn-secondary tooltip tooltip-left px-1"
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
                              <PencilSquareIcon className="text-secondary-content h-5 w-5" />
                            </CustomButton>
                            <CustomButton
                              className="btn-error tooltip tooltip-left px-1"
                              tooltip="Delete Dimension"
                              onClickAction={DelDimension(
                                category._id.toString(),
                                DimensionType._id.toString(),
                                dimension._id.toString(),
                              )}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </CustomButton>
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
  );
};

export default CategoryItem;
