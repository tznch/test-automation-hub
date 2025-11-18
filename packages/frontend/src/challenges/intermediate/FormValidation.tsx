import { useState } from 'react';

interface FormData {
  username: string;
  email: string;
  password: string;
  age: string;
  website: string;
}

interface Errors {
  [key: string]: string;
}

export default function FormValidation() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    age: '',
    website: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = async (name: string, value: string): Promise<string> => {
    switch (name) {
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return 'Username can only contain letters, numbers, and underscores';
        return '';

      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';

        // Async validation - check if email exists
        setIsValidatingEmail(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsValidatingEmail(false);

        if (value === 'taken@example.com') return 'Email already exists';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          return 'Password must contain uppercase, lowercase, and number';
        return '';

      case 'age':
        if (!value) return 'Age is required';
        const age = Number(value);
        if (isNaN(age) || age < 18 || age > 120) return 'Age must be between 18 and 120';
        return '';

      case 'website':
        if (value && !/^https?:\/\/.+\..+/.test(value)) return 'Invalid URL format';
        return '';

      default:
        return '';
    }
  };

  const handleBlur = async (name: string) => {
    setTouched({ ...touched, [name]: true });
    const error = await validateField(name, formData[name as keyof FormData]);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      validateField(name, value).then((error) => {
        setErrors({ ...errors, [name]: error });
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    // Validate all fields
    const validationPromises = Object.entries(formData).map(([name, value]) =>
      validateField(name, value).then((error) => ({ name, error }))
    );

    const validationResults = await Promise.all(validationPromises);
    const newErrors = validationResults.reduce(
      (acc, { name, error }) => ({ ...acc, [name]: error }),
      {}
    );

    setErrors(newErrors);

    // Check if form is valid
    const hasErrors = Object.values(newErrors).some((error) => error !== '');
    if (!hasErrors) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-green-400 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-white mb-2">Form Submitted Successfully!</h2>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ username: '', email: '', password: '', age: '', website: '' });
              setErrors({});
              setTouched({});
            }}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Form Validation</h1>

        <div className="bg-gray-800 p-6 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username *
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 ${
                  errors.username && touched.username
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-600 focus:ring-indigo-400'
                }`}
                aria-invalid={!!(errors.username && touched.username)}
                aria-describedby={
                  errors.username && touched.username ? 'username-error' : undefined
                }
              />
              {errors.username && touched.username && (
                <p id="username-error" className="text-red-400 text-sm mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email *{' '}
                {isValidatingEmail && <span className="text-xs text-gray-400">(checking...)</span>}
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 ${
                  errors.email && touched.email
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-600 focus:ring-indigo-400'
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Try "taken@example.com" to see async validation
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 ${
                  errors.password && touched.password
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-600 focus:ring-indigo-400'
                }`}
              />
              {errors.password && touched.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
                Age *
              </label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                onBlur={() => handleBlur('age')}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 ${
                  errors.age && touched.age
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-600 focus:ring-indigo-400'
                }`}
              />
              {errors.age && touched.age && (
                <p className="text-red-400 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                Website (optional)
              </label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                onBlur={() => handleBlur('website')}
                placeholder="https://example.com"
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 ${
                  errors.website && touched.website
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-600 focus:ring-indigo-400'
                }`}
              />
              {errors.website && touched.website && (
                <p className="text-red-400 text-sm mt-1">{errors.website}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
            >
              Submit Form
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
