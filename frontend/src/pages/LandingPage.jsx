import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import HeroDashboardPreview from '../components/landing/HeroDashboardPreview';
import StatisticsSection from '../components/landing/StatisticsSection';
import LiveActivityFeed from '../components/landing/LiveActivityFeed';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

const LandingPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ reports: 0, completed: 0, workers: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/public/statistics');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Set demo data if API fails
        setStats({ reports: 150, completed: 120, workers: 8 });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text.primary">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Theme Toggle and Language Selector in top-right corner */}
        <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-text.primary mb-6">
                {t('landing.title')}
              </h1>
              <p className="text-xl md:text-2xl text-text.secondary mb-8 max-w-3xl">
                {t('landing.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link
                  to="/login"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
                >
                  {t('landing.getStarted')}
                </Link>
              </div>
            </div>
            <div>
              <HeroDashboardPreview />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text.primary mb-4">
            {t('landing.dashboardAnalytics')}
          </h2>
          <p className="text-lg text-text.secondary max-w-2xl mx-auto">
            {t('landing.dashboardAnalyticsDesc')}
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <StatisticsSection stats={stats} />

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text.primary mb-4">
            {t('landing.howItWorks')}
          </h2>
          <p className="text-lg text-text.secondary max-w-2xl mx-auto">
            {t('landing.howItWorksDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-medium">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text.primary mb-2">{t('landing.reportIssues')}</h3>
            <p className="text-text.secondary">
              {t('landing.reportIssuesDesc')}
            </p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-border shadow-medium">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text.primary mb-2">{t('landing.manageAssign')}</h3>
            <p className="text-text.secondary">
              {t('landing.manageAssignDesc')}
            </p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-border shadow-medium">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text.primary mb-2">{t('landing.completeTrack')}</h3>
            <p className="text-text.secondary">
              {t('landing.completeTrackDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Portal Access Section */}
      <div className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text.primary mb-4">
              {t('landing.accessYourPortal')}
            </h2>
            <p className="text-lg text-text.secondary">
              {t('landing.accessYourPortalDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Citizen Portal */}
            <div className="bg-surface rounded-2xl border border-border shadow-medium overflow-hidden hover:shadow-large transition-shadow duration-200">
              <div className="bg-green-600 p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">{t('landing.citizenPortal')}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6 text-text.secondary">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {t('landing.submitGarbageReports')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {t('landing.trackReportStatus')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {t('landing.submitFeedback')}
                  </li>
                </ul>
                <Link
                  to="/login"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 block text-center"
                >
                  {t('landing.enterCitizenPortal')}
                </Link>
              </div>
            </div>

            {/* Worker Portal */}
            <div className="bg-surface rounded-2xl border border-border shadow-medium overflow-hidden hover:shadow-xl transition-shadow duration-200">
              <div className="bg-blue-600 p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">{t('landing.workerPortal')}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6 text-text.secondary">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {t('landing.viewAssignedTasks')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {t('landing.updateTaskStatus')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {t('landing.uploadWorkProof')}
                  </li>
                </ul>
                <Link
                  to="/login"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 block text-center"
                >
                  {t('landing.enterWorkerPortal')}
                </Link>
              </div>
            </div>

            {/* Admin Portal */}
            <div className="bg-surface rounded-2xl border border-border shadow-medium overflow-hidden hover:shadow-xl transition-shadow duration-200">
              <div className="bg-purple-600 p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">{t('landing.adminPortal')}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6 text-text.secondary">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {t('landing.manageReports')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {t('landing.assignWorkers')}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {t('landing.viewAnalytics')}
                  </li>
                </ul>
                <Link
                  to="/login"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 block text-center"
                >
                  {t('landing.enterAdminPortal')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text.primary mb-4">
            {t('landing.keyFeatures')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-text.primary">{t('landing.secureAuth')}</h3>
            <p className="text-sm text-text.secondary mt-1">{t('landing.secureAuthDesc')}</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-text.primary">{t('landing.realtimeUpdates')}</h3>
            <p className="text-sm text-text.secondary mt-1">{t('landing.realtimeUpdatesDesc')}</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-text.primary">{t('landing.aiContentMod')}</h3>
            <p className="text-sm text-text.secondary mt-1">{t('landing.aiContentModDesc')}</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-text.primary">{t('landing.analyticsDashboard')}</h3>
            <p className="text-sm text-text-secondary mt-1">{t('landing.analyticsDashboardDesc')}</p>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <LiveActivityFeed />

      {/* Footer */}
      <footer className="bg-surface border-t border-border text-text.primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-text.secondary">
              {t('landing.copyright')}
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link to="/login" className="text-text.secondary hover:text-text.primary transition-colors">
                {t('landing.footerLogin')}
              </Link>
              <span className="text-text.muted">•</span>
              <a href="#" className="text-text.secondary hover:text-text.primary transition-colors">
                {t('landing.footerAbout')}
              </a>
              <span className="text-text.muted">•</span>
              <a href="#" className="text-text.secondary hover:text-text.primary transition-colors">
                {t('landing.footerContact')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
