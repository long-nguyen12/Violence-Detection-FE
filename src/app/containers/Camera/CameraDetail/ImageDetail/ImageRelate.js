import Loading from '@components/Loading';
import { Pagination, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

import Ratio from '@components/Ratio';
import { getCameraFilterAll } from '@app/services/Camera';

const PAGE_SIZE = 10;

function ImageRelate({ imageId, imageData, stateImgDetail, filterSelected, ...props }) {
  const [imageDataRelate, setImageDataRelate] = useState(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (stateImgDetail.isShowModal) {
      setImageDataRelate({ images: imageData.data, page: 1 });
      setTotal(imageData?.total);
    }
  }, [stateImgDetail.isShowModal]);

  useEffect(() => {
    if (filterSelected.page === imageDataRelate?.page) {
      setImageDataRelate({ images: imageData?.data, page: filterSelected.page });
      setTotal(imageData?.total);
    } else if (imageDataRelate) {
      onChangePage(imageDataRelate?.page);
    }
  }, [imageData]);

  async function onChangePage(pageState) {
    setLoading(true);
    let query = {
      limit: PAGE_SIZE + `&count=1&img_type=capture&skip=${(pageState - 1) * PAGE_SIZE}`,
    };
    const apiResponse = await getCameraFilterAll(query);
    if (apiResponse) {
      setLoading(false);
      setImageDataRelate({ images: apiResponse?.data, page: pageState });
      setTotal(apiResponse?.total);
    }
  }

  return (
    <div className="image-relate">
      <Tabs size="small" className="tab-title">
        <Tabs.TabPane tab="Ảnh liên quan" forceRender/>
      </Tabs>
      <Loading active={isLoading} className="image-relate__content">
        <div className="image-relate__list">
          {imageDataRelate?.images.map((imgItem, index) => {
            return (
              <div className="image-relate__item" key={index}>
                <div className={`image-relate__img ${imageId === imgItem._id ? 'active' : ''}`}
                     onClick={() => props.setStateImgDetail({
                       isShowModal: true,
                       imgSelected: imgItem,
                       id: imgItem._id,
                     })}>
                  <Ratio type="4:3">
                    <img src={imgItem?.imgUri} alt=""/>
                  </Ratio>
                </div>
              </div>
            );
          })}
        </div>
        {total && (
          <div className="image-relate__pagination">
            <Pagination
              size="small"
              pageSize={PAGE_SIZE}
              current={imageDataRelate.page}
              onChange={onChangePage}
              total={total}
              showSizeChanger={false}
            />
          </div>
        )}
      </Loading>
    </div>
  );
}

export default ImageRelate;
