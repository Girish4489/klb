'use client';
import { useCompany } from '@context/companyContext';
import { useState } from 'react';
import AddCompanyButton from './components/AddCompanyButton';
import CompanyDetails from './components/CompanyDetails';
import UserDetails from './components/UserDetails';

const CompanyPage: React.FC = () => {
  const { company } = useCompany();
  const [isEditing, setIsEditing] = useState(false);

  if (!company?.name) {
    return <AddCompanyButton />;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <h1 className="grow text-center">Company Details</h1>
      <CompanyDetails company={company} isEditing={isEditing} setIsEditing={setIsEditing} />
      <UserDetails users={company.users ?? []} />
    </div>
  );
};

export default CompanyPage;
