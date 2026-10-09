import {
  useFloating,
  useFocus,
  useInteractions,
  useListNavigation,
} from "@floating-ui/react";
import { COUNTRIES } from "@shared/countries";
import { useMemo, useRef, useState } from "react";

export const CountryList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    loop: true,
    virtual: true,
    onNavigate: setActiveIndex,
  });

  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [listNavigation, focus],
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

  return (
    <div className="flex flex-col h-full">
      <input
        ref={refs.setReference}
        type="text"
        placeholder="France... United Kingdom..."
        className="input w-full"
        onChange={handleSearchChange}
        {...getReferenceProps()}
      />
      {isOpen && (
        <div
          ref={refs.setFloating}
          {...getFloatingProps()}
          className="flex flex-col bg-base-200 rounded-box w-full flex-1 overflow-auto"
        >
          {countries.map((country, index) => {
            return (
              <div
                key={`${country}-${index}`}
                className={`text-lg hover:bg-gray-200 p-2 ${activeIndex === index && "bg-gray-200"}`}
                ref={(node) => {
                  listRef.current[index] = node;
                }}
                {...getItemProps()}
              >
                {country}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
