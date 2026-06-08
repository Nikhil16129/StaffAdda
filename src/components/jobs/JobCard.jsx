import { useState } from 'react';
import { MapPin, Clock, Phone, Building2, Check } from 'lucide-react';

export default function JobCard({ job, onApply, applied }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="card card-hover p-5 sm:p-6 mb-4">
      {/* Row 1: title + salary + logo */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-0.5">{job.title}</h3>
          <p className="text-blue-600 font-bold text-sm">{job.salaryLabel}</p>
        </div>
        {/* Company logo — small square top-right */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 ml-4 overflow-hidden bg-white border border-gray-100 shadow-sm"
          style={{ backgroundColor: job.companyLogo && (job.companyLogo.startsWith('/') || job.companyLogo.includes('.')) ? '#ffffff' : job.companyColor }}
        >
          {job.companyLogo && (job.companyLogo.startsWith('/') || job.companyLogo.includes('.')) ? (
            <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1.5" />
          ) : (
            job.companyLogo
          )}
        </div>
      </div>

      {/* Row 2: company / location / experience */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Building2 size={14} className="text-gray-400 shrink-0" />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} className="text-gray-400 shrink-0" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} className="text-gray-400 shrink-0" />
          <span>{job.experience}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {job.tags.map(tag => (
          <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${
            tag === 'Full-time' || tag === 'Full Time' ? 'tag-blue' :
            tag === 'Remote' ? 'tag-green' :
            tag === 'Contract' ? 'tag-orange' :
            'tag-gray'
          }`}>
            {tag}
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {applied ? (
          <button
            disabled
            className="flex-1 py-2.5 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
          >
            <Check size={15} className="stroke-[3]" />
            Applied
          </button>
        ) : (
          <button
            onClick={() => onApply?.(job)}
            className="flex-1 py-2.5 border-2 border-blue-600 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            Apply Now
          </button>
        )}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
          <Phone size={14} />
          Call
        </button>
      </div>
    </div>
  );
}
