import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../utils/auth';
import toast from 'react-hot-toast';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      toast.success(t('auth.login.loginSuccess'));

      // Redirect based on role
      switch (response.user.role) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Citizen':
          navigate('/citizen');
          break;
        case 'Worker':
          navigate('/worker');
          break;
        default:
          navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('auth.login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface p-8 rounded-2xl shadow-large w-full max-w-md border border-border">
        <h2 className="text-3xl font-bold text-center mb-8 text-text-primary">{t('auth.login.welcomeBack')}</h2>
        <p className="text-center text-text-muted mb-8">{t('auth.login.signInToAccount')}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">{t('auth.login.email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              placeholder={t('auth.login.enterEmail')}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">{t('auth.login.password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              placeholder={t('auth.login.enterPassword')}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {t('auth.login.signingIn')}
              </div>
            ) : (
              t('auth.login.signIn')
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-surfaceLight rounded-xl border border-border">
          <p className="text-sm text-text-secondary mb-3 font-medium">{t('auth.login.demoAccounts')}</p>
          <div className="space-y-2 text-xs text-text-muted">
            <div><strong className="text-text-primary">{t('auth.login.adminDemo')}</strong> admin@example.com / admin123</div>
            <div><strong className="text-text-primary">{t('auth.login.workerDemo')}</strong> worker1@example.com / password</div>
            <div><strong className="text-text-primary">{t('auth.login.citizenDemo')}</strong> citizen@example.com / password</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;