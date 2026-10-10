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
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const guessBtnRef = useRef<HTMLButtonElement>(null);
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

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setSearch(e.currentTarget.value);
    setActiveIndex(0);
  };

  const countries = useMemo(() => {
    const countryNames = COUNTRIES.map((country) => country.name);

    return countryNames.filter((country) =>
      country.toLocaleLowerCase().includes(search),
    );
  }, [search]);

  const handleSelect = () => {
    const countryToSubmit = countries[activeIndex]?.toLowerCase();
    const countryFound = countries.some(
      (country) => country.toLocaleLowerCase() === countryToSubmit,
    );

    if (!countryFound) {
      return;
    }

    setIsOpen(false);
    setSearch(countries[activeIndex]);
    guessBtnRef.current?.focus();
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
          onChange={handleSearchChange}
          {...getReferenceProps({
            onKeyDown(event) {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSelect();
              }
            },
          })}
        />
        {isOpen && (
          <div
            ref={refs.setFloating}
            {...getFloatingProps({})}
            className="bg-base-200 rounded-box flex-1 overflow-auto"
          >
            {countries.map((country, index) => {
              return (
                <div
                  key={`${country}-${index}`}
                  className={`text-lg hover:bg-gray-200 p-2 ${activeIndex === index && "bg-gray-200"}`}
                  ref={(node) => {
                    listRef.current[index] = node;
                  }}
                  {...getItemProps({})}
                >
                  {country}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <button ref={guessBtnRef} className="btn">
        <img className="w-8" src={WorldleIcon}></img>
        Guess
      </button>
    </div>
  );
};
