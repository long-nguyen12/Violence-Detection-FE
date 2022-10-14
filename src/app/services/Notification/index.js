import { API } from "@api";

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase } from "@app/services/Base";
import axios from "axios";

export function createNotification(data) {
  return createBase(API.NOTIFICATION, data);
}

export function getAllNotification(currentPage = 1, totalDocs = 0, query) {
  return axios
    .get(`${API.NOTIFICATION}?page=${currentPage}&limit=${totalDocs}`)
    .then((response) => {
      if (response.status === 200) return response?.data;
      return null;
    })
    .catch((err) => {
      return null;
    });
}

export function updateNotification(data) {
  return axios
    .put(API.NOTIFICATION_ID.format(data))
    .then((response) => {
      if (response.status === 200) return response?.data;
      return null;
    })
    .catch((err) => {
      return null;
    });
}

export function deleteNotification(id) {
  return axios
    .delete(API.NOTIFICATION_ID.format(id))
    .then((response) => {
      if (response.status === 200) return response?.data;
      return null;
    })
    .catch((err) => {
      return null;
    });
}

