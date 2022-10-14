import { VideoCameraAddOutlined } from "@ant-design/icons";
import { toast } from "@app/common/functionCommons";
import { createCapture, getCameraById, getCameraFilterAll, updateCamera } from "@app/services/Camera";
import ActionCell from "@components/ActionCell";
import CustomBreadcrumb from "@components/CustomBreadcrumb";
import Loading from "@components/Loading";
import { CONSTANTS } from "@constants";
import ImageDetail from "@containers/Camera/CameraDetail/ImageDetail/ImageDetail";
import JsmpegPlayer from "@containers/Camera/CameraDetail/JsmpegPlayer";
import CreateCamera from "@containers/Camera/CreateCamera";
import { Button, Col, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import "./Camera.scss";
import useWebSocket from "react-use-websocket";

const { TabPane } = Tabs;
const videoOverlayOptions = { preserveDrawingBuffer: true, audio: false, disableGl: true };
const videoOptions = {};
const pageSizeNumber = 10;

function CameraDetail({ myInfo }) {
  let history = useHistory();
  let { id } = useParams();
  const [dataCamera, setDataCamera] = useState(null);
  const [stateCreateCamera, setStateCreateCamera] = useState({
    isShowModal: false,
    createCameraSelected: null,
  });
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [arrImg, setArrImg] = useState([]);
  let jsmpegPlayer;
  const [stateImgDetail, setStateImgDetail] = useState({
    isShowModal: false,
    id: "",
    imgSelected: null,
  });
  const [filterSelected, setFilterSelected] = useState({
    page: 1,
    label: CONSTANTS.ALL,
    orgUnit: undefined,
    owner: undefined,
  });
  const [loadingCapture, setLoadingCapture] = useState(false);

  const { sendMessage, getWebSocket } = useWebSocket("ws://localhost:8008/ws/1", {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) => processMessages(event),
  });

  useEffect(() => {
    getDataCameraID();
    getWebSocket();
  }, []);

  async function processMessages(event) {
    let image = document.getElementById("frame");
    image.src = URL.createObjectURL(event.data);
  }

  async function getDataCameraID() {
    setLoading(true);
    const apiResponse = await getCameraById(id);
    if (apiResponse) {
      setDataCamera(apiResponse?.data);
      runStream(apiResponse?.data?.ws_url);
    }
    setLoading(false);
  }

  function runStream(URL) {
    setUrl(URL);
  }

  async function handleCreateCamera(type, dataForm) {
    const formData = {
      camera_username: dataForm.camera_username,
      camera_url: dataForm.camera_url,
      camera_password: dataForm.camera_password,
      camera_name: dataForm.camera_name,
    };
    const apiResponse = await updateCamera(stateCreateCamera.createCameraSelected.idcameras, formData);
    if (apiResponse) {
      setDataCamera(apiResponse);
      setStateCreateCamera({ isShowModal: false, createCameraSelected: null });
      toast(CONSTANTS.SUCCESS, `Cập nhật camera thành công`);
    }
  }

  return (
    <>
      <CustomBreadcrumb breadcrumbLabel="Chi tiết Camera">
        <Button
          type="primary"
          icon={<i className="fa fa-arrow-left mr-1" />}
          onClick={() => {
            history.goBack();
            sendMessage("DISCONNECT");
          }}
        >
          Quay lại
        </Button>
      </CustomBreadcrumb>
      <div className="site-layout-background" style={{ paddingBottom: 12 }}>
        <Loading active={loading}>
          {dataCamera && (
            <>
              <Row span={24} gutter={15}>
                <Col xs={20}>
                  <div>
                    <div className="font-weight-bold float-left" style={{ width: 120 }}>
                      Camera url:
                    </div>
                    <div className="font-weight-bold" style={{ fontWeight: "normal" }}>
                      {dataCamera?.camera_url}
                    </div>
                  </div>
                </Col>
                {/* <Col xs={4}>
                  <ActionCell
                    value={dataCamera}
                    handleEdit={() => setStateCreateCamera({ isShowModal: true, createCameraSelected: dataCamera })}
                    allowDelete={false}
                  />
                </Col> */}
              </Row>
            </>
          )}
          <br />
          <Tabs type="card">
            <TabPane
              tab={
                <div style={{ fontSize: 15 }}>
                  <VideoCameraAddOutlined style={{ fontSize: 15 }} />
                  LIVE
                </div>
              }
              key="LIVE"
            >
              {url && (
                <Row justify="center">
                  <img id="frame" src="" width={1200}></img>
                </Row>
              )}
            </TabPane>
          </Tabs>
        </Loading>
      </div>
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

export default connect(mapStateToProps, null)(CameraDetail);

