import { useState } from 'react';

interface FormData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Step 2: Address
  street: string;
  city: string;
  state: string;
  zipCode: string;
  // Step 3: Preferences
  newsletter: boolean;
  notifications: boolean;
  interests: string[];
}

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    newsletter: true,
    notifications: false,
    interests: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 3;

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone is required';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.street) newErrors.street = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 5 digits';
    }
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = currentStep === 1 ? validateStep1() : validateStep2();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const updateField = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const toggleInterest = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest];
    updateField('interests', newInterests);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Complete!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Thank you for signing up, {formData.firstName}!</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(1);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                newsletter: true,
                notifications: false,
                interests: [],
              });
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
            data-testid="reset-button"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Registration Form</h2>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 text-center text-sm font-medium ${
                  step <= currentStep ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                Step {step}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  step <= currentStep ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                data-testid={`progress-step-${step}`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div data-testid="step-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-testid="first-name"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-testid="last-name"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-testid="email"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-testid="phone"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Address */}
        {currentStep === 2 && (
          <div data-testid="step-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => updateField('street', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-testid="street"
                />
                {errors.street && <p className="text-red-600 text-sm mt-1">{errors.street}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-testid="city"
                  />
                  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-testid="state"
                  />
                  {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code *</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => updateField('zipCode', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-testid="zip-code"
                />
                {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {currentStep === 3 && (
          <div data-testid="step-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => updateField('newsletter', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    data-testid="newsletter"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Subscribe to newsletter</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={(e) => updateField('notifications', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    data-testid="notifications"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Enable email notifications</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interests</label>
                <div className="space-y-2">
                  {['Technology', 'Design', 'Business', 'Marketing', 'Development'].map(
                    (interest) => (
                      <label key={interest} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => toggleInterest(interest)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                          data-testid={`interest-${interest.toLowerCase()}`}
                        />
                        <span className="text-gray-700 dark:text-gray-300">{interest}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
            data-testid="back-button"
          >
            Back
          </button>
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
              data-testid="next-button"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
              data-testid="submit-button"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
