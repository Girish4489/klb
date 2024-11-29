import { FormModal } from '@/app/dashboard/master-record/category/components/modals';
import React from 'react';

interface FormModalsProps {
  AddCategory: (e: { category: string; description: string }) => Promise<void>;
  AddProcess: (e: { styleProcess: string }) => Promise<void>;
  EditProcess: (e: { processName: string }) => Promise<void>;
  AddStyle: (e: { catStyle: string }) => Promise<void>;
  EditStyles: (e: { styleName: string }) => Promise<void>;
  addDimensionTypes: (e: { dimensionType: string }) => Promise<void>;
  EditDimensionType: (e: { dimensionTypeName: string }) => Promise<void>;
  AddDimension: (e: { dimension: string }) => Promise<string | void>;
  EditDimension: (e: { dimension: string }) => Promise<void>;
  EditCategory: (e: { category: string; description: string }) => Promise<void>;
}

export const FormModals: React.FC<FormModalsProps> = ({
  AddCategory,
  AddProcess,
  EditProcess,
  AddStyle,
  EditStyles,
  addDimensionTypes,
  EditDimensionType,
  AddDimension,
  EditDimension,
  EditCategory,
}) => {
  return (
    <span>
      <FormModal
        id="editCategory"
        title="Edit Category"
        onSubmit={(formData) => EditCategory(formData as { category: string; description: string })}
        buttonName="Edit"
        fields={[
          { label: 'Category', name: 'category', type: 'text', required: true, placeholder: 'Category Name' },
          { label: 'Description', name: 'description', type: 'text', placeholder: 'Description Name' },
        ]}
        onClose={() => {}}
      />
      <FormModal
        id="addProcess"
        title="Add Process"
        onSubmit={(formData) => AddProcess(formData as { styleProcess: string })}
        buttonName="Add"
        fields={[
          {
            label: 'Style Process',
            name: 'styleProcess',
            type: 'text',
            required: true,
            placeholder: 'Style Process',
          },
        ]}
        onClose={() => {}}
      />
      <FormModal
        id="editProcess"
        title="Edit Process"
        onSubmit={(formData) => EditProcess(formData as { processName: string })}
        buttonName="Edit"
        fields={[
          {
            label: 'Style Process',
            name: 'processName',
            type: 'text',
            required: true,
            placeholder: 'Style Process',
          },
        ]}
        onClose={() => {}}
      />
      <FormModal
        id="addStyle"
        title="Add Style"
        onSubmit={(formData) => AddStyle(formData as { catStyle: string })}
        buttonName="Add"
        fields={[
          {
            label: 'Style',
            name: 'catStyle',
            type: 'text',
            required: true,
            placeholder: 'Style',
          },
        ]}
        onClose={() => {}}
      />
      <FormModal
        id="editStyle"
        title="Edit Style"
        onSubmit={(formData) => EditStyles({ styleName: formData.styleName })}
        buttonName="Edit"
        fields={[
          {
            label: 'Style',
            name: 'styleName',
            type: 'text',
            required: true,
            placeholder: 'Style',
          },
        ]}
        onClose={() => {}}
      />
      <FormModal
        id="addDimensionTypes"
        title="Add Dimension Type"
        onSubmit={(formData) => addDimensionTypes({ dimensionType: formData.dimensionType })}
        buttonName="Add"
        fields={[
          {
            label: 'Dimension Type',
            name: 'dimensionType',
            type: 'text',
            required: true,
            placeholder: 'Dimension Type',
          },
        ]}
        onClose={() => {}}
      />
      <FormModal
        id="editDimensionType"
        title="Edit Dimension Type"
        onSubmit={(formData) => EditDimensionType({ dimensionTypeName: formData.dimensionTypeName })}
        buttonName="Edit"
        fields={[
          {
            label: 'Dimension Type',
            name: 'dimensionTypeName',
            type: 'text',
            required: true,
            placeholder: 'Dimension Type',
          },
        ]}
        onClose={() => {}}
      />
      <FormModal
        id="addDimension"
        title="Add Dimension"
        onSubmit={(formData) => AddDimension({ dimension: formData.dimension })}
        buttonName="Add"
        fields={[
          {
            label: 'Dimension',
            name: 'dimension',
            type: 'text',
            required: true,
            placeholder: 'Dimension',
          },
        ]}
        onClose={() => {}}
      />
      <FormModal
        id="editDimension"
        title="Edit Dimension"
        onSubmit={(formData) => EditDimension({ dimension: formData.dimension })}
        buttonName="Edit"
        fields={[
          {
            label: 'Dimension',
            name: 'dimension',
            type: 'text',
            required: true,
            placeholder: 'Dimension',
          },
        ]}
        onClose={() => {}}
      />
      <FormModal
        id="addCategory"
        title="Add Category"
        onSubmit={(formData) => AddCategory({ category: formData.category, description: formData.description })}
        buttonName="Add"
        fields={[
          { label: 'Category', name: 'category', type: 'text', required: true, placeholder: 'Category Name' },
          { label: 'Description', name: 'description', type: 'text', placeholder: 'Category Description' },
        ]}
        onClose={() => {}}
      />
    </span>
  );
};
