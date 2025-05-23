"use client"
import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Trash2, Edit, Save, X, Upload, Search, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

// Define types for TypeScript
interface Person {
  id: number;
  name: string;
  email: string;
  role: string;
  [key: string]: any; // For any additional properties from Excel
}
interface NewPerson {
  name: string;
  email: string;
  role: string;
}
// Placeholder component similar to the one referenced in the example
const AnimatingPlaceholderInput = ({ placeholders, onChange, onSubmit }) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);
  
  return (
    <div className="relative">
      <input
        type="text"
        className="w-full p-2 border rounded-md pl-10"
        placeholder={placeholders[placeholderIndex]}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit();
          }
        }}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
    </div>
  );
};
export default function PeopleListManager() {
  const router = useRouter(); // Initialize router
  const [people, setPeople] = useState<Person[]>([]);
  const [newPerson, setNewPerson] = useState<NewPerson>({ name: '', email: '', role: '' });
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  
  // Store people data in localStorage
  useEffect(() => {
    if (people.length > 0) {
      localStorage.setItem('peopleData', JSON.stringify(people));
    }
  }, [people]);

  // Load people data from localStorage on initial mount
  useEffect(() => {
    const storedPeople = localStorage.getItem('peopleData');
    if (storedPeople) {
      try {
        setPeople(JSON.parse(storedPeople));
      } catch (e) {
        console.error('Error parsing stored people data', e);
      }
    }
  }, []);
  
  // Get unique roles for filtering
  const roles = ['All', ...Array.from(new Set(people.map(person => person.role)))].filter(Boolean);
  
  // Update filtered people when search or filters change
  const updateFilteredPeople = useCallback(() => {
    const filtered = people.filter(person => {
      const matchesSearch = 
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'All' || person.role === selectedRole;
      return matchesSearch && matchesRole;
    });
    setFilteredPeople(filtered);
  }, [searchQuery, selectedRole, people]);
  
  // Apply debounced filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilteredPeople();
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [updateFilteredPeople]);
  
  // Initialize filtered people with all people
  useEffect(() => {
    setFilteredPeople(people);
  }, [people]);
  
  // Function to handle sample file download
  const handleSampleDownload = async () => {
    try {
      // Create a sample Excel file dynamically using SheetJS
      // Sample data structure with expanded information
      const sampleData = [
        { 
          Name: "Person 1", 
          Email: "person1@example.com", 
          Role: "Developer", 
          Address: "1 Example Street, City, Country", 
          "Contact Number": "+91-9000000000", 
          "Parent Name": "Parent 1", 
          "Parent Contact": "+91-8000000000", 
          "Date of Birth": "1990-01-15", 
          Department: "Engineering" 
        },
        { 
          Name: "Person 2", 
          Email: "person2@example.com", 
          Role: "Designer", 
          Address: "2 Example Street, City, Country", 
          "Contact Number": "+91-9000000001", 
          "Parent Name": "Parent 2", 
          "Parent Contact": "+91-8000000001", 
          "Date of Birth": "1991-02-15", 
          Department: "Design" 
        }
      ];
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "People");
      
      // Generate binary data
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create a Blob from the buffer with the correct MIME type
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create a download link and trigger the download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Sample-input.xlsx';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error creating sample file:', error);
      alert('Error creating the sample file. Please try again later.');
    }
  };
  
  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target?.result) return;
        // Process Excel file using SheetJS
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        // Get the first worksheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        // Map to our Person interface
        const importedPeople = jsonData.map((row: any) => {
          return {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: row.name || row.Name || '',
            email: row.email || row.Email || '',
            role: row.role || row.Role || '',
            ...row // Keep any additional fields
          };
        });
        // Add the imported people to the state
        setPeople(current => [...importedPeople, ...current]);
        // Clear the file input
        event.target.value = '';
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing the Excel file. Please try a different file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };
  
  // Function to handle adding a new person
  const handleAddPerson = () => {
    if (!newPerson.name.trim()) return;
    const personWithId: Person = {
      id: Date.now(),
      ...newPerson
    };
    // Add new person at the top of the list
    setPeople([personWithId, ...people]);
    setNewPerson({ name: '', email: '', role: '' });
    setIsDialogOpen(false);
  };
  
  // Function to handle deleting a person
  const handleDeletePerson = (id: number) => {
    setPeople(people.filter(person => person.id !== id));
  };
  
  // Function to handle editing a person
  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setIsEditDialogOpen(true);
  };
  
  // Function to handle clicking on a person - navigate to details page
  const handlePersonClick = (person: Person) => {
    // Navigate to person details page with the person's ID
    router.push(`/person/${person.id}`);
  };
  
  // Function to save edited person
  const handleSaveEdit = () => {
    if (!editingPerson || !editingPerson.name.trim()) return;
    setPeople(people.map(person => 
      person.id === editingPerson.id ? editingPerson : person
    ));
    setEditingPerson(null);
    setIsEditDialogOpen(false);
  };
  
  // Function to handle field change in editing mode
  const handleEditFieldChange = (key: string, value: any) => {
    if (!editingPerson) return;
    setEditingPerson({
      ...editingPerson,
      [key]: value
    });
  };
  
  return (
    <div className="flex flex-col space-y-4 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">People Manager</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <button
              className="px-3 py-1 border rounded text-sm flex items-center gap-1"
              onClick={handleSampleDownload}
            >
              <Download size={16} />
              Sample Download
            </button>
          </div>
          <div className="relative">
            <button
              className="px-3 py-1 border rounded text-sm flex items-center gap-1"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload size={16} />
              Upload Excel
            </button>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <div className="relative inline-block">
            <button 
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusCircle size={16} />
              Add Person
            </button>
            {isDialogOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Add New Person</h3>
                    <button onClick={() => setIsDialogOpen(false)} className="text-gray-500">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <input
                        id="name"
                        className="border rounded p-2"
                        value={newPerson.name}
                        onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <input
                        id="email"
                        className="border rounded p-2"
                        value={newPerson.email}
                        onChange={(e) => setNewPerson({...newPerson, email: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="role" className="text-sm font-medium">Role</label>
                      <input
                        id="role"
                        className="border rounded p-2"
                        value={newPerson.role}
                        onChange={(e) => setNewPerson({...newPerson, role: e.target.value})}
                        placeholder="Developer"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button 
                      className="px-3 py-1 border rounded"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={handleAddPerson}
                    >
                      Add Person
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Search and Filter Section */}
      <div className="mt-4 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <AnimatingPlaceholderInput
              placeholders={[
                "Search by name...",
                "Search by email...",
                "Search by role...",
                "Find team members...",
                "Look up collaborators..."
              ]}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSubmit={() => {}}
            />
          </div>
          {people.length > 0 && (
            <div className="w-full md:w-48">
              <select
                className="w-full p-2 border rounded-md"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role || 'Unspecified'}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      {/* Edit Person Dialog */}
      {isEditDialogOpen && editingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Person</h3>
              <button onClick={() => setIsEditDialogOpen(false)} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-4 py-4">
              {/* Display all fields from the person object, including dynamically imported ones */}
              {Object.entries(editingPerson)
                .filter(([key]) => key !== 'id') // Exclude ID from editing
                .sort(([keyA], [keyB]) => {
                  // Ensure name, email, and role appear first in that order
                  const order = {name: 0, email: 1, role: 2};
                  const orderA = order[keyA] !== undefined ? order[keyA] : Infinity;
                  const orderB = order[keyB] !== undefined ? order[keyB] : Infinity;
                  return orderA - orderB;
                })
                .map(([key, value]) => (
                  <div key={key} className="grid gap-2">
                    <label htmlFor={`edit-${key}`} className="text-sm font-medium capitalize">
                      {key}
                    </label>
                    <input
                      id={`edit-${key}`}
                      className="border rounded p-2"
                      value={value?.toString() || ''}
                      onChange={(e) => handleEditFieldChange(key, e.target.value)}
                    />
                  </div>
                ))
              }
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                className="px-3 py-1 border rounded"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* People List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPeople.length > 0 ? (
          filteredPeople.map((person) => (
            <div 
              key={person.id} 
              className="relative border rounded-lg w-full h-16 flex items-center cursor-pointer hover:bg-gray-50"
              onClick={() => handlePersonClick(person)}
            >
              <div className="p-4 w-full">
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex space-x-1">
                  <button
                    className="h-8 w-8 text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPerson(person);
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePerson(person.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{person.name}</h3>
                    <div className="flex gap-2">
                      <p className="text-gray-500 text-sm">{person.email}</p>
                      {person.role && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          {person.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : searchQuery || selectedRole !== 'All' ? (
          <div className="col-span-full flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">No people found matching your search</p>
            <button 
              className="px-3 py-1 border rounded text-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('All');
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">No people added yet</p>
          </div>
        )}
      </div>
    </div>
  );
}