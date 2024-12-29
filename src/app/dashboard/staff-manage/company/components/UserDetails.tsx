'use client';
import { Modal } from '@components/Modal/Modal';
import { useCompany } from '@context/companyContext';
import { useUser } from '@context/userContext';
import { PencilSquareIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ObjectId } from '@models/companyModel';
import { RoleType } from '@models/userModel';
import { userConfirmation } from '@utils/confirmation/confirmationUtil';
import handleError from '@utils/error/handleError';
import { ApiGet, ApiPut, ApiResponse } from '@utils/makeApiRequest/makeApiRequest';
import { fetchUserByEmail } from '@utils/user/userFetchByEmailUtil/userByEmailUtil';
import { FC, FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface UserDetailsProps {
  users: {
    userId: ObjectId;
    email: string;
  }[];
}

interface UsersByEmailsResponse extends ApiResponse {
  success: boolean;
  data: companyUserDetail[];
}

export interface companyUserDetail {
  email: string;
  companyAccess: {
    companyId: string;
    role: RoleType;
    access: {
      login: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canView: boolean;
    };
    accessLevels: RoleType[];
  };
}

const roleOptions: RoleType[] = [
  'owner',
  'admin',
  'hr',
  'manager',
  'stockManager',
  'cashier',
  'salesAssociate',
  'employee',
  'intern',
  'guest',
];

const UserDetails: FC<UserDetailsProps> = ({ users }) => {
  const { addUserToCompany } = useCompany();
  const { updateUserAccess, updateUserRole, addUserAccessLevel, removeUserAccessLevel } = useUser();
  const [newUserEmail, setNewUserEmail] = useState('');
  const [userDetails, setUserDetails] = useState<companyUserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const fetchUsersByEmails = async (emails: string[]): Promise<void> => {
    try {
      setLoading(true);
      const res = await ApiGet.Company.UsersByEmails<UsersByEmailsResponse>(emails);
      if (!res || !res.success) {
        throw new Error('Failed to fetch users');
      }

      if (!res.data || res.data.length === 0) {
        throw new Error('No users found');
      }

      if (res.data.length !== emails.length) {
        throw new Error('Some users not found');
      }

      const usersWithDefaults = res.data.map((user: companyUserDetail) => ({
        email: user.email,
        companyAccess: {
          companyId: user.companyAccess.companyId || '',
          role: user.companyAccess.role || 'guest',
          access: user.companyAccess.access || {
            login: false,
            canEdit: false,
            canDelete: false,
            canView: false,
          },
          accessLevels: user.companyAccess.accessLevels || [],
        },
      }));

      setUserDetails(usersWithDefaults);
    } catch (error) {
      handleError.toast(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (users && users.length > 0) {
      fetchUsersByEmails(users.map((user) => user.email));
    }
  }, [users]);

  const handleAddUser = async (): Promise<void> => {
    try {
      const user = await fetchUserByEmail(newUserEmail);

      if (!user) throw new Error('User not found');
      await addUserToCompany(user._id.toString(), newUserEmail);
      setNewUserEmail('');
    } catch (error) {
      handleError.toast(error);
    }
  };

  const handleDeleteUser = async (email: string): Promise<void> => {
    try {
      const user = userDetails.find((user) => user.email === email);
      if (user && user.companyAccess.role === 'owner') {
        toast.error("Owner can't be removed.");
        return;
      }

      const confirmed = await userConfirmation({
        header: 'Remove User',
        message: `Are you sure you want to remove ${email} from the company?`,
      });

      if (!confirmed) return;

      const updatedUsers = userDetails.filter((user) => user.email !== email);
      setUserDetails(updatedUsers);
      await ApiPut.User.updateUserRole(email, 'guest');
      await ApiPut.User.updateUserAccess(email, { login: true, canEdit: false, canDelete: false, canView: false });
      await ApiPut.User.updateUserAccessLevels(email, ['guest']);
    } catch (error) {
      handleError.toast(error);
    }
  };

  const handleUserRoleChange = async (email: string, role: RoleType): Promise<void> => {
    try {
      await updateUserRole(email, role);
      setUserDetails((prevDetails) =>
        prevDetails.map((user) =>
          user.email === email ? { ...user, companyAccess: { ...user.companyAccess, role } } : user,
        ),
      );
    } catch (error) {
      handleError.toast(error);
    }
  };

  const handleUserAccessChange = async (email: string, accessType: string, value: boolean): Promise<void> => {
    try {
      const user = userDetails.find((user) => user.email === email);
      if (user) {
        const updatedAccess = { ...user.companyAccess.access, [accessType]: value };
        await updateUserAccess(email, updatedAccess);
        setUserDetails((prevDetails) =>
          prevDetails.map((user) =>
            user.email === email ? { ...user, companyAccess: { ...user.companyAccess, access: updatedAccess } } : user,
          ),
        );
      }
    } catch (error) {
      handleError.toast(error);
    }
  };

  const handleAddUserRoleAndAccess = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const accessLevel = formData.get('accessLevel') as RoleType;
      const email = userDetails.find((user) => user.email === newUserEmail)?.email;
      if (email) {
        await addUserAccessLevel(email, [accessLevel]);
        setUserDetails((prevDetails) =>
          prevDetails.map((user) =>
            user.email === email
              ? {
                  ...user,
                  companyAccess: {
                    ...user.companyAccess,
                    accessLevels: Array.from(new Set([...user.companyAccess.accessLevels, accessLevel])),
                  },
                }
              : user,
          ),
        );
        (document.getElementById('add_access_levels_modal') as HTMLDialogElement)?.close();
      } else {
        toast.error("User not found. Please add the user's email first.");
      }
    } catch (error) {
      handleError.toast(error);
    }
  };

  const handleDeleteAccessLevel = async (email: string, level: RoleType): Promise<void> => {
    try {
      const confirmed = await userConfirmation({
        header: 'Remove Access Level',
        message: `Are you sure you want to remove "${level}" access level from ${email}?`,
      });

      if (!confirmed) return;

      await removeUserAccessLevel(email, level);
      setUserDetails((prevDetails) =>
        prevDetails.map((user) =>
          user.email === email
            ? {
                ...user,
                companyAccess: {
                  ...user.companyAccess,
                  accessLevels: user.companyAccess.accessLevels.filter((l) => l !== level),
                },
              }
            : user,
        ),
      );
    } catch (error) {
      handleError.toast(error);
    }
  };

  const toggleEditUser = (email: string): void => {
    setEditingUser((prevEmail) => (prevEmail === email ? null : email));
  };

  return (
    <div className="rounded-box border-base-content/60 bg-base-300 flex flex-col gap-2 border p-2">
      <h2 className="mx-auto font-bold text-lg">Users</h2>
      {loading ? (
        <span className="mx-auto flex w-full flex-col items-center gap-3">
          <span className="loading loading-spinner text-primary text-pretty"></span>Loading...
        </span>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {userDetails.map((companyUser, index) => (
            <div
              key={`${companyUser.email}-${index}`}
              className="rounded-box border-primary/40 bg-base-100 flex grow flex-col gap-2 border p-3"
            >
              <div className="flex grow items-center justify-between gap-2">
                <span className="flex grow gap-2">Email: {companyUser.email ?? 'NA'}</span>
                <div className="flex gap-2">
                  {companyUser.companyAccess.role !== 'owner' && (
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDeleteUser(companyUser.email)}
                    >
                      <TrashIcon className="text-warning-content h-5 w-5" />
                      Trash
                    </button>
                  )}
                  <button
                    type="button"
                    className={`btn btn-sm ${editingUser === companyUser.email ? 'btn-error' : 'btn-info'}`}
                    onClick={() => toggleEditUser(companyUser.email)}
                  >
                    {editingUser === companyUser.email ? (
                      <>
                        <XCircleIcon className="text-warning-content h-5 w-5" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <PencilSquareIcon className="text-info-content h-5 w-5" />
                        Edit
                      </>
                    )}
                  </button>
                </div>
              </div>
              <hr className="border-primary h-1" />
              <div className="flex grow items-center justify-between px-2">
                <label htmlFor={`role-${companyUser.email}`}>Role:</label>
                <select
                  id={`role-${companyUser.email}`}
                  name={`role-${companyUser.email}`}
                  className="select select-primary select-sm"
                  value={companyUser.companyAccess.role}
                  onChange={(e) => handleUserRoleChange(companyUser.email, e.target.value as RoleType)}
                  disabled={companyUser.companyAccess.role === 'owner' || editingUser !== companyUser.email}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex grow items-center justify-between gap-2 px-2">
                <p>Access:</p>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`login-${companyUser.email}`}
                    className="badge badge-primary badge-outline h-full gap-2 py-1"
                  >
                    Login
                    <input
                      id={`login-${companyUser.email}`}
                      name={`login-${companyUser.email}`}
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={companyUser.companyAccess.access.login}
                      onChange={(e) => handleUserAccessChange(companyUser.email, 'login', e.target.checked)}
                      disabled={editingUser !== companyUser.email}
                    />
                  </label>
                  <label
                    htmlFor={`canEdit-${companyUser.email}`}
                    className="badge badge-primary badge-outline h-full gap-2 py-1"
                  >
                    <input
                      id={`canEdit-${companyUser.email}`}
                      name={`canEdit-${companyUser.email}`}
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={companyUser.companyAccess.access.canEdit}
                      onChange={(e) => handleUserAccessChange(companyUser.email, 'canEdit', e.target.checked)}
                      disabled={editingUser !== companyUser.email}
                    />
                    Can Edit
                  </label>
                  <label
                    htmlFor={`canDelete-${companyUser.email}`}
                    className="badge badge-primary badge-outline h-full gap-2 py-1"
                  >
                    <input
                      id={`canDelete-${companyUser.email}`}
                      name={`canDelete-${companyUser.email}`}
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={companyUser.companyAccess.access.canDelete}
                      onChange={(e) => handleUserAccessChange(companyUser.email, 'canDelete', e.target.checked)}
                      disabled={editingUser !== companyUser.email}
                    />
                    Can Delete
                  </label>
                  <label
                    htmlFor={`canView-${companyUser.email}`}
                    className="badge badge-primary badge-outline h-full gap-2 py-1"
                  >
                    <input
                      id={`canView-${companyUser.email}`}
                      name={`canView-${companyUser.email}`}
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={companyUser.companyAccess.access.canView}
                      onChange={(e) => handleUserAccessChange(companyUser.email, 'canView', e.target.checked)}
                      disabled={editingUser !== companyUser.email}
                    />
                    Can View
                  </label>
                </div>
              </div>
              <div className="flex grow flex-col items-start justify-between gap-2 px-2">
                <span className="flex w-full grow items-center justify-between gap-2">
                  <p>Access Levels</p>
                  {editingUser === companyUser.email && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setNewUserEmail(companyUser.email);
                        (document.getElementById('add_access_levels_modal') as HTMLDialogElement)?.showModal();
                      }}
                      disabled={editingUser !== companyUser.email}
                    >
                      Add levels
                    </button>
                  )}
                </span>
                <div className="flex grow flex-wrap items-center gap-2">
                  {companyUser.companyAccess.accessLevels.map((level, index) => (
                    <div
                      key={index}
                      className="badge badge-primary badge-outline flex h-full justify-between gap-2 px-2 py-1"
                    >
                      <p className="px-2">
                        {level.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())}
                      </p>
                      {editingUser === companyUser.email && (
                        <button
                          className="btn btn-error btn-xs"
                          onClick={() => handleDeleteAccessLevel(companyUser.email, level)}
                          disabled={editingUser !== companyUser.email}
                        >
                          <TrashIcon className="text-error-content h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => (document.getElementById('add_user_modal') as HTMLDialogElement)?.showModal()}
      >
        Add User
      </button>

      <Modal id="add_user_modal">
        <h2 className="font-bold text-lg">Add User</h2>
        <form className="flex flex-col gap-2 p-4">
          <label className="input input-sm input-primary flex items-center gap-2">
            Email:
            <input
              type="email"
              name="newUserEmail"
              autoComplete="email"
              className="grow"
              placeholder="Enter user email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
          </label>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleAddUser}>
            Add
          </button>
        </form>
      </Modal>

      <Modal id="add_access_levels_modal">
        <h2 className="font-bold text-lg">Add Access Levels</h2>
        <form className="flex justify-around gap-2 p-4" onSubmit={handleAddUserRoleAndAccess}>
          <span className="flex flex-col items-center gap-2 p-2">
            <span className="flex flex-wrap">
              <label className="flex items-center" htmlFor="accessLevel">
                Access Levels:
              </label>
              <select
                id="accessLevel"
                name="accessLevel"
                className="select select-primary w-full max-w-xs"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select the access role
                </option>
                {roleOptions
                  .filter((role) => !userDetails.some((user) => user.companyAccess.accessLevels?.includes(role)))
                  .map((role) => (
                    <option key={role} value={role}>
                      {role.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())}
                    </option>
                  ))}
              </select>
            </span>
            <button type="submit" className="btn btn-primary btn-sm w-full grow">
              Add
            </button>
          </span>
        </form>
      </Modal>
    </div>
  );
};

export default UserDetails;
