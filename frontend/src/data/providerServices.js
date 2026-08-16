// Provider Services Data Store
// This will store services added by providers after login

let providerServices = [];

// Service categories mapping
const serviceCategories = {
  'home-services': 'Home Services',
  'automotive-services': 'Automotive Services', 
  'medical-services': 'Medical Services',
  'tutoring-services': 'Tutoring Services',
  'personal-support': 'Personal Support',
  'emergency-services': 'Emergency Services'
};

// Add a new service by a provider
export const addProviderService = (serviceData) => {
  const newService = {
    id: Date.now().toString(),
    ...serviceData,
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  
  providerServices.push(newService);
  return newService;
};

// Get all services for a specific category
export const getServicesByCategory = (categoryId) => {
  return providerServices.filter(service => service.categoryId === categoryId);
};

// Get all services by a specific provider
export const getServicesByProvider = (providerId) => {
  return providerServices.filter(service => service.providerId === providerId);
};

// Update a service
export const updateService = (serviceId, updates) => {
  const index = providerServices.findIndex(service => service.id === serviceId);
  if (index !== -1) {
    providerServices[index] = { ...providerServices[index], ...updates };
    return providerServices[index];
  }
  return null;
};

// Delete a service
export const deleteService = (serviceId) => {
  const index = providerServices.findIndex(service => service.id === serviceId);
  if (index !== -1) {
    const deleted = providerServices.splice(index, 1);
    return deleted[0];
  }
  return null;
};

// Get all provider services (for admin)
export const getAllProviderServices = () => {
  return providerServices;
};

// Get service by ID
export const getServiceById = (serviceId) => {
  return providerServices.find(service => service.id === serviceId);
};

// Get service categories
export const getServiceCategories = () => {
  return serviceCategories;
};

// Initialize with some sample data for testing
export const initializeSampleServices = () => {
  if (providerServices.length === 0) {
    const sampleServices = [
      {
        providerId: 'provider1',
        providerName: 'John Smith',
        providerEmail: 'john@example.com',
        categoryId: 'home-services',
        title: 'Professional Home Plumbing',
        description: 'Expert plumbing services including repairs, installations, and maintenance for residential properties.',
        price: 65,
        priceUnit: 'hour',
        location: 'Downtown District',
        responseTime: '30 min',
        availability: true,
        verified: true,
        services: ['Plumbing Repair', 'Pipe Installation', 'Emergency Plumbing'],
        experience: '10+ years',
        rating: 4.8,
        reviews: 127
      },
      {
        providerId: 'provider2',
        providerName: 'Sarah Williams',
        providerEmail: 'sarah@example.com',
        categoryId: 'automotive-services',
        title: 'Premium Car Detailing',
        description: 'Complete car detailing services including interior cleaning, exterior polishing, and paint protection.',
        price: 80,
        priceUnit: 'hour',
        location: 'South District',
        responseTime: '45 min',
        availability: true,
        verified: true,
        services: ['Car Detailing', 'Interior Cleaning', 'Paint Protection'],
        experience: '8+ years',
        rating: 4.9,
        reviews: 178
      },
      {
        providerId: 'provider3',
        providerName: 'Dr. Emily Brown',
        providerEmail: 'emily@example.com',
        categoryId: 'medical-services',
        title: 'General Medical Consultation',
        description: 'Comprehensive medical consultations and health assessments for adults and children.',
        price: 100,
        priceUnit: 'session',
        location: 'Medical Center',
        responseTime: '10 min',
        availability: true,
        verified: true,
        services: ['General Consultation', 'Health Assessment', 'Medical Advice'],
        experience: '15+ years',
        rating: 4.9,
        reviews: 267
      }
    ];
    
    sampleServices.forEach(service => addProviderService(service));
  }
};

// Export for use in components
export default {
  addProviderService,
  getServicesByCategory,
  getServicesByProvider,
  updateService,
  deleteService,
  getAllProviderServices,
  getServiceById,
  getServiceCategories,
  initializeSampleServices
};
