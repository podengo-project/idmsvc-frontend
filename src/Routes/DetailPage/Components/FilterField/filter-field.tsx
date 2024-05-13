import {
	Button,
	InputGroup,
	TextInput, InputGroupItem
} from '@patternfly/react-core';
import {
	Dropdown,
	DropdownItem,
	DropdownToggle
} from '@patternfly/react-core/deprecated';
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

  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <>
      <InputGroup>
        <InputGroupItem><Dropdown
          onSelect={onSelect}
          toggle={
            <DropdownToggle onToggle={(_event, isOpen: boolean) => onToggle(isOpen)} icon={<FilterIcon />}>
              {filter}
            </DropdownToggle>
          }
          isOpen={isOpen}
          dropdownItems={dropdownItems}
          ouiaId="DropdownFilterField"
        /></InputGroupItem>
        <InputGroupItem isFill ><TextInput
          id="input-filter-dropdown"
          aria-label="input with dropdown and button"
          value={value}
          onChange={(_event, value: string) => onChange(value)}
          ouiaId="TextinputFilterField"
        /></InputGroupItem>
        <InputGroupItem><Button id="input-filter-button" variant="control" icon={<SearchIcon />} ouiaId="ButtonFilterField" /></InputGroupItem>
      </InputGroup>
    </>
  );
};
