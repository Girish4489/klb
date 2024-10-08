'use client';
import { userConfirmation } from '@/app/util/confirmation/confirmationUtil';
import handleError from '@/app/util/error/handleError';
import { ApiGet, ApiPost } from '@/app/util/makeApiRequest/makeApiRequest';
import { FormModal, closeModal, openModal } from '@/app/util/modal/modals';
import { ICategory, IDimension, IDimensionType, IStyle, IStyleProcess } from '@/models/klm';
import Image from 'next/image';
import React from 'react';
import toast from 'react-hot-toast';

export default function CategoryPage() {
  interface IIds {
    catId: string;
    styleProcessId: string;
    styleId: string;
    dimensionTypeId: string;
    dimensionId: string;
  }

  const [category, setCategory] = React.useState<ICategory[]>([]);
  const [ids, setIds] = React.useState<IIds>();
  const isMounted = React.useRef(false);

  const GetCategory = async () => {
    try {
      const res = await ApiGet.Category();
      setCategory(res.categories);
    } catch (error) {
      // console.error(error);
      handleError.log(error);
    }
  };

  React.useEffect(() => {
    if (isMounted.current) return;
    GetCategory();
    isMounted.current = true;
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const configureToastPromise = async (promise: Promise<any>, loadingMessage: string) => {
    try {
      await toast.promise(promise, {
        loading: loadingMessage,
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
    } catch (error) {
      handleError.log(error);
    }
  };

  const AddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const category = e.currentTarget.category.value;
    const description = e.currentTarget.description.value;

    const saveCategory = async () => {
      try {
        const res = await ApiPost.Category('addCategory', { categoryName: category, description });
        if (res.success === true) {
          setCategory((prevCategory) => [...prevCategory, res.data]);
          return res.message;
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        handleError.throw(error);
      }
    };
    await configureToastPromise(saveCategory(), 'Adding Category...');
  };

  const AddProcess = async (e: { styleProcess: string }) => {
    const { styleProcess } = e;

    const saveProcess = async () => {
      try {
        const res = await ApiPost.Category('addProcess', {
          categoryId: ids?.catId,
          styleProcessName: styleProcess,
        });
        if (res.success === true) {
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
        // throw new Error(error);
        handleError.throw(error);
      }
    };
    await configureToastPromise(saveProcess(), 'Adding Process...');
  };

  const AddTypeDimension = async (e: { dimensionType: string }) => {
    const { dimensionType } = e;

    const saveDimension = async () => {
      try {
        const res = await ApiPost.Category('addTypeDimension', {
          categoryId: ids?.catId,
          dimensionTypeName: dimensionType,
        });

        if (res.success === true) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension ? [...cat.dimension, res.data] : [res.data],
                  } as ICategory;
                }
                return cat as ICategory;
              }) as ICategory[],
          );
          closeModal('addTypeDimension');
          return res.message;
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        // throw new Error(error);
        handleError.throw(error);
      }
    };
    await configureToastPromise(saveDimension(), 'Adding Dimension Type...');
  };

  const AddDimension = async (e: { dimension: string }) => {
    const { dimension } = e;

    const saveDimension = async () => {
      try {
        const res = await ApiPost.Category('addDimension', {
          categoryId: ids?.catId,
          dimensionTypeId: ids?.dimensionTypeId,
          dimensionName: dimension,
        });
        if (res.success === true) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension?.map((dimensionType) => {
                      if ((dimensionType as IDimension)?._id.toString() === ids?.dimensionTypeId) {
                        return {
                          ...(dimensionType as IDimension),
                          dimensionTypes: dimensionType.dimensionTypes
                            ? [...(dimensionType.dimensionTypes as IDimensionType[]), res.data]
                            : [res.data],
                        };
                      }
                      return dimensionType;
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
        // throw new Error(error);
        handleError.throw(error);
      }
    };
    await configureToastPromise(saveDimension(), 'Adding Dimension...');
  };

  const AddStyle = async (e: { catStyle: string }) => {
    const { catStyle } = e;
    const saveStyle = async () => {
      try {
        const res = await ApiPost.Category('addStyle', {
          categoryId: ids?.catId,
          styleProcessId: ids?.styleProcessId,
          styleName: catStyle,
        });

        if (res.success === true) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess) => {
                      if ((styleProcess as IStyleProcess)?._id.toString() === ids?.styleProcessId) {
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
        // throw new Error(error);
        handleError.throw(error);
      }
    };
    await configureToastPromise(saveStyle(), 'Adding Style...');
  };

  const DelCategory = (id: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const confirmed = await userConfirmation({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this category?',
    });
    if (!confirmed) return;
    const deleteCategory = async () => {
      try {
        const res = await ApiPost.Category('delCategory', {
          categoryId: id,
        });
        if (res.success === true) {
          setCategory(category.filter((cat) => cat._id.toString() !== id));
          return res.message;
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        // throw new Error(error);
        handleError.throw(error);
      }
    };
    await configureToastPromise(deleteCategory(), 'Deleting Category...');
  };

  const DelProcess =
    (id: string, styleProcessId: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this process?',
      });
      if (!confirmed) return;
      const deleteProcess = async () => {
        try {
          const res = await ApiPost.Category('delProcess', {
            categoryId: id,
            styleProcessId: styleProcessId,
          });
          if (res.success === true) {
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
          // throw new Error(error);
          handleError.throw(error);
        }
      };
      await configureToastPromise(deleteProcess(), 'Deleting Process...');
    };

  const DelTypeDimension =
    (id: string, dimensionTypeId: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this dimension type?',
      });
      if (!confirmed) return;
      const deleteDimensionType = async () => {
        try {
          const res = await ApiPost.Category('delTypeDimension', {
            categoryId: id,
            dimensionTypeId: dimensionTypeId,
          });
          if (res.success === true) {
            setCategory(
              category.map((cat) => {
                if (cat._id.toString() === id) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension?.filter(
                      (dimensionType: IDimension) => dimensionType && dimensionType._id.toString() !== dimensionTypeId,
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
        }
      };
      await configureToastPromise(deleteDimensionType(), 'Deleting Dimension Type...');
    };

  const DelStyle =
    (id: string, styleProcessId: string, styleId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this style?',
      });
      if (!confirmed) return;
      const deleteStyle = async () => {
        try {
          const res = await ApiPost.Category('delStyle', {
            categoryId: id,
            styleProcessId: styleProcessId,
            styleId: styleId,
          });
          if (res.success === true) {
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
        }
      };
      await configureToastPromise(deleteStyle(), 'Deleting Style...');
    };

  const DelDimension =
    (id: string, dimensionTypeId: string, dimensionId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const confirmed = await userConfirmation({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this dimension?',
      });
      if (!confirmed) return;
      const deleteDimension = async () => {
        try {
          const res = await ApiPost.Category('delDimension', {
            categoryId: id,
            dimensionTypeId: dimensionTypeId,
            dimensionId: dimensionId,
          });
          if (res.success === true) {
            setCategory(
              category.map((cat) => {
                if (cat._id.toString() === id) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension?.map((dimensionType: IDimension) => {
                      if ((dimensionType as IDimension)?._id.toString() === dimensionTypeId) {
                        return {
                          ...dimensionType,
                          dimensionTypes: Array.isArray(dimensionType.dimensionTypes)
                            ? dimensionType.dimensionTypes.filter(
                                (dimension: IDimensionType) => dimension && dimension._id.toString() !== dimensionId,
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
        }
      };
      await configureToastPromise(deleteDimension(), 'Deleting Dimension...');
    };

  // edit logic

  const EditCategory = async (e: { category: string; description: string }) => {
    const { category, description } = e;
    const UpdateCategory = async () => {
      try {
        const res = await ApiPost.Category('editCategory', {
          categoryId: ids?.catId,
          categoryName: category,
          description: description,
        });
        if (res.success === true) {
          setCategory((prevCategory) =>
            prevCategory.map((cat: ICategory) => {
              if (cat._id.toString() === ids?.catId) {
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
        // throw new Error(error);
        handleError.throw(error);
      }
    };
    await configureToastPromise(UpdateCategory(), 'Updating Category...');
  };

  const EditProcess = async (e: { processName: string }) => {
    const { processName } = e;
    const UpdateProcess = async () => {
      try {
        const res = await ApiPost.Category('editProcess', {
          categoryId: ids?.catId,
          styleProcessId: ids?.styleProcessId,
          styleProcessName: processName,
        });
        if (res.success === true) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess: IStyleProcess) => {
                      if (styleProcess?._id.toString() === ids?.styleProcessId) {
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
        // throw new Error(error);
        handleError.throw(error);
      }
    };
    await configureToastPromise(UpdateProcess(), 'Updating Process...');
  };

  const EditTypeDimension = async (e: { dimensionType: string }) => {
    const { dimensionType } = e;
    const UpdateDimension = async () => {
      try {
        const res = await ApiPost.Category('editTypeDimension', {
          categoryId: ids?.catId,
          dimensionTypeId: ids?.dimensionTypeId,
          dimensionTypeName: dimensionType,
        });
        if (res.success === true) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension?.map((dimTyp: IDimension) => {
                      if (dimTyp?._id.toString() === ids?.dimensionTypeId) {
                        return {
                          ...dimTyp,
                          dimensionTypeName: dimensionType,
                        };
                      }
                      return dimTyp;
                    }),
                  } as ICategory;
                }
                return cat as ICategory;
              }) as ICategory[],
          );
          closeModal('editTypeDimension');
          return res.message;
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        // throw new Error(error);
        handleError.throw(error);
      }
    };
    await configureToastPromise(UpdateDimension(), 'Updating Dimension...');
  };

  const EditStyles = async (e: { styleName: string }) => {
    const { styleName } = e;
    const UpdateStyles = async () => {
      try {
        const res = await ApiPost.Category('editStyle', {
          categoryId: ids?.catId,
          styleProcessId: ids?.styleProcessId,
          styleId: ids?.styleId,
          styleName: styleName,
        });
        if (res.success === true) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess: IStyleProcess) => {
                      if (styleProcess?._id.toString() === ids?.styleProcessId) {
                        return {
                          ...styleProcess,
                          styles: Array.isArray(styleProcess.styles)
                            ? styleProcess.styles.map((style: IStyle) => {
                                if (style?._id.toString() === ids?.styleId) {
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
        // throw new Error(error);
        handleError.throw(error);
      }
    };
    await configureToastPromise(UpdateStyles(), 'Updating Style...');
  };

  const EditDimension = async (e: { dimension: string }) => {
    const { dimension } = e;
    const UpdateDimension = async () => {
      try {
        const res = await ApiPost.Category('editDimension', {
          categoryId: ids?.catId,
          dimensionTypeId: ids?.dimensionTypeId,
          dimensionId: ids?.dimensionId,
          dimensionName: dimension,
        });
        if (res.success === true) {
          setCategory(
            (prevCategory) =>
              prevCategory.map((cat) => {
                if (cat._id.toString() === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension?.map((dimTyp: IDimension) => {
                      if (dimTyp?._id.toString() === ids?.dimensionTypeId) {
                        return {
                          ...dimTyp,
                          dimensionTypes: Array.isArray(dimTyp.dimensionTypes)
                            ? dimTyp.dimensionTypes.map((dim: IDimensionType) => {
                                if (dim?._id.toString() === ids?.dimensionId) {
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
        // throw new Error(error);
        handleError.throw(error);
      }
    };
    await configureToastPromise(UpdateDimension(), 'Updating Dimension...');
  };

  return (
    <span className="h-full w-full overflow-x-hidden">
      {/* modals */}
      <span>
        <FormModal
          id="editCategory"
          title="Edit Category"
          onSubmit={(formData) => EditCategory(formData as { category: string; description: string })}
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
          id="addTypeDimension"
          title="Add Dimension Type"
          onSubmit={(formData) => AddTypeDimension({ dimensionType: formData.dimensionType })}
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
          id="editTypeDimension"
          title="Edit Dimension Type"
          onSubmit={(formData) => EditTypeDimension({ dimensionType: formData.dimensionType })}
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
          id="addDimension"
          title="Add Dimension"
          onSubmit={(formData) => AddDimension({ dimension: formData.dimension })}
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
      </span>
      <span className="container w-full overflow-y-auto">
        <div className="w-full rounded-box border-2 border-base-300 p-2 shadow-lg">
          <h1 className="text-center text-2xl font-bold">Category</h1>
          <form
            onSubmit={AddCategory}
            className="m-2 mt-1 flex flex-row items-center gap-2 p-2 pt-0 max-sm:max-w-full max-sm:flex-col max-sm:items-start"
          >
            <label htmlFor="category" className="label">
              Category
            </label>
            <input
              type="text"
              placeholder="Category Name"
              className="input input-sm input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
              required
              spellCheck="true"
              name="category"
              id="category"
              onFocus={(e) => e.currentTarget.select()}
            />
            <label htmlFor="description" className="label label-text">
              Description
            </label>
            <input
              type="text"
              placeholder="Category Description"
              className="input input-sm input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
              name="description"
              id="description"
              onFocus={(e) => e.currentTarget.select()}
            />
            <span className="max-sm:flex max-sm:w-full max-sm:justify-end">
              <button
                className="btn btn-primary form-control btn-sm tooltip tooltip-right flex items-center self-end"
                data-tip="Add Category"
              >
                <Image
                  src="/icons/svg/plus-circle.svg"
                  alt="Add Category"
                  width={32}
                  height={32}
                  className="h-auto w-8 max-sm:hidden"
                />
                <span className="hidden max-sm:flex">Add</span>
              </button>
            </span>
          </form>
          <p className="text-start text-sm text-warning max-sm:text-center">
            Note: General users can view this page for informational purposes. Edits are reserved for authorized
            personnel.
          </p>
        </div>
        <div className="flex grow flex-col items-center gap-2 rounded-box border border-base-300 p-2 shadow-2xl">
          <h1 className="m-1 w-max border-b border-base-content text-center text-xl font-bold">Categories</h1>
          <div className="flex h-auto w-full flex-col">
            <div className="flex flex-col items-start justify-between gap-2 max-sm:items-center">
              {category.map((cat, index) => (
                <div key={cat.categoryName} className="w-full rounded-box border border-base-300 bg-base-200">
                  <div
                    className={
                      'flex w-full flex-row justify-between p-2 max-sm:w-full max-sm:max-w-full max-sm:flex-wrap max-sm:gap-2 max-sm:p-0'
                    }
                  >
                    <div className="flex w-full flex-row items-center gap-2 rounded-box border border-base-200 bg-base-300 p-2 max-sm:flex-col max-sm:items-start max-sm:p-2">
                      <div className="form-control w-min max-sm:w-full">
                        <p className="label flex flex-row flex-wrap gap-1 font-bold">
                          <span className="label-text">Name:</span>
                          <span className="">{cat.categoryName}</span>
                        </p>
                        <p className="label flex flex-row flex-wrap gap-1">
                          <span className="label-text">Description:</span>
                          <span className="">{cat.description}</span>
                        </p>
                      </div>
                      <div className="mx-2 flex w-full flex-col gap-1 max-sm:m-0">
                        <details className="collapse collapse-arrow border border-base-100 bg-base-200 shadow">
                          <summary className="collapse-title text-xl font-medium">
                            <div className="flex flex-row items-center justify-between gap-2 p-1">
                              <p className="label-text w-max">Styles</p>
                              <button
                                className="btn btn-primary btn-sm tooltip tooltip-left"
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
                                <Image
                                  src="/icons/svg/plus-circle.svg"
                                  alt="Add"
                                  width={32}
                                  height={32}
                                  className="h-auto w-8 max-sm:hidden"
                                />
                                <span className="hidden max-sm:flex">Add</span>
                              </button>
                            </div>
                          </summary>
                          <div className="collapse-content flex flex-col gap-1 bg-base-100 pt-4">
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
                                          <Image
                                            src="/icons/svg/plus-circle.svg"
                                            alt="Add"
                                            width={32}
                                            height={32}
                                            className="h-auto w-7"
                                          />
                                        </button>
                                        <button
                                          className="btn btn-primary btn-sm tooltip tooltip-left px-1"
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
                                          <Image
                                            src="/icons/svg/note-pencil.svg"
                                            alt="Edit"
                                            width={32}
                                            height={32}
                                            className="h-auto w-7"
                                          />
                                        </button>
                                        <button
                                          className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                          data-tip="Delete Process"
                                          onClick={DelProcess(cat._id.toString(), styleProcess._id.toString())}
                                        >
                                          <Image
                                            src="/icons/svg/trash.svg"
                                            alt="Delete"
                                            width={32}
                                            height={32}
                                            className="h-auto w-7"
                                          />
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
                                              className="btn btn-primary btn-sm tooltip tooltip-left px-1"
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
                                              <Image
                                                src="/icons/svg/note-pencil.svg"
                                                alt="Edit"
                                                width={32}
                                                height={32}
                                                className="h-auto w-7"
                                              />
                                            </button>
                                            <button
                                              className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                              data-tip="Delete Style"
                                              onClick={DelStyle(
                                                cat._id.toString(),
                                                styleProcess._id.toString(),
                                                style._id.toString(),
                                              )}
                                            >
                                              <Image
                                                src="/icons/svg/trash.svg"
                                                alt="Delete"
                                                width={32}
                                                height={32}
                                                className="h-auto w-7"
                                              />
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
                            <div className="flex flex-row items-center justify-between gap-2 p-1">
                              <p className="label-text w-max">Dimensions</p>
                              <button
                                className="btn btn-primary btn-sm tooltip tooltip-left"
                                data-tip="Add Dimension Type"
                                onClick={() => {
                                  setIds({
                                    catId: cat._id.toString(),
                                    styleProcessId: '',
                                    styleId: '',
                                    dimensionTypeId: '',
                                    dimensionId: '',
                                  } as IIds);
                                  openModal('addTypeDimension');
                                }}
                              >
                                <Image
                                  src="/icons/svg/plus-circle.svg"
                                  alt="Add"
                                  width={32}
                                  height={32}
                                  className="h-auto w-8 max-sm:hidden"
                                />
                                <span className="hidden max-sm:flex">Add</span>
                              </button>
                            </div>
                          </summary>
                          <div className="collapse-content flex flex-col gap-1 bg-base-100 pt-4">
                            <p className="label label-text-alt w-max">Dimension Types:</p>
                            {cat.dimension?.map((typ: IDimension, typIndex: number) => (
                              <div key={typIndex}>
                                <details className="collapse collapse-arrow border-2 border-base-300 bg-base-200">
                                  <summary className="collapse-title text-xl font-medium">
                                    <div className="flex flex-row items-center justify-between">
                                      <p className="label label-text">{typ.dimensionTypeName}</p>
                                      <span className="mr-2 flex flex-row gap-1">
                                        <button
                                          className="btn btn-primary btn-sm tooltip tooltip-left px-1"
                                          data-tip="Add Dimension"
                                          onClick={() => {
                                            setIds({
                                              ...ids,
                                              catId: cat._id.toString(),
                                              dimensionTypeId: typ._id.toString(),
                                            } as IIds);
                                            openModal('addDimension');
                                          }}
                                        >
                                          <Image
                                            src="/icons/svg/plus-circle.svg"
                                            alt="Add"
                                            width={32}
                                            height={32}
                                            className="h-auto w-7"
                                          />
                                        </button>
                                        <button
                                          className="btn btn-primary btn-sm tooltip tooltip-left px-1"
                                          data-tip="Edit Type"
                                          onClick={() => {
                                            setIds({
                                              ...ids,
                                              catId: cat._id.toString(),
                                              dimensionTypeId: typ._id.toString(),
                                            } as IIds);
                                            openModal('editTypeDimension');
                                          }}
                                        >
                                          <Image
                                            src="/icons/svg/note-pencil.svg"
                                            alt="Edit"
                                            width={32}
                                            height={32}
                                            className="h-auto w-7"
                                          />
                                        </button>
                                        <button
                                          className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                          data-tip="Delete Type"
                                          onClick={() => DelTypeDimension(cat._id.toString(), typ._id.toString())}
                                        >
                                          <Image
                                            src="/icons/svg/trash.svg"
                                            alt="Delete"
                                            width={32}
                                            height={32}
                                            className="h-auto w-7"
                                          />
                                        </button>
                                      </span>
                                    </div>
                                  </summary>
                                  <div className="collapse-content transform transition-all">
                                    <div className="m-1 flex max-h-56 flex-col gap-2 overflow-auto rounded-box bg-base-300 p-2">
                                      <p className="label label-text-alt w-max">Dimensions:</p>
                                      {typ.dimensionTypes?.map((dimension: IDimensionType, dimensionIndex: number) => (
                                        <div
                                          key={dimensionIndex}
                                          className="flex flex-row items-center justify-between"
                                        >
                                          <p className="label label-text">{dimension.dimensionName}</p>
                                          <span className="mr-2 flex flex-row gap-1">
                                            <button
                                              className="btn btn-primary btn-sm tooltip tooltip-left px-1"
                                              data-tip="Edit Dimension"
                                              onClick={() => {
                                                setIds({
                                                  catId: cat._id.toString(),
                                                  styleProcessId: '',
                                                  styleId: '',
                                                  dimensionTypeId: typ._id.toString(),
                                                  dimensionId: dimension._id.toString(),
                                                } as IIds);
                                                openModal('editDimension');
                                              }}
                                            >
                                              <Image
                                                src="/icons/svg/note-pencil.svg"
                                                alt="Edit"
                                                width={32}
                                                height={32}
                                                className="h-auto w-7"
                                              />
                                            </button>
                                            <button
                                              className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                                              data-tip="Delete Style"
                                              onClick={DelDimension(
                                                cat._id.toString(),
                                                typ._id.toString(),
                                                dimension._id.toString(),
                                              )}
                                            >
                                              <Image
                                                src="/icons/svg/trash.svg"
                                                alt="Delete"
                                                width={32}
                                                height={32}
                                                className="h-auto w-7"
                                              />
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
                    <div className="ml-1 flex flex-col items-center justify-center gap-2 max-sm:mb-2 max-sm:mr-2 max-sm:w-full max-sm:flex-row max-sm:justify-end max-sm:pr-2">
                      <button
                        className="btn btn-primary btn-sm tooltip tooltip-left px-1"
                        data-tip="Edit Category"
                        onClick={() => {
                          setIds({
                            catId: cat._id.toString(),
                            styleProcessId: '',
                            styleId: '',
                            dimensionTypeId: '',
                            dimensionId: '',
                          } as IIds);
                          openModal('editCategory');
                        }}
                      >
                        <Image
                          src="/icons/svg/note-pencil.svg"
                          alt="Edit"
                          width={32}
                          height={32}
                          className="h-auto w-7"
                        />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm tooltip tooltip-left px-1"
                        data-tip="Delete Category"
                        onClick={DelCategory(cat._id.toString())}
                      >
                        <Image src="/icons/svg/trash.svg" alt="Delete" width={32} height={32} className="h-auto w-7" />
                      </button>
                    </div>
                  </div>
                  <div className={`${index === category.length - 1 ? 'hidden' : ''} px-2`}>
                    <hr className={'h-0.5 w-full rounded-box border-0 bg-base-content'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </span>
    </span>
  );
}
