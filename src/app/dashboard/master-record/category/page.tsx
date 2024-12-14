'use client';
import LoadingSpinner from '@components/LoadingSpinner';
import CategoryItem from '@dashboard/master-record/category/components/CategoryItem';
import { FormModals } from '@dashboard/master-record/category/components/FormModals';
import { closeModal, openModal } from '@dashboard/master-record/category/components/modals';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { ICategory, IDimensionTypes, IDimensions, IStyle, IStyleProcess } from '@models/klm';
import { userConfirmation } from '@util/confirmation/confirmationUtil';
import handleError from '@util/error/handleError';
import { ApiGet, ApiPost } from '@util/makeApiRequest/makeApiRequest';
import React, { useEffect, useRef, useState, type JSX } from 'react';
import toast from 'react-hot-toast';

// The `IIds` interface represents the identifiers for a category, style process, style, dimension type, and dimension.
interface IIds {
  catId: string;
  styleProcessId: string;
  styleId: string;
  dimensionTypeId: string;
  dimensionId: string;
}

// CategoryPage component handles the display and management of categories, processes, dimensions, and styles.
export default function CategoryPage(): JSX.Element {
  const [category, setCategory] = useState<ICategory[]>([]);
  const [ids, setIds] = useState<IIds>();
  const isMounted = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetches the category data from the API and updates the state with the retrieved categories.
  const GetCategory = async (): Promise<void> => {
    try {
      const res = await ApiGet.Category();
      setCategory(res.categories);
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
  const configureToastPromise = async (promise: Promise<string>, loadingMessage: string) => {
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
        const res = await ApiPost.Category('addCategory', { categoryName: category, description: description });
        if (res.success) {
          setCategory((prevCategory) => [...prevCategory, res.data]);
          return res.message;
        } else {
          throw new Error(res.message);
        }
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
      return;
    }

    // Asynchronously saves a new process to a category.
    const saveProcess = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category('addProcess', {
          categoryId: ids?.catId,
          styleProcessName: styleProcess,
        });
        if (res.success) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess ? [...cat.styleProcess, res.data] : [res.data],
                  } as ICategory;
                }
                return cat as ICategory;
              }) as ICategory[],
          );
          closeModal('addProcess');
          return res.message;
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
        return 'An error occurred while adding the process';
      }
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
        const res = await ApiPost.Category('addDimensionTypes', {
          categoryId: ids.catId,
          dimensionTypeName: dimensionType,
        });

        if (res.success) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids.catId) {
                  return {
                    ...(cat as ICategory),
                    dimensionTypes: cat.dimensionTypes ? [...cat.dimensionTypes, res.data] : [res.data],
                  } as ICategory;
                }
                return cat as ICategory;
              }) as ICategory[],
          );
          closeModal('addDimensionTypes');
          return res.message;
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
        const res = await ApiPost.Category('addDimension', {
          categoryId: ids.catId,
          dimensionTypeId: ids.dimensionTypeId,
          dimensionName: dimension,
        });
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
                            ? [...(dimensionTypes.dimensions as IDimensions[]), res.data]
                            : [res.data],
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
          return res.message;
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

  const EditDimensionType = async (e: { dimensionTypeName: string }) => {
    const { dimensionTypeName } = e;

    if (!ids?.catId || !ids?.dimensionTypeId) {
      handleError.throw(new Error('Category ID or Dimension Type ID is invalid. Please refresh the page.'));
      return;
    }

    const UpdateDimension = async () => {
      try {
        const res = await ApiPost.Category('editDimensionType', {
          categoryId: ids.catId,
          dimensionTypeId: ids.dimensionTypeId,
          dimensionTypeName: dimensionTypeName,
        });
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
          return res.message;
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
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
        const res = await ApiPost.Category('addStyle', {
          categoryId: ids.catId,
          styleProcessId: ids.styleProcessId,
          styleName: catStyle,
        });

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
                          styles: styleProcess.styles ? [...(styleProcess.styles as IStyle[]), res.data] : [res.data],
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
          return res.message;
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
  const DelCategory = (id: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const confirmed = await userConfirmation({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this category?',
    });
    if (!confirmed) return;

    // Deletes a category by its ID.
    const deleteCategory = async (): Promise<string> => {
      try {
        const res = await ApiPost.Category('delCategory', {
          categoryId: id,
        });
        if (res.success) {
          setCategory(category.filter((cat) => cat._id.toString() !== id));
          return res.message;
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
    (id: string, styleProcessId: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this process?',
      });
      if (!confirmed) return;

      // Deletes a style process from a category.
      const deleteProcess = async (): Promise<string> => {
        try {
          const res = await ApiPost.Category('delProcess', {
            categoryId: id,
            styleProcessId: styleProcessId,
          });
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
            return res.message;
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
    (id: string, dimensionTypeId: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this dimension type?',
      });
      if (!confirmed) return;

      // Deletes a dimension type from a category.
      const deleteDimensionType = async (): Promise<string> => {
        try {
          const res = await ApiPost.Category('delDimensionType', {
            categoryId: id,
            dimensionTypeId: dimensionTypeId,
          });
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
            return res.message;
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
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this style?',
      });
      if (!confirmed) return;

      // Deletes a style from a category's style process.
      const deleteStyle = async (): Promise<string> => {
        try {
          const res = await ApiPost.Category('delStyle', {
            categoryId: id,
            styleProcessId: styleProcessId,
            styleId: styleId,
          });
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
            return res.message;
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
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this dimension?',
      });
      if (!confirmed) return;

      // Deletes a dimension from a category.
      const deleteDimension = async (): Promise<string> => {
        try {
          const res = await ApiPost.Category('delDimension', {
            categoryId: id,
            dimensionTypeId: dimensionTypeId,
            dimensionId: dimensionId,
          });
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
            return res.message;
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
        const res = await ApiPost.Category('editCategory', {
          categoryId: ids.catId,
          categoryName: category,
          description: description,
        });
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
          return res.message;
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
        const res = await ApiPost.Category('editProcess', {
          categoryId: ids.catId,
          styleProcessId: ids.styleProcessId,
          styleProcessName: processName,
        });
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
          return res.message;
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
        const res = await ApiPost.Category('editStyle', {
          categoryId: ids.catId,
          styleProcessId: ids.styleProcessId,
          styleId: ids.styleId,
          styleName: styleName,
        });
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
          return res.message;
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

    const UpdateDimension = async () => {
      try {
        const res = await ApiPost.Category('editDimension', {
          categoryId: ids.catId,
          dimensionTypeId: ids.dimensionTypeId,
          dimensionId: ids.dimensionId,
          dimensionName: dimension,
        });
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
          return res.message;
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
  ) => {
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
    <span className="h-full w-full overflow-x-hidden">
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
      <span className="container w-full overflow-y-auto">
        {/* category header for adding */}
        <div className="w-full rounded-box border-2 border-base-300 p-2 shadow-lg">
          <div className="flex items-center gap-2 max-sm:justify-between">
            <h2 className="label text-center font-bold">Category</h2>
            <button className="btn btn-primary btn-sm" onClick={() => openModal('addCategory')}>
              <PlusCircleIcon className="h-6 w-6 text-primary-content max-sm:hidden" />
              <span className="hidden max-sm:flex">Add</span>
            </button>
          </div>
          <p className="text-start text-sm text-warning max-sm:text-center">
            Note: General users can view this page for informational purposes. Edits are reserved for authorized
            personnel.
          </p>
        </div>
        {/* category list */}
        <div className="flex grow flex-col items-center gap-2 rounded-box border border-base-300 p-2 shadow-2xl">
          <h1 className="m-1 w-max border-b border-base-content text-center text-base font-bold">Categories</h1>
          <div className="flex h-auto w-full flex-col">
            <div className="flex flex-col items-start justify-between gap-2 max-sm:items-center">
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
      </span>
    </span>
  );
}
