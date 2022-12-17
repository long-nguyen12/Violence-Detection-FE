import { VideoCameraAddOutlined } from "@ant-design/icons";
import { toast } from "@app/common/functionCommons";
import { createCapture, getVideoById, getVideoFilterAll, updateVideo } from "@app/services/Video";
import ActionCell from "@components/ActionCell";
import CustomBreadcrumb from "@components/CustomBreadcrumb";
import Loading from "@components/Loading";
import { CONSTANTS } from "@constants";
import { Button, Col, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import "./Video.scss";
import useWebSocket from "react-use-websocket";

const { TabPane } = Tabs;

function VideoDetail() {
  let history = useHistory();
  let { id } = useParams();
  const [dataVideo, setDataVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const { sendMessage, getWebSocket } = useWebSocket(`ws://localhost:8008/ws/video/${id}`, {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) => processMessages(event),
  });

  useEffect(() => {
    getDataVideoID();
    getWebSocket();
  }, []);

  async function processMessages(event) {
    let image = document.getElementById("frame");
    image.src = URL.createObjectURL(event.data);
  }

  async function getDataVideoID() {
    setLoading(true);
    const apiResponse = await getVideoById(id);
    console.log(apiResponse);
    if (apiResponse) {
      setDataVideo(apiResponse?.data);
      runStream(apiResponse?.data?.video_path);
    }
    setLoading(false);
  }

  function runStream(URL) {
    setUrl(URL);
  }

  return (
    <>
      <CustomBreadcrumb breadcrumbLabel="Chi tiết Video">
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
          {dataVideo && (
            <>
              <Row span={24} gutter={15}>
                <Col xs={20}>
                  <div>
                    <div className="font-weight-bold float-left" style={{ width: 120 }}>
                      Video:
                    </div>
                    <div className="font-weight-bold" style={{ fontWeight: "normal" }}>
                      {dataVideo?.video_path}
                    </div>
                  </div>
                </Col>
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
    </>
  );
}

export default VideoDetail;

