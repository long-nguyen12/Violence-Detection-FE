import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Upload } from "antd";

import CustomModal from "@components/CustomModal";
import CustomSkeleton from "@components/CustomSkeleton";
import { CONSTANTS, RULES } from "@constants";

const layoutCol = { xs: 24, md: 24 };
const labelCol = { xs: 24 };

function CreateCamera({ myInfo, isModalVisible, handleOk, handleCancel, createCameraSelected, ...props }) {
  const [formCreateDataset] = Form.useForm();

  const [imgsUploadView, setImgsUploadView] = useState([]);
  const [imgsUpload, setImgsUpload] = useState([]);
  const prototype = {
    name: "file",
    multiple: true,
    listType: "picture-card",
    fileList: imgsUploadView,
    showUploadList: { showPreviewIcon: false },
    onChange({ fileList }) {
      setImgsUploadView(fileList);
    },
    beforeUpload(file, fileList) {
      if (file.type !== "video/mp4") {
        message.error("Chọn đúng định dạng video");
      } else if (file.size / 1024 / 1024 > 50) {
        message.error("Chọn đúng kích thước video");
      } else {
        const newList = imgsUpload.concat(fileList);
        setImgsUpload(newList);
      }
      return file.type === "video/mp4" ? false : Upload.LIST_IGNORE;
    },
    onRemove(file) {
      const index = imgsUploadView.indexOf(file);
      const newFileList = imgsUpload.slice();
      newFileList.splice(index, 1);
      setImgsUpload(newFileList);
    },
  };
  useEffect(() => {
    if (isModalVisible) {
      formCreateDataset.resetFields();
    }
  }, [isModalVisible]);

  function onFinish(data) {
    const newData = {
      videos: data.videos,
    };
    if (props.isLoading) return;
    handleOk(newData);
  }

  return (
    <>
      <CustomModal
        width="920px"
        title={"Tải lên video mới "}
        visible={isModalVisible}
        onCancel={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
      >
        <Form id="form-modal" form={formCreateDataset} onFinish={onFinish}>
          <CustomSkeleton
            label={"Video"}
            name="videos"
            layoutCol={layoutCol}
            labelCol={labelCol}
            rules={[RULES.REQUIRED]}
          >
            <Upload {...prototype}>+ Thêm video</Upload>
          </CustomSkeleton>
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
