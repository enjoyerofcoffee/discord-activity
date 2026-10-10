import {
  useFloating,
  useFocus,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import { COUNTRIES } from "@shared/countries";
import { useMemo, useRef, useState } from "react";
import WorldleIcon from "../../../public/WorldleIcon.svg";

export const CountryList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const COUNTRY_NAMES = COUNTRIES.map((country) => country.name);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    loop: true,
    virtual: true,
    onNavigate: setActiveIndex,
  });

  const focus = useFocus(context);
  const role = useRole(context, { role: "listbox" });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [listNavigation, focus, role],
  );

  const countries = useMemo(() => {
    const query = search.toLocaleLowerCase();

    return COUNTRY_NAMES.filter((country) =>
      country.toLocaleLowerCase().includes(query),
    );
  }, [search]);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setSearch(e.currentTarget.value);
    setActiveIndex(0);
    setIsOpen(true);
  };

  const handleSelect = (index: number) => {
    setSearch(countries[index]);
    setActiveIndex(0);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (!countries[activeIndex]) {
      return;
    }

    setSearch("");
  };

  return (
    <div className="flex gap-2 min-h-0 mb-4">
      <div className="flex flex-col flex-1 min-h-0">
        <input
          value={search}
          ref={refs.setReference}
          type="text"
          placeholder="France... United Kingdom..."
          className="input w-full"
          {...getReferenceProps({
            onChange: handleSearchChange,
            onKeyDown(event) {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            },
          })}
        />
        {isOpen && (
          <div
            ref={refs.setFloating}
            className="bg-base-200 rounded-box flex-1 overflow-auto mt-2"
            {...getFloatingProps({
              onMouseDown: (event) => event.preventDefault(),
            })}
          >
            {countries.map((country, index) => (
              <div
                key={`${country}-${index}`}
                className={`hover:bg-gray-200 p-2 ${activeIndex === index && "bg-gray-200"}`}
                ref={(node) => {
                  listRef.current[index] = node;
                }}
                {...getItemProps({
                  onClick: () => handleSelect(index),
                })}
              >
                {country}
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="btn">
        <img className="w-8" src={WorldleIcon}></img>
        Guess
      </button>
    </div>
  );
};
