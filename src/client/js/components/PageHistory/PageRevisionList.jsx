import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';
import PageHistroyContainer from '../../services/PageHistoryContainer';

import Revision from './Revision';
import RevisionDiff from './RevisionDiff';

class PageRevisionList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isCompactNodiffRevisions: true,
    };

    this.cbCompactizeChangeHandler = this.cbCompactizeChangeHandler.bind(this);
  }

  cbCompactizeChangeHandler() {
    this.setState({ isCompactNodiffRevisions: !this.state.isCompactNodiffRevisions });
  }

  /**
   * render a row (Revision component and RevisionDiff component)
   * @param {Revison} revision
   * @param {Revision} previousRevision
   * @param {boolean} hasDiff whether revision has difference to previousRevision
   * @param {boolean} isContiguousNodiff true if the current 'hasDiff' and one of previous row is both false
   */
  renderRow(revision, previousRevision, hasDiff, isContiguousNodiff) {
    const revisionId = revision._id;
    const revisionDiffOpened = this.props.diffOpened[revisionId] || false;

    const classNames = ['revision-history-outer'];
    if (isContiguousNodiff) {
      classNames.push('revision-history-outer-contiguous-nodiff');
    }

    return (
      <div className={classNames.join(' ')} key={`revision-history-${revisionId}`}>
        <Revision
          t={this.props.t}
          revision={revision}
          revisionDiffOpened={revisionDiffOpened}
          hasDiff={hasDiff}
          isCompactNodiffRevisions={this.state.isCompactNodiffRevisions}
          onDiffOpenClicked={this.props.onDiffOpenClicked}
          key={`revision-history-rev-${revisionId}`}
        />
        { hasDiff
          && (
          <RevisionDiff
            revisionDiffOpened={revisionDiffOpened}
            currentRevision={revision}
            previousRevision={previousRevision}
            key={`revision-deff-${revisionId}`}
          />
          )
        }
      </div>
    );
  }

  render() {
    const { t, pageHistoryContainer } = this.props;

    const revisions = this.props.revisions;
    const revisionCount = this.props.revisions.length;

    let hasDiffPrev;

    const revisionList = this.props.revisions.map((revision, idx) => {
      // Returns null because the last revision is for the bottom diff display
      if (idx === pageHistoryContainer.state.pagingLimit) {
        return null;
      }

      let previousRevision;
      if (idx + 1 < revisionCount) {
        previousRevision = revisions[idx + 1];
      }
      else {
        previousRevision = revision; // if it is the first revision, show full text as diff text
      }

      const hasDiff = revision.hasDiffToPrev !== false; // set 'true' if undefined for backward compatibility
      const isContiguousNodiff = !hasDiff && !hasDiffPrev;

      hasDiffPrev = hasDiff;

      return this.renderRow(revision, previousRevision, hasDiff, isContiguousNodiff);
    });

    const classNames = ['revision-history-list'];
    if (this.state.isCompactNodiffRevisions) {
      classNames.push('revision-history-list-compact');
    }

    return (
      <React.Fragment>
        <div className="custom-control custom-checkbox custom-checkbox-info float-right">
          <input
            type="checkbox"
            id="cbCompactize"
            className="custom-control-input"
            checked={this.state.isCompactNodiffRevisions}
            onChange={this.cbCompactizeChangeHandler}
          />
          <label className="custom-control-label" htmlFor="cbCompactize">{ t('Shrink versions that have no diffs') }</label>
        </div>
        <div className="clearfix"></div>
        <div className={classNames.join(' ')}>
          {revisionList}
        </div>
      </React.Fragment>
    );
  }

}

PageRevisionList.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  pageHistoryContainer: PropTypes.instanceOf(PageHistroyContainer).isRequired,

  revisions: PropTypes.array,
  diffOpened: PropTypes.object,
  onDiffOpenClicked: PropTypes.func.isRequired,
};

export default withTranslation()(PageRevisionList);
