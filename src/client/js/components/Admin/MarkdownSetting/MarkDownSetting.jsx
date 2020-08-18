import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import loggerFactory from '@alias/logger';

import { withUnstatedContainers } from '../../UnstatedUtils';
import { toastError } from '../../../util/apiNotification';

import MarkDownSettingContents from './MarkDownSettingContents';
import AdminMarkDownContainer from '../../../services/AdminMarkDownContainer';

const logger = loggerFactory('growi:MarkDown');

function MarkdownSettingWithContainerWithSuspense(props) {
  return (
    <Suspense
      fallback={(
        <div className="row">
          <i className="fa fa-5x fa-spinner fa-pulse mx-auto text-muted"></i>
        </div>
      )}
    >
      <MarkdownSettingWithUnstatedContainer />
    </Suspense>
  );
}

function MarkdownSetting(props) {
  const { adminMarkDownContainer } = props;

  if (adminMarkDownContainer.state.isEnabledLinebreaks === adminMarkDownContainer.dummyIsEnabledLinebreaks) {
    throw (async() => {
      try {
        await adminMarkDownContainer.retrieveMarkdownData();
      }
      catch (err) {
        toastError(err);
        adminMarkDownContainer.setState({ isEnabledLinebreaks: adminMarkDownContainer.dummyIsEnabledLinebreaksForError, retrieveError: err[0].message });
        logger.error(err);
      }
    })();
  }

  if (adminMarkDownContainer.state.isEnabledLinebreaks === adminMarkDownContainer.dummyIsEnabledLinebreaksForError) {
    throw new Error(adminMarkDownContainer.state.retrieveError);
  }

  return <MarkDownSettingContents />;
}

const MarkdownSettingWithUnstatedContainer = withUnstatedContainers(MarkdownSetting, [AdminMarkDownContainer]);

MarkdownSetting.propTypes = {
  adminMarkDownContainer: PropTypes.instanceOf(AdminMarkDownContainer).isRequired,
};

export default MarkdownSettingWithContainerWithSuspense;
