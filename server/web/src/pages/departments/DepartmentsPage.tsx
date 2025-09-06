import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { 
  Building2, 
  Users, 
  Search, 
  MoreVertical,
  UserCheck,
  Award,
  Plus,
  Download,
  Eye,
  Edit,
  Settings
} from 'lucide-react';
import { exportToExcel } from '../../utils/exportUtils';
import { useAppStore } from '../../store';
import { MOCK_DEPARTMENTS } from '../../data/mockDepartments';

export const DepartmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { addNotification } = useAppStore();

  const filteredDepartments = MOCK_DEPARTMENTS.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.head.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || dept.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'Inactive':
        return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Technology':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Engineering':
        return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'Science':
        return 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700';
      default:
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
            <p className="text-muted-foreground mt-1">Manage academic departments and organizational structure</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                exportToExcel(filteredDepartments, 'departments-data');
                addNotification({ message: 'Department data exported successfully', type: 'success' });
              }}
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Departments</p>
                  <div className="text-3xl font-bold text-primary mt-2">{MOCK_DEPARTMENTS.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">academic departments</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Technology Depts</p>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {MOCK_DEPARTMENTS.filter(d => d.type === 'Technology').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">tech-focused</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 dark:from-green-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Faculty</p>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                    {MOCK_DEPARTMENTS.reduce((acc, d) => acc + d.faculty, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">across all departments</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 dark:from-purple-950/30 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                    {MOCK_DEPARTMENTS.reduce((acc, d) => acc + d.students, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">enrolled students</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search departments by name, code, or head..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Technology">Technology</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Science">Science</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departments Table */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                All Departments ({filteredDepartments.length})
              </CardTitle>
              <Badge variant="outline" className="text-muted-foreground">
                Academic Year 2024-25
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Head & Contact</TableHead>
                    <TableHead className="font-semibold">Type & Programs</TableHead>
                    <TableHead className="font-semibold">Faculty</TableHead>
                    <TableHead className="font-semibold">Students</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((department) => (
                    <TableRow key={department.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-medium">{department.name}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {department.code}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{department.head}</div>
                          <div className="text-xs text-muted-foreground">{department.email}</div>
                          <div className="text-xs text-muted-foreground">{department.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getTypeColor(department.type)}>
                            {department.type}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {department.programs} programs
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <UserCheck className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{department.faculty}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{department.students}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(department.status)}>
                          {department.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <button 
                            className="h-8 w-8 p-0 hover:bg-muted/80 transition-colors rounded-md flex items-center justify-center border border-transparent hover:border-border"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === department.id ? null : department.id);
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {openDropdown === department.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                              <div className="absolute right-0 top-8 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-50 py-1 animate-in slide-in-from-top-2">
                                <button 
                                  onClick={() => setOpenDropdown(null)} 
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left rounded-sm"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </button>
                                <button 
                                  onClick={() => setOpenDropdown(null)} 
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left rounded-sm"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit Department
                                </button>
                                <button 
                                  onClick={() => setOpenDropdown(null)} 
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left rounded-sm"
                                >
                                  <Users className="h-4 w-4" />
                                  Manage Faculty
                                </button>
                                <button 
                                  onClick={() => setOpenDropdown(null)} 
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left rounded-sm"
                                >
                                  <Settings className="h-4 w-4" />
                                  Department Settings
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredDepartments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No departments found</p>
                <p className="text-sm">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};