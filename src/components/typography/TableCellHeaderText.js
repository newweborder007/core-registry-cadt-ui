import React from 'react';
import { useSelector } from 'react-redux';
import styled, { withTheme } from 'styled-components';

const Text = withTheme(styled('h1')`
  color: ${props =>
    props.color || '#000000'};
  font-size: 0.875rem;
  font-family: ${props => props.theme.typography.primary.semiBold};
  font-style: normal;
  font-weight: 600;
  line-height: 1.375rem;
`);

const TableCellHeaderText = withTheme(({ children, color }) => {
  const appStore = useSelector(state => state.app);
  return (
    <Text color={color} selectedTheme={appStore.theme}>
      {children}
    </Text>
  );
});

export { TableCellHeaderText };
