import { API } from "@api";
import { createBase, createBaseFromFormData, deleteByIdBase, getAllBase, getAllPaginationBase, getByIdBase, updateBase } from "../Base";
import axios from "axios";

import { renderMessageError } from "@app/common/functionCommons";
import BASE_URL from "../../../constants/BASE_URL";

export function getAllDataVideo() {
  return axios
    .get(`${API.ALL_VIDEO}`)
    .then((response) => {
      if (response.status === 200) return response;
      return null;
    })
    .catch((err) => {
      return null;
    });
}


export function createVideo(data) {
  return createBaseFromFormData(API.CREATE_VIDEO, data);
}

export function deleteVideo(id) {
  return deleteByIdBase(API.VIDEO_ID.format(id));
}

export function getVideoById(id) {
  return axios
    .get(API.VIDEO_ID.format(id))
    .then((response) => {
      if (response.status === 200) return response;
      return null;
    })
    .catch((err) => {
      console.log(err);
      renderMessageError(err);
      return null;
    });
}
