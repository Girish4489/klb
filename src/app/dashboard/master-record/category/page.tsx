'use client';
import { ICategory } from '@/models/klm';
import axios from 'axios';
import Image from 'next/image';
import React from 'react';
import toast from 'react-hot-toast';

export default function CategoryPage() {
  const [category, setCategory] = React.useState<ICategory[]>([]);

  const [catId, setCatId] = React.useState<string>('');
  const [styleProcessId, setStyleProcessId] = React.useState<string>('');
  const [styleId, setStyleId] = React.useState<string>('');

  const myEditCategoryModel = (modalId: string, catId: string) => {
    setCatId(catId);
    myModal(modalId);
  };

  const myEditProcessModel = (modalId: string, catId: string, styleProcessId: string) => {
    setCatId(catId);
    setStyleProcessId(styleProcessId);
    myModal(modalId);
  };

  const myEditStyleModel = (modalId: string, catId: string, styleProcessId: string, styleId: string) => {
    setCatId(catId);
    setStyleProcessId(styleProcessId);
    setStyleId(styleId);
    myModal(modalId);
  };

  const GetCategory = async () => {
    try {
      const res = await axios.get('/api/dashboard/master-record/category');
      setCategory(res.data.categories);
      // console.log(res.data);
    } catch (error: any) {
      // console.error(error);
    }
  };

  React.useEffect(() => {
    GetCategory();
  }, []);

  const AddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const category = e.currentTarget.category.value;
    const description = e.currentTarget.description.value;

    const saveCategory = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'addCategory',
        categoryName: category,
        description: description,
      });

      if (res.data.success === true) {
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };

    try {
      await toast.promise(saveCategory(), {
        loading: 'Adding Category...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });

      GetCategory();
    } catch (error: any) {
      // Handle any additional error handling if needed
      // console.error(error);
      // toast.error(error.response.data.error);
    }
  };

  const AddProcess = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const styleProcess = e.currentTarget.styleProcess.value;

    const saveProcess = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'addProcess',
        categoryId: catId,
        styleProcessName: styleProcess,
      });

      if (res.data.success === true) {
        closeModal('addProcess');
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      await toast.promise(saveProcess(), {
        loading: 'Adding Process...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });

      GetCategory();
    } catch (error: any) {
      // Handle any additional error handling if needed
      // console.error(error);
      // toast.error(error.response.data.error);
    }
  };

  const AddTypeDimension = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const typeDimension = e.currentTarget.dimensionType.value;

    const saveDimension = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'addTypeDimension',
        categoryId: catId,
        dimensionTypeName: typeDimension,
      });

      if (res.data.success === true) {
        closeModal('addTypeDimension');
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      await toast.promise(saveDimension(), {
        loading: 'Adding Dimension...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });

      GetCategory();
    } catch (error: any) {
      // Handle any additional error handling if needed
      // console.error(error);
      // toast.error(error.response.data.error);
    }
  };

  const AddDimension = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dimension = e.currentTarget.dimension.value;

    const saveDimension = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'addDimension',
        categoryId: catId,
        dimensionTypeId: styleProcessId,
        dimensionName: dimension,
      });

      if (res.data.success === true) {
        closeModal('addDimension');
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      await toast.promise(saveDimension(), {
        loading: 'Adding Dimension...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });

      GetCategory();
    } catch (error: any) {
      // Handle any additional error handling if needed
      // console.error(error);
      // toast.error(error.response.data.error);
    }
  };

  const AddStyle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const style = e.currentTarget.catStyle.value;
    const saveStyle = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'addStyle',
        categoryId: catId,
        styleProcessId: styleProcessId,
        styleName: style,
      });

      if (res.data.success === true) {
        closeModal('addStyle');
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      await toast.promise(saveStyle(), {
        loading: 'Adding Style...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
      GetCategory();
    } catch (error: any) {
      // Handle any additional error handling if needed
      // console.error(error);
      // toast.error(error.response.data.error);
    }
  };

  const DelCategory = (id: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const confirmed = await myConfirmModal(
      'confirm',
      'Confirm Deletion',
      'Are you sure you want to delete this category?',
    );
    const deleteCategory = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'delCategory',
        categoryId: id,
      });
      if (res.data.success === true) {
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    if (confirmed) {
      try {
        await toast.promise(deleteCategory(), {
          loading: 'Deleting Category...',
          success: (message) => <b>{message}</b>,
          error: (error) => <b>{error.message}</b>,
        });
        GetCategory();
      } catch (error: any) {
        // Handle any additional error handling if needed
        // console.error(error);
        // toast.error(error.response.data.error);
      }
    }
  };

  const DelProcess =
    (id: string, styleProcessId: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const confirmed = await myConfirmModal(
        'confirm',
        'Confirm Deletion',
        'Are you sure you want to delete this process?',
      );
      const deleteProcess = async () => {
        const res = await axios.post('/api/dashboard/master-record/category', {
          type: 'delProcess',
          categoryId: id,
          styleProcessId: styleProcessId,
        });
        if (res.data.success === true) {
          return res.data.message;
        } else {
          throw new Error(res.data.message);
        }
      };
      if (confirmed) {
        try {
          await toast.promise(deleteProcess(), {
            loading: 'Deleting Process...',
            success: (message) => <b>{message}</b>,
            error: (error) => <b>{error.message}</b>,
          });
          GetCategory();
        } catch (error: any) {
          // Handle any additional error handling if needed
          // console.error(error);
          // toast.error(error.response.data.error);
        }
      }
    };

  const DelTypeDimension =
    (id: string, dimensionTypeId: string) => async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const confirmed = await myConfirmModal(
        'confirm',
        'Confirm Deletion',
        'Are you sure you want to delete this dimension type?',
      );
      const deleteDimensionType = async () => {
        const res = await axios.post('/api/dashboard/master-record/category', {
          type: 'delTypeDimension',
          categoryId: id,
          dimensionTypeId: dimensionTypeId,
        });
        if (res.data.success === true) {
          return res.data.message;
        } else {
          throw new Error(res.data.message);
        }
      };
      if (confirmed) {
        try {
          await toast.promise(deleteDimensionType(), {
            loading: 'Deleting Dimension Type...',
            success: (message) => <b>{message}</b>,
            error: (error) => <b>{error.message}</b>,
          });
          GetCategory();
        } catch (error: any) {
          // Handle any additional error handling if needed
          // console.error(error);
          // toast.error(error.response.data.error);
        }
      }
    };

  const DelStyle =
    (id: string, styleProcessId: string, styleId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const confirmed = await myConfirmModal(
        'confirm',
        'Confirm Deletion',
        'Are you sure you want to delete this style?',
      );
      const deleteStyle = async () => {
        const res = await axios.post('/api/dashboard/master-record/category', {
          type: 'delStyle',
          categoryId: id,
          styleProcessId: styleProcessId,
          styleId: styleId,
        });
        if (res.data.success === true) {
          return res.data.message;
        } else {
          throw new Error(res.data.message);
        }
      };
      if (confirmed) {
        try {
          await toast.promise(deleteStyle(), {
            loading: 'Deleting Style...',
            success: (message) => <b>{message}</b>,
            error: (error) => <b>{error.message}</b>,
          });
          GetCategory();
        } catch (error: any) {
          // Handle any additional error handling if needed
          // console.error(error);
          // toast.error(error.response.data.error);
        }
      }
    };

  const DelDimension =
    (id: string, dimensionTypeId: string, dimensionId: string) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const confirmed = await myConfirmModal(
        'confirm',
        'Confirm Deletion',
        'Are you sure you want to delete this dimension?',
      );
      const deleteDimension = async () => {
        const res = await axios.post('/api/dashboard/master-record/category', {
          type: 'delDimension',
          categoryId: id,
          dimensionTypeId: dimensionTypeId,
          dimensionId: dimensionId,
        });
        if (res.data.success === true) {
          return res.data.message;
        } else {
          throw new Error(res.data.message);
        }
      };
      if (confirmed) {
        try {
          await toast.promise(deleteDimension(), {
            loading: 'Deleting Dimension...',
            success: (message) => <b>{message}</b>,
            error: (error) => <b>{error.message}</b>,
          });
          GetCategory();
        } catch (error: any) {
          // Handle any additional error handling if needed
          // console.error(error);
          // toast.error(error.response.data.error);
        }
      }
    };

  // edit logic

  const EditCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const category = e.currentTarget.category.value;
    const description = e.currentTarget.description.value;
    const catIds = catId;
    const UpdateCategory = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'editCategory',
        categoryId: catIds,
        categoryName: category,
        description: description,
      });
      if (res.data.success === true) {
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      await toast.promise(UpdateCategory(), {
        loading: 'Updating Category...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
      GetCategory();
      closeModal('editCategory');
    } catch (error: any) {
      // console.error(error);
      toast.error(error.response.data.error);
    }
  };

  const EditProcess = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const styleProcess = e.currentTarget.processName.value;
    const UpdateProcess = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'editProcess',
        categoryId: catId,
        styleProcessId: styleProcessId,
        styleProcessName: styleProcess,
      });
      if (res.data.success === true) {
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      await toast.promise(UpdateProcess(), {
        loading: 'Updating Process...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
      GetCategory();
      closeModal('editProcess');
    } catch (error: any) {
      // console.error(error);
      // toast.error(error.response.data.error);
    }
  };

  const EditTypeDimension = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dimension = e.currentTarget.typeName.value;
    const UpdateDimension = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'editTypeDimension',
        categoryId: catId,
        dimensionTypeId: styleProcessId,
        dimensionTypeName: dimension,
      });
      if (res.data.success === true) {
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      await toast.promise(UpdateDimension(), {
        loading: 'Updating Dimension...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
      GetCategory();
      closeModal('editTypeDimension');
    } catch (error: any) {
      // console.error(error);
      // toast.error(error.response.data.error);
    }
  };

  const EditStyles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const style = e.currentTarget.styleName.value;
    const UpdateStyles = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'editStyle',
        categoryId: catId,
        styleProcessId: styleProcessId,
        styleId: styleId,
        styleName: style,
      });
      if (res.data.success === true) {
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      await toast.promise(UpdateStyles(), {
        loading: 'Updating Style...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
      GetCategory();
      closeModal('editStyles');
    } catch (error: any) {
      // console.error(error);
      toast.error(error.response.data.error);
    }
  };

  const EditDimension = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dimension = e.currentTarget.styleName.value;
    const UpdateDimension = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'editDimension',
        categoryId: catId,
        dimensionTypeId: styleProcessId,
        dimensionId: styleId,
        dimensionName: dimension,
      });
      if (res.data.success === true) {
        return res.data.message;
      } else {
        throw new Error(res.data.message);
      }
    };
    try {
      await toast.promise(UpdateDimension(), {
        loading: 'Updating Dimension...',
        success: (message) => <b>{message}</b>,
        error: (error) => <b>{error.message}</b>,
      });
      GetCategory();
      closeModal('editDimension');
    } catch (error: any) {
      // console.error(error);
      toast.error(error.response.data.error);
    }
  };

  const myConfirmModal = (modalId: string, header: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const element = document.getElementById(modalId) as HTMLDialogElement | null;
      if (element) {
        // Define the header
        element.querySelector('.modal-box h3')!.textContent = header;
        element.querySelector('.modal-box p')!.textContent = message;

        // Define the action when the "Confirm" button is clicked
        const confirmButton = element.querySelector('.btn-primary') as HTMLButtonElement;
        confirmButton.addEventListener('click', () => {
          element.close();
          resolve(true);
        });

        // Define the action when the "Cancel" button is clicked
        const cancelButton = element.querySelector('.btn-secondary') as HTMLButtonElement;
        cancelButton.addEventListener('click', () => {
          element.close();
          resolve(false);
        });

        element.showModal();
      } else {
        resolve(false);
      }
    });
  };

  const myModal = (modalId: string) => {
    const element = document.getElementById(modalId) as HTMLDialogElement | null;
    if (element) {
      element.showModal();
    }
  };
  const closeModal = (modalId: string) => {
    const element = document.getElementById(modalId) as HTMLDialogElement | null;
    if (element) {
      element.close();
    }
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto">
      {/* modals */}
      <span>
        <dialog id="confirm" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold"></h3>
            <p className="py-4"></p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn btn-secondary">Cancel</button>
                <button className="btn btn-primary">Confirm</button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="editCategory" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Edit Category</h3>
            <div className="flex flex-col items-center p-1">
              <form onSubmit={EditCategory} className="form flex w-max flex-col items-start gap-2">
                <label htmlFor="category">Category:</label>
                <input
                  type="text"
                  placeholder="Category Name"
                  className="input input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  required
                  spellCheck="true"
                  name="category"
                  id="category"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <label htmlFor="description">Description:</label>
                <input
                  type="text"
                  placeholder="Category Description"
                  className="input input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  name="description"
                  id="description"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <div className="form-control w-full items-center">
                  <button className="btn btn-primary w-10/12" type="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="addProcess" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Add Process</h3>
            <div className="flex flex-col items-center p-1">
              <form onSubmit={AddProcess} className="flex flex-col items-center gap-2 p-2">
                <input
                  type="text"
                  placeholder="Style Process"
                  className="input input-bordered input-primary input-sm w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  required
                  spellCheck="true"
                  name="styleProcess"
                  id="styleProcess"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="submit"
                  className="btn btn-primary form-control btn-sm btn-wide tooltip flex items-center"
                >
                  Add
                </button>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="editProcess" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Edit Process</h3>
            <div className="flex flex-col items-center p-1">
              <form onSubmit={EditProcess} className="form flex w-max flex-col items-start gap-2">
                <label htmlFor="processName">Process Name:</label>
                <input
                  type="text"
                  placeholder="Process Name"
                  className="input input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  required
                  spellCheck="true"
                  name="processName"
                  id="processName"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <div className="form-control w-full items-center">
                  <button className="btn btn-primary w-10/12" type="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="addStyle" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Add Style</h3>
            <div className="flex flex-col items-center p-1">
              <form onSubmit={AddStyle} className="flex flex-col items-center gap-2 p-2">
                <input
                  type="text"
                  placeholder="Style"
                  className="input input-bordered input-primary input-sm w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  required
                  spellCheck="true"
                  name="catStyle"
                  id="catStyle"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="submit"
                  className="btn btn-primary form-control btn-sm btn-wide tooltip flex items-center"
                >
                  Add
                </button>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="editStyles" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Edit Styles</h3>
            <div className="flex flex-col items-center p-1">
              <form onSubmit={EditStyles} className="form flex w-max flex-col items-start gap-2">
                <label htmlFor="styleName">Style Name:</label>
                <input
                  type="text"
                  placeholder="Style Name"
                  className="input input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  required
                  spellCheck="true"
                  name="styleName"
                  id="styleName"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <div className="form-control w-full items-center">
                  <button className="btn btn-primary w-10/12" type="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="addTypeDimension" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Add Dimension Type</h3>
            <div className="flex flex-col items-center p-1">
              <form onSubmit={AddTypeDimension} className="flex flex-col items-center gap-2 p-2">
                <input
                  type="text"
                  placeholder="Dimension Type"
                  className="input input-bordered input-primary input-sm w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  required
                  spellCheck="true"
                  name="dimensionType"
                  id="dimensionType"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="submit"
                  className="btn btn-primary form-control btn-sm btn-wide tooltip flex items-center"
                >
                  Add
                </button>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="editTypeDimension" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Edit Dimension Type</h3>
            <div className="flex flex-col items-center p-1">
              <form onSubmit={EditTypeDimension} className="form flex w-max flex-col items-start gap-2">
                <label htmlFor="typeName" className="label">
                  Type Name:
                </label>
                <input
                  type="text"
                  placeholder="Type Name"
                  className="input input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  required
                  spellCheck="true"
                  name="typeName"
                  id="typeName"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <div className="form-control w-full items-center">
                  <button className="btn btn-primary w-10/12" type="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="addDimension" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Add Dimension</h3>
            <div className="flex flex-col items-center p-1">
              <form onSubmit={AddDimension} className="flex flex-col items-center gap-2 p-2">
                <input
                  type="text"
                  placeholder="Dimension"
                  className="input input-bordered input-primary input-sm w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  required
                  spellCheck="true"
                  name="dimension"
                  id="dimension"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="submit"
                  className="btn btn-primary form-control btn-sm btn-wide tooltip flex items-center"
                >
                  Add
                </button>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="editDimension" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Edit Dimension</h3>
            <div className="flex flex-col items-center p-1">
              <form onSubmit={EditDimension} className="form flex w-max flex-col items-start gap-2">
                <label htmlFor="styleName">Dimension Name:</label>
                <input
                  type="text"
                  placeholder="Dimension Name"
                  className="input input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  required
                  spellCheck="true"
                  name="styleName"
                  id="styleName"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <div className="form-control w-full items-center">
                  <button className="btn btn-primary w-10/12" type="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </span>
      <div className="mx-2 flex flex-col overflow-clip rounded-box border-2 border-base-300 p-2 shadow-lg max-sm:shrink">
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
      <div className="catList m-2 mt-0 flex grow flex-col items-center gap-2 rounded-box border border-base-300 p-2 shadow-2xl">
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
                            <p className="label-text w-max">Style Process</p>
                            {/* input to add process using modal */}
                            <button
                              className="btn btn-primary btn-sm tooltip tooltip-left"
                              data-tip="Add Process"
                              onClick={() => myEditCategoryModel('addProcess', cat._id)}
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
                                        onClick={() => myEditProcessModel('addStyle', cat._id, styleProcess._id)}
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
                                        onClick={() => myEditProcessModel('editProcess', cat._id, styleProcess._id)}
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
                                            onClick={() =>
                                              myEditStyleModel('editStyles', cat._id, styleProcess._id, style._id)
                                            }
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
                            <p className="label-text w-max">Dimension</p>
                            {/* input to add Dimension type using modal */}
                            <button
                              className="btn btn-primary btn-sm tooltip tooltip-left"
                              data-tip="Add Dimension Type"
                              onClick={() => myEditCategoryModel('addTypeDimension', cat._id)}
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
                                        onClick={() => myEditProcessModel('addDimension', cat._id, typ._id)}
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
                                        onClick={() => myEditProcessModel('editTypeDimension', cat._id, typ._id)}
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
                                    <p className="label label-text-alt w-max">Types:</p>
                                    {typ.types.map((dimension: any, dimensionIndex: any) => (
                                      <div key={dimensionIndex} className="flex flex-row items-center justify-between">
                                        <p className="label label-text">{dimension.dimensionName}</p>
                                        <span className="mr-2 flex flex-row gap-1">
                                          <button
                                            className="btn btn-primary btn-sm tooltip tooltip-left px-1"
                                            data-tip="Edit Style"
                                            onClick={() =>
                                              myEditStyleModel('editDimension', cat._id, typ._id, dimension._id)
                                            }
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
                      onClick={() => myEditCategoryModel('editCategory', cat._id)}
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
    </div>
  );
}
