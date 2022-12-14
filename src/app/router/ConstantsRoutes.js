import React, {lazy} from 'react';

import {
  WarningOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import {URL} from '@url';
import Video from '../containers/Video';
import VideoDetail from '../containers/Video/VideoDetail/VideoDetail';
const Camera = lazy(() => import('@containers/Camera/index'));
const ThongBao = lazy(() => import('@containers/ThongBao/index'));
const CameraDetail = lazy(() => import('@containers/Camera/CameraDetail/CameraDetail'));


export const ConstantsRoutes = [
  {
    path: URL.MENU.THONGBAO,
    menuName: 'Thông báo',
    component: ThongBao,
    icon: <WarningOutlined />,
  },
  {
    path: URL.MENU.VIDEO,
    menuName: 'Video',
    component: Video,
    icon: <VideoCameraOutlined/>,
    children: [
      {
        path: URL.VIDEO_ID.format(':id'),
        component: VideoDetail,
      },
    ],
  },
  {
    path: URL.MENU.CAMERA,
    menuName: 'Camera',
    component: Camera,
    icon: <VideoCameraOutlined/>,
    children: [
      {
        path: URL.CAMERA_ID.format(':id'),
        component: CameraDetail,
      },
    ],
  },
];
