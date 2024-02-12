#!/bin/bash

# See: https://www.patternfly.org/developer-resources/open-ui-automation/#ouia-compliant-patternfly-5-components
# See: https://github.com/podengo-project/idmsvc-frontend/pull/28

opts=(-HRn)

# react-core package           # Prefix to use on ouiaId attribute
opts+=(-e \<Alert)             # Alert
opts+=(-e \<Breadcrumb)        # Breadcrumb
opts+=(-e \<Button)            # Button|Link
opts+=(-e \<Card)              # Card
opts+=(-e \<Checkbox)          # Checkbox
opts+=(-e \<Chip)              # Chip
opts+=(-e \<Dropdown)          # Dropdown
opts+=(-e \<DropdownItem)      # Dropitem
opts+=(-e \<FormSelect)        # Select
opts+=(-e \<Menu)              # Menu
opts+=(-e \<Modal)             # Modal
opts+=(-e \<Navigation)        # Nav
opts+=(-e \<NavExpandable)     # Navexpandable
opts+=(-e \<NavItem)           # Navitem
opts+=(-e \<Pagination)        # Pagination
opts+=(-e \<Radio)             # Radio
opts+=(-e \<Select)            # Select
opts+=(-e \<Switch)            # Switch
opts+=(-e \<TabContent)        # Tabcontent
opts+=(-e \<Tabs)              # Tabs
opts+=(-e \<Text)              # Text
opts+=(-e \<TextInput)         # Textinput
opts+=(-e \<Title)             # Title
opts+=(-e \<Toolbar)           # Toolbar

# react-table package
opts+=(-e \<Table)             # Table
opts+=(-e \<Tr)                # Tr

# Launch the search
grep "${opts[@]}" src/
