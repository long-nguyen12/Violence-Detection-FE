import { Button, Image, message, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CustomBreadcrumb from "@components/CustomBreadcrumb";
import Loading from "@components/Loading";
import { createCamera, deleteCamera, getAllDataCamera, updateCamera } from "@app/services/Camera";
import CreateCamera from "@containers/Camera/CreateCamera";
import ActionCell from "@components/ActionCell";
import { CONSTANTS } from "@constants";
import { formatDateTime, toast } from "@app/common/functionCommons";
import { Link } from "react-router-dom";

function Camera({ myInfo }) {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: null,
  });
  const [loading, setLoading] = useState(false);
  const [dataCamera, setDataCamera] = useState([]);
  const [stateCreateCamera, setStateCreateCamera] = useState({
    isShowModal: false,
    createCameraSelected: null,
  });

  useEffect(() => {
    getDataCamera();
  }, []);

  async function getDataCamera() {
    setLoading(true);
    const apiResponse = await getAllDataCamera();
    if (apiResponse) {
      setDataCamera(apiResponse.data?.camera);
    }
    setLoading(false);
  }

  function handleShowModalCreateCamera(isShowModal, createCameraSelected = null) {
    if (isShowModal) {
      setStateCreateCamera({ isShowModal, createCameraSelected });
    } else {
      setStateCreateCamera({ ...stateCreateCamera, createCameraSelected });
    }
  }

  const handleTableChange = async (pagination) => {
    await getDataCamera(pagination);
  };

  const columnsDataset = [
    {
      title: "Camera Name",
      width: "15%",
      align: "center",
      fixed: "left",
      render: (value) => {
        return (
          <Link
            to={{
              pathname: "/camera/" + value?.idcameras,
              aboutProps: {
                id: value.idcameras,
                name: value.camera_name,
              },
            }}
          >
            <div></div>
            <div>{value?.camera_name}</div>
          </Link>
        );
      },
    },
    {
      title: "Thông Tin Camera",
      width: "45%",
      render: (value) => {
        return (
          <>
            <div>
              <div className="float-left" style={{ width: 120 }}>
                - URL camera:
              </div>
              <div>{value?.camera_url}</div>
            </div>
          </>
        );
      },
    },
    {
      title: "Thao Tác",
      align: "center",
      render: (value) => (
        // <ActionCell
        //   value={value}
        //   handleEdit={() => setStateCreateCamera({ isShowModal: true, createCameraSelected: value })}
        //   handleDelete={handleDeleteCamera}
        // />
        <Button type="primary" onClick={handleShowModalCreateCamera}>
          Xem
        </Button>
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
        await getDataCamera(pagination);
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

  // async function handleDeleteCamera(data) {
  //   const apiResponse = await deleteCamera(myInfo._id, data._id);
  //   if (apiResponse) {
  //     await getDataCamera(pagination);
  //     message.success("Xóa camera thành công!");
  //   }
  // }

  return (
    <>
      <CustomBreadcrumb breadcrumbLabel="Camera">
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
          rowKey="idcameras"
          size="small"
          style={{ width: "100%" }}
          columns={columnsDataset}
          dataSource={dataCamera}
          pagination={pagination}
          onChange={handleTableChange}
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

export default connect(mapStateToProps, null)(Camera);

