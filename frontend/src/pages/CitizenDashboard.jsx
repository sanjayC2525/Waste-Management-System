import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { getStatusBadge, formatDate } from '../utils/statusHelpers.jsx';
import FeedbackForm from '../components/FeedbackForm';

const CitizenDashboard = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('reports');
  const [reports, setReports] = useState([]);
  const [issuesAndFeedback, setIssuesAndFeedback] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [formData, setFormData] = useState({
    address: '',
    garbageType: 'Dry',
    description: '',
  });
  const [issuesAndFeedbackForm, setIssuesAndFeedbackForm] = useState({
    type: 'FEEDBACK',
    title: '',
    description: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    workerId: '',
    garbageReportId: '',
  });
  const [showReportForm, setShowReportForm] = useState(false);
  const [showIssuesAndFeedbackForm, setShowIssuesAndFeedbackForm] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    photo: null,
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchReports(),
          fetchIssuesAndFeedback(),
          fetchWorkers()
        ]);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Add real-time notification for new reports
  const [lastReportCount, setLastReportCount] = useState(0);
  
  useEffect(() => {
    if (reports.length > lastReportCount && lastReportCount > 0) {
      toast.success('New reports have been updated!');
    }
    setLastReportCount(reports.length);
  }, [reports.length]);

  const fetchReports = async () => {
    try {
      const response = await api.getMyGarbageReports();
      setReports(response.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    }
  };

  const fetchIssuesAndFeedback = async () => {
    try {
      const [feedbackResponse, issuesResponse] = await Promise.all([
        api.getMyFeedback(),
        api.getMyIssues()
      ]);
      
      // Combine feedback and issues, adding a source property to distinguish them
      const combined = [
        ...feedbackResponse.data.map(item => ({ ...item, source: 'feedback' })),
        ...issuesResponse.data.map(item => ({ ...item, source: 'issue' }))
      ];
      
      // Sort by date (newest first)
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setIssuesAndFeedback(combined);
    } catch (error) {
      toast.error('Failed to fetch issues and feedback');
    }
  };

  const fetchWorkers = async () => {
    try {
      console.log('Fetching workers...');
      const response = await api.getWorkers();
      console.log('Workers response:', response.data);
      setWorkers(response.data);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
      toast.error('Failed to fetch workers');
    }
  };

  const getLocation = async () => {
    // Check if we're on HTTPS (required for geolocation in most browsers)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      toast.error('Location services require HTTPS. Using Bangalore center as fallback.', { id: 'location', duration: 4000 });
      
      // Fallback to Bangalore center coordinates
      const fallbackLat = 12.9716;
      const fallbackLng = 77.5946;
      setLocation({ lat: fallbackLat, lng: fallbackLng });
      setReportFormData(prev => ({
        ...prev,
        latitude: fallbackLat.toFixed(6),
        longitude: fallbackLng.toFixed(6)
      }));
      toast.info(`Using Bangalore center: ${fallbackLat}, ${fallbackLng}`, { id: 'location-fallback', duration: 3000 });
      return;
    }

    if (!navigator.geolocation) {
      toast.error('Geolocation not supported. Using Bangalore center as fallback.', { id: 'location', duration: 4000 });
      
      // Fallback to Bangalore center coordinates
      const fallbackLat = 12.9716;
      const fallbackLng = 77.5946;
      setLocation({ lat: fallbackLat, lng: fallbackLng });
      setReportFormData(prev => ({
        ...prev,
        latitude: fallbackLat.toFixed(6),
        longitude: fallbackLng.toFixed(6)
      }));
      toast.info(`Using Bangalore center: ${fallbackLat}, ${fallbackLng}`, { id: 'location-fallback', duration: 3000 });
      return;
    }

    // Check if permission is already denied
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'denied') {
          toast.error('Location permission denied. Using Bangalore center as fallback.', { id: 'location', duration: 4000 });
          
          // Fallback to Bangalore center coordinates
          const fallbackLat = 12.9716;
          const fallbackLng = 77.5946;
          setLocation({ lat: fallbackLat, lng: fallbackLng });
          setReportFormData(prev => ({
            ...prev,
            latitude: fallbackLat.toFixed(6),
            longitude: fallbackLng.toFixed(6)
          }));
          toast.info(`Using Bangalore center: ${fallbackLat}, ${fallbackLng}`, { id: 'location-fallback', duration: 3000 });
          return;
        }
      } catch (error) {
        console.log('Permissions API not supported');
      }
    }

    toast.loading('Getting your location...', { id: 'location' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setReportFormData(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }));
        toast.success(`Location obtained: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, { id: 'location' });
      },
      (error) => {
        let errorMessage = '';
        let actionMessage = '';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            actionMessage = 'Using Bangalore center as fallback.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            actionMessage = 'Using Bangalore center as fallback.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            actionMessage = 'Using Bangalore center as fallback.';
            break;
          default:
            errorMessage = 'Location error occurred';
            actionMessage = 'Using Bangalore center as fallback.';
        }

        // Fallback to Bangalore center coordinates
        const fallbackLat = 12.9716;
        const fallbackLng = 77.5946;
        setLocation({ lat: fallbackLat, lng: fallbackLng });
        setReportFormData(prev => ({
          ...prev,
          latitude: fallbackLat.toFixed(6),
          longitude: fallbackLng.toFixed(6)
        }));

        toast.error(`${errorMessage}. ${actionMessage}`, { id: 'location', duration: 6000 });
        toast.info(`Using Bangalore center: ${fallbackLat}, ${fallbackLng}`, { id: 'location-fallback', duration: 3000 });
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // Reduced timeout for faster fallback
        maximumAge: 60000 // Allow cached positions up to 1 minute old
      }
    );
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('photo', reportFormData.photo);
      formDataToSend.append('latitude', reportFormData.latitude);
      formDataToSend.append('longitude', reportFormData.longitude);

      await api.createGarbageReport(formDataToSend);
      toast.success('Garbage report submitted successfully!');
      setShowReportForm(false);
      setReportFormData({ photo: null, latitude: '', longitude: '' });
      fetchReports();
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const handleReportChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setReportFormData({ ...reportFormData, photo: files[0] });
    } else {
      setReportFormData({ ...reportFormData, [name]: value });
    }
  };

  const handleIssuesAndFeedbackSubmit = async (formData) => {
    console.log('CitizenDashboard: handleIssuesAndFeedbackSubmit called with:', formData);
    
    // Client-side validation
    if (!formData.type || !formData.title?.trim() || !formData.description?.trim() || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.title.trim().length === 0 || formData.description.trim().length === 0) {
      toast.error('Title and description cannot be empty');
      return;
    }
    
    try {
      // Use unified endpoint for both feedback and issues
      const payload = {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        workerId: formData.workerId || undefined,
        garbageReportId: formData.garbageReportId || undefined,
        // Include AI analysis if present
        ...(formData.aiAnalysis && { aiAnalysis: formData.aiAnalysis })
      };
      
      console.log('CitizenDashboard: Submitting to unified endpoint:', payload);
      const response = await api.createIssuesFeedback(payload);
      console.log('CitizenDashboard: Submission response:', response.data);
      
      toast.success(`${formData.type === 'FEEDBACK' ? 'Feedback' : 'Issue'} submitted successfully`);
      
      setShowIssuesAndFeedbackForm(false);
      setIssuesAndFeedbackForm({
        type: 'FEEDBACK',
        title: '',
        description: '',
        category: 'GENERAL',
        priority: 'MEDIUM',
        workerId: '',
        garbageReportId: '',
      });
      fetchIssuesAndFeedback();
      console.log('CitizenDashboard: handleIssuesAndFeedbackSubmit completed successfully');
    } catch (error) {
      console.error('CitizenDashboard: Submit error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to submit. Please try again.';
      toast.error(`Submission failed: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">{t('dashboard.citizen.title')}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-400">{t('common.loading')}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Navigation Tabs */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveSection('reports')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'reports'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('dashboard.citizen.myReports')}
              </button>
              <button
                onClick={() => setActiveSection('issuesAndFeedback')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'issuesAndFeedback'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('dashboard.citizen.issuesAndFeedback')}
              </button>
            </nav>
          </div>

          {/* Reports Section */}
          {activeSection === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{t('reports.title')}</h2>
                <button
                  onClick={() => setShowReportForm(!showReportForm)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                >
                  {showReportForm ? t('common.cancel') : t('dashboard.citizen.reportGarbage')}
                </button>
              </div>

              {showReportForm && (
                <div className="bg-darker p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">{t('dashboard.citizen.reportGarbage')}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>Step 1 of 3</span>
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-1/3"></div>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleReportSubmit}>
                    {/* Photo Upload Section */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {t('dashboard.citizen.photoEvidence')}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          onChange={handleReportChange}
                          className="hidden"
                          id="photo-upload"
                          required
                        />
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p className="text-sm text-gray-400">
                            {reportFormData.photo ? reportFormData.photo.name : t('dashboard.citizen.clickToUpload')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 10MB</p>
                        </label>
                      </div>
                      {reportFormData.photo && (
                        <div className="mt-2 flex items-center text-green-400 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Photo uploaded successfully
                        </div>
                      )}
                    </div>

                    {/* Location Section */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {t('dashboard.citizen.location')}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-400">{t('dashboard.citizen.latitude')}</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="latitude"
                              value={reportFormData.latitude}
                              onChange={handleReportChange}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              placeholder="e.g., 12.9716"
                              required
                            />
                            <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-400">{t('dashboard.citizen.longitude')}</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="longitude"
                              value={reportFormData.longitude}
                              onChange={handleReportChange}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              placeholder="e.g., 77.5946"
                              required
                            />
                            <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <button
                          type="button"
                          onClick={getLocation}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span>{t('dashboard.citizen.getCurrentLocation')}</span>
                        </button>
                        {location.lat && location.lng && (
                          <div className="mt-2 text-xs text-green-400 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Location obtained: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        Address Details (Optional)
                      </label>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          placeholder="Enter address (e.g., MG Road, Bangalore)"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (!formData.address.trim()) {
                              toast.error('Please enter an address');
                              return;
                            }
                            
                            toast.loading('Getting coordinates for address...', { id: 'address-geocode' });
                            
                            try {
                              const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
                              const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}&limit=1`;
                              
                              const response = await fetch(proxyUrl + geocodeUrl, {
                                headers: {
                                  'X-Requested-With': 'XMLHttpRequest',
                                }
                              });
                              
                              if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                              }
                              
                              const data = await response.json();
                              
                              if (data && data.length > 0) {
                                const { lat, lon } = data[0];
                                const latNum = parseFloat(lat);
                                const lonNum = parseFloat(lon);
                                
                                setReportFormData(prev => ({
                                  ...prev,
                                  latitude: latNum.toFixed(6),
                                  longitude: lonNum.toFixed(6)
                                }));
                                setLocation({ lat: latNum, lng: lonNum });
                                toast.success(`Coordinates found: ${latNum.toFixed(6)}, ${lonNum.toFixed(6)}`, { id: 'address-geocode' });
                              } else {
                                toast.error('Address not found. Please try a more specific address.', { id: 'address-geocode' });
                              }
                            } catch (error) {
                              toast.error('Failed to get coordinates. Please enter coordinates manually.', { id: 'address-geocode' });
                            }
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                          </svg>
                          <span>Get Coordinates from Address</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Location Presets */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-3 text-gray-400">Quick Location Presets</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          { name: 'MG Road', lat: 12.9768, lng: 77.5704 },
                          { name: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
                          { name: 'Koramangala', lat: 12.9279, lng: 77.6271 },
                          { name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
                          { name: 'Jayanagar', lat: 12.9293, lng: 77.5806 },
                          { name: 'HSR Layout', lat: 12.9146, lng: 77.6374 }
                        ].map((area) => (
                          <button
                            key={area.name}
                            type="button"
                            onClick={() => {
                              setReportFormData(prev => ({
                                ...prev,
                                latitude: area.lat.toFixed(6),
                                longitude: area.lng.toFixed(6)
                              }));
                              setLocation({ lat: area.lat, lng: area.lng });
                              setFormData(prev => ({ ...prev, address: area.name }));
                              toast.success(`Using ${area.name}: ${area.lat.toFixed(6)}, ${area.lng.toFixed(6)}`);
                            }}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-2 rounded transition duration-200"
                          >
                            {area.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowReportForm(false)}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition duration-200 flex items-center space-x-2"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* My Reports */}
              <div className="bg-darker rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-xl font-bold">My Reports</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Photo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {reports.map((report) => (
                        <tr key={report.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img src={`http://localhost:5001${report.imagePath}`} alt="Garbage" className="w-16 h-16 object-cover rounded" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div>{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</div>
                              <a
                                href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-xs"
                              >
                                View on Map
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(report.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(report.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reports.length === 0 && (
                    <div className="px-6 py-8 text-center text-gray-400">
                      No reports submitted yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Issues & Feedback Section */}
          {activeSection === 'issuesAndFeedback' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Issues & Feedback</h2>
                <button
                  onClick={() => setShowIssuesAndFeedbackForm(!showIssuesAndFeedbackForm)}
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                >
                  {showIssuesAndFeedbackForm ? 'Cancel' : 'Submit Issue/Feedback'}
                </button>
              </div>

              {showIssuesAndFeedbackForm && (
                <FeedbackForm
                  onSubmit={handleIssuesAndFeedbackSubmit}
                  onCancel={() => setShowIssuesAndFeedbackForm(false)}
                  workers={workers}
                  garbageReports={reports}
                  showTypeSelector={true}
                />
              )}

              {/* My Issues & Feedback */}
              <div className="bg-surface rounded-lg overflow-hidden border border-border">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-xl font-bold text-text-primary">My Issues & Feedback</h3>
                </div>
                <div className="p-6 space-y-4">
                  {issuesAndFeedback.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-primary">{item.title}</h4>
                          <p className="text-sm text-text-muted">
                            {item.source === 'feedback' ? 'Feedback' : 'Issue'} - {item.type} - {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.status === 'RESOLVED' ? 'bg-status-success/20 text-status-success' :
                            item.status === 'IN_PROGRESS' || item.status === 'IN_REVIEW' ? 'bg-status-warning/20 text-status-warning' :
                            item.status === 'REJECTED' ? 'bg-status-error/20 text-status-error' :
                            'bg-surfaceLight text-text-muted'
                          }`}>
                            {item.status}
                          </span>
                          <p className="text-xs text-text-muted mt-1">{formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-text-secondary mb-2">{item.description}</p>
                      {item.adminReply && (
                        <div className="bg-status-info/10 border border-status-info/30 p-3 rounded mb-2">
                          <p className="text-sm text-status-info font-medium mb-1">Admin Reply:</p>
                          <p className="text-text-secondary">{item.adminReply}</p>
                          {item.admin?.name && (
                            <p className="text-xs text-text-muted mt-2">- {item.admin.name}</p>
                          )}
                        </div>
                      )}
                      {item.resolution && (
                        <div className="bg-status-success/10 border border-status-success/30 p-3 rounded mb-2">
                          <p className="text-sm text-status-success font-medium mb-1">Resolution:</p>
                          <p className="text-text-secondary">{item.resolution}</p>
                        </div>
                      )}
                      {item.adminNotes && (
                        <div className="bg-surfaceLight p-3 rounded">
                          <p className="text-sm text-text-muted">Internal Notes:</p>
                          <p className="text-text-secondary">{item.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {issuesAndFeedback.length === 0 && (
                    <div className="text-center text-text-muted py-8">
                      No issues or feedback submitted yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CitizenDashboard;
