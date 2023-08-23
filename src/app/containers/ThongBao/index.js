import { toast } from "@app/common/functionCommons";
import { createCamera, updateCamera } from "@app/services/Camera";
import CustomBreadcrumb from "@components/CustomBreadcrumb";
import Loading from "@components/Loading";
import { CONSTANTS } from "@constants";
import CreateCamera from "@containers/Camera/CreateCamera";
import { Button, Image, message, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { deleteNotification, getAllNotification, updateNotification } from "../../services/Notification";
import { NavLink, useHistory } from "react-router-dom";

import AVATAR_DEFAULT from "@assets/images/no-image.png";
import BASE_URL from "../../../constants/BASE_URL";
import moment from "moment";
import {
  convertQueryToObject,
  formatDateTime,
  handleReplaceUrlSearch,
  paginationConfig,
} from "@app/common/functionCommons";

function ThongBao({ myInfo }) {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [dataCamera, setDataCamera] = useState({
    dataRes: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });
  const [stateCreateCamera, setStateCreateCamera] = useState({
    isShowModal: false,
    createCameraSelected: null,
  });

  useEffect(() => {
    getDataNotification();
  }, []);

  async function getDataNotification(
    page = dataCamera.currentPage,
    limit = dataCamera.pageSize,
    query = dataCamera.query
  ) {
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;
    handleReplaceUrlSearch(history, page, limit, query);
    setLoading(true);
    const apiResponse = await getAllNotification(page, limit, query);
    if (apiResponse) {
      setDataCamera({
        dataRes: apiResponse.items,
        currentPage: page,
        pageSize: limit,
        totalDocs: apiResponse.total,
        query: query,
      });
    }
    setLoading(false);
  }

  async function handleChangePagination(current, pageSize) {
    await getDataNotification(current, pageSize);
  }

  const columnsDataset = [
    {
      title: "Hình ảnh",
      width: "25%",
      align: "center",
      fixed: "left",
      render: (value) => {
        return (
          <div>
            <Image
              src={`${value?.image !== null ? BASE_URL.BASE_URL + "/static/" + value?.image : AVATAR_DEFAULT}`}
              height={100}
              width={100}
            />
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      width: "25%",
      align: "center",
      render: (value) => {
        return (
          <>
            <div>
              {value?.confirmed == 0 ? <Tag color={"blue"}>Chưa xác nhận</Tag> : <Tag color={"green"}>Đã xác nhận</Tag>}
            </div>
          </>
        );
      },
    },
    {
      title: "Thời gian",
      width: "25%",
      align: "center",
      render: (value) => {
        return (
          <>
            <div>{moment(value?.create_at).format("HH:mm:ss DD-MM-YYYY")}</div>
          </>
        );
      },
    },
    {
      title: "Thao Tác",
      align: "center",
      render: (value) => (
        <div>
          {value?.confirmed === 0 && (
            <Button type="primary" style={{ marginRight: 10 }} onClick={(_) => handleConfirmNotification(value)}>
              Xác nhận
            </Button>
          )}
          <Button type="primary" style={{ backgroundColor: "red" }} onClick={(_) => handleDeleteCamera(value)}>
            Xoá
          </Button>
        </div>
      ),
      fixed: "right",
      width: "15%",
    },
  ];

  async function handleCreateCamera(type, dataForm) {
    const formData = {
      camera_username: dataForm.camera_username,
      camera_url: dataForm.camera_url,
      camera_password: dataForm.camera_password,
      camera_name: dataForm.camera_name,
    };
    let apiResponse = null;
    if (type === CONSTANTS.CREATE) {
      apiResponse = await createCamera(formData);
      if (apiResponse) {
        await getDataNotification(pagination);
      }
    }
    if (type === CONSTANTS.UPDATE) {
      apiResponse = await updateCamera(stateCreateCamera.createCameraSelected._id, formData);
      if (apiResponse) {
        const docs = dataCamera.map((doc) => {
          if (doc._id === apiResponse?.data?._id) {
            doc = apiResponse?.data;
          }
          return doc;
        });
        setDataCamera(docs);
      }
    }
    if (apiResponse) {
      setStateCreateCamera({ isShowModal: false, createCameraSelected: null });
      toast(CONSTANTS.SUCCESS, `${type === CONSTANTS.CREATE ? "Tạo mới" : "Cập nhật"} camera thành công`);
    }
  }

  async function handleDeleteCamera(data) {
    const apiResponse = await deleteNotification(data.id_notification);
    if (apiResponse) {
      await handleChangePagination();
      message.success("Xóa thông báo thành công!");
    }
  }

  async function handleConfirmNotification(data) {
    const apiResponse = await updateNotification(data.id_notification);
    if (apiResponse) {
      await handleChangePagination();
      message.success("Xác nhận thông báo thành công!");
    }
  }

  return (
    <>
      <CustomBreadcrumb breadcrumbLabel="Thông báo">
        {/* <Row>
          <Button
            type="primary"
            icon={<i className="fa fa-plus mr-1"/>}
            onClick={handleShowModalCreateCamera}>
            Tạo mới
          </Button>
        </Row> */}
      </CustomBreadcrumb>
      <Loading active={loading} layoutBackground>
        <Table
          bordered
          rowKey="id_notification"
          size="small"
          style={{ width: "100%" }}
          columns={columnsDataset}
          dataSource={dataCamera.dataRes}
          pagination={paginationConfig(handleChangePagination, dataCamera)}
          scroll={{ x: 1200 }}
        />
      </Loading>

      <CreateCamera
        isModalVisible={stateCreateCamera.isShowModal}
        handleOk={handleCreateCamera}
        handleCancel={() => setStateCreateCamera({ isShowModal: false, createCameraSelected: null })}
        createCameraSelected={stateCreateCamera.createCameraSelected}
      />
    </>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  return { myInfo };
}

export default connect(mapStateToProps, null)(ThongBao);
