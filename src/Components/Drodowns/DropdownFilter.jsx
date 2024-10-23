import React, { useState, useEffect, useRef } from "react";
import "./drop.css";

const DropdownFilter = ({
  title,
  options,
  selectedOptions,
  onChange,
  coord,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [openUpwards, setOpenUpwards] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside); // Cleanup
  }, []);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    if (isOpen) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const bottomSpace = windowHeight - dropdownRect.bottom;
      const contentHeight = 260; // máxima altura del contenido del dropdown

      setOpenUpwards(bottomSpace < contentHeight);
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (option) => {
    if (option === coord) {
      const newSelectedOptions = selectedOptions.filter(
        (item) => item !== option
      );
      onChange(newSelectedOptions);
    } else {
      const newSelectedOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option];
      onChange(newSelectedOptions);
    }
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === filteredOptions.length) {
      onChange([]);
    } else {
      onChange(filteredOptions);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="dropdown-filter" ref={dropdownRef}>
      <div
        className={`dropdown-header ${isOpen ? "open" : "down"}`}
        onClick={toggleDropdown}
      >
        {title}
        <span className={`arrow ${isOpen ? "up" : "down"}`}></span>
      </div>
      {isOpen && (
        <div className={`dropdown-content ${openUpwards ? "upwards" : ""}`}>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="dropdown-search"
          />
          <label className="checkbox-label select-all">
            <input
              type="checkbox"
              checked={
                selectedOptions &&
                selectedOptions.length === filteredOptions.length &&
                filteredOptions.length > 0
              }
              onChange={handleSelectAll}
            />
            Seleccionar todos
          </label>
          {filteredOptions.map((option) => (
            <label key={option} className="checkbox-label">
              <div className="option">
                <input
                  type="checkbox"
                  checked={selectedOptions && selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                />
                {option}
              </div>
            </label>
          ))}
        </div>
      )}
      <div className="seleccionados">
        {selectedOptions &&
          selectedOptions.map((s) => <div className="fSelect">{s}</div>)}
      </div>
    </div>
  );
};

export default DropdownFilter;
