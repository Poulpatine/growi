import React from 'react';
import md5 from 'md5';
import PropTypes from 'prop-types';

import { userPageRoot } from '@commons/util/path-utils';

const DEFAULT_IMAGE = '/images/icons/user.svg';

// TODO UserComponent?
export default class UserPicture extends React.Component {

  getUserPicture(user) {
    // gravatar
    if (user.isGravatarEnabled === true) {
      return this.generateGravatarSrc(user);
    }
    // uploaded image
    if (user.image != null) {
      return user.image;
    }
    if (user.imageAttachment != null) {
      return user.imageAttachment.filePathProxied;
    }

    return DEFAULT_IMAGE;
  }

  generateGravatarSrc(user) {
    const email = user.email || '';
    const hash = md5(email.trim().toLowerCase());
    return `https://gravatar.com/avatar/${hash}`;
  }

  getClassName() {
    const className = ['rounded-circle', 'picture'];
    // size
    if (this.props.size) {
      className.push(`picture-${this.props.size}`);
    }

    return className.join(' ');
  }

  renderForNull() {
    return (
      <img
        src={DEFAULT_IMAGE}
        alt="someone"
        className={this.getClassName()}
      />
    );
  }

  RootElmWithoutLink = (props) => {
    return <span {...props}>{props.children}</span>;
  }

  RootElmWithLink = (props) => {
    const { user } = this.props;
    const href = userPageRoot(user);

    return <a href={href} {...props}>{props.children}</a>;
  }

  withTooltip = (RootElm) => {
    const { user } = this.props;
    const title = `@${user.username}<br />${user.name}`;

    return props => (
      <RootElm data-toggle="tooltip" data-placement="bottom" data-html="true" title={title}>{props.children}</RootElm>
    );
  }

  render() {
    const user = this.props.user;

    if (user == null) {
      return this.renderForNull();
    }

    const { withoutLink, withoutTooltip } = this.props;

    // determine RootElm
    let RootElm = withoutLink ? this.RootElmWithoutLink : this.RootElmWithLink;
    if (!withoutTooltip) {
      RootElm = this.withTooltip(RootElm);
    }

    return (
      <RootElm>
        <img
          src={this.getUserPicture(user)}
          alt={user.username}
          className={this.getClassName()}
        />
      </RootElm>
    );
  }

}

UserPicture.propTypes = {
  user: PropTypes.object,
  size: PropTypes.string,
  withoutLink: PropTypes.bool,
  withoutTooltip: PropTypes.bool,
};

UserPicture.defaultProps = {
  size: null,
  withoutLink: false,
  withoutTooltip: false,
};
