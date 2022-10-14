import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import DropzoneImage from '@components/DropzoneImage';

function AnhDinhKem({ avatarUrl, allowChange, ...props }) {
  let { t } = useTranslation();
  return (<>
      <div className="attach-image">
        <div className="attach-image__title">
          {t('LOGO')}
        </div>
        <div className="attach-image__img">
          <DropzoneImage
            width={38 * 4}
            height={38 * 4}
            imgUrl={avatarUrl}
            handleDrop={props.handleSelectAvatar}
            stateRerender={props.stateRerender}
            allowChange={allowChange}
          />
        </div>
      </div>
    </>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default (connect(mapStateToProps)(AnhDinhKem));
AnhDinhKem.propTypes = {};
AnhDinhKem.defaultProps = {};
