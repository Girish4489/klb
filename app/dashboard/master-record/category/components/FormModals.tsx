import React from 'react';
import { FormModal } from './modals';

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
        onSubmitAction={(formData: Record<string, string>) =>
          EditCategory(formData as { category: string; description: string })
        }
        buttonName="Edit"
        fields={[
          { label: 'Category', name: 'category', type: 'text', required: true, placeholder: 'Category Name' },
          { label: 'Description', name: 'description', type: 'text', placeholder: 'Description Name' },
        ]}
        onCloseAction={() => {}}
      />
      <FormModal
        id="addProcess"
        title="Add Process"
        onSubmitAction={(formData: Record<string, string>) => AddProcess(formData as { styleProcess: string })}
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
        onCloseAction={() => {}}
      />
      <FormModal
        id="editProcess"
        title="Edit Process"
        onSubmitAction={(formData: Record<string, string>) => EditProcess(formData as { processName: string })}
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
        onCloseAction={() => {}}
      />
      <FormModal
        id="addStyle"
        title="Add Style"
        onSubmitAction={(formData: Record<string, string>) => AddStyle(formData as { catStyle: string })}
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
        onCloseAction={() => {}}
      />
      <FormModal
        id="editStyle"
        title="Edit Style"
        onSubmitAction={(formData: Record<string, string>) => EditStyles({ styleName: formData.styleName })}
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
        onCloseAction={() => {}}
      />
      <FormModal
        id="addDimensionTypes"
        title="Add Dimension Type"
        onSubmitAction={(formData: Record<string, string>) =>
          addDimensionTypes({ dimensionType: formData.dimensionType })
        }
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
        onCloseAction={() => {}}
      />
      <FormModal
        id="editDimensionType"
        title="Edit Dimension Type"
        onSubmitAction={(formData: Record<string, string>) =>
          EditDimensionType({ dimensionTypeName: formData.dimensionTypeName })
        }
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
        onCloseAction={() => {}}
      />
      <FormModal
        id="addDimension"
        title="Add Dimension"
        onSubmitAction={(formData: Record<string, string>) => AddDimension({ dimension: formData.dimension })}
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
        onCloseAction={() => {}}
      />
      <FormModal
        id="editDimension"
        title="Edit Dimension"
        onSubmitAction={(formData: Record<string, string>) => EditDimension({ dimension: formData.dimension })}
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
        onCloseAction={() => {}}
      />
      <FormModal
        id="addCategory"
        title="Add Category"
        onSubmitAction={(formData: Record<string, string>) =>
          AddCategory({ category: formData.category, description: formData.description })
        }
        buttonName="Add"
        fields={[
          { label: 'Category', name: 'category', type: 'text', required: true, placeholder: 'Category Name' },
          { label: 'Description', name: 'description', type: 'text', placeholder: 'Category Description' },
        ]}
        onCloseAction={() => {}}
      />
    </span>
  );
};
