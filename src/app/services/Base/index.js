import axios from "axios";
import { convertSnakeCaseToCamelCase, convertParam, renderMessageError } from "@app/common/functionCommons";

export function createBase(api, data, loading = true) {
  const config = { loading };
  return axios
    .post(`${api}`, data, config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function createBaseFromFormData(api, file) {
  // console.log(file.file.file);
  // return null
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };
  let path = api;
  const formData = new FormData();
  formData.append("file", file.file.file);
  return axios
    .post(path, formData, config)
    .then((response) => {
      const data = convertSnakeCaseToCamelCase(response?.data);
      if (data) return data;
    })
    .catch((error) => {
      renderMessageError(error);
      return null;
    });
}

export function getAllBase(api, query, loading = true) {
  const config = { loading };
  const params = convertParam(query);
  return axios
    .get(`${api}${params}`, config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllPaginationBase(api, currentPage = 1, totalDocs = 0, query, loading = true) {
  const config = { loading };
  const params = convertParam(query, "&");
  return axios
    .get(`${api}&skip=${(currentPage - 1) * totalDocs}&limit=${totalDocs}${params}`, config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getByIdBase(api, id, loading = true) {
  const config = { loading };
  return axios
    .get(`${api.format(id)}`, config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateBase(api, data, loading = true) {
  const config = { loading };
  return axios
    .put(api.format(data._id), data, config)
    .then((response) => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteByIdBase(api, id) {
  return axios
    .delete(api.format(id))
    .then((response) => {
      if (response.status === 200) return response?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
