import React, { lazy } from "react";

import { WarningOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { URL } from "@url";
import Detection from "../containers/Detection";
const Camera = lazy(() => import("@containers/Camera/index"));
const ThongBao = lazy(() => import("@containers/ThongBao/index"));
const CameraDetail = lazy(() => import("@containers/Camera/CameraDetail/CameraDetail"));

export const ConstantsRoutes = [
  {
    path: URL.MENU.THONGBAO,
    menuName: "Thông báo",
    component: ThongBao,
    icon: <WarningOutlined />,
  },
  {
    path: URL.MENU.VIDEO,
    menuName: "Hình ảnh/video",
    component: Detection,
    icon: <VideoCameraOutlined />,
  },
  {
    path: URL.MENU.CAMERA,
    menuName: "Camera",
    component: Camera,
    icon: <VideoCameraOutlined />,
    children: [
      {
        path: URL.CAMERA_ID.format(":id"),
        component: CameraDetail,
      },
    ],
  },
];

