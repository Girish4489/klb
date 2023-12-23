'use client';
import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function CategoryPage() {
  interface Category {
    _id: string;
    categoryName: string;
    description: string;
    styleProcess: [
      {
        styleProcessName: string;
        styles: {
          styleName: string;
        };
      },
    ];
  }

  const [category, setCategory] = React.useState<Category[]>([]);

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
        return res.data.message; // Resolve with success message
      } else {
        throw new Error(res.data.message); // Reject with error message
      }
    };

    try {
      await toast.promise(saveCategory(), {
        loading: 'Adding Category...',
        success: message => <b>{message}</b>,
        error: error => <b>{error.message}</b>,
      });

      GetCategory(); // Refresh the category list on success
    } catch (error: any) {
      // Handle any additional error handling if needed
      // console.error(error);
      // toast.error(error.response.data.error);
    }
  };

  const AddProcess = (id: string) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const styleProcess = e.currentTarget.styleProcess.value;

    const saveProcess = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'addProcess',
        categoryId: id,
        styleProcessName: styleProcess,
      });

      if (res.data.success === true) {
        return res.data.message; // Resolve with success message
      } else {
        throw new Error(res.data.message); // Reject with error message
      }
    };
    try {
      await toast.promise(saveProcess(), {
        loading: 'Adding Process...',
        success: message => <b>{message}</b>,
        error: error => <b>{error.message}</b>,
      });

      GetCategory(); // Refresh the category list on success
    } catch (error: any) {
      // Handle any additional error handling if needed
      // console.error(error);
      // toast.error(error.response.data.error);
    }
  };

  const AddStyle = (id: string, styleProcessIndex: number) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const style = e.currentTarget.catStyle.value;
    const saveStyle = async () => {
      const res = await axios.post('/api/dashboard/master-record/category', {
        type: 'addStyle',
        categoryId: id,
        styleProcessIndex: styleProcessIndex,
        styleName: style,
      });

      if (res.data.success === true) {
        return res.data.message; // Resolve with success message
      } else {
        throw new Error(res.data.message); // Reject with error message
      }
    };
    try {
      await toast.promise(saveStyle(), {
        loading: 'Adding Style...',
        success: message => <b>{message}</b>,
        error: error => <b>{error.message}</b>,
      });
      GetCategory(); // Refresh the category list on success
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
        return res.data.message; // Resolve with success message
      } else {
        throw new Error(res.data.message); // Reject with error message
      }
    };
    if (confirmed) {
      try {
        await toast.promise(deleteCategory(), {
          loading: 'Deleting Category...',
          success: message => <b>{message}</b>,
          error: error => <b>{error.message}</b>,
        });
        GetCategory(); // Refresh the category list on success
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
          return res.data.message; // Resolve with success message
        } else {
          throw new Error(res.data.message); // Reject with error message
        }
      };
      if (confirmed) {
        try {
          await toast.promise(deleteProcess(), {
            loading: 'Deleting Process...',
            success: message => <b>{message}</b>,
            error: error => <b>{error.message}</b>,
          });
          GetCategory(); // Refresh the category list on success
        } catch (error: any) {
          // Handle any additional error handling if needed
          // console.error(error);
          // toast.error(error.response.data.error);
        }
      }
    };

  const DelStyle =
    (id: string, styleProcessIndex: string, styleId: string) =>
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
          styleProcessIndex: styleProcessIndex,
          styleId: styleId,
        });
        if (res.data.success === true) {
          return res.data.message; // Resolve with success message
        } else {
          throw new Error(res.data.message); // Reject with error message
        }
      };
      if (confirmed) {
        try {
          await toast.promise(deleteStyle(), {
            loading: 'Deleting Style...',
            success: message => <b>{message}</b>,
            error: error => <b>{error.message}</b>,
          });
          GetCategory(); // Refresh the category list on success
        } catch (error: any) {
          // Handle any additional error handling if needed
          // console.error(error);
          // toast.error(error.response.data.error);
        }
      }
    };

  const [catId, setCatId] = React.useState<string>('');
  const [styleProcessId, setStyleProcessId] = React.useState<string>('');
  const [styleId, setStyleId] = React.useState<string>('');

  const myEditCategoryModel = (modalId: string, catId: string) => {
    setCatId(catId);
    myModal(modalId);
  };

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
        return res.data.message; // Resolve with success message
      } else {
        throw new Error(res.data.message); // Reject with error message
      }
    };
    try {
      await toast.promise(UpdateCategory(), {
        loading: 'Updating Category...',
        success: message => <b>{message}</b>,
        error: error => <b>{error.message}</b>,
      });
      GetCategory(); // Refresh the category list on success
      closeModal('editCategory');
    } catch (error: any) {
      // console.error(error);
      toast.error(error.response.data.error);
    }
  };

  const myEditProcessModel = (modalId: string, catId: string, styleProcessId: string) => {
    setCatId(catId);
    setStyleProcessId(styleProcessId);
    myModal(modalId);
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
        return res.data.message; // Resolve with success message
      } else {
        throw new Error(res.data.message); // Reject with error message
      }
    };
    try {
      await toast.promise(UpdateProcess(), {
        loading: 'Updating Process...',
        success: message => <b>{message}</b>,
        error: error => <b>{error.message}</b>,
      });
      GetCategory(); // Refresh the category list on success
      closeModal('editProcess');
    } catch (error: any) {
      // console.error(error);
      toast.error(error.response.data.error);
    }
  };

  const myEditStyleModel = (modalId: string, catId: string, styleProcessId: string, styleId: string) => {
    setCatId(catId);
    setStyleProcessId(styleProcessId);
    setStyleId(styleId);
    myModal(modalId);
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
        return res.data.message; // Resolve with success message
      } else {
        throw new Error(res.data.message); // Reject with error message
      }
    };
    try {
      await toast.promise(UpdateStyles(), {
        loading: 'Updating Style...',
        success: message => <b>{message}</b>,
        error: error => <b>{error.message}</b>,
      });
      GetCategory(); // Refresh the category list on success
      closeModal('editStyles');
    } catch (error: any) {
      // console.error(error);
      toast.error(error.response.data.error);
    }
  };

  const myConfirmModal = (modalId: string, header: string, message: string): Promise<boolean> => {
    return new Promise(resolve => {
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
    <div className=" h-full  gap-2 overflow-auto">
      <div className="catAdd mx-2 flex flex-col overflow-clip rounded-box border-2 border-base-300 p-2 shadow-xl max-sm:shrink">
        <h1 className="text-center text-2xl font-bold">Category</h1>
        <form
          onSubmit={AddCategory}
          className="catAddForm m-2 mt-1 flex flex-row items-center gap-2 p-2 pt-0 max-sm:max-w-full max-sm:flex-col max-sm:items-start"
        >
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            placeholder="Category Name"
            className="input input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
            required
            spellCheck="true"
            name="category"
            id="category"
            onFocus={e => e.currentTarget.select()}
          />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            placeholder="Category Description"
            className="input input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
            name="description"
            id="description"
            onFocus={e => e.currentTarget.select()}
          />
          <button className="btn btn-primary form-control tooltip tooltip-right self-end" data-tip="Add Category">
            <Image src="/icons/svg/plus-circle.svg" alt="Add Category" width={45} height={40} className="h-auto w-11" />
          </button>
        </form>
        <p className="text-start text-sm text-warning max-sm:text-center">
          Note: This page is read-only for general users. Edits are restricted to authorized personnel.
        </p>
      </div>
      {/* modals */}
      <span>
        <dialog id="confirm" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold"></h3>
            <p className="py-4"></p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn btn-primary">Confirm</button>
                <button className="btn btn-secondary">Cancel</button>
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
                  onFocus={e => e.currentTarget.select()}
                />
                <label htmlFor="description">Description:</label>
                <input
                  type="text"
                  placeholder="Category Description"
                  className="input input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                  name="description"
                  id="description"
                  onFocus={e => e.currentTarget.select()}
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
                  onFocus={e => e.currentTarget.select()}
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
                  onFocus={e => e.currentTarget.select()}
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
      <div className="catList m-2 mt-0 flex h-full flex-col items-center gap-2 rounded-box border border-base-300 p-2 shadow-2xl">
        <h1 className="m-1 w-max border-b border-base-content text-center text-xl font-bold">Categories</h1>
        <div className="flex h-auto w-full flex-col max-sm:overflow-visible">
          <div className="flex flex-col items-start justify-between gap-2 max-sm:items-center">
            {category.map((cat, index) => (
              <div key={cat.categoryName} className="w-full">
                <div
                  className={`flex w-full flex-row justify-between p-2 max-sm:w-full max-sm:max-w-full max-sm:flex-wrap max-sm:gap-2 max-sm:p-0`}
                >
                  <div className="flex w-full flex-row items-center gap-2 rounded-box border border-base-200 bg-base-300 p-2 max-sm:flex-col max-sm:items-start max-sm:p-2">
                    <div className="flex w-min flex-col max-sm:w-max">
                      <h1 className="text-lg font-bold">Name: {cat.categoryName}</h1>
                      <p className="text-sm">Description: {cat.description}</p>
                    </div>
                    <div className="mx-2 flex w-full flex-col max-sm:m-0">
                      <details className="collapse collapse-arrow border border-base-300 bg-base-200">
                        <summary className="collapse-title text-xl font-medium">
                          <div className="flex flex-row items-center justify-start gap-2 p-1 max-sm:flex-col max-sm:items-start">
                            <p className="w-max">Style Process:</p>
                            {/* input to add process */}
                            <form onSubmit={AddProcess(cat._id)} className="join items-center">
                              <input
                                type="text"
                                placeholder="Style Process"
                                className="input join-item input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                                required
                                spellCheck="true"
                                name="styleProcess"
                                id="styleProcess"
                                onFocus={e => e.currentTarget.select()}
                              />
                              <button
                                className="btn btn-primary form-control join-item tooltip tooltip-right rounded-r-full pl-0 pr-3"
                                data-tip="Add Process"
                              >
                                <Image src="/icons/svg/plus-circle.svg" alt="Add" width={45} height={40} className="" />
                              </button>
                            </form>
                          </div>
                        </summary>
                        <div className="collapse-content">
                          {cat.styleProcess.map((styleProcess: any, styleProcessIndex: any) => (
                            <div key={styleProcessIndex}>
                              <details className="collapse collapse-arrow border-2 border-base-100 bg-base-200">
                                <summary className="collapse-title text-xl font-medium">
                                  <div className="flex flex-row items-center justify-between">
                                    {styleProcess.styleProcessName}:
                                    <span className="mr-2 flex flex-row gap-1">
                                      <button
                                        className="btn btn-primary tooltip tooltip-left p-0"
                                        data-tip="Edit Process"
                                        onClick={() => myEditProcessModel('editProcess', cat._id, styleProcess._id)}
                                      >
                                        <Image src="/icons/svg/note-pencil.svg" alt="Edit" width={32} height={24} />
                                      </button>
                                      <button
                                        className="btn btn-secondary tooltip tooltip-left h-6 w-8 p-0"
                                        data-tip="Delete Process"
                                        onClick={DelProcess(cat._id, styleProcess._id)}
                                      >
                                        <Image
                                          src="/icons/svg/trash.svg"
                                          alt="Delete"
                                          width={32}
                                          height={24}
                                          className=""
                                        />
                                      </button>
                                    </span>
                                  </div>
                                </summary>
                                <div className="collapse-content transform transition-all">
                                  <div className="flex flex-row items-center justify-start gap-2 p-1 max-sm:flex-col max-sm:items-start">
                                    <p className="w-max">Style:</p>
                                    {/* input to add process */}
                                    <form onSubmit={AddStyle(cat._id, styleProcessIndex)} className="join items-center">
                                      <input
                                        type="text"
                                        placeholder="Styles"
                                        className="input join-item input-bordered input-primary w-full max-w-xs max-sm:w-full max-sm:max-w-full"
                                        required
                                        spellCheck="true"
                                        name="catStyle"
                                        id="catStyle"
                                        onFocus={e => e.currentTarget.select()}
                                      />
                                      <button className="btn btn-primary form-control join-item rounded-r-full pl-0 pr-3">
                                        <Image
                                          src="/icons/svg/plus-circle.svg"
                                          alt="Add"
                                          width={50}
                                          height={50}
                                          className=""
                                        />
                                      </button>
                                    </form>
                                  </div>
                                  <div className="m-1 flex max-h-56 flex-col gap-2 overflow-auto rounded-box bg-base-300 p-2">
                                    {styleProcess.styles.map((style: any, styleIndex: any) => (
                                      <div key={styleIndex} className="flex flex-row items-center justify-between">
                                        <p>{style.styleName}</p>
                                        <span className="mr-2 flex flex-row gap-1">
                                          <button
                                            className="btn btn-primary tooltip tooltip-left p-0"
                                            data-tip="Edit Style"
                                            onClick={() =>
                                              myEditStyleModel('editStyles', cat._id, styleProcess._id, style._id)
                                            }
                                          >
                                            <Image src="/icons/svg/note-pencil.svg" alt="Edit" width={32} height={24} />
                                          </button>

                                          <button
                                            className="btn btn-secondary tooltip tooltip-left h-6 w-8 p-0"
                                            data-tip="Delete Style"
                                            onClick={DelStyle(cat._id, styleProcessIndex, style._id)}
                                          >
                                            <Image
                                              src="/icons/svg/trash.svg"
                                              alt="Delete"
                                              width={32}
                                              height={24}
                                              className=""
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
                  <div className="flex flex-col items-center justify-center gap-2 max-sm:mb-2 max-sm:mr-2 max-sm:w-full max-sm:flex-row max-sm:justify-end max-sm:pr-2">
                    <button
                      className="btn btn-primary tooltip tooltip-left p-0"
                      data-tip="Edit Category"
                      onClick={() => myEditCategoryModel('editCategory', cat._id)}
                    >
                      <Image src="/icons/svg/note-pencil.svg" alt="Edit" width={32} height={24} />
                    </button>
                    <button
                      className="btn btn-secondary tooltip tooltip-left h-6 w-8 p-0"
                      data-tip="Delete Category"
                      onClick={DelCategory(cat._id)}
                    >
                      <Image src="/icons/svg/trash.svg" alt="Delete" width={32} height={24} className="" />
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
