import React, { useEffect, useState } from 'react';
import styled, { withTheme } from 'styled-components';
import { CircularProgress } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  ButtonText,
  WarehouseIcon,
  RegistryIcon,
  Modal,
  Body,
} from '../../components';
import { OrgCreateFormModal } from '../forms';
import { modalTypeEnum } from '.';
import { getOrganizationData } from '../../store/actions/climateWarehouseActions';
import { getHomeOrg } from '../../store/view/organization.view';

const Container = styled('div')`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const StyledAppVersion = styled('div')`
  position: absolute;
  bottom: 12px;
  left: 50px;
`;

const NavContainer = styled('div')`
  width: 16rem;
  min-width: 16rem;
  height: 100%;
  background-color: ${props => props.theme.colors.default.shade1};
`;

const MenuItem = styled(Link)`
  background: ${props => (props.selected ? 'white' : 'transparent')};
  :hover {
    background: ${props => props.theme.colors.default.primary};
  }
  padding: 0.5625rem 0rem 0.75rem 3.25rem;
  text-transform: uppercase;
  ${props =>
    props.selected
      ? `color: ${props.theme.colors.default.primary};`
      : 'color: #6e7d7f;'}
  font-family: ${props => props.theme.typography.primary.bold};
  cursor: pointer;
  display: block;
  text-decoration: none;
  width: calc(100% - 1.625rem);
  margin: auto;
  font-size: 1.1rem;
  box-sizing: border-box;
  border-radius: 0.625rem;
  margin-bottom: 0.625rem;
`;

const StyledTitleContainer = styled('div')`
  ${props => (!props.disabled ? `color: white;` : `color: #BFBFBF;`)};
  display: flex;
  gap: 0.8438rem;
  & h4 {
    text-transform: uppercase;
    ${props => (!props.disabled ? `color: white;` : `color: #BFBFBF;`)};
  }
  margin: 46px 0px 1.3125rem 1.3rem;
`;

const LeftNav = withTheme(({ children, theme }) => {
  const location = useLocation();
  const [confirmCreateOrgIsVisible, setConfirmCreateOrgIsVisible] =
    useState(false);
  const [createOrgIsVisible, setCreateOrgIsVisible] = useState(false);
  const intl = useIntl();
  const { readOnlyMode } = useSelector(state => state.app);
  const { isGovernance } = useSelector(state => state.climateWarehouse);
  const dispatch = useDispatch();
  const [myOrgUid, isMyOrgPending] = useSelector(store => getHomeOrg(store));

  const isMyOrgCreated = !!myOrgUid;

  useEffect(() => {
    let intervalId;
    if (!createOrgIsVisible && isMyOrgPending) {
      intervalId = setInterval(
        () => dispatch(getOrganizationData()),
        30 * 1000,
      );
    }
    return () => clearTimeout(intervalId);
  }, [isMyOrgCreated, isMyOrgPending, createOrgIsVisible]);

  const projectsPageUrl = '/projects';

  const isUnitsPage = location.pathname.includes('/units');
  const isProjectsPage = location.pathname.includes('/projects');
  const isAuditPage = location.pathname.includes('/audit');
  const isMyRegistryPage = location.search.includes('myRegistry=true');
  const isOrganizationPage = location.pathname.includes('/organization');
  const isGovernancePage = location.pathname.includes('/governance');
  const isFilesPage = location.pathname.includes('/files');
  const isGlossaryPage = location.pathname.includes('/glossary');

  return (
    <Container>
      <NavContainer>
        <StyledTitleContainer>
          <WarehouseIcon height={24} width={24} color="#6e7d7f" />
          <ButtonText color={theme.colors.default.primary}>
            <FormattedMessage id="cadt" />
          </ButtonText>
        </StyledTitleContainer>
        <MenuItem selected={isProjectsPage && !isMyRegistryPage} to="/projects">
          <FormattedMessage id="projects-list" />
        </MenuItem>
        <div></div>
        <MenuItem selected={isUnitsPage && !isMyRegistryPage} to="/units">
          <FormattedMessage id="units-list" />
        </MenuItem>
        <MenuItem selected={isAuditPage} to="/audit">
          <FormattedMessage id="audit" />
        </MenuItem>
        <MenuItem selected={isGlossaryPage} to={`/glossary`}>
          <FormattedMessage id="glossary" />
        </MenuItem>

        {!readOnlyMode && (
          <>
            <StyledTitleContainer disabled={!isMyOrgCreated || isMyOrgPending}>
              {isMyOrgPending && <CircularProgress size={20} thickness={5} />}
              {!isMyOrgPending && <RegistryIcon height={20} width={20} />}
              <ButtonText color={theme.colors.default.primary}>
                <FormattedMessage id="my-registry" />
              </ButtonText>
            </StyledTitleContainer>
            {!isMyOrgCreated && (
              <MenuItem
                to={projectsPageUrl}
                onClick={() => setCreateOrgIsVisible(true)}
              >
                <FormattedMessage id="create-organization" />
              </MenuItem>
            )}
            {isMyOrgPending && (
              <MenuItem to={projectsPageUrl} disabled>
                <FormattedMessage id="creating-organization" />
              </MenuItem>
            )}
            {isMyOrgCreated && !isMyOrgPending ? (
              <>
                <MenuItem
                  selected={isProjectsPage && isMyRegistryPage}
                  to={`/projects?orgUid=${myOrgUid}&myRegistry=true`}
                >
                  <FormattedMessage id="my-projects" />
                </MenuItem>
                <div></div>
                <MenuItem
                  selected={isUnitsPage && isMyRegistryPage}
                  to={`/units?orgUid=${myOrgUid}&myRegistry=true`}
                >
                  <FormattedMessage id="my-units" />
                </MenuItem>

                <div></div>
                <MenuItem selected={isFilesPage} to={`/files`}>
                  <FormattedMessage id="my-files" />
                </MenuItem>

                <MenuItem selected={isOrganizationPage} to="/organization">
                  <FormattedMessage id="my-organization" />
                </MenuItem>
                {isGovernance && (
                  <MenuItem selected={isGovernancePage} to="/governance">
                    <FormattedMessage id="governance" />
                  </MenuItem>
                )}
              </>
            ) : (
              <>
                <MenuItem
                  to={projectsPageUrl}
                  onClick={() => setConfirmCreateOrgIsVisible(true)}
                  disabled
                >
                  <FormattedMessage id="my-projects" />
                </MenuItem>
                <div></div>
                <MenuItem
                  to={projectsPageUrl}
                  onClick={() => setConfirmCreateOrgIsVisible(true)}
                  disabled
                >
                  <FormattedMessage id="my-units" />
                </MenuItem>
              </>
            )}
          </>
        )}
      </NavContainer>
      {children}
      {createOrgIsVisible && (
        <OrgCreateFormModal onClose={() => setCreateOrgIsVisible(false)} />
      )}
      {!isMyOrgCreated && confirmCreateOrgIsVisible && (
        <Modal
          title={intl.formatMessage({ id: 'create-organization' })}
          body={intl.formatMessage({ id: 'you-need-to-create-organization' })}
          modalType={modalTypeEnum.confirmation}
          onClose={() => setConfirmCreateOrgIsVisible(false)}
          onOk={() => {
            setCreateOrgIsVisible(true);
            setConfirmCreateOrgIsVisible(false);
          }}
        />
      )}
      <StyledAppVersion>
        <Body size="X-Small" color="white">
          {process.env.REACT_APP_VERSION && `v${process.env.REACT_APP_VERSION}`}
        </Body>
      </StyledAppVersion>
    </Container>
  );
});

export { LeftNav };
