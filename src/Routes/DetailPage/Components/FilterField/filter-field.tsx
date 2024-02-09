import { Button, Dropdown, DropdownItem, DropdownToggle, InputGroup, TextInput } from '@patternfly/react-core';
import React, { useState } from 'react';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';

/** Define the values for the dropdown component. */
type FilterType = 'Name' | 'Location';

/** Define the allowed properties for InputFilterServer component. */
interface InputFilterServerProps {
  /** Indicate the column to filter if any. */
  column?: FilterType;
  /** Indicate the value to filter for the selected column. */
  value?: string;
  /** Event to communicate a state change in the component. */
  onChange?: (column: string, value: string) => void;
}

/** Component to let the user select the column to filter and the content to filter the table for. */
export const InputFilterServer = (props: InputFilterServerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(props.value || '');
  const [filter, setFilter] = useState<FilterType>(props.column || 'Name');

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect = (event?: React.SyntheticEvent<HTMLDivElement>) => {
    console.info('event.target.value=' + event?.target);
    setIsOpen(false);
  };

  const dropdownItems = [
    <DropdownItem
      key="Name"
      value="Name"
      component="button"
      ouiaId="DropitemFilterFieldName"
      onClick={() => {
        setFilter('Name');
      }}
    >
      Name
    </DropdownItem>,
    <DropdownItem
      key="Location"
      value="Location"
      component="button"
      ouiaId="DropitemFilterFieldLocation"
      onClick={() => {
        setFilter('Location');
      }}
    >
      Location
    </DropdownItem>,
  ];

  const onChange = (value: string, event: React.FormEvent<HTMLInputElement>) => {
    setValue(value);
  };

  return (
    <>
      <InputGroup>
        <Dropdown
          onSelect={onSelect}
          toggle={
            <DropdownToggle onToggle={onToggle} icon={<FilterIcon />}>
              {filter}
            </DropdownToggle>
          }
          isOpen={isOpen}
          dropdownItems={dropdownItems}
          ouiaId="DropdownFilterField"
        />
        <TextInput
          id="input-filter-dropdown"
          aria-label="input with dropdown and button"
          value={value}
          onChange={onChange}
          ouiaId="TextinputFilterField"
        />
        <Button id="input-filter-button" variant="control" icon={<SearchIcon />} ouiaId="ButtonFilterField" />
      </InputGroup>
    </>
  );
};
