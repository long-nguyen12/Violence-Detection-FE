import React, { useEffect, useState } from 'react';

import ImageRelate from './ImageRelate';
import ViewAndDrawImage from './ViewAndDrawImage';
import CustomModal from '@components/CustomModal';
import Loading from '@components/Loading';

function ImageDetail({ imageId, stateImgDetail, imageData, filterSelected, ...props }) {

  const [boundingList, setBoundingList] = useState([]);

  useEffect(() => {
  }, []);

  function setCanvasDataset(dataset) {
    setBoundingList(dataset);
  }

  if (!stateImgDetail?.isShowModal) return null;
  return (
    <>
      <CustomModal
        width="100%"
        title="Chi tiết ảnh"
        className="modalCamera"
        visible={stateImgDetail.isShowModal}
        onCancel={() => props.setStateImgDetail({ isShowModal: false, imgSelected: null, id: '' })}
        showFooter={false}
      >
        <Loading active={false} className="site-layout-background">
          <div className="change-label-camera">
            <ImageRelate
              imageId={imageId}
              imageData={imageData}
              setStateImgDetail={props.setStateImgDetail}
              stateImgDetail={stateImgDetail}
              filterSelected={filterSelected}
            />
            <ViewAndDrawImage
              imageUrl={stateImgDetail?.imgSelected?.imgUri}
              canvasDataset={boundingList}
              setCanvasDataset={setCanvasDataset}
              handleDeleteImage={() => {
              props.handleDeleteImage();
              }}
            />
          </div>
        </Loading>
      </CustomModal>
    </>
  );
}

export default ImageDetail;
