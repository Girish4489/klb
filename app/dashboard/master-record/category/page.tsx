'use client';
import LoadingSpinner from '@components/LoadingSpinner';
import CategoryItem from '@dashboard/master-record/category/components/CategoryItem';
import { FormModals } from '@dashboard/master-record/category/components/FormModals';
import { closeModal, openModal } from '@dashboard/master-record/category/components/modals';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { ICategory, IDimensionTypes, IDimensions, IStyle, IStyleProcess } from '@models/klm';
import { userConfirmation } from '@utils/confirmation/confirmationUtil';
import handleError from '@utils/error/handleError';
import { ApiGet, ApiPost, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { toast } from '@utils/toast/toast';
import React, { useEffect, useRef, useState, type JSX } from 'react';

// The `IIds` interface represents the identifiers for a category, style process, style, dimension type, and dimension.
interface IIds {
  catId: string;
  styleProcessId: string;
  styleId: string;
  dimensionTypeId: string;
  dimensionId: string;
}

interface CategoryResponse extends ApiResponse {
  categories?: ICategory[];
  data?: ICategory;
}

// Helper function to handle response messages with proper type checking
const getApiMessage = (res: CategoryResponse | undefined, successMsg: string, errorMsg: string): string => {
  if (!res?.success || !res?.message) {
    throw new Error(errorMsg);
  }
  return res.message;
};

// CategoryPage component handles the display and management of categories, processes, dimensions, and styles.
export default function CategoryPage(): JSX.Element {
  const [category, setCategory] = useState<ICategory[]>([]);
  const [ids, setIds] = useState<IIds>();
  const isMounted = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetches the category data from the API and updates the state with the retrieved categories.
  const GetCategory = async (): Promise<void> => {
    try {
      const res = await ApiGet.Category<CategoryResponse>();
      if (res?.success && res.categories) {
        setCategory(res.categories);
      } else {
        throw new Error(res?.message ?? 'Failed to fetch categories');
      }
    } catch (error) {
      handleError.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted.current) return;
    GetCategory();
    isMounted.current = true;
  }, []);

  // Configures a toast notification for a given promise.
  const configureToastPromise = async (promise: Promise<string>, loadingMessage: string): Promise<void> => {
    try {
      await toast.promise(promise, {
        loading: loadingMessage,
        success: (message: string) => <b>{message}</b>,
        error: (error: Error) => <b>{error.message}</b>,
      });
    } catch (error) {
      handleError.log(error);
    }
  };

  // Handles the form submission for adding a new category.
  const AddCategory = async (e: { category: string; description: string }): Promise<void> => {
    const { category, description } = e;
    if (typeof category !== 'string' || typeof description !== 'string') {
      handleError.throw(new Error('Invalid input types'));
      return;
    }
    if (!category || !description) {
      handleError.throw(new Error('All fields are required'));
      return;
    }

    // Asynchronously saves a new category by making a POST request to the API.
    const saveCategory = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category<CategoryResponse>('addCategory', {
          categoryName: category,
          description: description,
        });
        if (res?.success && res.data) {
          setCategory((prevCategory) => [...prevCategory, res.data!]);
          return res.message ?? 'Category added successfully';
        }
        throw new Error(res?.message ?? 'Failed to add category');
      } catch (error) {
        handleError.throw(error);
        return 'An error occurred while adding the category';
      }
    };
    await configureToastPromise(saveCategory(), 'Adding Category...');
  };

  // Adds a new process to the category.
  const AddProcess = async (e: { styleProcess: string }): Promise<void> => {
    const { styleProcess } = e;

    if (!ids?.catId) {
      throw new Error('Category invalid try to refresh the page');
    }

    // Asynchronously saves a new process to a category.
    const saveProcess = async (): Promise<string> => {
      const res = await ApiPost.Category<CategoryResponse>('addProcess', {
        categoryId: ids?.catId,
        styleProcessName: styleProcess,
      });

      if (res?.success && res.data) {
        setCategory(
          (prevCategory) =>
            prevCategory.map((cat) => {
              if (cat._id.toString() === ids?.catId) {
                return {
                  ...(cat as ICategory),
                  styleProcess: cat.styleProcess ? [...cat.styleProcess, res.data!] : [res.data!],
                } as ICategory;
              }
              return cat as ICategory;
            }) as ICategory[],
        );
        closeModal('addProcess');
        return getApiMessage(res, 'Process added successfully', 'Failed to add process');
      }
      throw new Error(res?.message ?? 'Failed to add process');
    };

    await configureToastPromise(saveProcess(), 'Adding Process...');
  };

  // Adds a new dimension type to the category.
  const addDimensionTypes = async (e: { dimensionType: string }): Promise<void> => {
    const { dimensionType } = e;

    if (!ids?.catId) {
      handleError.throw(new Error('Category ID is invalid. Please refresh the page.'));
      return;
    }

    // Asynchronously saves a new dimension type for a category.
    const saveDimension = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category<CategoryResponse>('addDimensionTypes', {
          categoryId: ids.catId,
          dimensionTypeName: dimensionType,
        });

        if (!res) {
          throw new Error('No response received');
        }

        if (res.success) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids.catId) {
                  return {
                    ...(cat as ICategory),
                    dimensionTypes: cat.dimensionTypes ? [...cat.dimensionTypes, res.data!] : [res.data!],
                  } as ICategory;
                }
                return cat as ICategory;
              }) as ICategory[],
          );
          closeModal('addDimensionTypes');
          return getApiMessage(res, 'Dimension type added successfully', 'Failed to add dimension type');
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
        throw new Error('An error occurred while adding the dimension type');
      }
    };
    await configureToastPromise(saveDimension(), 'Adding Dimension Type...');
  };

  // Adds a new dimension to the specified category and dimension type.
  const AddDimension = async (e: { dimension: string }): Promise<string | void> => {
    const { dimension } = e;

    if (!ids?.catId || !ids?.dimensionTypeId) {
      handleError.throw(new Error('Category ID or Dimension Type ID is invalid. Please refresh the page.'));
      return;
    }

    // Asynchronously saves a new dimension to a category.
    const saveDimension = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category<CategoryResponse>('addDimension', {
          categoryId: ids.catId,
          dimensionTypeId: ids.dimensionTypeId,
          dimensionName: dimension,
        });

        if (!res) {
          throw new Error('No response received');
        }
        if (res.success) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids.catId) {
                  return {
                    ...(cat as ICategory),
                    dimensionTypes: cat.dimensionTypes?.map((dimensionTypes) => {
                      if ((dimensionTypes as IDimensionTypes)?._id.toString() === ids.dimensionTypeId) {
                        return {
                          ...(dimensionTypes as IDimensionTypes),
                          dimensions: dimensionTypes.dimensions
                            ? [...(dimensionTypes.dimensions as IDimensions[]), res.data!]
                            : [res.data!],
                        };
                      }
                      return dimensionTypes;
                    }),
                  } as ICategory;
                }
                return cat as ICategory;
              }) as ICategory[],
          );
          closeModal('addDimension');
          return getApiMessage(res, 'Dimension added successfully', 'Failed to add dimension');
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
        return 'An error occurred while adding the dimension';
      }
    };
    await configureToastPromise(saveDimension(), 'Adding Dimension...');
  };

  const EditDimensionType = async (e: { dimensionTypeName: string }): Promise<void> => {
    const { dimensionTypeName } = e;

    if (!ids?.catId || !ids?.dimensionTypeId) {
      handleError.throw(new Error('Category ID or Dimension Type ID is invalid. Please refresh the page.'));
      return;
    }

    const UpdateDimension = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category<CategoryResponse>('editDimensionType', {
          categoryId: ids.catId,
          dimensionTypeId: ids.dimensionTypeId,
          dimensionTypeName: dimensionTypeName,
        });

        if (!res) {
          throw new Error('No response received');
        }
        if (res.success) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids.catId) {
                  return {
                    ...(cat as ICategory),
                    dimensionTypes: cat.dimensionTypes?.map((dimensionType: IDimensionTypes) => {
                      if (dimensionType?._id.toString() === ids.dimensionTypeId) {
                        return {
                          ...dimensionType,
                          dimensionTypeName: dimensionTypeName,
                        };
                      }
                      return dimensionType;
                    }),
                  } as ICategory;
                }
                return cat as ICategory;
              }) as ICategory[],
          );
          closeModal('editDimensionType');
          return getApiMessage(res, 'Dimension type updated successfully', 'Failed to update dimension type');
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
        return 'An error occurred while updating the dimension type';
      }
    };
    await configureToastPromise(UpdateDimension(), 'Updating Dimension...');
  };

  // Adds a new style to a category's style process.
  const AddStyle = async (e: { catStyle: string }): Promise<void> => {
    const { catStyle } = e;

    if (!ids?.catId || !ids?.styleProcessId) {
      handleError.throw(new Error('Category ID or Style Process ID is invalid. Please refresh the page.'));
      return;
    }

    // Asynchronously saves a new style to a category and updates the state.
    const saveStyle = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category<CategoryResponse>('addStyle', {
          categoryId: ids.catId,
          styleProcessId: ids.styleProcessId,
          styleName: catStyle,
        });

        if (!res) {
          throw new Error('No response received');
        }

        if (res.success) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids.catId) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess) => {
                      if ((styleProcess as IStyleProcess)?._id.toString() === ids.styleProcessId) {
                        return {
                          ...(styleProcess as IStyleProcess),
                          styles: styleProcess.styles ? [...(styleProcess.styles as IStyle[]), res.data!] : [res.data!],
                        };
                      }
                      return styleProcess;
                    }),
                  } as ICategory;
                }
                return cat as ICategory;
              }) as ICategory[],
          );
          closeModal('addStyle');
          return getApiMessage(res, 'Style added successfully', 'Failed to add style');
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
        return 'An error occurred while adding the style';
      }
    };
    await configureToastPromise(saveStyle(), 'Adding Style...');
  };

  // Deletes a category after user confirmation.
  const DelCategory =
    (id: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this category?',
      });
      if (!confirmed) return;

      // Deletes a category by its ID.
      const deleteCategory = async (): Promise<string> => {
        try {
          const res = await ApiPost.Category<CategoryResponse>('delCategory', {
            categoryId: id,
          });

          if (!res) {
            throw new Error('No response received');
          }
          if (res.success) {
            setCategory(category.filter((cat) => cat._id.toString() !== id));
            return getApiMessage(res, 'Category deleted successfully', 'Failed to delete category');
          } else {
            throw new Error(res.message);
          }
        } catch (error) {
          // throw new Error(error);
          handleError.throw(error);
          return 'An error occurred while deleting the category';
        }
      };
      await configureToastPromise(deleteCategory(), 'Deleting Category...');
    };

  // Handles the deletion of a style process from a category.
  const DelProcess =
    (id: string, styleProcessId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this process?',
      });
      if (!confirmed) return;

      // Deletes a style process from a category.
      const deleteProcess = async (): Promise<string> => {
        try {
          const res = await ApiPost.Category<CategoryResponse>('delProcess', {
            categoryId: id,
            styleProcessId: styleProcessId,
          });

          if (!res) {
            throw new Error('No response received');
          }
          if (res.success) {
            setCategory(
              category.map((cat) => {
                if (cat._id.toString() === id) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.filter(
                      (styleProcess: IStyleProcess) => styleProcess && styleProcess._id.toString() !== styleProcessId,
                    ),
                  } as ICategory;
                }
                return cat as ICategory;
              }),
            );
            return getApiMessage(res, 'Process deleted successfully', 'Failed to delete process');
          } else {
            throw new Error(res.message);
          }
        } catch (error) {
          handleError.throw(error);
          return 'An error occurred while deleting the process';
        }
      };
      await configureToastPromise(deleteProcess(), 'Deleting Process...');
    };

  // Deletes a dimension type from a category after user confirmation.
  const DelDimensionType =
    (id: string, dimensionTypeId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this dimension type?',
      });
      if (!confirmed) return;

      // Deletes a dimension type from a category.
      const deleteDimensionType = async (): Promise<string> => {
        try {
          const res = await ApiPost.Category<CategoryResponse>('delDimensionType', {
            categoryId: id,
            dimensionTypeId: dimensionTypeId,
          });

          if (!res) {
            throw new Error('No response received');
          }
          if (res.success) {
            setCategory(
              category.map((cat) => {
                if (cat._id.toString() === id) {
                  return {
                    ...(cat as ICategory),
                    dimensionTypes: cat.dimensionTypes?.filter(
                      (dimensionType: IDimensionTypes) =>
                        dimensionType && dimensionType._id.toString() !== dimensionTypeId,
                    ),
                  } as ICategory;
                }
                return cat as ICategory;
              }),
            );
            return getApiMessage(res, 'Dimension type deleted successfully', 'Failed to delete dimension type');
          } else {
            throw new Error(res.message);
          }
        } catch (error) {
          // throw new Error(error);
          handleError.throw(error);
          return 'An error occurred while deleting the dimension type';
        }
      };
      await configureToastPromise(deleteDimensionType(), 'Deleting Dimension Type...');
    };

  // Handles the deletion of a style from a category's style process.
  const DelStyle =
    (id: string, styleProcessId: string, styleId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this style?',
      });
      if (!confirmed) return;

      // Deletes a style from a category's style process.
      const deleteStyle = async (): Promise<string> => {
        try {
          const res = await ApiPost.Category<CategoryResponse>('delStyle', {
            categoryId: id,
            styleProcessId: styleProcessId,
            styleId: styleId,
          });

          if (!res) {
            throw new Error('No response received');
          }
          if (res.success) {
            setCategory(
              category.map((cat) => {
                if (cat._id.toString() === id) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess) => {
                      if ((styleProcess as IStyleProcess)?._id.toString() === styleProcessId) {
                        return {
                          ...(styleProcess as IStyleProcess),
                          styles: Array.isArray(styleProcess.styles)
                            ? styleProcess.styles.filter((style: IStyle) => style && style._id.toString() !== styleId)
                            : [],
                        };
                      }
                      return styleProcess;
                    }),
                  } as ICategory;
                }
                return cat as ICategory;
              }),
            );
            return getApiMessage(res, 'Style deleted successfully', 'Failed to delete style');
          } else {
            throw new Error(res.message);
          }
        } catch (error) {
          // throw new Error(error);
          handleError.throw(error);
          return 'An error occurred while deleting the style';
        }
      };
      await configureToastPromise(deleteStyle(), 'Deleting Style...');
    };

  // Deletes a dimension from a category after user confirmation.
  const DelDimension =
    (id: string, dimensionTypeId: string, dimensionId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this dimension?',
      });
      if (!confirmed) return;

      // Deletes a dimension from a category.
      const deleteDimension = async (): Promise<string> => {
        try {
          const res = await ApiPost.Category<CategoryResponse>('delDimension', {
            categoryId: id,
            dimensionTypeId: dimensionTypeId,
            dimensionId: dimensionId,
          });

          if (!res) {
            throw new Error('No response received');
          }
          if (res.success) {
            setCategory(
              category.map((cat) => {
                if (cat._id.toString() === id) {
                  return {
                    ...(cat as ICategory),
                    dimensionTypes: cat.dimensionTypes?.map((dimensionType: IDimensionTypes) => {
                      if ((dimensionType as IDimensionTypes)?._id.toString() === dimensionTypeId) {
                        return {
                          ...dimensionType,
                          dimensions: Array.isArray(dimensionType.dimensions)
                            ? dimensionType.dimensions.filter(
                                (dimension: IDimensions) => dimension && dimension._id.toString() !== dimensionId,
                              )
                            : [],
                        };
                      }
                      return dimensionType;
                    }),
                  } as ICategory;
                }
                return cat as ICategory;
              }),
            );
            return getApiMessage(res, 'Dimension deleted successfully', 'Failed to delete dimension');
          } else {
            throw new Error(res.message);
          }
        } catch (error) {
          // throw new Error(error);
          handleError.throw(error);
          return 'An error occurred while deleting the dimension';
        }
      };
      await configureToastPromise(deleteDimension(), 'Deleting Dimension...');
    };

  // edit logic
  // Edits an existing category with the provided details.
  const EditCategory = async (e: { category: string; description: string }): Promise<void> => {
    const { category, description } = e;

    if (!ids?.catId) {
      handleError.throw(new Error('Category ID is invalid. Please refresh the page.'));
      return;
    }

    // Updates the category with the provided details.
    const UpdateCategory = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category<CategoryResponse>('editCategory', {
          categoryId: ids.catId,
          categoryName: category,
          description: description,
        });

        if (!res) {
          throw new Error('No response received');
        }
        if (res.success) {
          setCategory((prevCategory) =>
            prevCategory.map((cat: ICategory) => {
              if (cat._id.toString() === ids.catId) {
                return {
                  ...(cat as ICategory),
                  categoryName: category,
                  description: description,
                } as ICategory;
              }
              return cat as ICategory;
            }),
          );
          closeModal('editCategory');
          return getApiMessage(res, 'Category updated successfully', 'Failed to update category');
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
        return 'An error occurred while updating the category';
      }
    };
    await configureToastPromise(UpdateCategory(), 'Updating Category...');
  };

  // EditProcess is an asynchronous function that updates the name of a style process
  const EditProcess = async (e: { processName: string }): Promise<void> => {
    const { processName } = e;

    if (!ids?.catId || !ids?.styleProcessId) {
      handleError.throw(new Error('Category ID or Style Process ID is invalid. Please refresh the page.'));
      return;
    }

    // Updates the style process of a category by making an API call and updating the state.
    const UpdateProcess = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category<CategoryResponse>('editProcess', {
          categoryId: ids.catId,
          styleProcessId: ids.styleProcessId,
          styleProcessName: processName,
        });

        if (!res) {
          throw new Error('No response received');
        }
        if (res.success) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids.catId) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess: IStyleProcess) => {
                      if (styleProcess?._id.toString() === ids.styleProcessId) {
                        return {
                          ...styleProcess,
                          styleProcessName: processName,
                        };
                      }
                      return styleProcess;
                    }),
                  } as ICategory;
                }
                return cat as ICategory;
              }) as ICategory[],
          );
          closeModal('editProcess');
          return getApiMessage(res, 'Process updated successfully', 'Failed to update process');
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
        return 'An error occurred while updating the process';
      }
    };
    await configureToastPromise(UpdateProcess(), 'Updating Process...');
  };

  // Edits the dimension type of a category.
  const EditStyles = async (e: { styleName: string }): Promise<void> => {
    const { styleName } = e;

    if (!ids?.catId || !ids?.styleProcessId || !ids?.styleId) {
      handleError.throw(new Error('Category ID, Style Process ID, or Style ID is invalid. Please refresh the page.'));
      return;
    }

    // Updates the styles of a category by making an API call and updating the state.
    const UpdateStyles = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category<CategoryResponse>('editStyle', {
          categoryId: ids.catId,
          styleProcessId: ids.styleProcessId,
          styleId: ids.styleId,
          styleName: styleName,
        });

        if (!res) {
          throw new Error('No response received');
        }
        if (res.success) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids.catId) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess: IStyleProcess) => {
                      if (styleProcess?._id.toString() === ids.styleProcessId) {
                        return {
                          ...styleProcess,
                          styles: Array.isArray(styleProcess.styles)
                            ? styleProcess.styles.map((style: IStyle) => {
                                if (style?._id.toString() === ids.styleId) {
                                  return {
                                    ...style,
                                    styleName: styleName,
                                  };
                                }
                                return style;
                              })
                            : [],
                        };
                      }
                      return styleProcess;
                    }),
                  } as ICategory;
                }
                closeModal('editStyle');
                return cat as ICategory;
              }) as ICategory[],
          );
          return getApiMessage(res, 'Style updated successfully', 'Failed to update style');
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
        return 'An error occurred while updating the style';
      }
    };
    await configureToastPromise(UpdateStyles(), 'Updating Style...');
  };

  // EditDimension is an asynchronous function that updates the name of a dimension
  const EditDimension = async (e: { dimension: string }): Promise<void> => {
    const { dimension } = e;

    if (!ids?.catId || !ids?.dimensionTypeId || !ids?.dimensionId) {
      handleError.throw(
        new Error('Category ID, Dimension Type ID, or Dimension ID is invalid. Please refresh the page.'),
      );
      return;
    }

    const UpdateDimension = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category<CategoryResponse>('editDimension', {
          categoryId: ids.catId,
          dimensionTypeId: ids.dimensionTypeId,
          dimensionId: ids.dimensionId,
          dimensionName: dimension,
        });

        if (!res) {
          throw new Error('No response received');
        }
        if (res.success) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids.catId) {
                  return {
                    ...(cat as ICategory),
                    dimensionTypes: cat.dimensionTypes?.map((dimTyp: IDimensionTypes) => {
                      if (dimTyp?._id.toString() === ids.dimensionTypeId) {
                        return {
                          ...dimTyp,
                          dimensions: Array.isArray(dimTyp.dimensions)
                            ? dimTyp.dimensions.map((dim: IDimensions) => {
                                if (dim?._id.toString() === ids.dimensionId) {
                                  return {
                                    ...dim,
                                    dimensionName: dimension,
                                  };
                                }
                                return dim;
                              })
                            : [],
                        };
                      }
                      return dimTyp;
                    }),
                  } as ICategory;
                }
                return cat as ICategory;
              }) as ICategory[],
          );
          closeModal('editDimension');
          return getApiMessage(res, 'Dimension updated successfully', 'Failed to update dimension');
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
        return 'An error occurred while updating the dimension';
      }
    };
    await configureToastPromise(UpdateDimension(), 'Updating Dimension...');
  };

  const setIdsState = (
    catId?: string,
    styleProcessId?: string,
    styleId?: string,
    dimensionTypeId?: string,
    dimensionId?: string,
  ): void => {
    setIds({
      catId: catId ?? '',
      styleProcessId: styleProcessId ?? '',
      styleId: styleId ?? '',
      dimensionTypeId: dimensionTypeId ?? '',
      dimensionId: dimensionId ?? '',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full w-full">
      {/* modals */}
      <FormModals
        AddCategory={AddCategory}
        AddProcess={AddProcess}
        EditProcess={EditProcess}
        AddStyle={AddStyle}
        EditStyles={EditStyles}
        addDimensionTypes={addDimensionTypes}
        EditDimensionType={EditDimensionType}
        AddDimension={AddDimension}
        EditDimension={EditDimension}
        EditCategory={EditCategory}
      />
      <div className="container flex h-full w-full flex-col gap-2 p-2">
        {/* category header for adding */}
        <div className="rounded-box border-base-300 w-full border p-2 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <h2 className="label text-center font-bold">Category</h2>
            <button className="btn btn-primary btn-soft btn-sm" onClick={() => openModal('addCategory')}>
              <PlusCircleIcon className="h-5 w-5" />
              Add
            </button>
          </div>
          <p className="text-warning text-start font-thin max-sm:hidden">
            Note: General users can view this page for informational purposes. Edits are reserved for authorized
            personnel.
          </p>
        </div>
        {/* category list */}
        <div className="rounded-box border-base-300 flex flex-1 grow flex-col items-center gap-2 border pb-2 shadow-2xl">
          <h1 className="py-1 text-center font-bold text-base">Categories</h1>
          <div className="flex h-full w-full flex-col gap-1 overflow-y-auto px-1">
            {category.map((cat: ICategory, catIndex: number) => (
              <CategoryItem
                key={catIndex}
                category={cat}
                setIdsState={setIdsState}
                DelCategory={DelCategory}
                DelProcess={DelProcess}
                DelStyle={DelStyle}
                DelDimensionType={DelDimensionType}
                DelDimension={DelDimension}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
