import { API } from "@api";
import { createBase, deleteByIdBase, getAllBase, getAllPaginationBase, getByIdBase, updateBase } from "../Base";
import axios from "axios";

import { renderMessageError } from "@app/common/functionCommons";
import BASE_URL from "../../../constants/BASE_URL";

export function getAllDataCamera() {
  return axios
    .get(`${API.ALL_CAMERA}`)
    .then((response) => {
      if (response.status === 200) return response;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function createCamera(data) {
  return createBase(API.CREATE_CAMERA, data);
}

export function deleteCamera(id, id_user) {
  return deleteByIdBase(API.DELETE_CAMERA.format(id, id_user));
}

export function updateCamera(id, data) {
  return axios
    .put(API.UPDATE_CAMERA.format(id), data)
    .then((response) => {
      if (response.status === 200) return response;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getCameraById(id) {
  return axios
    .get(API.UPDATE_CAMERA.format(id))
    .then((response) => {
      if (response.status === 200) return response;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getCametaCate() {
  return getAllBase(API.CAMERA_CATE);
}

export function getPlayStream(port, url, key, loading = true) {
  const config = { loading };
  return axios
    .get(`${API.PLAY_STREAM}?port=${port}&url=${url}&key=${key}`, config)
    .then((response) => {
      if (response.status === 200) return response;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getStopStream(port, loading = true) {
  const config = { loading };
  return axios
    .get(`${API.STOP_STREAM}?port=${port}`, config)
    .then((response) => {
      if (response.status === 200) return response;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
export function createCapture(data) {
  return createBase(API.CREATE_CAPTURE, data);
}

export async function getCameraFilterAll(query) {
  return getAllBase(`${API.FILTER_CAPTURE}`, query);
}

