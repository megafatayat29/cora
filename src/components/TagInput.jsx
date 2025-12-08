import { useState } from 'react';
import { X } from 'lucide-react';

export const TagInput = ({ 
  options = [], 
  selectedTags = [], 
  onChange, 
  placeholder = "Select options...",
  loading = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.some(tag => tag.value === option.value)
  );

  const addTag = (option) => {
    onChange([...selectedTags, option]);
    setSearchTerm('');
    setIsOpen(false);
  };

  const removeTag = (tagToRemove) => {
    onChange(selectedTags.filter(tag => tag.value !== tagToRemove.value));
  };

  return (
    <div className="relative">
      {/* Selected Tags + Input */}
      <div 
        className="w-full min-h-11 px-4 py-2 border border-gray-300 rounded-lg flex flex-wrap gap-2 items-center cursor-text"
        onClick={() => setIsOpen(true)}
      >
        {selectedTags.map((tag) => (
          <span
            key={tag.value}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
          >
            {tag.name}
            <X 
              size={14} 
              className="cursor-pointer hover:text-blue-900"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
            />
          </span>
        ))}
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] outline-none bg-transparent"
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Options List */}
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No options available</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => addTag(option)}
                >
                  {option.name}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};