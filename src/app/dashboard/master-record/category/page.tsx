'use client';
import { userConfirmaion } from '@/app/util/confirmation/confirmationUtil';
import { ApiGet, ApiPost } from '@/app/util/makeApiRequest/makeApiRequest';
import { FormModal, closeModal, openModal } from '@/app/util/modal/modals';
import { ICategory } from '@/models/klm';
import Image from 'next/image';
import React from 'react';
import toast from 'react-hot-toast';

export default function CategoryPage() {
  interface IIds {
    catId: String;
    styleProcessId: String;
    styleId: String;
    dimensionTypeId: String;
    dimensionId: String;
  }

  const [category, setCategory] = React.useState<ICategory[]>([]);
  const [ids, setIds] = React.useState<IIds>();
  const isMounted = React.useRef(false);

  const GetCategory = async () => {
    try {
      const res = await ApiGet.Category();
      setCategory(res.categories);
    } catch (error: any) {
      // console.error(error);
    }
  };

  React.useEffect(() => {
    if (isMounted.current) return;
    GetCategory();
    isMounted.current = true;
  }, []);

  const configureToastPromise = async (promise: Promise<any>, loadingMessage: string) => {
    try {
      await toast.promise(promise, {
        loading: loadingMessage,
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
    } catch (error) {}
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
      } catch (error: any) {
        throw new Error(error);
      }
    };
    await configureToastPromise(saveCategory(), 'Adding Category...');
  };

  const AddProcess = async (e: any) => {
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
                if (cat._id === ids?.catId) {
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
      } catch (error: any) {
        throw new Error(error);
      }
    };
    await configureToastPromise(saveProcess(), 'Adding Process...');
  };

  const AddTypeDimension = async (e: any) => {
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
                if (cat._id === ids?.catId) {
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
      } catch (error: any) {
        throw new Error(error);
      }
    };
    await configureToastPromise(saveDimension(), 'Adding Dimension Type...');
  };

  const AddDimension = async (e: any) => {
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
                if (cat._id === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension?.map((dimensionType) => {
                      if ((dimensionType as any)?._id === ids?.dimensionTypeId) {
                        return {
                          ...(dimensionType as any),
                          dimensionTypes: dimensionType.dimensionTypes
                            ? [...(dimensionType.dimensionTypes as any), res.data]
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
      } catch (error: any) {
        throw new Error(error);
      }
    };
    await configureToastPromise(saveDimension(), 'Adding Dimension...');
  };

  const AddStyle = async (e: any) => {
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
                if (cat._id === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess) => {
                      if ((styleProcess as any)?._id === ids?.styleProcessId) {
                        return {
                          ...(styleProcess as any),
                          styles: styleProcess.styles ? [...(styleProcess.styles as any), res.data] : [res.data],
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
      } catch (error: any) {
        throw new Error(error);
      }
    };
    await configureToastPromise(saveStyle(), 'Adding Style...');
  };

  const DelCategory = (id: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const confirmed = await userConfirmaion({
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
          setCategory(category.filter((cat) => cat._id !== id));
          return res.message;
        } else {
          throw new Error(res.message);
        }
      } catch (error: any) {
        throw new Error(error);
      }
    };
    await configureToastPromise(deleteCategory(), 'Deleting Category...');
  };

  const DelProcess =
    (id: string, styleProcessId: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const confirmed = await userConfirmaion({
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
                if (cat._id === id) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.filter(
                      (styleProcess) => styleProcess && (styleProcess as any)._id !== styleProcessId,
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
        } catch (error: any) {
          throw new Error(error);
        }
      };
      await configureToastPromise(deleteProcess(), 'Deleting Process...');
    };

  const DelTypeDimension =
    (id: string, dimensionTypeId: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const confirmed = await userConfirmaion({
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
                if (cat._id === id) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension?.filter(
                      (dimensionType) => dimensionType && (dimensionType as any)._id !== dimensionTypeId,
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
        } catch (error: any) {
          throw new Error(error);
        }
      };
      await configureToastPromise(deleteDimensionType(), 'Deleting Dimension Type...');
    };

  const DelStyle =
    (id: string, styleProcessId: string, styleId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const confirmed = await userConfirmaion({
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
                if (cat._id === id) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess) => {
                      if ((styleProcess as any)?._id === styleProcessId) {
                        return {
                          ...(styleProcess as any),
                          styles: Array.isArray(styleProcess.styles)
                            ? styleProcess.styles.filter((style) => style && (style as any)._id !== styleId)
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
        } catch (error: any) {
          throw new Error(error);
        }
      };
      await configureToastPromise(deleteStyle(), 'Deleting Style...');
    };

  const DelDimension =
    (id: string, dimensionTypeId: string, dimensionId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const confirmed = await userConfirmaion({
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
                if (cat._id === id) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension?.map((dimensionType) => {
                      if ((dimensionType as any)?._id === dimensionTypeId) {
                        return {
                          ...(dimensionType as any),
                          dimensionTypes: Array.isArray(dimensionType.dimensionTypes)
                            ? dimensionType.dimensionTypes.filter(
                                (dimension) => dimension && (dimension as any)._id !== dimensionId,
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
        } catch (error: any) {
          throw new Error(error);
        }
      };
      await configureToastPromise(deleteDimension(), 'Deleting Dimension...');
    };

  // edit logic

  const EditCategory = async (e: any) => {
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
              if (cat._id === ids?.catId) {
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
      } catch (error: any) {
        throw new Error(error);
      }
    };
    await configureToastPromise(UpdateCategory(), 'Updating Category...');
  };

  const EditProcess = async (e: any) => {
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
                if (cat._id === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess) => {
                      if ((styleProcess as any)?._id === ids?.styleProcessId) {
                        return {
                          ...(styleProcess as any),
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
      } catch (error: any) {
        throw new Error(error);
      }
    };
    await configureToastPromise(UpdateProcess(), 'Updating Process...');
  };

  const EditTypeDimension = async (e: any) => {
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
                if (cat._id === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension?.map((dimTyp) => {
                      if ((dimTyp as any)?._id === ids?.dimensionTypeId) {
                        return {
                          ...(dimTyp as any),
                          dimensionTypeName: dimensionType,
                        };
                      }
                      return dimensionType;
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
      } catch (error: any) {
        throw new Error(error);
      }
    };
    await configureToastPromise(UpdateDimension(), 'Updating Dimension...');
  };

  const EditStyles = async (e: any) => {
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
                if (cat._id === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    styleProcess: cat.styleProcess?.map((styleProcess) => {
                      if ((styleProcess as any)?._id === ids?.styleProcessId) {
                        return {
                          ...(styleProcess as any),
                          styles: Array.isArray(styleProcess.styles)
                            ? styleProcess.styles.map((style: any) => {
                                if ((style as any)?._id === ids?.styleId) {
                                  return {
                                    ...(style as any),
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
      } catch (error: any) {
        throw new Error(error);
      }
    };
    await configureToastPromise(UpdateStyles(), 'Updating Style...');
  };

  const EditDimension = async (e: any) => {
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
                if (cat._id === ids?.catId) {
                  return {
                    ...(cat as ICategory),
                    dimension: cat.dimension?.map((dimTyp) => {
                      if ((dimTyp as any)?._id === ids?.dimensionTypeId) {
                        return {
                          ...(dimTyp as any),
                          dimensionTypes: Array.isArray(dimTyp.dimensionTypes)
                            ? dimTyp.dimensionTypes.map((dim: any) => {
                                if ((dim as any)?._id === ids?.dimensionId) {
                                  return {
                                    ...(dim as any),
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
      } catch (error: any) {
        throw new Error(error);
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
          onSubmit={EditCategory}
          fields={[
            { label: 'Category', name: 'category', type: 'text', required: true, placeholder: 'Category Name' },
            { label: 'Description', name: 'description', type: 'text', placeholder: 'Description Name' },
          ]}
          onClose={() => {}}
        />
        <FormModal
          id="addProcess"
          title="Add Process"
          onSubmit={AddProcess}
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
          onSubmit={EditProcess}
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
          onSubmit={AddStyle}
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
          onSubmit={EditStyles}
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
          onSubmit={AddTypeDimension}
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
          onSubmit={EditTypeDimension}
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
          onSubmit={AddDimension}
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
          onSubmit={EditDimension}
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
              className="input input-bordered input-primary input-sm w-full max-w-xs max-sm:w-full max-sm:max-w-full"
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
              className="input input-bordered input-primary input-sm w-full max-w-xs max-sm:w-full max-sm:max-w-full"
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
                    className={`flex w-full flex-row justify-between p-2 max-sm:w-full max-sm:max-w-full max-sm:flex-wrap max-sm:gap-2 max-sm:p-0`}
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
                                  setIds({ catId: cat._id } as IIds);
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
                            {cat.styleProcess?.map((styleProcess: any, styleProcessIndex: any) => (
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
                                              catId: cat._id,
                                              styleProcessId: styleProcess._id,
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
                                              catId: cat._id,
                                              styleProcessId: styleProcess._id,
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
                                          onClick={DelProcess(cat._id, styleProcess._id)}
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
                                      {styleProcess.styles.map((style: any, styleIndex: any) => (
                                        <div key={styleIndex} className="flex flex-row items-center justify-between">
                                          <p className="label label-text">{style.styleName}</p>
                                          <span className="mr-2 flex flex-row gap-1">
                                            <button
                                              className="btn btn-primary btn-sm tooltip tooltip-left px-1"
                                              data-tip="Edit Style"
                                              onClick={() => {
                                                setIds({
                                                  ...ids,
                                                  catId: cat._id,
                                                  styleProcessId: styleProcess._id,
                                                  styleId: style._id,
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
                                              onClick={DelStyle(cat._id, styleProcess._id, style._id)}
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
                                  setIds({ catId: cat._id } as IIds);
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
                            {cat.dimension?.map((typ: any, typIndex: any) => (
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
                                            setIds({ ...ids, catId: cat._id, dimensionTypeId: typ._id } as IIds);
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
                                            setIds({ ...ids, catId: cat._id, dimensionTypeId: typ._id } as IIds);
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
                                          onClick={DelTypeDimension(cat._id, typ._id)}
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
                                      {typ.dimensionTypes.map((dimension: any, dimensionIndex: any) => (
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
                                                  catId: cat._id,
                                                  dimensionTypeId: typ._id,
                                                  dimensionId: dimension._id,
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
                                              onClick={DelDimension(cat._id, typ._id, dimension._id)}
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
                          setIds({ catId: cat._id } as IIds);
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
                        onClick={DelCategory(cat._id)}
                      >
                        <Image src="/icons/svg/trash.svg" alt="Delete" width={32} height={32} className="h-auto w-7" />
                      </button>
                    </div>
                  </div>
                  <div className={`${index === category.length - 1 ? 'hidden' : ''} px-2`}>
                    <hr className={`h-0.5 w-full rounded-box border-0 bg-base-content`} />
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
