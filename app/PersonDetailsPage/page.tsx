'use client'
import { useState, useEffect, ReactNode } from 'react'
import {
  Edit,
  ArrowLeft,
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  Calendar,
  Users,
  Building
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Tab component
const TabsList = ({ children }: { children: ReactNode }) => (
  <div className='scrollbar-hide mb-8 overflow-x-auto border-b border-gray-200 pb-1 md:overflow-visible'>
    <div className='flex justify-start md:w-auto'>{children}</div>
  </div>
)

const TabsTrigger = ({
  value,
  active,
  onClick,
  children
}: {
  value: string
  active: boolean
  onClick: (value: string) => void
  children: ReactNode
}) => (
  <button
    onClick={() => onClick(value)}
    className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold md:text-base ${
      active ? 'border-green-500 text-green-500' : 'border-transparent'
    }`}
  >
    {children}
  </button>
)

const TabsContent = ({
  value,
  activeTab,
  children
}: {
  value: string
  activeTab: string
  children: ReactNode
}) => <div className={value === activeTab ? 'block' : 'hidden'}>{children}</div>

// Card components
const Card = ({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) => (
  <div
    className={`rounded-xl border border-gray-200 transition-shadow hover:shadow-md ${className}`}
  >
    {children}
  </div>
)

const CardContent = ({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) => <div className={`p-6 ${className}`}>{children}</div>

export default function PersonDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')

  // Get the person ID from the URL parameters
  const personId = params?.id

  // Load person data from localStorage on initial mount
  useEffect(() => {
    const loadPersonData = () => {
      setLoading(true)
      try {
        const storedPeople = localStorage.getItem('peopleData')
        if (storedPeople) {
          const people = JSON.parse(storedPeople)
          const foundPerson = people.find(
            (p: { id: number }) => p.id === parseInt(personId)
          )

          if (foundPerson) {
            setPerson(foundPerson)
          } else {
            // Person not found
            console.error('Person not found with ID:', personId)
          }
        }
      } catch (error) {
        console.error('Error loading person data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (personId) {
      loadPersonData()
    }
  }, [personId])

  // Function to go back to the people list
  const handleGoBack = () => {
    router.back()
  }

  // Function to handle editing
  const handleEditPerson = () => {
    // Store the editing person in localStorage for state persistence
    localStorage.setItem('editingPerson', JSON.stringify(person))
    // Go to the main page where editing will be handled
    router.push('/?edit=' + personId)
  }

  // Categorize person properties
  const categorizeProperties = (person: { [key: string]: any }) => {
    if (!person) return {}

    // Define categories with normalized keys to prevent duplicates
    const categoryMappings: { [key: string]: { [key: string]: string[] } } = {
      personal: {
        name: ['name'],
        email: ['email'],
        phone: ['phone', 'mobile', 'contactnumber', 'contact number'],
        dateOfBirth: ['dateofbirth', 'date of birth'],
        gender: ['gender'],
        address: ['address']
      },
      professional: {
        role: ['role', 'position', 'title', 'jobtitle'],
        department: ['department'],
        company: ['company'],
        experience: ['experience'],
        skills: ['skills']
      },
      family: {
        parentName: ['parentname', 'parent name'],
        parentContact: ['parentcontact', 'parent contact'],
        spouse: ['spouse'],
        children: ['children'],
        familyMembers: ['familymembers', 'family members'],
        guardian: ['guardian']
      },
      education: {
        education: ['education'],
        degree: ['degree'],
        school: ['school'],
        college: ['college'],
        university: ['university'],
        graduation: ['graduation'],
        qualifications: ['qualifications']
      }
    }

    // Initialize categorized data object
    const categorized: { [key: string]: { [key: string]: any } } = {
      personal: {},
      professional: {},
      family: {},
      education: {},
      other: {}
    }

    // Track which keys have been processed to avoid duplicates
    const processedKeys = new Set<string>()

    // Categorize each property
    Object.entries(person).forEach(([key, value]) => {
      // Skip ID and already processed keys
      if (key === 'id' || processedKeys.has(key.toLowerCase())) return

      const keyLower = key.toLowerCase()
      let foundCategory: string | null = null
      let normalizedKey: string | null = null

      // Find which category this key belongs to
      for (const [category, mappings] of Object.entries(categoryMappings)) {
        for (const [normalizedName, variations] of Object.entries(mappings)) {
          if (variations.includes(keyLower)) {
            foundCategory = category
            normalizedKey = normalizedName
            break
          }
        }
        if (foundCategory) break
      }

      // If no specific category is found, put in "other"
      if (!foundCategory) {
        foundCategory = 'other'
        normalizedKey = key
      }

      // Add to categorized data and mark as processed
      if (foundCategory && normalizedKey) {
        categorized[foundCategory][normalizedKey] = value
        processedKeys.add(keyLower)

        // Also mark all variations as processed to prevent duplicates
        if (foundCategory !== 'other') {
          const categoryMapping = categoryMappings[foundCategory]
          const variations = categoryMapping[normalizedKey]
          variations.forEach((variation: string) =>
            processedKeys.add(variation)
          )
        }
      }
    })

    return categorized
  }

  // Show loading state
  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500'></div>
      </div>
    )
  }

  // Show error if person not found
  if (!person) {
    return (
      <div className='container mx-auto max-w-4xl p-4'>
        <button
          onClick={handleGoBack}
          className='mb-6 flex items-center text-green-500 hover:text-blue-800'
        >
          <ArrowLeft size={18} className='mr-1' />
          Back to People List
        </button>
        <div className='rounded-lg bg-white p-6 text-center shadow'>
          <h1 className='mb-4 text-2xl font-bold'>Person Not Found</h1>
          <p>
            The person you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    )
  }

  // Categorize person data
  const categorizedData = categorizeProperties(person)

  // Hide empty categories
  const nonEmptyCategories = Object.entries(categorizedData)
    .filter(
      ([_, values]: [string, { [key: string]: any }]) =>
        Object.keys(values).length > 0
    )
    .map(([category]) => category)

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'personal':
        return 'Personal Information'
      case 'professional':
        return 'Professional Details'
      case 'family':
        return 'Family Information'
      case 'education':
        return 'Education Background'
      default:
        return 'Other Information'
    }
  }

  // Get icon for specific field
  const getFieldIcon = (field: string) => {
    const fieldLower = field.toLowerCase()
    if (fieldLower.includes('email')) return <Mail size={16} />
    if (fieldLower.includes('name')) return <User size={16} />
    if (fieldLower.includes('role') || fieldLower.includes('department'))
      return <Briefcase size={16} />
    if (fieldLower.includes('phone') || fieldLower.includes('contact'))
      return <Phone size={16} />
    if (fieldLower.includes('address')) return <MapPin size={16} />
    if (fieldLower.includes('date') || fieldLower.includes('birth'))
      return <Calendar size={16} />
    if (
      fieldLower.includes('family') ||
      fieldLower.includes('parent') ||
      fieldLower.includes('spouse')
    )
      return <Users size={16} />
    if (fieldLower.includes('company') || fieldLower.includes('department'))
      return <Building size={16} />
    return null
  }

  // Get display name for field
  const getDisplayName = (key: string): string => {
    const displayNames: { [key: string]: string } = {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      address: 'Address',
      role: 'Role/Position',
      department: 'Department',
      company: 'Company',
      experience: 'Experience',
      skills: 'Skills',
      parentName: 'Parent Name',
      parentContact: 'Parent Contact',
      spouse: 'Spouse',
      children: 'Children',
      familyMembers: 'Family Members',
      guardian: 'Guardian',
      education: 'Education',
      degree: 'Degree',
      school: 'School',
      college: 'College',
      university: 'University',
      graduation: 'Graduation',
      qualifications: 'Qualifications'
    }

    return (
      displayNames[key] ||
      key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str: string) => str.toUpperCase())
    )
  }

  return (
    <div className='container mx-auto max-w-4xl p-4'>
      {/* Back button */}
      <button
        onClick={handleGoBack}
        className='mb-6 flex items-center text-green-500 hover:text-blue-800'
      >
        <ArrowLeft size={18} className='mr-1' />
        Back to People List
      </button>

      <div className='rounded-lg bg-white p-6 shadow'>
        {/* Header with edit button */}
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Person Details</h1>
          <button
            className='flex items-center gap-1 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
            onClick={handleEditPerson}
          >
            <Edit size={16} />
            Edit
          </button>
        </div>

        {/* Tabs */}
        <TabsList>
          {nonEmptyCategories.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              active={activeTab === category}
              onClick={setActiveTab}
            >
              {getCategoryLabel(category)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab content */}
        <div className='mt-4'>
          {nonEmptyCategories.map(category => (
            <TabsContent key={category} value={category} activeTab={activeTab}>
              <Card>
                <CardContent>
                  <ul className='space-y-4'>
                    {Object.entries(categorizedData[category]).map(
                      ([key, value]) => (
                        <li key={key} className='flex items-start'>
                          <div className='flex-1'>
                            <div className='flex items-center'>
                              {getFieldIcon(key) && (
                                <span className='mr-2 text-green-500'>
                                  {getFieldIcon(key)}
                                </span>
                              )}
                              <h4 className='font-medium text-green-500'>
                                {getDisplayName(key)}
                              </h4>
                            </div>
                            <p className='ml-6 mt-1 text-gray-600'>
                              {value?.toString() || '-'}
                            </p>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </div>
      </div>
    </div>
  )
}
