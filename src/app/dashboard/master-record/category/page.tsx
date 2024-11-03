'use client';
import { userConfirmation } from '@/app/util/confirmation/confirmationUtil';
import handleError from '@/app/util/error/handleError';
import { ApiGet, ApiPost } from '@/app/util/makeApiRequest/makeApiRequest';
import { FormModal, closeModal, openModal } from '@/app/util/modal/modals';
import { ICategory, IDimensionTypes, IDimensions, IStyle, IStyleProcess } from '@/models/klm';
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { type JSX } from 'react';
import toast from 'react-hot-toast';

/**
 * The `IIds` interface represents the identifiers for a category, style process, style, dimension type, and dimension.
 *
 * @interface IIds
 * @property {string} catId - The category ID.
 * @property {string} styleProcessId - The style process ID.
 * @property {string} styleId - The style ID.
 * @property {string} dimensionTypeId - The dimension type ID.
 * @property {string} dimensionId - The dimension ID.
 */
interface IIds {
  catId: string;
  styleProcessId: string;
  styleId: string;
  dimensionTypeId: string;
  dimensionId: string;
}

/**
 * CategoryPage component handles the display and management of categories, processes, dimensions, and styles.
 *
 * @component
 * @returns {JSX.Element} The rendered CategoryPage component.
 */
