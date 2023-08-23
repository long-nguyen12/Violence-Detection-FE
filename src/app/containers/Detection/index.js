import { ExpandOutlined, UploadOutlined } from "@ant-design/icons";
import CustomBreadcrumb from "@components/CustomBreadcrumb";
import Loading from "@components/Loading";
import { Button, Col, Form, Image, Row, Upload, Typography, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import CustomSkeleton from "@components/CustomSkeleton";
import UploadImg from "@components/Upload/UploadImg";
import { uploadImage, uploadImages } from "../../services/File";
import BASE_URL from "../../../constants/BASE_URL";
import ReactPlayer from "react-player";
import axios from "axios";
import fileDownload from "js-file-download";

const layoutCol = { xs: 24, md: 24 };
const labelCol = { xs: 24 };
const { Text } = Typography;

function Detection({ myInfo }) {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formUpload] = Form.useForm();
  const [imgsUploadView, setImgsUploadView] = useState([]);
  const [imgsUpload, setImgsUpload] = useState([]);
  const [detection, setDetection] = useState(null);
  const [attr, setAttr] = useState(null);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {}, []);

  async function onFinish() {}

  function handleImage(value) {
    setImgsUpload(value);
  }

  function getExtension(filename) {
    var parts = filename.split(".");
    return parts[parts.length - 1];
  }

  async function onDetect() {
    setLoading(true);
    if (imgsUpload.length) {
      let [img] = imgsUpload;
      let resp = await uploadImage(img);
      setLoading(false);
      if (resp) {
        if (getExtension(resp.path) == "png" || getExtension(resp.path) == "jpg") {
          setDetection(resp);
          setIsVideo(false);
        } else {
          setIsVideo(true);
          let path = BASE_URL.BASE_URL + "/static/" + resp.path;
          const link = document.createElement("a");
          link.href = path;
          link.setAttribute("download", resp.path);
          document.body.appendChild(link);
          link.click();

          URL.revokeObjectURL(url);
          link.remove();
        }
      }
    }
    setLoading(false);
  }

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  function renderImage() {
    return (
      <>
        {detection && (
          <Row gutter={[16, 24]}>
            <Col span={16}>
              <Image src={BASE_URL.BASE_URL + "/static/" + detection.path}></Image>
            </Col>
            <Col span={8}>
              {detection.detection &&
                detection.detection.map((item, index) => {
                  let r = item.color[0];
                  let g = item.color[1];
                  let b = item.color[2];
                  let code = rgbToHex(r, g, b);
                  return (
                    <Row>
                      <Tag color={code}></Tag>
                      <Text key={index}>
                        Hành vi: {item.name}, độ tin cậy: {parseFloat(item.conf) * 100}%
                      </Text>
                    </Row>
                  );
                })}
            </Col>
          </Row>
        )}
      </>
    );
  }

  function renderVideo() {
    return (
      <>
        {detection && (
          <Row gutter={[16, 24]}>
            <Col span={24}></Col>
          </Row>
        )}
      </>
    );
  }

  return (
    <>
      <CustomBreadcrumb breadcrumbLabel="Nhận dạng"></CustomBreadcrumb>
      <Loading active={loading} layoutBackground>
        <Form id="form-modal" form={formUpload} onFinish={onFinish}>
          <Row gutter={[16, 8]}>
            <CustomSkeleton label={"Chọn ảnh/video"} name="images" layoutCol={layoutCol} labelCol={labelCol}>
              <UploadImg fileListOrg={imgsUpload} onChange={(data) => handleImage(data)}>
                + Thêm ảnh
              </UploadImg>
            </CustomSkeleton>
          </Row>
          <Row gutter={[0, 24]}>
            <Button icon={<ExpandOutlined />} disabled={imgsUpload.length > 0 ? false : true} onClick={onDetect}>
              Nhận dạng
            </Button>
          </Row>
          {!isVideo && renderImage()}
        </Form>
      </Loading>
    </>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  return { myInfo };
}

export default connect(mapStateToProps, null)(Detection);
