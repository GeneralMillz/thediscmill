import React, { useState } from 'react';
import { User, Mail, Phone, Hash, FileText } from 'lucide-react';

interface CreateTagFormProps {
  onSubmit: (data: any) => void;
}

export function CreateTagForm({ onSubmit }: CreateTagFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pdga: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <User className="w-4 h-4 mr-2 text-indigo-600" />
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="Jane Doe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-indigo-600" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-indigo-600" />
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="(555) 000-0000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="pdga" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Hash className="w-4 h-4 mr-2 text-indigo-600" />
            PDGA Number (Optional)
          </label>
          <input
            id="pdga"
            type="text"
            value={formData.pdga}
            onChange={(e) => setFormData({ ...formData, pdga: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="123456"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-indigo-600" />
            Custom Message / Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-24 resize-none"
            placeholder="Reward offered! Please text me if found."
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-indigo-900 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Generate Return Tag
      </button>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500">
        By generating this tag, you agree to share this information with anyone who scans the QR code.
      </p>
    </form>
  );
}
