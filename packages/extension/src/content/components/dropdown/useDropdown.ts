import { useRef, useState } from "react";
import useClickOutside from "./useClickOutside";

interface dropdownOption {
  name: string;
  link?: string;
  id?: string;
}

const useDropdown = (handleClick?: (id: string) => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);
  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const handleItemClick = (event, { link, id }) => {
    if (link) {
      window.open(link, "_blank")?.focus();
    } else if (handleClick) {
      handleClick(id);
    } else {
      // eslint-disable-next-line no-console
      console.error("Not implemented yet!");
    }

    if (isOpen) {
      setIsOpen(false);
    }
  };

  const handleMenuClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return { dropdownRef, isOpen, handleMenuClick, handleItemClick };
};

export default useDropdown;
