import React, { Component } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { Button } from 'antd';
import './Camera.scss';
import {
  InstagramOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  CameraOutlined,
} from '@ant-design/icons';

export default class JsmpegPlayer extends Component {
  constructor(props) {
    super(props);
    this.els = {
      videoWrapper: null,
    };
  };

  takePhoto = () => {
    this.props.takePhoto(this.video.els.canvas.toDataURL());
  };

  takeQuickPhoto = () => {
    let image = [];
    const tineInterval = setInterval(() => {
      image = [...image, this.video.els.canvas.toDataURL()];
      if (image.length === 10) {
        this.props.takeQuickPhoto(image);
        clearInterval(tineInterval);
      }
    }, 500);
  };

  render() {
    return (
      <div className="centerButton">
        <div
          className={this.props.wrapperClassName}
          ref={videoWrapper => this.els.videoWrapper = videoWrapper}>
        </div>
        <br/>
        <div>
          <Button
            icon={<PlayCircleOutlined style={{ fontSize: 15 }}/>}
            type="primary" ghost
            onClick={() => this.video.play()}
            style={{ fontWeight: 'bold', marginRight: 10 }}
            disabled={false}>Phát</Button>
          <Button
            icon={<PauseCircleOutlined style={{ fontSize: 15 }}/>}
            type="primary" ghost danger
            onClick={() => this.video.stop()}
            style={{ fontWeight: 'bold', marginRight: 10 }}
            disabled={false}>Dừng
          </Button>
          {/* <Button
            icon={<CameraOutlined style={{ fontSize: 15 }}/>}
            type="primary" ghost
            onClick={this.takePhoto}
            style={{ fontWeight: 'bold', marginRight: 10 }}>Chụp ảnh</Button>
          <Button
            icon={<InstagramOutlined style={{ fontSize: 15 }}/>}
            type="primary" ghost
            onClick={this.takeQuickPhoto}
            style={{ fontWeight: 'bold', marginRight: 10 }}>Chụp nhanh</Button> */}
        </div>
      </div>
    );
  };

  componentDidMount() {
    this.video = new JSMpeg.VideoElement(
      this.els.videoWrapper,
      this.props.videoUrl,
      this.props.options,
      this.props.overlayOptions,
    );

    if (this.props.onRef) {
      this.props.onRef(this);
      this.props.takePhoto();
      this.props.takeQuickPhoto();
    }
  };
};

