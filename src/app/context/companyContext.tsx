'use client';
import { useUser } from '@context/userContext';
import { ICompany } from '@models/companyModel';
import { fetchCompanyData } from '@util/company/companyFetchUtil/companyUtils';
import { userConfirmation } from '@util/confirmation/confirmationUtil';
import handleError from '@util/error/handleError';
import { ApiPut } from '@util/makeApiRequest/makeApiRequest';
import mongoose from 'mongoose';
import { usePathname } from 'next/navigation';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface CompanyContextProps {
  children: ReactNode;
}

interface CompanyContextType {
  company: ICompany | undefined;
  setCompany: React.Dispatch<React.SetStateAction<ICompany | undefined>>;
  updateCompany: (partialUpdate: Partial<ICompany>) => void;
  fetchAndSetCompany: (userId: string, role: string) => void;
  saveCompany: (company: ICompany) => Promise<void>;
  addUserToCompany: (userId: string, email: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const initialCompanyState = {
  _id: new mongoose.Types.ObjectId(),
  name: '',
  gstNumber: '',
  contactDetails: {
    phones: [],
    emails: [],
    address: '',
  },
  logos: {
    small: '',
    medium: '',
    large: '',
  },
  users: [],
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as ICompany;

export const CompanyProvider: React.FC<CompanyContextProps> = ({ children }) => {
  const [company, setCompany] = useState<ICompany | undefined>(initialCompanyState);

  const pathname = usePathname();
  const { user } = useUser(); // Get user from UserContext

  const fetchAndSetCompany = useCallback(async (userId: string, role: string) => {
    try {
      // if the role is guest then no need to fetch company data
      if (role === 'guest') return null;
      const companyData: ICompany = await fetchCompanyData(userId, role);
      setCompany(companyData);

      // Persist company data in local storage
      localStorage.setItem('company', JSON.stringify(companyData));
    } catch (error) {
      handleError.toast(error);
    }
  }, []);

  const updateCompany = useCallback(
    async (partialUpdate: Partial<ICompany>) => {
      setCompany((prevCompany) => {
        if (!prevCompany) return undefined;
        const updatedCompany = { ...prevCompany, ...partialUpdate } as ICompany;
        if (partialUpdate.contactDetails) {
          updatedCompany.contactDetails = {
            ...prevCompany.contactDetails,
            ...partialUpdate.contactDetails,
          };
        }
        return updatedCompany;
      });

      try {
        const updatedCompany = { ...company, ...partialUpdate } as ICompany;
        if (partialUpdate.contactDetails) {
          updatedCompany.contactDetails = {
            ...company?.contactDetails,
            ...partialUpdate.contactDetails,
          };
        }
        const response = await ApiPut.company.updateCompany(updatedCompany._id.toString(), updatedCompany);
        if (!response.success) throw new Error(response.message ?? 'Failed to update company details');
        setCompany(response.data);
        localStorage.setItem('company', JSON.stringify(response.data));
        toast.success(response.message ?? 'Company details updated successfully');
      } catch (error) {
        handleError.toastAndLog(error);
      }
    },
    [company],
  );

  const saveCompany = useCallback(async (company: ICompany) => {
    const confirmed = await userConfirmation({
      header: 'Confirm Update',
      message: 'Are you sure you want to update the company details?',
    });

    if (!confirmed) return;

    try {
      const updatedCompany = await ApiPut.company.updateCompany(company._id.toString(), company);
      setCompany(updatedCompany);
      localStorage.setItem('company', JSON.stringify(updatedCompany));
      handleError.toast('Company details updated successfully');
    } catch (error) {
      handleError.toastAndLog(error);
    }
  }, []);

  const addUserToCompany = useCallback(
    async (userId: string, email: string) => {
      try {
        const updatedUsers = [
          ...(company?.users || []),
          {
            userId: new mongoose.Types.ObjectId(userId),
            email,
          },
        ];
        await updateCompany({ users: updatedUsers });
      } catch (error) {
        handleError.toastAndLog(error);
      }
    },
    [company, updateCompany],
  );

  useEffect(() => {
    if (pathname.startsWith('/auth')) {
      setCompany(initialCompanyState);
      // remove company data from local storage
      localStorage.removeItem('company');
      return;
    }

    const storedCompany = localStorage.getItem('company');
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany) as ICompany);
    } else if (user && user._id && user.companyAccess && user.companyAccess.role) {
      fetchAndSetCompany(user._id.toString(), user.companyAccess.role);
    }
  }, [fetchAndSetCompany, pathname, user]);

  const contextValue = useMemo(
    () => ({
      company,
      setCompany,
      updateCompany,
      fetchAndSetCompany,
      saveCompany,
      addUserToCompany,
    }),
    [company, updateCompany, fetchAndSetCompany, saveCompany, addUserToCompany],
  );

  return <CompanyContext.Provider value={contextValue}>{children}</CompanyContext.Provider>;
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }

  return context;
};
