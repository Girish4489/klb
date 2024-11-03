'use client';
import { useUser } from '@/app/context/userContext';
import { fetchCompanyData } from '@/app/util/company/companyFetchUtil/companyUtils';
import { userConfirmation } from '@/app/util/confirmation/confirmationUtil';
import handleError from '@/app/util/error/handleError';
import { ApiPut } from '@/app/util/makeApiRequest/makeApiRequest';
import { ICompany } from '@/models/companyModel';
import { usePathname } from 'next/navigation';
import React, { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';

interface CompanyContextProps {
  children: ReactNode;
}

interface CompanyContextType {
  company: ICompany | undefined;
  setCompany: React.Dispatch<React.SetStateAction<ICompany | undefined>>;
  updateCompany: (partialUpdate: Partial<ICompany>) => void;
  fetchAndSetCompany: (userId: string, role: string) => void;
  saveCompany: (company: ICompany) => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<CompanyContextProps> = ({ children }) => {
  const [company, setCompany] = React.useState<ICompany | undefined>(undefined);

  const pathname = usePathname();
  const { user } = useUser(); // Get user from UserContext

  const fetchAndSetCompany = useCallback(async (userId: string, role: string) => {
    try {
      const companyData: ICompany = await fetchCompanyData(userId, role);
      setCompany(companyData);

      // Persist company data in local storage
      localStorage.setItem('company', JSON.stringify(companyData));
    } catch (error) {
      handleError.toast(error);
    }
  }, []);

  const updateCompany = useCallback((partialUpdate: Partial<ICompany>) => {
    setCompany((prevCompany) => {
      if (!prevCompany) return null;
      return { ...prevCompany.toObject(), ...partialUpdate };
    });
  }, []);

  const saveCompany = useCallback(async (company: ICompany) => {
    const confirmed = await userConfirmation({
      header: 'Confirm Update',
      message: 'Are you sure you want to update the company details?',
    });

    if (!confirmed) return;

    try {
      const updatedCompany = await ApiPut.Company(company._id.toString(), company);
      setCompany(updatedCompany);
      handleError.toast('Company details updated successfully');
    } catch (error) {
      handleError.toastAndLog(error);
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/auth')) return; // Skip fetching company data on auth pages

    const storedCompany = localStorage.getItem('company');
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany) as ICompany);
    } else if (user && user._id && user.role) {
      fetchAndSetCompany(user._id.toString(), user.role);
    }
  }, [fetchAndSetCompany, pathname, user]);

  return (
    <CompanyContext.Provider value={{ company, setCompany, updateCompany, fetchAndSetCompany, saveCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }

  return context;
};
