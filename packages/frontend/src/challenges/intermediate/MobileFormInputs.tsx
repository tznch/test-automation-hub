import { useState } from 'react';

interface FormState {
  phone: string;
  email: string;
  website: string;
  age: string;
  birthdate: string;
  meetingTime: string;
}

interface ValidationState {
  phone: boolean;
  email: boolean;
  website: boolean;
  age: boolean;
}

export default function MobileFormInputs() {
  const [form, setForm] = useState<FormState>({
    phone: '',
    email: '',
    website: '',
    age: '',
    birthdate: '',
    meetingTime: ''
  });

  const [errors, setErrors] = useState<ValidationState>({
    phone: false,
    email: false,
    website: false,
    age: false
  });

  const [submitted, setSubmitted] = useState(false);

  const validateField = (name: keyof FormState, value: string) => {
    let isError = false;
    
    switch (name) {
      case 'phone':
        // Basic phone validation (digits, spaces, dashes, plus, parens)
        isError = !/^[\d\s\-\+\(\)]+$/.test(value) && value !== '';
        break;
      case 'email':
        isError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value !== '';
        break;
      case 'website':
        isError = !/^https?:\/\/.+/.test(value) && value !== '';
        break;
      case 'age':
        const ageNum = parseInt(value);
        isError = (isNaN(ageNum) || ageNum < 18 || ageNum > 120) && value !== '';
        break;
    }

    setErrors(prev => ({ ...prev, [name]: isError }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name as keyof FormState, value);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled and valid
    const hasErrors = Object.values(errors).some(err => err);
    const hasEmpty = Object.values(form).some(val => val === '');
    
    if (!hasErrors && !hasEmpty) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mobile Form Inputs</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          ℹ️ These inputs use specific HTML5 types to trigger the correct virtual keyboard on mobile devices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number (tel)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                inputMode="tel"
                placeholder="+1 (555) 000-0000"
                className={`w-full p-3 rounded-lg border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                data-testid="input-tel"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1" data-testid="validation-phone">Invalid phone format</p>}
              <p className="text-xs text-gray-500 mt-1">Triggers numeric keypad on mobile</p>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address (email)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                inputMode="email"
                placeholder="user@example.com"
                className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                data-testid="input-email"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1" data-testid="validation-email">Invalid email format</p>}
              <p className="text-xs text-gray-500 mt-1">Adds @ and . keys to keyboard</p>
            </div>

            {/* URL Input */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website (url)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={form.website}
                onChange={handleChange}
                inputMode="url"
                placeholder="https://example.com"
                className={`w-full p-3 rounded-lg border ${errors.website ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                data-testid="input-url"
              />
              {errors.website && <p className="text-xs text-red-500 mt-1" data-testid="validation-website">Must start with http:// or https://</p>}
              <p className="text-xs text-gray-500 mt-1">Optimized for URL entry</p>
            </div>

            {/* Number Input */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Age (number)
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={form.age}
                onChange={handleChange}
                inputMode="numeric"
                min="18"
                max="120"
                className={`w-full p-3 rounded-lg border ${errors.age ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                data-testid="input-number"
              />
              {errors.age && <p className="text-xs text-red-500 mt-1" data-testid="validation-age">Must be between 18 and 120</p>}
              <p className="text-xs text-gray-500 mt-1">Numeric keypad only</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Date Input */}
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={form.birthdate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  data-testid="input-date"
                />
              </div>

              {/* Time Input */}
              <div>
                <label htmlFor="meetingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="meetingTime"
                  name="meetingTime"
                  value={form.meetingTime}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  data-testid="input-time"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-4"
              data-testid="submit-button"
            >
              Submit Form
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Form State</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(form, null, 2)}
            </pre>
          </div>

          {submitted && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center" data-testid="success-message">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-lg font-bold text-green-800 dark:text-green-300">Submission Successful</h3>
              <p className="text-green-600 dark:text-green-400 text-sm mt-1">All fields validated correctly.</p>
            </div>
          )}
        </div>
      </div>

      {/* Testing Hints */}
      <div className="mt-6 bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Fill inputs: <code className="bg-gray-800 px-1 rounded">await page.fill('[data-testid="input-tel"]', '1234567890')</code></li>
          <li>• Test validation: Enter invalid email and check for error message</li>
          <li>• Verify input types: <code className="bg-gray-800 px-1 rounded">await expect(page.getByTestId('input-email')).toHaveAttribute('type', 'email')</code></li>
          <li>• Test date/time pickers (browser dependent)</li>
        </ul>
      </div>
    </div>
  );
}
