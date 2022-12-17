import { Button, Image, message, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CustomBreadcrumb from "@components/CustomBreadcrumb";
import Loading from "@components/Loading";
import { createVideo, deleteVideo, getAllDataVideo, updateVideo } from "@app/services/Video";
import ActionCell from "@components/ActionCell";
import { CONSTANTS } from "@constants";
import { formatDateTime, toast } from "@app/common/functionCommons";
import { Link } from "react-router-dom";
import CreateVideo from "./CreateVideo";

function Video({ myInfo }) {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: null,
  });
  const [loading, setLoading] = useState(false);
  const [dataVideo, setDataVideo] = useState([]);
  const [stateCreateVideo, setStateCreateVideo] = useState({
    isShowModal: false,
    createVideoSelected: null,
  });

  useEffect(() => {
    getDataVideo();
  }, []);

  async function getDataVideo() {
    setLoading(true);
    const apiResponse = await getAllDataVideo();
    if (apiResponse) {
      setDataVideo(apiResponse.data?.items);
    }
    setLoading(false);
  }

  function handleShowModalCreateVideo(isShowModal, createVideoSelected = null) {
    if (isShowModal) {
      setStateCreateVideo({ isShowModal, createVideoSelected });
    } else {
      setStateCreateVideo({ ...stateCreateVideo, createVideoSelected });
    }
  }

  const handleTableChange = async (pagination) => {
    await getDataVideo(pagination);
  };

  const columnsDataset = [
    {
      title: "Video",
      width: "59%",
      align: "center",
      fixed: "left",
      render: (value) => {
        return (
          <Link
            to={{
              pathname: "/camera/" + value?.idcameras,
              aboutProps: {
                id: value.id_video,
                name: value.video_path,
              },
            }}
          >
            <div></div>
            <div>Video {value?.image_path}</div>
          </Link>
        );
      },
    },
    {
      title: "Thao Tác",
      align: "center",
      render: (value) => (
        // <ActionCell
        //   value={value}
        //   handleEdit={() => setStateCreateVideo({ isShowModal: true, createVideoSelected: value })}
        //   handleDelete={handleDeleteVideo}
        // />
        <div>
          <Link
            to={{
              pathname: "/video/" + value?.id_video,
              aboutProps: {
                id: value.id_video,
                name: value.video_path,
              },
            }}
          >
            <Button type="primary" style={{ marginRight: 10 }}>
              Xem
            </Button>
          </Link>
          <Button type="primary" style={{backgroundColor: 'red'}} onClick={(_) => handleDeleteVideo(value)}>
            Xoá
          </Button>
        </div>
      ),
      fixed: "right",
      width: "15%",
    },
  ];

  async function handleCreateVideo(dataForm) {
    const formData = {
      file: dataForm.videos,
    };
    let apiResponse = null;
    apiResponse = await createVideo(formData);
    if (apiResponse) {
      await getDataVideo(pagination);
    }

    if (apiResponse) {
      setStateCreateVideo({ isShowModal: false, createVideoSelected: null });
      toast(CONSTANTS.SUCCESS, "Tạo mới video thành công")
    }
  }

  async function handleDeleteVideo(data) {
    const apiResponse = await deleteVideo(data.id_video);
    if (apiResponse) {
      await getDataVideo(pagination);
      message.success("Xóa camera thành công!");
    }
  }

  return (
    <>
      <CustomBreadcrumb breadcrumbLabel="Video">
        <Row>
          <Button type="primary" icon={<i className="fa fa-plus mr-1" />} onClick={handleShowModalCreateVideo}>
            Thêm mới
          </Button>
        </Row>
      </CustomBreadcrumb>
      <Loading active={loading} layoutBackground>
        <Table
          bordered
          rowKey="id_video"
          size="small"
          style={{ width: "100%" }}
          columns={columnsDataset}
          dataSource={dataVideo}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Loading>

      <CreateVideo
        isModalVisible={stateCreateVideo.isShowModal}
        handleOk={handleCreateVideo}
        handleCancel={() => setStateCreateVideo({ isShowModal: false, createVideoSelected: null })}
        createVideoSelected={stateCreateVideo.createVideoSelected}
      />
    </>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  return { myInfo };
}

export default connect(mapStateToProps, null)(Video);
