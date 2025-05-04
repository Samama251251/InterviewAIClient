import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Briefcase, Mail, Trash2, AlertCircle, X, Building } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee } from '@/types/employee';
import { useToast } from '@/hooks/useToast';
import { useCompanyContext } from '@/contexts/CompanyContext';
import AddEmployeeModal from '@/components/Employee/AddEmployeeModal';

const EmployeesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toast = useToast();

  // Use hooks
  const { getEmployees, deleteEmployee } = useEmployees();
  const { selectedCompany } = useCompanyContext();
  
  // Fetch data
  const { data: allEmployees = [], isLoading: isEmployeesLoading, error: employeesError } = getEmployees;
  
  // Filter employees for the selected company
  const companyEmployees = useMemo(() => {
    if (!selectedCompany) return [];
    
    return allEmployees.filter(employee => {
      const employeeCompanyId = typeof employee.company_id === 'object' 
        ? employee.company_id._id 
        : employee.company_id;
      
      return employeeCompanyId === selectedCompany._id;
    });
  }, [allEmployees, selectedCompany]);

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return companyEmployees;
    
    const query = searchQuery.toLowerCase();
    return companyEmployees.filter(employee => {
      // Handle both populated and non-populated user_id
      const userName = typeof employee.user_id === 'object' ? employee.user_id.name?.toLowerCase() : '';
      const userEmail = typeof employee.user_id === 'object' ? employee.user_id.email?.toLowerCase() : '';
      const role = employee.role?.toLowerCase() || '';
      
      return userName.includes(query) || 
             userEmail.includes(query) || 
             role.includes(query);
    });
  }, [companyEmployees, searchQuery]);

  // Calculate metrics
  const metrics = useMemo(() => {
    // Count employees per role
    const roleCounts = companyEmployees.reduce((acc: Record<string, number>, employee) => {
      const role = employee.role || 'Unspecified';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: companyEmployees.length,
      byRole: roleCounts,
      topRoles: Object.entries(roleCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
    };
  }, [companyEmployees]);

  // Handle employee deletion
  const handleDeleteEmployee = async () => {
    if (!selectedEmployeeId) return;
    
    try {
      await deleteEmployee.mutateAsync(selectedEmployeeId);
      setIsDeleteModalOpen(false);
      setSelectedEmployeeId(null);
      toast.success('Employee removed successfully');
      
    } catch (error: any) {
      toast.error('Failed to delete employee');
      console.error('Error deleting employee:', error);
    }
  };

  // Prepare for employee deletion
  const openDeleteModal = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsDeleteModalOpen(true);
  };

  // Get user name and email display
  const getUserInfo = (employee: Employee) => {
    if (typeof employee.user_id === 'object') {
      return {
        name: employee.user_id.name || 'N/A',
        email: employee.user_id.email || 'N/A'
      };
    }
    
    return {
      name: 'Unknown User',
      email: 'N/A'
    };
  };

  // If still loading, show loading state
  if (isEmployeesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4">Loading employees...</p>
      </div>
    );
  }

  // If no company selected, display message
  if (!selectedCompany) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Building className="w-16 h-16 text-warning mb-4" />
        <h1 className="text-2xl font-bold mb-4">No Company Selected</h1>
        <p className="text-base-content/70 text-center mb-6">
          Please select a company first to view its employees.
        </p>
      </div>
    );
  }

  // If error fetching employees, show error state
  if (employeesError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <AlertCircle className="w-16 h-16 text-error mb-4" />
        <h1 className="text-2xl font-bold mb-4">Error loading employees</h1>
        <p className="text-base-content/70 text-center mb-6">
          There was a problem loading the employee data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <motion.div 
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedCompany.name} - Employees
          </h1>
          <p className="text-base-content/70 mt-1">
            Manage employees and their roles for {selectedCompany.name}
          </p>
        </div>
        
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <div className="stat bg-base-200 rounded-box p-4 shadow-sm">
          <div className="stat-figure text-primary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Employees</div>
          <div className="stat-value text-primary">{metrics.total}</div>
        </div>
        
        {metrics.topRoles.map(([role, count], index) => (
          <div 
            key={role} 
            className="stat bg-base-200 rounded-box p-4 shadow-sm"
          >
            <div className="stat-figure text-secondary">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="stat-title">{role}</div>
            <div className="stat-value text-secondary">{count}</div>
            <div className="stat-desc">
              {metrics.total > 0 ? `${((count / metrics.total) * 100).toFixed(1)}% of total` : '0% of total'}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <div className="flex items-center mb-6 mt-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-base-content/50" />
          </div>
          <input
            type="text"
            placeholder="Search employees by name, email, or role..."
            className="input input-bordered pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="overflow-x-auto bg-base-100 rounded-box shadow-sm">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base-content/70">
              {searchQuery.trim() 
                ? 'No employees found matching your search.' 
                : `No employees in ${selectedCompany.name} yet. Add your first employee!`}
            </p>
          </div>
        ) : (
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => {
                const userInfo = getUserInfo(employee);
                return (
                  <tr key={employee._id}>
                    <td className="font-medium">{userInfo.name}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-base-content/70" />
                        {userInfo.email}
                      </div>
                    </td>
                    <td>{employee.role || 'Unspecified'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => openDeleteModal(employee._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        company={selectedCompany}
        onSuccess={() => {
          toast.success(`Employee added to ${selectedCompany.name}`);
        }}
      />

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
          <p>
            Are you sure you want to remove this employee from {selectedCompany.name}? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button 
              className="btn"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-error"
              onClick={handleDeleteEmployee}
              disabled={deleteEmployee.isPending}
            >
              {deleteEmployee.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default EmployeesPage; 