export default function CategoryPage(): JSX.Element {
  const [category, setCategory] = React.useState<ICategory[]>([]);
  const [ids, setIds] = React.useState<IIds>();
  const isMounted = React.useRef(false);

  /**
   * Fetches the category data from the API and updates the state with the retrieved categories.
   *
   * @async
   * @function GetCategory
   * @returns {Promise<void>} A promise that resolves when the category data has been fetched and the state has been updated.
   * @throws Will log an error if the API request fails.
   */
  const GetCategory = async (): Promise<void> => {
    try {
      const res = await ApiGet.Category();
      setCategory(res.categories);
    } catch (error) {
      handleError.log(error);
    }
  };

  React.useEffect(() => {
    if (isMounted.current) return;
    GetCategory();
    isMounted.current = true;
  }, []);

  /**
   * Configures a toast notification for a given promise.
   *
   * @param promise - The promise to be tracked by the toast notification.
   * @param loadingMessage - The message to display while the promise is pending.
   * @returns A promise that resolves with the result of the input promise.
   *
   * @example
   * ```typescript
   * const myPromise = new Promise<string>((resolve) => setTimeout(() => resolve("Success!"), 2000));
   * configureToastPromise(myPromise, "Loading...");
   * ```
   */
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

  /**
   * Handles the form submission for adding a new category.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<void>} A promise that resolves when the category is added.
   *
   * @throws {Error} Throws an error if the input types are invalid or if any field is empty.
   *
   * The function performs the following steps:
   * 1. Prevents the default form submission behavior.
   * 2. Extracts the category and description values from the form.
   * 3. Validates the input types and checks if any field is empty.
   * 4. Defines an asynchronous function to save the category using an API call.
   * 5. Handles the API response, updating the state with the new category if successful.
   * 6. Uses a toast notification to indicate the status of the category addition.
   */
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

    /**
     * Asynchronously saves a new category by making a POST request to the API.
     *
     * @async
     * @function saveCategory
     * @throws Will throw an error if the API request fails.
     * @returns {Promise<string>} A promise that resolves to a success message if the category is saved successfully.
     */
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

  /**
   * Adds a new process to the category.
   *
   * @param {Object} e - The event object containing the style process name.
   * @param {string} e.styleProcess - The name of the style process to be added.
   * @throws Will throw an error if the category ID is invalid.
   * @returns {Promise<void>} A promise that resolves when the process is added.
   *
   * The function performs the following steps:
   * 1. Checks if the category ID is valid.
   * 2. Defines an async function to save the process.
   * 3. Attempts to save the process using an API call.
   * 4. If successful, updates the category state with the new process.
   * 5. Closes the modal and returns a success message.
   * 6. If unsuccessful, throws an error with the response message.
   * 7. Handles any errors that occur during the process.
   */
  const AddProcess = async (e: { styleProcess: string }): Promise<void> => {
    const { styleProcess } = e;

    if (!ids?.catId) {
      throw new Error('Category invalid try to refresh the page');
      return;
    }

    /**
     * Asynchronously saves a new process to a category.
     *
     * This function sends a request to add a new process to a specified category.
     * If the request is successful, it updates the category state with the new process
     * and closes the modal. If the request fails, it throws an error.
     *
     * @async
     * @function saveProcess
     * @returns {Promise<string>} A promise that resolves to the success message if the process is added successfully, or void if an error occurs.
     * @throws {Error} Throws an error if the request fails.
     */
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

  /**
   * Adds a new dimension type to the category.
   *
   * @param {Object} e - The event object containing the dimension type.
   * @param {string} e.dimensionType - The name of the dimension type to be added.
   *
   * @throws Will throw an error if the category ID is invalid.
   *
   * @returns {Promise<void>} A promise that resolves when the dimension type is added.
   *
   * This function performs the following steps:
   * 1. Checks if the category ID is valid.
   * 2. Attempts to save the new dimension type by making an API call.
   * 3. If the API call is successful, updates the category state with the new dimension type.
   * 4. Closes the modal for adding dimension types.
   * 5. If the API call fails, throws an error with the response message.
   */
  const addDimensionTypes = async (e: { dimensionType: string }): Promise<void> => {
    const { dimensionType } = e;

    if (!ids?.catId) {
      handleError.throw(new Error('Category ID is invalid. Please refresh the page.'));
      return;
    }

    /**
     * Asynchronously saves a new dimension type for a category.
     *
     * This function sends a POST request to add a new dimension type to a specified category.
     * If the request is successful, it updates the category state with the new dimension type
     * and closes the modal. If the request fails, it throws an error.
     *
     * @async
     * @function saveDimension
     * @returns {Promise<string>} A promise that resolves to the success message if the operation is successful, or void if an error occurs.
     * @throws {Error} Throws an error if the request fails.
     */
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

  /**
   * Adds a new dimension to the specified category and dimension type.
   *
   * @param {Object} e - The event object containing the dimension name.
   * @param {string} e.dimension - The name of the dimension to be added.
   *
   * @throws Will throw an error if the Category ID or Dimension Type ID is invalid.
   *
   * @returns {Promise<string | void>} A promise that resolves to a success message if the dimension is added successfully, or void if an error occurs.
   *
   * The function performs the following steps:
   * 1. Validates the presence of category ID and dimension type ID.
   * 2. Sends a request to add the dimension using the `ApiPost.Category` method.
   * 3. Updates the state with the new dimension if the request is successful.
   * 4. Closes the modal for adding a dimension.
   * 5. Handles any errors that occur during the process.
   */
  const AddDimension = async (e: { dimension: string }): Promise<string | void> => {
    const { dimension } = e;

    if (!ids?.catId || !ids?.dimensionTypeId) {
      handleError.throw(new Error('Category ID or Dimension Type ID is invalid. Please refresh the page.'));
      return;
    }

    /**
     * Asynchronously saves a new dimension to a category.
     *
     * This function sends a POST request to add a new dimension to a specified category and dimension type.
     * If the request is successful, it updates the state with the new dimension and closes the modal.
     * If the request fails, it throws an error.
     *
     * @async
     * @function saveDimension
     * @returns {Promise<string>} A promise that resolves to the response message if successful, or void if an error occurs.
     * @throws {Error} Throws an error if the request fails.
     */
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

  /**
   * Adds a new style to a category's style process.
   *
   * @param {Object} e - The event object containing the style information.
   * @param {string} e.catStyle - The name of the style to be added.
   *
   * @throws {Error} Throws an error if the Category ID or Style Process ID is invalid.
   *
   * @returns {Promise<void>} A promise that resolves when the style is successfully added.
   *
   * This function performs the following steps:
   * 1. Validates the presence of Category ID and Style Process ID.
   * 2. Sends a request to the API to add the new style.
   * 3. Updates the state with the new style if the API request is successful.
   * 4. Closes the modal and returns a success message.
   * 5. Handles any errors that occur during the process.
   */
  const AddStyle = async (e: { catStyle: string }): Promise<void> => {
    const { catStyle } = e;

    if (!ids?.catId || !ids?.styleProcessId) {
      handleError.throw(new Error('Category ID or Style Process ID is invalid. Please refresh the page.'));
      return;
    }

    /**
     * Asynchronously saves a new style to a category and updates the state.
     *
     * This function sends a POST request to add a new style to a specified category and style process.
     * If the request is successful, it updates the category state with the new style and closes the modal.
     * If the request fails, it throws an error.
     *
     * @async
     * @function saveStyle
     * @returns {Promise<string>} A promise that resolves to the response message if successful, or void if an error occurs.
     * @throws {Error} Throws an error if the request fails.
     */
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

  /**
   * Deletes a category after user confirmation.
   *
   * @param {string} id - The ID of the category to be deleted.
   *
   * The function performs the following steps:
   * 1. Prevents the default button click behavior.
   * 2. Prompts the user for confirmation to delete the category.
   * 3. If confirmed, sends a request to delete the category via the `ApiPost.Category` method.
   * 4. If the deletion is successful, updates the category state by filtering out the deleted category.
   * 5. If the deletion fails, throws an error and handles it using `handleError.throw`.
   * 6. Displays a toast notification during the deletion process.
   *
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - The mouse event triggered by the button click.
   */
  const DelCategory = (id: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const confirmed = await userConfirmation({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this category?',
    });
    if (!confirmed) return;
    /**
     * Deletes a category by its ID.
     *
     * This function sends a request to delete a category using the provided category ID.
     * If the deletion is successful, it updates the state to remove the deleted category.
     * If an error occurs during the deletion process, it handles the error and returns an error message.
     *
     * @returns {Promise<string>} A promise that resolves to a success message if the category is deleted successfully,
     * or an error message if the deletion fails.
     *
     * @throws {Error} Throws an error if the deletion request fails.
     */
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

  /**
   * Handles the deletion of a style process from a category.
   *
   * This function is an event handler that triggers the deletion of a style process
   * identified by `styleProcessId` from a category identified by `id`. It first asks
   * for user confirmation before proceeding with the deletion. If confirmed, it sends
   * a request to delete the style process and updates the local state accordingly.
   * If an error occurs during the deletion process, it handles the error and displays
   * an appropriate message.
   *
   * @param e - The mouse event triggered by the button click.
   *
   * @param {string} id - The ID of the category from which the style process will be deleted.
   * @param {string} styleProcessId - The ID of the style process to be deleted.
   */
  const DelProcess =
    (id: string, styleProcessId: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this process?',
      });
      if (!confirmed) return;
      /**
       * Deletes a style process from a category.
       *
       * This function sends a request to delete a style process identified by `styleProcessId`
       * from a category identified by `id`. If the deletion is successful, it updates the
       * local state to reflect the change. If an error occurs, it handles the error and
       * returns an error message.
       *
       * @async
       * @function deleteProcess
       * @returns {Promise<string>} A message indicating the result of the deletion process.
       * @throws Will throw an error if the deletion request fails.
       */
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

  /**
   * Deletes a dimension type from a category after user confirmation.
   *
   * This function is an event handler that triggers when a button is clicked. It first asks the user
   * for confirmation before proceeding with the deletion. If the user confirms, it calls the
   * `deleteDimensionType` function to perform the deletion. The local state is updated to reflect
   * the change if the deletion is successful. If an error occurs, it handles the error and displays
   * an appropriate message.
   *
   * @param {string} id - The ID of the category from which the dimension type will be deleted.
   * @param {string} dimensionTypeId - The ID of the dimension type to be deleted.
   *
   * @param e - The mouse event triggered by clicking the delete button.
   */
  const DelDimensionType =
    (id: string, dimensionTypeId: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this dimension type?',
      });
      if (!confirmed) return;
      /**
       * Deletes a dimension type from a category.
       *
       * This function sends a request to delete a dimension type identified by `dimensionTypeId`
       * from a category identified by `id`. If the deletion is successful, it updates the local
       * state to reflect the change. If an error occurs, it handles the error and returns an
       * appropriate message.
       *
       * @async
       * @function deleteDimensionType
       * @returns {Promise<string>} A message indicating the result of the deletion operation.
       * @throws Will throw an error if the deletion request fails.
       */
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

  /**
   * Handles the deletion of a style from a category's style process.
   *
   * This function is triggered by a button click event and performs the following steps:
   * 1. Prevents the default button click behavior.
   * 2. Prompts the user for confirmation to delete the style.
   * 3. If confirmed, sends a request to delete the style identified by `styleId` from the style process identified by `styleProcessId`
   *    within the category identified by `id`.
   * 4. If the deletion is successful, updates the state to reflect the changes.
   * 5. Displays a toast notification indicating the progress and result of the deletion operation.
   *
   * @param {string} id - The identifier of the category.
   * @param {string} styleProcessId - The identifier of the style process.
   * @param {string} styleId - The identifier of the style to be deleted.
   */
  const DelStyle =
    (id: string, styleProcessId: string, styleId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this style?',
      });
      if (!confirmed) return;
      /**
       * Deletes a style from a category's style process.
       *
       * This function sends a request to delete a style identified by `styleId` from a style process identified by `styleProcessId`
       * within a category identified by `id`. If the deletion is successful, it updates the state to reflect the changes.
       *
       * @async
       * @function deleteStyle
       * @returns {Promise<string>} A message indicating the result of the deletion operation.
       * @throws {Error} If the deletion operation fails, an error message is thrown.
       */
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

  /**
   * Deletes a dimension from a category after user confirmation.
   *
   * @param {string} id - The ID of the category.
   * @param {string} dimensionTypeId - The ID of the dimension type.
   * @param {string} dimensionId - The ID of the dimension to be deleted.
   *
   * The function performs the following steps:
   * 1. Prevents the default button click behavior.
   * 2. Prompts the user for confirmation to delete the dimension.
   * 3. If confirmed, sends a request to delete the dimension via the `ApiPost.Category` method.
   * 4. If the deletion is successful, updates the category state by removing the deleted dimension.
   * 5. If the deletion fails, throws an error and handles it using `handleError.throw`.
   * 6. Displays a toast notification during the deletion process.
   */
  const DelDimension =
    (id: string, dimensionTypeId: string, dimensionId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this dimension?',
      });
      if (!confirmed) return;
      /**
       * Deletes a dimension from a category.
       *
       * This function sends a request to delete a dimension identified by `dimensionId`
       * from a category identified by `id` and `dimensionTypeId`. If the deletion is
       * successful, it updates the local state to reflect the change. If the deletion
       * fails, it throws an error and handles it appropriately.
       *
       * @async
       * @function deleteDimension
       * @returns {Promise<string>} A message indicating the result of the deletion.
       * @throws Will throw an error if the deletion request fails.
       */
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
  /**
   * Edits an existing category with the provided details.
   *
   * This function validates the presence of a category ID and then attempts to update
   * the category using the provided `category` name and `description`. If the category ID
   * is invalid, it throws an error. If the update is successful, it updates the local state
   * and closes the edit modal. If the update fails, it throws an error and returns an error message.
   *
   * @async
   * @function EditCategory
   * @param {Object} e - The category details.
   * @param {string} e.category - The new name of the category.
   * @param {string} e.description - The new description of the category.
   * @returns {Promise<void>} A promise that resolves when the category is updated or an error occurs.
   * @throws Will throw an error if the category ID is invalid or if the update request fails.
   */
  const EditCategory = async (e: { category: string; description: string }): Promise<void> => {
    const { category, description } = e;

    if (!ids?.catId) {
      handleError.throw(new Error('Category ID is invalid. Please refresh the page.'));
      return;
    }

    /**
     * Updates the category with the provided details.
     *
     * This function sends a request to update the category identified by `ids.catId`
     * with the new `category` name and `description`. If the update is successful,
     * it updates the local state to reflect the changes and closes the edit modal.
     * If the update fails, it throws an error and returns an error message.
     *
     * @async
     * @function UpdateCategory
     * @returns {Promise<string>} A promise that resolves to a success message if the update is successful,
     *                            or an error message if the update fails.
     * @throws Will throw an error if the update request fails.
     */
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

  /**
   * EditProcess is an asynchronous function that updates the name of a style process
   * within a category. It first checks if the necessary IDs are available, and if not,
   * throws an error. If the IDs are valid, it proceeds to update the process name by
   * making an API call. Upon successful update, it updates the local state and closes
   * the modal. If an error occurs during the update, it handles the error appropriately.
   *
   * @param {Object} e - The event object containing the process name.
   * @param {string} e.processName - The new name for the style process.
   * @returns {Promise<void>} - A promise that resolves when the process is updated.
   */
  const EditProcess = async (e: { processName: string }): Promise<void> => {
    const { processName } = e;

    if (!ids?.catId || !ids?.styleProcessId) {
      handleError.throw(new Error('Category ID or Style Process ID is invalid. Please refresh the page.'));
      return;
    }

    /**
     * Updates the style process of a category by making an API call and updating the state.
     *
     * @async
     * @function UpdateProcess
     * @returns {Promise<string>} A message indicating the result of the update operation.
     * @throws Will throw an error if the API call fails.
     *
     * @example
     * // Example usage:
     * UpdateProcess().then((message) => {
     *   console.log(message);
     * }).catch((error) => {
     *   console.error(error);
     * });
     */
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

  /**
   * Edits the dimension type of a category.
   *
   * @param {Object} e - The event object containing the dimension type name.
   * @param {string} e.dimensionTypeName - The name of the dimension type to be updated.
   *
   * @throws Will throw an error if the category ID or dimension type ID is invalid.
   *
   * @returns {Promise<void>} A promise that resolves to a success message or an error message.
   *
   * The function performs the following steps:
   * 1. Validates the presence of category ID, style process ID, and style ID.
   * 2. Defines an asynchronous function `UpdateStyles` to update the style name.
   * 3. Makes an API call to update the style name.
   * 4. Updates the local state with the new style name if the API call is successful.
   * 5. Closes the modal if the update is successful.
   * 6. Throws an error if the API call fails.
   * 7. Displays a toast notification while the update is in progress.
   */
  const EditStyles = async (e: { styleName: string }): Promise<void> => {
    const { styleName } = e;

    if (!ids?.catId || !ids?.styleProcessId || !ids?.styleId) {
      handleError.throw(new Error('Category ID, Style Process ID, or Style ID is invalid. Please refresh the page.'));
      return;
    }

    /**
     * Updates the styles of a category by making an API call and updating the state.
     *
     * @async
     * @function UpdateStyles
     * @returns {Promise<string>} A message indicating the result of the update operation.
     *
     * @throws Will throw an error if the API call fails.
     *
     * @description
     * This function sends a request to update the style of a category using the provided category ID,
     * style process ID, and style ID. If the update is successful, it updates the local state with the
     * new style name. If the update fails, it throws an error and returns an error message.
     *
     * @example
     * ```typescript
     * await UpdateStyles();
     * ```
     */
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

  /**
   * EditDimension is an asynchronous function that updates the name of a dimension
   * within a category. It validates the presence of necessary IDs before proceeding
   * with the update. If any ID is missing, an error is thrown. The function then
   * attempts to update the dimension name via an API call. Upon successful update,
   * it updates the local state to reflect the changes and closes the modal. If the
   * update fails, an error is thrown and handled appropriately.
   *
   * @param {Object} e - The event object containing the dimension name.
   * @param {string} e.dimension - The new name of the dimension to be updated.
   * @returns {Promise<string | void>} - A promise that resolves to a success message
   * or void if an error occurs.
   */
  const EditDimension = async (e: { dimension: string }): Promise<string | void> => {
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

  /**
   * CustomButton component renders a button with optional tooltip and custom styling.
   *
   * @param {Object} props - The properties object.
   * @param {(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void} props.onClick - The click event handler for the button.
   * @param {React.ReactNode} props.children - The content to be displayed inside the button.
   * @param {string} [props.className] - Optional additional CSS classes for the button.
   * @param {string} [props.tooltip] - Optional tooltip text to be displayed on hover.
   * @returns {JSX.Element} The rendered button component.
   */
  const CustomButton = ({
    onClick,
    children,
    className,
    tooltip,
  }: {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    children: React.ReactNode;
    className?: string;
    tooltip?: string;
  }): JSX.Element => {
    return (
      <button className={`btn btn-sm ${className}`} onClick={onClick} data-tip={tooltip}>
        {children}
      </button>
    );
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

  return (
    <span className="h-full w-full overflow-x-hidden">
      {/* modals */}
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
      <span className="container w-full overflow-y-auto">
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
        <div className="flex grow flex-col items-center gap-2 rounded-box border border-base-300 p-2 shadow-2xl">
          <h1 className="m-1 w-max border-b border-base-content text-center text-xl font-bold">Categories</h1>
          <div className="flex h-auto w-full flex-col">
            <div className="flex flex-col items-start justify-between gap-2 max-sm:items-center">
              {category.map((cat: ICategory, catIndex: number) => (
                <span className="w-full" key={catIndex}>
                  <div className="w-full rounded-box border border-base-300 bg-base-200">
                    <div
                      className={
                        'flex w-full flex-row justify-between p-2 max-sm:w-full max-sm:max-w-full max-sm:flex-wrap max-sm:gap-2 max-sm:p-0'
                      }
                    >
                      <div className="flex w-full flex-col items-center gap-2 rounded-box border border-base-200 bg-base-300 p-2 max-sm:flex-col max-sm:items-start max-sm:p-2">
                        <div className="flex w-full flex-row px-2">
                          <span className="w-wax flex grow flex-row items-center gap-2 max-sm:w-full">
                            <div className="badge badge-success badge-md flex flex-row flex-wrap gap-1 rounded-lg font-bold max-sm:flex-col">
                              Name:
                              <span>{cat.categoryName}</span>
                            </div>
                            <div className="badge badge-warning badge-md flex flex-row flex-wrap gap-1 rounded-lg font-bold max-sm:flex-col">
                              Description:
                              <span>{cat.description}</span>
                            </div>
                          </span>
                          <div className="ml-1 flex flex-row items-center justify-center gap-2 max-sm:mb-2 max-sm:mr-2 max-sm:w-fit max-sm:flex-row max-sm:justify-end max-sm:pr-2">
                            <CustomButton
                              className="btn-secondary btn-sm tooltip tooltip-left px-1"
                              tooltip="Edit Category"
                              onClick={() => {
                                setIdsState(cat._id.toString());
                                openModal('editCategory');
                              }}
                            >
                              <PencilSquareIcon className="h-6 w-6 text-secondary-content" />
                            </CustomButton>
                            <button
                              className="btn btn-error btn-sm tooltip tooltip-left px-1"
                              data-tip="Delete Category"
                              onClick={DelCategory(cat._id.toString())}
                            >
                              <TrashIcon className="h-6 w-6 text-error-content" />
                            </button>
                          </div>
                        </div>
                        <div className="mx-2 flex w-full flex-col gap-1 max-sm:m-0">
                          <details className="collapse collapse-arrow border border-base-100 bg-base-200 shadow">
                            <summary className="collapse-title text-xl font-medium">
                              <div className="flex flex-row items-center justify-between gap-2">
                                <p className="label-text w-max">Styles</p>
                                <button
                                  className="btn btn-primary btn-sm tooltip tooltip-left px-1 max-sm:p-2"
                                  data-tip="Add Process"
                                  onClick={() => {
                                    setIds({
                                      catId: cat._id.toString() as string,
                                      styleProcessId: '',
                                      styleId: '',
                                      dimensionTypeId: '',
                                      dimensionId: '',
                                    } as IIds);
                                    openModal('addProcess');
                                  }}
                                >
                                  <PlusCircleIcon className="h-6 w-6 text-primary-content max-sm:hidden" />
                                  <span className="hidden max-sm:flex">Add</span>
                                </button>
                              </div>
                            </summary>
                            <div className="collapse-content flex flex-col gap-1 bg-base-100 pt-2">
                              <p className="label label-text-alt w-max">Style Process:</p>
                              {cat.styleProcess?.map((styleProcess: IStyleProcess, styleProcessIndex: number) => (
                                <div key={styleProcessIndex}>
                                  <details className="collapse collapse-arrow border-2 border-base-300 bg-base-200">
                                    <summary className="collapse-title text-xl font-medium">
                                      <div className="flex flex-row items-center justify-between">
                                        <p className="label label-text">{styleProcess.styleProcessName}</p>
                                        <span className="mr-2 flex flex-row gap-1">
                                          <button
                                            className="btn btn-primary btn-sm tooltip tooltip-left px-1"
                                            data-tip="Add Style"
                                            onClick={() => {
                                              setIds({
                                                ...ids,
                                                catId: cat._id.toString() as string,
                                                styleProcessId: styleProcess._id.toString(),
                                                styleId: '',
                                                dimensionTypeId: '',
                                                dimensionId: '',
                                              } as IIds);
                                              openModal('addStyle');
                                            }}
                                          >
                                            <PlusCircleIcon className="h-6 w-6 text-primary-content" />
                                          </button>
                                          <button
                                            className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                            data-tip="Edit Process"
                                            onClick={() => {
                                              setIds({
                                                ...ids,
                                                catId: cat._id.toString() as string,
                                                styleProcessId: styleProcess._id.toString(),
                                              } as IIds);
                                              openModal('editProcess');
                                            }}
                                          >
                                            <PencilSquareIcon className="h-6 w-6 text-secondary-content" />
                                          </button>
                                          <button
                                            className="btn btn-error btn-sm tooltip tooltip-left px-1"
                                            data-tip="Delete Process"
                                            onClick={DelProcess(cat._id.toString(), styleProcess._id.toString())}
                                          >
                                            <TrashIcon className="h-6 w-6 text-error-content" />
                                          </button>
                                        </span>
                                      </div>
                                    </summary>
                                    <div className="collapse-content transform transition-all">
                                      <div className="m-1 flex max-h-56 flex-col gap-2 overflow-auto rounded-box bg-base-300 p-2">
                                        <p className="label label-text-alt w-max">Styles:</p>
                                        {styleProcess.styles.map((style: IStyle, styleIndex: number) => (
                                          <div key={styleIndex} className="flex flex-row items-center justify-between">
                                            <p className="label label-text">{style.styleName}</p>
                                            <span className="mr-2 flex flex-row gap-1">
                                              <button
                                                className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                                data-tip="Edit Style"
                                                onClick={() => {
                                                  setIds({
                                                    ...ids,
                                                    catId: cat._id.toString(),
                                                    styleProcessId: styleProcess._id.toString(),
                                                    styleId: style._id.toString(),
                                                  } as IIds);
                                                  openModal('editStyle');
                                                }}
                                              >
                                                <PencilSquareIcon className="h-6 w-6 text-secondary-content" />
                                              </button>
                                              <button
                                                className="btn btn-error btn-sm tooltip tooltip-left px-1"
                                                data-tip="Delete Style"
                                                onClick={DelStyle(
                                                  cat._id.toString(),
                                                  styleProcess._id.toString(),
                                                  style._id.toString(),
                                                )}
                                              >
                                                <TrashIcon className="h-6 w-6 text-error-content" />
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
                          <details className="collapse collapse-arrow border border-base-100 bg-base-200 shadow">
                            <summary className="collapse-title text-xl font-medium">
                              <div className="flex flex-row items-center justify-between gap-2">
                                <p className="label-text w-max">Dimensions</p>
                                <button
                                  className="btn btn-primary btn-sm tooltip tooltip-left px-1 max-sm:p-2"
                                  data-tip="Add Dimension Type"
                                  onClick={() => {
                                    setIds({
                                      catId: cat._id.toString() as string,
                                      styleProcessId: '',
                                      styleId: '',
                                      dimensionTypeId: '',
                                      dimensionId: '',
                                    } as IIds);
                                    openModal('addDimensionTypes');
                                  }}
                                >
                                  <PlusCircleIcon className="h-6 w-6 text-primary-content max-sm:hidden" />
                                  <span className="hidden max-sm:flex">Add</span>
                                </button>
                              </div>
                            </summary>
                            <div className="collapse-content flex flex-col gap-1 bg-base-100 pt-2">
                              <p className="label label-text-alt w-max">Dimension Types:</p>
                              {cat.dimensionTypes?.map((DimensionType: IDimensionTypes, typIndex: number) => (
                                <div key={typIndex}>
                                  <details className="collapse collapse-arrow border-2 border-base-300 bg-base-200">
                                    <summary className="collapse-title text-xl font-medium">
                                      <div className="flex flex-row items-center justify-between">
                                        <p className="label label-text">{DimensionType.dimensionTypeName}</p>
                                        <span className="mr-2 flex flex-row gap-1">
                                          <button
                                            className="btn btn-primary btn-sm tooltip tooltip-left px-1"
                                            data-tip="Add Dimension"
                                            onClick={() => {
                                              setIds({
                                                catId: cat._id.toString() as string,
                                                styleProcessId: '',
                                                styleId: '',
                                                dimensionTypeId: DimensionType._id.toString(),
                                                dimensionId: '',
                                              } as IIds);
                                              openModal('addDimension');
                                            }}
                                          >
                                            <PlusCircleIcon className="h-6 w-6 text-primary-content" />
                                          </button>
                                          <button
                                            className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                            data-tip="Edit Type"
                                            onClick={() => {
                                              setIds({
                                                ...ids,
                                                catId: cat._id.toString() as string,
                                                dimensionTypeId: DimensionType._id.toString() as string,
                                              } as IIds);
                                              openModal('editDimensionType');
                                            }}
                                          >
                                            <PencilSquareIcon className="h-6 w-6 text-secondary-content" />
                                          </button>
                                          <button
                                            className="btn btn-error btn-sm tooltip tooltip-left px-1"
                                            data-tip="Delete Type"
                                            onClick={DelDimensionType(
                                              cat._id.toString() as string,
                                              DimensionType._id.toString() as string,
                                            )}
                                          >
                                            <TrashIcon className="h-6 w-6 text-error-content" />
                                          </button>
                                        </span>
                                      </div>
                                    </summary>
                                    <div className="collapse-content transform transition-all">
                                      <div className="m-1 flex max-h-56 flex-col gap-2 overflow-auto rounded-box bg-base-300 p-2">
                                        <p className="label label-text-alt w-max">Dimensions:</p>
                                        {DimensionType.dimensions?.map(
                                          (dimension: IDimensions, dimensionIndex: number) => (
                                            <div
                                              key={dimensionIndex}
                                              className="flex flex-row items-center justify-between"
                                            >
                                              <p className="label label-text">{dimension.dimensionName}</p>
                                              <span className="mr-2 flex flex-row gap-1">
                                                <button
                                                  className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                                  data-tip="Edit Dimension"
                                                  onClick={() => {
                                                    setIds({
                                                      catId: cat._id.toString() as string,
                                                      styleProcessId: '',
                                                      styleId: '',
                                                      dimensionTypeId: DimensionType._id.toString() as string,
                                                      dimensionId: dimension._id.toString() as string,
                                                    } as IIds);
                                                    openModal('editDimension');
                                                  }}
                                                >
                                                  <PencilSquareIcon className="h-6 w-6 text-secondary-content" />
                                                </button>
                                                <button
                                                  className="btn btn-error btn-sm tooltip tooltip-left px-1"
                                                  data-tip="Delete Dimension"
                                                  onClick={DelDimension(
                                                    cat._id.toString() as string,
                                                    DimensionType._id.toString() as string,
                                                    dimension._id.toString() as string,
                                                  )}
                                                >
                                                  <TrashIcon className="h-6 w-6 text-error-content" />
                                                </button>
                                              </span>
                                            </div>
                                          ),
                                        )}
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
                  <div className={`${catIndex === category.length - 1 ? 'hidden' : ''} w-full px-2`}>
                    <hr className={'divider divider-primary my-1 h-0.5 w-full divide-dashed rounded-box border-0'} />
                  </div>
                </span>
              ))}
            </div>
          </div>
        </div>
      </span>
    </span>
  );
}
