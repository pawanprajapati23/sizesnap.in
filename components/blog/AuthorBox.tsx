import React from 'react';
import { Author } from '@/data/blog';

export default function AuthorBox({ author }: { author: Author }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100">
        {author.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={author.profileImage} alt={author.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#414FA8] text-white text-3xl font-bold">
            {author.name.charAt(0)}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{author.name}</h3>
        {author.role && (
          <p className="text-sm font-medium text-[#414FA8] mb-3">{author.role}</p>
        )}
        {author.bio && (
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
            {author.bio}
          </p>
        )}

        {author.socialLinks && (
          <div className="flex items-center justify-center md:justify-start gap-4">
            {author.socialLinks.twitter && (
              <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            )}
            {author.socialLinks.linkedin && (
              <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0A66C2] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            )}
            {author.socialLinks.website && (
              <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#414FA8] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
