import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'antd';
import { connect } from 'react-redux';

import CustomModal from '@components/CustomModal';
import CustomSkeleton from '@components/CustomSkeleton';

import { CONSTANTS, RULES } from '@constants';
import { cloneObj, toast } from '@app/common/functionCommons';
import AnhDinhKem from '@containers/Account/AnhDinhKem';

const layoutCol = { xs: 24, md: 24 };
const labelCol = { xs: 24 };

function CameraDetail({ myInfo, isModalVisible, handleOk, handleCancel, cameraSelected, ...props }) {
  const [formCamera] = Form.useForm();
  const [avatarCamera, setAvatarCamera] = useState(null);
  const [stateRerender, setStateRerender] = useState(0);

  useEffect(() => {
    if (isModalVisible) {
      setAvatarCamera(null);
      formCamera.resetFields();
      if (cameraSelected) {
        const dataField = cloneObj(cameraSelected);
        formCamera.setFieldsValue(dataField);
        setAvatarCamera(cameraSelected?.logo?.imgUri);
      }
      setStateRerender(stateRerender + 1);
    }
  }, [isModalVisible]);

  function onFinish(data) {
    if (avatarCamera === null) {
      toast(CONSTANTS.ERROR, 'Chưa chọn logo');
      return;
    }
    const newData = new FormData();
    newData.append('name', data.name);
    newData.append('desc', data.desc);
    newData.append('logo', avatarCamera);
    if (props.isLoading) return;
    handleOk(cameraSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, newData);
  }

  return (
    <>
      <CustomModal
        width="920px"
        title={cameraSelected ? 'Cập nhật thông tin camera' : 'Thêm mới camera'}
        visible={isModalVisible}
        onCancel={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
        formId='form-detail-camera'
      >
        <Form id="form-detail-camera" form={formCamera} onFinish={onFinish}>
          <Row gutter={15}>
            <Col xs={24} md={18}>
              <CustomSkeleton
                label="Tên camera"
                name="name"
                layoutCol={layoutCol}
                labelCol={labelCol}
                type={CONSTANTS.TEXT}
                rules={[RULES.REQUIRED]}
                form={formCamera}
              />
              <CustomSkeleton
                label="Mô tả"
                name="desc"
                layoutCol={layoutCol}
                labelCol={labelCol}
                type={CONSTANTS.TEXT}
                rules={[RULES.REQUIRED]}
                form={formCamera}
              />
            </Col>
            <Col xs={24} md={6}>
              <AnhDinhKem
                avatarUrl={avatarCamera}
                handleSelectAvatar={setAvatarCamera}
                stateRerender={stateRerender}
              />
            </Col>
          </Row>
        </Form>
      </CustomModal>
    </>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default connect(mapStateToProps)(CameraDetail);
