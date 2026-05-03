import Sidebar from '../../components/Sidebar';

const EmployeeLayout = ({ children }) => (
  <div className="min-h-screen bg-surface">
    <div className="lg:flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  </div>
);

export default EmployeeLayout;
