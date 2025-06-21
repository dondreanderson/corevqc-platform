import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { registerSchema, RegisterFormData } from '../lib/validations';
import { registerUser, clearError } from '../store/authSlice';
import { RootState, AppDispatch } from '../store/store';
import '../styles/auth.css';

export const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success('🎉 Registration successful! Welcome to COREVQC!');
      navigate('/dashboard');
    } catch (err) {
      // Error handled by Redux and toast
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">🏗️</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">
          Start managing construction quality control
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                {...register('firstName')}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <div className="form-error">{errors.firstName.message}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                {...register('lastName')}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <div className="form-error">{errors.lastName.message}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              {...register('email')}
              autoComplete="email"
            />
            {errors.email && (
              <div className="form-error">{errors.email.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="organizationName">
              Organization Name
            </label>
            <input
              id="organizationName"
              type="text"
              className={`form-input ${errors.organizationName ? 'error' : ''}`}
              {...register('organizationName')}
            />
            {errors.organizationName && (
              <div className="form-error">{errors.organizationName.message}</div>
            )}
            <div className="form-help">This will be your company/organization name</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              {...register('password')}
              autoComplete="new-password"
            />
            {errors.password && (
              <div className="form-error">{errors.password.message}</div>
            )}
            <div className="form-help">
              Must be at least 8 characters with uppercase, lowercase, and number
            </div>
          </div>

          <button
            type="submit"
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading && <div className="spinner"></div>}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="auth-link">
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
