'use client';
import { useAuth, useUser } from '@context/userContext';
import { ICompany } from '@models/companyModel';
import { fetchCompanyData } from '@utils/company/companyFetchUtils';
import { userConfirmation } from '@utils/confirmation/confirmationUtil';
import handleError from '@utils/error/handleError';
import { ApiPut } from '@utils/makeApiRequest/makeApiRequest';
import mongoose from 'mongoose';
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

export const CompanyProvider: React.FC<CompanyContextProps> = ({ children }) => {
  const [company, setCompany] = useState<ICompany | undefined>(undefined);
  const { user } = useUser();
  const { isAuthenticated } = useAuth();

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
    // Reset company state when user is not authenticated
    if (!isAuthenticated || !user?.isCompanyMember) {
      setCompany(undefined);
      localStorage.removeItem('company');
      return;
    }

    // Only fetch company data if user is authenticated and a company member
    if (user.isCompanyMember && user.companyAccess && user?.companyAccess?.companyId && user._id) {
      fetchAndSetCompany(user._id.toString(), user.companyAccess.role);
    }
  }, [isAuthenticated, user]);

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
