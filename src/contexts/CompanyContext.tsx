import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Company } from '@/types/company';
import { useCompanies } from '@/hooks/useCompanies';

interface CompanyContextType {
  companies: Company[];
  eligibleCompanies: Company[]; // Companies where user is owner or employee
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company) => void;
  isLoading: boolean;
  error: unknown;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const { getCompanies } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const { data: companies = [], isLoading, error } = getCompanies;

  // Filter companies to only include those where user is owner or employee
  const eligibleCompanies = useMemo(() => {
    return companies.filter(company => 
      company.role === 'owner' || company.role === 'employee'
    );
  }, [companies]);

  // Set the first eligible company as selected when companies load
  useEffect(() => {
    if (eligibleCompanies.length > 0 && !selectedCompany) {
      // Prioritize companies where user is owner
      const ownedCompany = eligibleCompanies.find(company => company.role === 'owner');
      if (ownedCompany) {
        setSelectedCompany(ownedCompany);
      } else if (eligibleCompanies.length > 0) {
        setSelectedCompany(eligibleCompanies[0]);
      }
    } else if (eligibleCompanies.length === 0) {
      // Reset selection if there are no eligible companies
      setSelectedCompany(null);
    }
  }, [eligibleCompanies, selectedCompany]);

  // Save selected company ID to localStorage
  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem('selectedCompanyId', selectedCompany._id);
    }
  }, [selectedCompany]);

  // Load selected company from localStorage
  useEffect(() => {
    if (eligibleCompanies.length > 0) {
      const savedCompanyId = localStorage.getItem('selectedCompanyId');
      if (savedCompanyId) {
        const savedCompany = eligibleCompanies.find(company => company._id === savedCompanyId);
        if (savedCompany) {
          setSelectedCompany(savedCompany);
        }
      }
    }
  }, [eligibleCompanies]);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        eligibleCompanies,
        selectedCompany,
        setSelectedCompany,
        isLoading,
        error
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
}; 