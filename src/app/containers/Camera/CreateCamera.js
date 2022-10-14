import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form } from 'antd';

import CustomModal from '@components/CustomModal';
import CustomSkeleton from '@components/CustomSkeleton';
import { CONSTANTS, RULES } from '@constants';
import { getCametaCate } from '@app/services/Camera';

const layoutCol = { xs: 24, md: 24 };
const labelCol = { xs: 24 };

function CreateCamera({
                        myInfo,
                        isModalVisible,
                        handleOk,
                        handleCancel,
                        createCameraSelected,
                        ...props
                      }) {
  const [formCreateDataset] = Form.useForm();
  
  useEffect(  () => {
    if (isModalVisible) {
      formCreateDataset.resetFields();
      if (createCameraSelected) {
        formCreateDataset.setFieldsValue({
          cameraUsername: createCameraSelected.camera_username,
          cameraName: createCameraSelected.camera_name,
          cameraPass: createCameraSelected.camera_password,
          cameraUrl: createCameraSelected.camera_url,
        });
      }
    }
  }, [isModalVisible]);

  function onFinish(data) {
    const newData = {
      camera_username: data.cameraUsername,
      camera_name: data.cameraName,
      camera_password: data.cameraPass,
      camera_url: data.cameraUrl,
    };
    if (props.isLoading) return;
    handleOk(createCameraSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, newData);
  }

  return (
    <>
      <CustomModal
        width="920px"
        title={createCameraSelected ? 'Cập nhật camera' : 'Tạo camera mới '}
        visible={isModalVisible}
        onCancel={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      >
        <Form id="form-modal" form={formCreateDataset} onFinish={onFinish}>
          <CustomSkeleton
            label="Camera name"
            name="cameraName"
            layoutCol={layoutCol}
            labelCol={labelCol}
            type={CONSTANTS.TEXT}
            rules={[RULES.REQUIRED]}
            form={formCreateDataset}
          />
          <CustomSkeleton
            label="Camera user name"
            name="cameraUsername"
            layoutCol={layoutCol}
            labelCol={labelCol}
            type={CONSTANTS.TEXT}
            rules={[RULES.REQUIRED]}
            form={formCreateDataset}
          />
          <CustomSkeleton
            label="Camera pass"
            name="cameraPass"
            layoutCol={layoutCol}
            labelCol={labelCol}
            type={CONSTANTS.PASSWORD}
            rules={[RULES.REQUIRED]}
            form={formCreateDataset}
          />
          <CustomSkeleton
            label="Url camera"
            name="cameraUrl"
            layoutCol={layoutCol}
            labelCol={labelCol}
            type={CONSTANTS.TEXT}
            rules={[RULES.REQUIRED, RULES.URL_FORMAT]}
            form={formCreateDataset}
          />
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

export default connect(mapStateToProps)(CreateCamera);
