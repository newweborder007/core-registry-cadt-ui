import React from 'react';
import { useSelector } from 'react-redux';
import styled, { withTheme } from 'styled-components';

const Text = withTheme(styled('h1')`
  color: ${props =>
    props.color || '#000000'};
  font-size: 1.5rem;
  font-family: ${props => props.theme.typography.primary};
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  letter-spacing: 0.00938em;
`);

const H3 = withTheme(({ children, color }) => {
  const appStore = useSelector(state => state.app);
  return (
    <Text color={color} selectedTheme={appStore.theme}>
      {children}
    </Text>
  );
});

export { H3 };
